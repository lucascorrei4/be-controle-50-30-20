import { Request, Response } from 'express';

import Earning from '@schemas/Earning';
import EarningService from '@services/EarningService';

class EarningController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const earning = await Earning.findOneAndUpdate(req.body);
      return res.status(200).json(earning);
    } catch (err) {
      console.error(err); // eslint-disable-line
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async findEarningByUserIdAndRef(req: Request, res: Response): Promise<Response> {
    await EarningService.validateFieldsUserIdAndRef(req);
    const { userId, ref } = req.query;
    const earning = await Earning.findOne({ userId, ref });
    return res.status(200).json(earning);
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.body;
      await Earning.findOneAndDelete({ _id });
      return res.status(200).send();
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }
}

export default new EarningController();
