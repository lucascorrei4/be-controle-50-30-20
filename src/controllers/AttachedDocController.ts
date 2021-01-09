import { Request, Response } from 'express';
import { readFile, unlink, rmdir } from 'fs';
import nconf from 'nconf';
import { promisify } from 'util';

import AttachedDocService from '@services/AttachedDocService';

import config from '../config';

class AttachedDocController {
  public async uploadCompPag(req: Request, res: Response): Promise<Response> {
    try {
      await AttachedDocService.validateFieldsCompPag(req);

      const idLote = Number(req.body.idLote);
      const idProposta = Number(req.body.idProposta);

      const filename = req?.file?.filename ?? null;

      const file = filename
        ? `${nconf.get('urlAppNode')}/uploads/docs/comp-pag/${filename}`
        : undefined;

      await AttachedDocService.saveCompPag(idLote, idProposta, file);

      return res.status(201).send();
    } catch (err) {
      console.error(err);

      return res.status(400).send({ error: err.message });
    }
  }

  public async uploadNfe(req: Request, res: Response): Promise<Response> {
    try {
      await AttachedDocService.validateFieldsNfe(req);

      const idLote = Number(req.body.idLote);
      const idProposta = Number(req.body.idProposta);

      const filename = req?.file?.filename ?? null;

      const file = filename ? `${nconf.get('urlAppNode')}/uploads/docs/nfe/${filename}` : undefined;

      await AttachedDocService.saveNFe(idLote, idProposta, file);

      return res.status(201).send();
    } catch (err) {
      console.error(err);

      return res.status(400).send({ error: err.message });
    }
  }

  public async findDocs(req: Request, res: Response): Promise<Response> {
    AttachedDocService.validateFields(req);
    const idLote = Number(req.query.idLote);
    const idProposta = Number(req.query.idProposta);

    const docs = await AttachedDocService.findDocs(idLote, idProposta);

    return res.status(200).json(docs);
  }
}

export default new AttachedDocController();
