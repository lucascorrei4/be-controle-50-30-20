import { Request, Response } from 'express';

import RepeatedLaunchService from '@services/RepeatedLaunchService';
import RepeatedLaunch from '@schemas/RepeatedLaunch';

class RepeatedLaunchController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      await RepeatedLaunchService.validateAllFields(req);
      const repeatedLaunch = await RepeatedLaunch.create(req.body);
      return res.status(200).json(repeatedLaunch);
    } catch (err) {
      console.error(err); // eslint-disable-line
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async findByUserIdAndType(req: Request, res: Response): Promise<Response> {
    await RepeatedLaunchService.validateFieldsEmail(req);
    const { userId, type } = req.query;
    const repeatedLaunch = type
      ? await RepeatedLaunch.find({ userId, type })
      : await RepeatedLaunch.find({ userId });
    console.log(repeatedLaunch); // eslint-disable-line
    return res.status(200).json(repeatedLaunch);
  }

  public async findByCategoryAndValue(req: Request, res: Response): Promise<Response> {
    const { userId, categoryId, valor } = req.query;
    const repeatedLaunch = await RepeatedLaunch.find({ userId, categoryId, valor });
    console.log(repeatedLaunch); // eslint-disable-line
    return res.status(200).json(repeatedLaunch);
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.body;
      await RepeatedLaunch.findOneAndDelete({ _id });
      return res.status(200).send();
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }
}

export default new RepeatedLaunchController();
