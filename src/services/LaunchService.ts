import { Request, Response } from 'express';

import Launch, { LaunchInterface } from '@schemas/Launch';

class LaunchService {
  public validateFieldsEmailMonth(req: Request) {
    const { userId, month } = req.query;

    if (!userId) {
      throw new Error('"E-mail" is required');
    }

    if (!month) {
      throw new Error('"E-mail" is required');
    }
  }

  public validateAllFields(req: Request) {
    const { userId, month, type } = req.body;
    if (!userId) {
      throw new Error('"nome" is required');
    }
    if (!month) {
      throw new Error('"E-mail" is required');
    }
    if (!type) {
      throw new Error('"telefone" is required');
    }
  }

  public async find(userId: string, email: string): Promise<LaunchInterface> {
    const launch = await Launch.findOne({ userId, email });
    return launch;
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    const Launchs = await Launch.find().sort({ createdAt: -1 });
    return res.json(Launchs);
  }
}

export default new LaunchService();
