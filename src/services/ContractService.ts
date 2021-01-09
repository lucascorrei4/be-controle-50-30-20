import axios from 'axios';
import { createHash } from 'crypto';
import { Request } from 'express';
import extenso from 'extenso';
import { unlink, readFile } from 'fs';
import { compile } from 'handlebars';
import nconf from 'nconf';
import { util, pki, pkcs12, asn1 } from 'node-forge';
import { resolve as pathResolve } from 'path';
import { promisify } from 'util';

import { plainAddPlaceholder } from '@libs/node-signpdf/helpers';
import { SignPdf } from '@libs/node-signpdf/signpdf';
import Contract, { ContractInterface, UserCertificate } from '@schemas/Contract';
import { imgTobase64 } from '@utils/convert';
import { formatDate, formatCurrency, formatDecimal, formatCpfCnpj } from '@utils/format';
import { getDataDisponibilidade, getDescricaoGrao, getNomeGrao } from '@utils/graos';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

class ContractService {
  private signer;

  constructor() {
    this.signer = new SignPdf();
  }

  public async saveCertificateP12(
    idLote: number,
    idProposta: number,
    idEmpresa: number,
    perfil: string,
    cert: Buffer,
    passphrase = ''
  ): Promise<ContractInterface> {
    let contract = await Contract.findOne({ idLote, idProposta });
    if (!contract) {
      contract = await Contract.create({ idLote, idProposta });
    }

    if (this.isProdutor(perfil)) {
      contract.producerCert = {
        cert,
        passphrase,
        idEmpresa
      };
      contract.producerSigned = true;
    }

    if (this.isIndustria(perfil)) {
      contract.industryCert = {
        cert,
        passphrase,
        idEmpresa
      };
      contract.industrySigned = true;
    }

    return Contract.updateOne({ idLote, idProposta }, contract);
  }

  public async generateAndSignContract(idLote: number, idProposta: number) {
    const contract = await Contract.findOne({ idLote, idProposta }).select(
      'producerCert industryCert'
    );

    let pdfBuffer = await this.generatePdf(idLote, idProposta);

    pdfBuffer = this.singPdf(pdfBuffer, contract.producerCert);
    pdfBuffer = this.singPdf(pdfBuffer, contract.industryCert);

    contract.pdf = pdfBuffer;
    contract.hashPdf = this.calculateHashPdf(pdfBuffer);
    contract.hasContractGenerated = true;
    contract.producerCert = null;
    contract.industryCert = null;

    await Contract.updateOne({ idLote, idProposta }, contract);
  }

  private singPdf(pdfBuffer: Buffer, { cert, passphrase }: UserCertificate): Buffer {
    pdfBuffer = plainAddPlaceholder({
      pdfBuffer,
      reason: 'Contrato'
    });

    return this.signer.sign(pdfBuffer, cert, { passphrase });
  }

  public validateFields(req: Request) {
    const { idLote, idProposta } = req.query;

    if (!idLote) {
      throw new Error('"idLote" is required');
    }

    if (!idProposta) {
      throw new Error('"idProposta" is required');
    }
  }

  public async validateSignCertificate(req: Request) {
    const { idLote, idEmpresa, idProposta, perfil } = req.body;
    const { file } = req;

    if (!idLote) {
      throw new Error('"idLote" is required');
    }

    if (!idEmpresa) {
      throw new Error('"idEmpresa" is required');
    }

    if (!idProposta) {
      throw new Error('"idProposta" is required');
    }

    if (!perfil) {
      throw new Error('"perfil" is required');
    }

    if (!file || file.size === 0) {
      throw new Error('"cert" is required');
    }

    const contract = await Contract.findOne({ idLote, idProposta });
    if (!contract) {
      return;
    }

    if (this.isProdutor(perfil) && contract.producerSigned) {
      throw new Error('Produtor já assinou o contrato');
    }

    if (this.isIndustria(perfil) && contract.industrySigned) {
      throw new Error('Indústria já assinou o contrato');
    }
  }

