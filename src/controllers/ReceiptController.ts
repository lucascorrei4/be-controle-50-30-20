import { Request, Response } from 'express';

import EbarnException from '@exceptions/Ebarn.exception';
import ReceiptService from '@services/ReceiptService';

class ReceiptController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.params;
      const { status, merchantPaymentCode } = req.query as {
        status: string[];
        merchantPaymentCode: string;
      };

      const filter = {
        status,
        merchantPaymentCode: merchantPaymentCode ? String(merchantPaymentCode) : null
      };

      const receipts = await ReceiptService.getUserReceipts(companyId, filter);

      return res.send(receipts);
    } catch (error) {
      const { message } = error;

      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }
      return res.status(500).send({ message });
    }
  }
}

export default new ReceiptController();
