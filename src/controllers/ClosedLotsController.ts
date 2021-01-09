import { Request, Response } from 'express';

import EbarnException from '@exceptions/Ebarn.exception';
import ClosedLotsService from '@services/ClosedLotsService';

class ClosedLotsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const lots = await ClosedLotsService.getLotsWithoutIntermediation();

      return res.send(lots);
    } catch (error) {
      const { message } = error;
      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }
      return res.status(500).send({ message });
    }
  }
}

export default new ClosedLotsController();
