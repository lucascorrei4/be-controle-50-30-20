import { Request, Response } from 'express';

import GettingStarted, { GettingStartedInterface } from '@schemas/GettingStarted';

class GettingStarteController {
  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const idEmpresa = Number(req.query.idEmpresa);

      const gettingStartedEmpresa: GettingStartedInterface = await GettingStarted.findOne({
        idEmpresa
      });

      if (gettingStartedEmpresa) {
        return res.status(200).json(gettingStartedEmpresa);
      }
      return res.status(404).json({ error: `Não existe registro com o id ${idEmpresa}` });
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const bodyReq: GettingStartedInterface = req.body;
      const getting = await GettingStarted.findOne({ idEmpresa: bodyReq.idEmpresa });

      if (getting) {
        await GettingStarted.update({ idEmpresa: bodyReq.idEmpresa }, bodyReq);
        return res.status(200).json(bodyReq);
      }

      const gettingStarted = await GettingStarted.create(bodyReq);
      return res.status(201).json(gettingStarted);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }
}

export default new GettingStarteController();