  private extractSubjectCert({ cert, passphrase, updatedAt }: UserCertificate): SubjectCert {
    const forgeCert = util.createBuffer(cert);
    const p12asn1 = asn1.fromDer(forgeCert);

    const p12 = pkcs12.pkcs12FromAsn1(p12asn1, false, passphrase);
    const [certBag] = p12.getBags({ bagType: pki.oids.certBag })[pki.oids.certBag];

    const subject = String(certBag.cert.subject.getField('CN').value).split(':');
    return {
      name: subject[0],
      cpf: subject[1],
      dateSign: formatDate(updatedAt, 'DD/MM/YYYY HH:mm:ss')
    };
  }

  private async generatePdf(idLote: number, idProposta: number): Promise<Buffer> {
    const pathContrato = pathResolve(`${__dirname}/../reports/contract`);
    const htmlBuffer = await promisify(readFile)(`${pathContrato}/contract.html`, 'utf-8');
    const logo = await imgTobase64(`${pathContrato}/logo-opacity.png`);

    const dataContract = await this.getInfoContract(idLote, idProposta);
    const dataCertificate = await this.getInfoCertificate(idLote, idProposta);

    const filename = `contract-${idLote}.pdf`;

    const template = compile(htmlBuffer, { strict: true });

    const html = template({ logo, ...dataContract, ...dataCertificate });

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/chromium-browser'
    });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.addStyleTag({ path: `${pathContrato}/contract.css` });

    await page.pdf({
      path: filename,
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: '<p></p>',
      footerTemplate:
        '<div style="color: #d0d0d0; font-weight: 400; font-size: 8px; margin-bottom: 8px; padding-right: 30px;text-align: right; width: 100%;"> \
          <p style="margin: 0; line-height: 2">Esta página é indissociável do CONTRATO DE COMPRA E VENDA DE GRÃOS entre COMPRADOR e VENDEDOR.</p> \
          <span>Página </span><span class="pageNumber"></span> de <span class="totalPages"></span> \
        </div>'
    });
    await browser.close();

    const bufferPdf = await promisify(readFile)(filename);
    await promisify(unlink)(filename);

    return bufferPdf;
  }

  public async generateHtml(idLote: number, idProposta: number): Promise<string> {
    const pathContrato = pathResolve(`${__dirname}/../reports/contract`);
    const htmlBuffer = await promisify(readFile)(`${pathContrato}/contract.html`, 'utf-8');
    const logo = await imgTobase64(`${pathContrato}/logo-opacity.png`);

    const dataContract = await this.getInfoContract(idLote, idProposta);

    const template = compile(htmlBuffer, { strict: true });

    const html = template({ logo, ...dataContract });

    return html;
  }

  private calculateHashPdf(pdf: Buffer): string {
    return createHash('sha256').update(pdf).digest('hex');
  }

  private async getInfoContract(idLote: number, idProposta: number) {
    const {
      enderecoObj,
      padraoDescMaterial,
      propostasLoteGrao,
      produtor,
      safra,
      atributos
    } = await axios
      .get(`${nconf.get('urlService')}/graos/lote/${idLote}`)
      .then(request => request.data)
      .catch(err => err.response?.data ?? err);

    const proposta = propostasLoteGrao.find(p => p.id === idProposta && p.loteGraoid === idLote);
    let { assinaturaContrato } = proposta;
    if (assinaturaContrato === null) {
      assinaturaContrato = 'Não informado';
    }

    const infoProdutor = {
      line1: produtor.razao,
      line2: `${enderecoObj.logradouro}, ${enderecoObj.bairro}`,
      line3: `${enderecoObj.cidadeObj.nome}, ${enderecoObj.ufObj.uf} - ${enderecoObj.cep}`,
      line4: `${assinaturaContrato.nomeResponsavel ?? 'Não informado'} - ${
        assinaturaContrato.telefoneResponsavel ?? 'Não informado'
      }`,
      razaoSocial: produtor.razao,
      isPJ: produtor.tipo === 'PJ',
      cnpj: formatCpfCnpj(produtor.cnpj),
      email: produtor.usuario?.email,
      endereco: enderecoObj
    };

    const infoIndustria = {
      line1: proposta.empresa.razao,
      line2: `${proposta.empresa.logradouro}, ${proposta.empresa.bairro}`,
      line3: `${proposta.empresa.cidadeObj.nome}, ${proposta.empresa.ufObj.uf} - ${proposta.empresa.cep}`,
      line4: `${assinaturaContrato.nomeResponsavelComprador ?? 'Não informado'} - ${
        assinaturaContrato.telefoneResponsavelComprador ?? 'Não informado'
      }`,
      razaoSocial: proposta.empresa.razao,
      isPJ: proposta.empresa.tipo === 'PJ',
      cnpj: formatCpfCnpj(proposta.empresa.cnpj),
      email: proposta.empresa.usuario?.email,
      endereco: proposta.empresa
    };

    const desc = getDescricaoGrao(padraoDescMaterial, proposta);
    const dataDisponibilidade = getDataDisponibilidade(proposta);

    const subtotal = formatCurrency(proposta.qtd * proposta.valor);
    const item = {
      produto: getNomeGrao(padraoDescMaterial),
      desc,
      qtd: formatDecimal(proposta.qtd),
      preco: formatCurrency(proposta.valor),
      total: subtotal
    };

    const notas = JSON.parse(
      atributos.find(atributo => atributo.tag === 'nota_de_peneira')?.valor ?? null
    );
    if (notas) {
      // eslint-disable-next-line no-return-assign
      Object.keys(notas).forEach(key => (notas[key].mostrar = Number(notas[key].nota) > 0));
    }

    const infoLote = {
      dataContrato: formatDate(new Date()),
      dataContratoExtenso: formatDate(new Date(), 'DD [de] MMMM [de] YYYY'),
      formaPagamento: proposta.formaPagamentoObj.nome,
      dataDisponibilidade: formatDate(dataDisponibilidade),
      dataInicialLimiteEntrega:
        formatDate(assinaturaContrato.dataEmbarqueInicial) ?? 'Não disponível',
      dataFinalLimiteEntrega: formatDate(assinaturaContrato.dataEmbarqueFinal) ?? 'Não disponível',
      tabelaClassificacao: proposta.tabelaClassificacao?.conteudo ?? '',
      notaPeneira: notas ?? '',
      tipoFrete: proposta.tipoFrete,
      enderecoRetirada: proposta.loteGraoObj.enderecoObj.enderecoCompleto,
      subtotal,
      precoExtenso: extenso(String(proposta.valor).replace('.', ','), { mode: 'currency' }),
      total: subtotal,
      totalExtenso: extenso(String(proposta.qtd * proposta.valor).replace('.', ','), {
        mode: 'currency'
      }),
      safra,
      idProposta: `${'00000'.substring(idProposta.toString().length)}${idProposta}`
    };

    console.log('teste info lote', infoLote);

    const sign = {
      produtor:
        assinaturaContrato.assinatura === null ? 'Não disponível' : assinaturaContrato.assinatura,
      industria: assinaturaContrato.assinaturaComprador ?? 'Não disponível'
    };

    const contaBancaria = {
      nomeBanco: `${assinaturaContrato.contaBancariaObj?.nomeBanco}`,
      agencia: `${assinaturaContrato.contaBancariaObj?.agencia}`,
      cnpj: `${assinaturaContrato.contaBancariaObj?.cnpj}`,
      nomeCorrentista: `${assinaturaContrato.contaBancariaObj?.nomeCorrentista}`,
      contaDV: `${assinaturaContrato.contaBancariaObj?.numero} - ${assinaturaContrato.contaBancariaObj?.dv}`,
      tipoCorrentePoupanca: `${assinaturaContrato.contaBancariaObj?.tipo}`
    };

    return { infoProdutor, infoIndustria, item, infoLote, sign, contaBancaria };
  }

  private async getInfoCertificate(idLote: number, idProposta: number) {
    const contract = await Contract.findOne({ idLote, idProposta }).select(
      'producerCert industryCert'
    );
    const { producerCert, industryCert } = contract;

    const producerSubject = this.extractSubjectCert(producerCert);
    const industrySubject = this.extractSubjectCert(industryCert);

    return { producerSubject, industrySubject };
  }

  public async isContractReadyToSigned(idLote: number, idProposta: number): Promise<boolean> {
    const { producerSigned, industrySigned } = await Contract.findOne({ idLote, idProposta });
    return producerSigned && industrySigned;
  }

  private isProdutor(perfil: string): boolean {
    return perfil.toUpperCase() === 'PRODUTOR';
  }

  private isIndustria(perfil: string): boolean {
    return perfil.toUpperCase() === 'INDUSTRIA';
  }
}

interface SubjectCert {
  name: string;
  cpf: string;
  dateSign: string;
}

export default new ContractService();
