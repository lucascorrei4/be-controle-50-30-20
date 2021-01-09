import { Request, Response } from 'express';
import { readFile } from 'fs';
import { promisify } from 'util';

import EbarnException from '@exceptions/Ebarn.exception';
import InvoiceService from '@services/InvoiceService';

class InvoiceController {
  public async showMensalidade(req: Request, res: Response): Promise<Response> {
    try {
      const { merchantPaymentCode } = req.params;

      const pdf = await InvoiceService.generateInvoicePdfMensalidade(merchantPaymentCode);

      return res
        .attachment(`invoice-${merchantPaymentCode}.pdf`)
        .contentType('application/pdf')
        .send(pdf);
    } catch (error) {
      const { message } = error;
      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }
      return res.status(500).send({ message });
    }
  }

  public async showIntermediacao(req: Request, res: Response): Promise<Response> {
    try {
      const { merchantPaymentCode } = req.params;

      const pdf = await InvoiceService.generateInvoicePdfIntermediacao(merchantPaymentCode);

      return res
        .attachment(`invoice-${merchantPaymentCode}.pdf`)
        .contentType('application/pdf')
        .send(pdf);
    } catch (error) {
      const { message } = error;
      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }
      return res.status(500).send({ message });
    }
  }

  public async showTemplate(req: Request, res: Response): Promise<Response> {
    try {
      const { merchantPaymentCode } = req.params;

      const template = await InvoiceService.generateTemplateMensalidade(merchantPaymentCode);
      const style = await promisify(readFile)('./src/reports/contract/contract.css', {
        encoding: 'utf-8'
      });

      return res.send({ template, style });
    } catch (error) {
      const { message } = error;
      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }
      return res.status(500).send({ message });
    }
  }
}

export default new InvoiceController();
