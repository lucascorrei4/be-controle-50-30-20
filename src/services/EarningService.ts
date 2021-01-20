import { Request, Response } from 'express';

import Earning, { EarningInterface } from '@schemas/Earning';

class EarningService {
  public validateFieldsUserIdAndRef(req: Request) {
    const { userId, ref } = req.query;

    if (!userId) {
      throw new Error('"userId" is required');
    }

    if (!ref) {
      throw new Error('"Ref" is required');
    }
  }

  public async find(userId: string, email: string): Promise<EarningInterface> {
    const launch = await Earning.findOne({ userId, email });
    return launch;
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    const Earnings = await Earning.find().sort({ createdAt: -1 });
    return res.json(Earnings);
  }
}

export default new EarningService();
