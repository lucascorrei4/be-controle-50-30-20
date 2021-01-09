import { Request, Response } from 'express';

import Bancos from '@schemas/Bancos';

class BancosController {
  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const bancos = await Bancos.create(req.body);
      return res.status(201).json(bancos);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const bancos = await Bancos.find();
      return res.status(200).json(bancos);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async removeAll(req: Request, res: Response): Promise<Response> {
    try {
      const remove = await Bancos.deleteMany({});
      return res.status(200).json(remove);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }
}

export default new BancosController();
