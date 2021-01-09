import { Request, Response } from 'express';

import EbarnException from '@exceptions/Ebarn.exception';
import PaymentService from '@services/PaymentService';

class PaymentController {
  public async finalize(req: Request, res: Response): Promise<Response> {
    try {
      const receipt = await PaymentService.finalize(req.body);
      return res.send(receipt);
    } catch (error) {
      const { message } = error;
      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }
      return res.status(500).send({ message });
    }
  }
}

export default new PaymentController();
