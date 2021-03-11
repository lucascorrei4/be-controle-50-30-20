import { Request, Response } from 'express';

import Account from '@schemas/Account';

class AccountController {
  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const account = await Account.create(req.body);
      return res.status(201).json(account);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const account = await Account.find();
      return res.status(200).json(account);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async removeAll(req: Request, res: Response): Promise<Response> {
    try {
      const remove = await Account.deleteMany({});
      return res.status(200).json(remove);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }
}

export default new AccountController();
