/* eslint-disable prettier/prettier */
import axios from 'axios';
import { readFile, unlink } from 'fs';
import { compile } from 'handlebars';
import nconf from 'nconf';
import { resolve as pathResolve } from 'path';
import { promisify } from 'util';

import Intermediation from '@schemas/Intermediation';
import PlanSubscription from '@schemas/PlanSubscription';
import { imgTobase64 } from '@utils/convert';
import { formatCpfCnpj, formatCurrency, formatDate, formatDecimal, formatPercent } from '@utils/format';
import { getDataDisponibilidade, getDescricaoGrao, getNomeGrao } from '@utils/graos';

import ReceiptService from './ReceiptService';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

class InvoiceService {
  private readonly pathInvoiceMensalidade = pathResolve(`${__dirname}/../reports/invoice-mensalidade`);

  private readonly pathInvoiceIntermediacao = pathResolve(`${__dirname}/../reports/invoice-intermediacao`);

  public async generateInvoicePdfMensalidade(merchantPaymentCode: string): Promise<Buffer> {
    const pathCss = `${this.pathInvoiceMensalidade}/invoice.css`;
    const compileHtml: string = await this.generateTemplateMensalidade(merchantPaymentCode);
    const filename = `invoice-mensalidade-${merchantPaymentCode}.pdf`;

    return this.generatePdf({ filename, content: compileHtml, pathCss });
  }

  public async generateTemplateMensalidade(merchantPaymentCode: string): Promise<string> {
    const pathHtml = `${this.pathInvoiceMensalidade}/invoice.html`;
    const data = await this.getDataInvoiceMensalidade(merchantPaymentCode);
    const compileHtml = await this.generateHtml({ pathHtml, data });

    return compileHtml;
  }

  public async generateInvoicePdfIntermediacao(merchantPaymentCode: string): Promise<Buffer> {
    const pathCss = `${this.pathInvoiceIntermediacao}/invoice.css`;
    const compileHtml = await this.generateTemplateIntermediacao(merchantPaymentCode);
    const filename = `invoice-intermediacao-${merchantPaymentCode}.pdf`;

    return this.generatePdf({ filename, content: compileHtml, pathCss });
  }

  public async generateTemplateIntermediacao(merchantPaymentCode: string): Promise<string> {
    const pathHtml = `${this.pathInvoiceIntermediacao}/invoice.html`;
    const data = await this.getDataInvoiceIntermediacao(merchantPaymentCode);
    const compileHtml = await this.generateHtml({ pathHtml, data });

    return compileHtml;
  }

  private async generateHtml(
    { pathHtml, data }: { pathHtml: string, data: any }
  ): Promise<string> {
    const htmlBuffer = await promisify(readFile)(pathHtml, 'utf-8');

    const template = compile(htmlBuffer, { strict: true });
    return template(data);
  }

  private async generatePdf(
    { filename, content, pathCss: path }: { filename: string, content: string, pathCss: string }
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(content);
    await page.addStyleTag({ path });

    await page.pdf({
      path: filename,
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: '<p></p>',
      footerTemplate:
        `<div style="color: #d0d0d0; font-weight: 400; font-size: 8px; margin-bottom: 8px; padding-right: 30px;text-align: right; width: 100%;"> \
        <p style="margin: 0; line-height: 2">Invoice gerada em ${formatDate(new Date(), 'DD/MM/YYYY HH:mm:ss')}.</p> \
          <span>Página </span><span class="pageNumber"></span> de <span class="totalPages"></span> \
        </div>`
    });
    await browser.close();

    const bufferPdf = await promisify(readFile)(filename);
    await promisify(unlink)(filename);

    return bufferPdf;
  }

  private async getDataInvoiceMensalidade(merchantPaymentCode: string) {
    const idPlanSubs = merchantPaymentCode.split('-')[0];
    const planSubs = await PlanSubscription.findById(idPlanSubs).populate('plan');

    const dataReceipt = await this.getDataReceipt(merchantPaymentCode);

    return {
      ...dataReceipt,
      planName: planSubs.plan.name
    };
  }

