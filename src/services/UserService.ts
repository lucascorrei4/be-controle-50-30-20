import { Request, Response } from 'express';

import Lead, { LeadInterface } from '@schemas/User';

class UserService {

  public validateFields(req: Request) {
    const { email } = req.query;

    if (!email) {
      throw new Error('"E-mail" is required');
    }
  }

  public validateAllFields(req: Request) {
    const { nome, email, telefone, ref } = req.body;
    if (!nome) {
      throw new Error('"nome" is required');
    }
    if (!email) {
      throw new Error('"E-mail" is required');
    }
    if (!telefone) {
      throw new Error('"telefone" is required');
    }
    if (!email) {
      throw new Error('"E-mail" is required');
    }
    if (!ref) {
      throw new Error('"ref" is required');
    }
  }

  public async find(email: string): Promise<LeadInterface> {
    const lead = await Lead.findOne({
      email
    });
    return lead;
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.json(leads);
  }
}

export default new UserService();
