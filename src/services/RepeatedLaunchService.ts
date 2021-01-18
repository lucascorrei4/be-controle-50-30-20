import { Request, Response } from 'express';

import RepeatedLaunch, { RepeatedLaunchInterface } from '@schemas/RepeatedLaunch';

class RepeatedLaunchService {
  public validateFieldsEmail(req: Request) {
    const { userId } = req.query;

    if (!userId) {
      throw new Error('"E-mail" is required');
    }
  }

  public validateAllFields(req: Request) {
    const { userId, type } = req.body;
    if (!userId) {
      throw new Error('"nome" is required');
    }
    if (!type) {
      throw new Error('"telefone" is required');
    }
  }

  public async find(userId: string, email: string): Promise<RepeatedLaunchInterface> {
    const launch = await RepeatedLaunch.findOne({ userId, email });
    return launch;
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    const Launchs = await RepeatedLaunch.find().sort({ createdAt: -1 });
    return res.json(Launchs);
  }
}

export default new RepeatedLaunchService();