  private async getDataInvoiceIntermediacao(merchantPaymentCode: string) {
    const [idLote, idProposta, companyId] = merchantPaymentCode.split('-').map(v => Number(v));
    const dataReceipt = await this.getDataReceipt(merchantPaymentCode);
    const dataInfoLote = await this.getInfoContract(idLote, idProposta);

    const { tax } = await Intermediation.findOne({ idLote, idProposta, companyId });

    return {
      ...dataReceipt,
      ...dataInfoLote,
      tax: formatPercent(tax)
    };
  }

  private async getInfoContract(idLote: number, idProposta: number) {
    const {
      id,
      produtor,
      padraoDescMaterial,
      propostasLoteGrao
    } = await axios
      .get(`${nconf.get('urlService')}/graos/lote/${idLote}`)
      .then(request => request.data)
      .catch(err => err.response?.data ?? err);

    const proposta = propostasLoteGrao.find(p => p.id === idProposta && p.loteGraoid === idLote);

    const { assinaturaContrato } = proposta;
    const dataDisponibilidade = getDataDisponibilidade(proposta);
    const totalLote = formatCurrency(proposta.qtd * proposta.valor);

    const infoLote = {
      idLote: id,
      produto: getNomeGrao(padraoDescMaterial),
      desc: getDescricaoGrao(padraoDescMaterial, proposta),
      qtd: formatDecimal(proposta.qtd),
      preco: formatCurrency(proposta.valor),
      formaPagamento: proposta.formaPagamentoObj.nome,
      dataDisponibilidade: formatDate(dataDisponibilidade),
      dataInicialLimiteEntrega:
        formatDate(assinaturaContrato?.dataEmbarqueInicial) ?? 'Não disponível',
      dataFinalLimiteEntrega: formatDate(assinaturaContrato?.dataEmbarqueFinal) ?? 'Não disponível',
      tipoFrete: proposta.tipoFrete,
      enderecoRetirada: proposta.loteGraoObj.enderecoObj.enderecoCompleto,
      totalLote,
      comprador: {
        nome: proposta.empresa.fantasia,
        labelCnpj: proposta.empresa.tipo === 'PJ' ? 'CNPJ' : 'CPF',
        cnpj: formatCpfCnpj(proposta.empresa.cnpj)
      },
      vendedor: {
        nome: produtor.fantasia,
        labelCnpj: produtor.tipo === 'PJ' ? 'CNPJ' : 'CPF',
        cnpj: formatCpfCnpj(produtor.cnpj)
      }
    };

    return infoLote;
  }

  private async getDataReceipt(merchantPaymentCode: string) {
    const receipt = await ReceiptService.getDetailsReceipt(merchantPaymentCode);
    const isCartaoCredito = receipt.dataPayment.paymentTypeCode === 'creditcard';
    const status = this.getStatus(receipt.status);
    const showWarningBoleto = !isCartaoCredito && receipt.status === 'pending';
    const logo = await imgTobase64(`${pathResolve(`${__dirname}/../reports/invoice-mensalidade`)}/logo.png`);

    return {
      ...receipt,
      merchantPaymentCode: merchantPaymentCode.split('.')[0],
      amountTotal: formatCurrency(receipt.amountTotal),
      confirmDate: receipt.confirmDate ? formatDate(receipt.confirmDate, 'DD/MM/YYYY') : '-',
      dueDate: formatDate(receipt.dataPayment.dueDate, 'DD/MM/YYYY'),
      methodPayment: isCartaoCredito ? 'Cartão de Crédito' : 'Boleto Bancário',
      status,
      classStatus: this.getClassStatus(status),
      isCartaoCredito,
      logo,
      document: formatCpfCnpj(receipt.dataPayment.document),
      labelDocument: receipt.dataPayment?.document?.length === 11 ? 'CPF' : 'CNPJ',
      showWarningBoleto
    };
  }

  private getStatus(status: string): string {
    const statusAdapter = {
      waiting_customer: 'Aguardando Usuário',
      pending: 'Pendente',
      canceled: 'Cancelado',
      confirmed: 'Confirmado'
    };

    return statusAdapter[status];
  }

  private getClassStatus(status: string): string {
    return status.toLowerCase().replace(' ', '').replace('á', 'a');
  }
}

export default new InvoiceService();
