import { Request, Response } from 'express';

import InfoLote from '@schemas/InfoLote';
import InfoLoteService from '@services/InfoLoteService';

class InfoLoteController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { idEmpresa, padraoDescMaterial } = req.body;
      const update = { ...req.body };
      const infoLote = await InfoLote.findOneAndUpdate({ idEmpresa, padraoDescMaterial }, update, {
        new: true,
        upsert: true
      });
      return res.status(201).json(infoLote);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async find(req: Request, res: Response): Promise<Response> {
    InfoLoteService.validateFields(req);
    const idEmpresa = Number(req.query.idEmpresa);
    const padraoDescMaterial = Number(req.query.padraoDescMaterial);

    const index = await InfoLoteService.find(idEmpresa, padraoDescMaterial);

    return res.status(200).json(index);
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    try {
      const { idEmpresa, padraoDescMaterial } = req.body;
      await InfoLote.findOneAndDelete({ idEmpresa, padraoDescMaterial });

      return res.status(200).send();
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }
}

export default new InfoLoteController();
