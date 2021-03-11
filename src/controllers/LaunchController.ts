import { Request, Response } from 'express';

import Launch from '@schemas/Launch';
import LaunchService from '@services/LaunchService';

class LaunchController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      await LaunchService.validateAllFields(req);
      const launch = await Launch.create(req.body);
      return res.status(200).json(launch);
    } catch (err) {
      console.error(err); // eslint-disable-line
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async findByUserIdAndMonthAndType(req: Request, res: Response): Promise<Response> {
    await LaunchService.validateFieldsEmailMonth(req);
    const { userId, month, type } = req.query;
    const launch = type
      ? await Launch.find({ userId, month, type })
      : await Launch.find({ userId, month });
    return res.status(200).json(launch);
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.query;
      await Launch.findOneAndDelete({ _id });
      return res.status(200).send();
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }
}

export default new LaunchController();
