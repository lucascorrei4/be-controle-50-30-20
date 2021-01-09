import { Request, Response } from 'express';
import { readFile, unlink, rmdir } from 'fs';
import { promisify } from 'util';

import Contract from '@schemas/Contract';
import ContractService from '@services/ContractService';

class ContractController {
  public async show(req: Request, res: Response): Promise<Response> {
    try {
      ContractService.validateFields(req);
      const idLote = Number(req.query.idLote);
      const idProposta = Number(req.query.idProposta);

      let contract = await Contract.findOne({ idLote, idProposta });
      if (!contract) {
        return res.status(404).send({ error: 'Contrato não existe!' });
      }

      if (!contract.hasContractGenerated && contract.producerSigned && contract.industrySigned) {
        await ContractService.generateAndSignContract(idLote, idProposta);
        contract = await Contract.findOne({ idLote, idProposta });
      }

      return res.send(contract);
    } catch (err) {
      console.error(err);
      return res.status(400).send({ error: err.message });
    }
  }

  public async signPdf(req: Request, res: Response): Promise<Response> {
    try {
      await ContractService.validateSignCertificate(req);

      const { perfil, passphrase } = req.body;
      const idLote = Number(req.body.idLote);
      const idProposta = Number(req.body.idProposta);
      const idEmpresa = Number(req.body.idEmpresa);

      const { path } = req.file;

      const p12Buffer = await promisify(readFile)(path);

      await ContractService.saveCertificateP12(
        idLote,
        idProposta,
        idEmpresa,
        perfil,
        p12Buffer,
        passphrase
      );

      const isReadyToSigned = await ContractService.isContractReadyToSigned(idLote, idProposta);
      if (isReadyToSigned) {
        await ContractService.generateAndSignContract(idLote, idProposta);
      }

      return res.status(204).send();
    } catch (err) {
      console.error(err);
      const isInvalidPassword = (err.message as string).includes('Invalid password?');
      if (isInvalidPassword) {
        return res.status(403).send({ error: 'Invalid password' });
      }

      return res.status(400).send({ error: err.message });
    } finally {
      const { path } = req.file;
      const [folder] = path.split('/');

      await promisify(unlink)(path);
      await promisify(rmdir)(folder);
    }
  }

  public async showTemplate(req: Request, res: Response): Promise<Response> {
    ContractService.validateFields(req);
    const idLote = Number(req.query.idLote);
    const idProposta = Number(req.query.idProposta);

    const template = await ContractService.generateHtml(idLote, idProposta);
    const style = await promisify(readFile)('./src/reports/contract/contract.css', {
      encoding: 'utf-8'
    });

    return res.status(200).send({ template, style });
  }
}

export default new ContractController();
