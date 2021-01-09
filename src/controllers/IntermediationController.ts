import { Request, Response } from 'express';

import EbarnException from '@exceptions/Ebarn.exception';
import Intermediation from '@schemas/Intermediation';
import EbarnPayService from '@services/EbarnPayService';
import IntermediationService from '@services/IntermediationService';

class IntermediationController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { page = 1, pageSize = 10 } = req.query;

    try {
      const total = await Intermediation.countDocuments();
      const intermediations = await Intermediation.find()
        .skip((Number(page) - 1) * Number(pageSize))
        .limit(Number(pageSize))
        .sort({ createdAt: -1 });

      res.header('x-total-count', String(total));
      return res.send(intermediations);
    } catch (error) {
      const { message } = error;
      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }
      return res.status(500).send({ message });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      IntermediationService.validateFieldsStore(req);

      const intermediation = await Intermediation.create(req.body);

      await EbarnPayService.requestCharge({
        productId: intermediation.productId,
        userId: req.body.companyId,
        amount: req.body.amount / req.body.tax,
        amountDiscount: req.body.tax,
        amountTotal: req.body.amount
      });

      return res.status(201).send(intermediation);
    } catch (error) {
      const { message } = error;
      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }
      return res.status(500).send({ message });
    }
  }
}

export default new IntermediationController();
