import { Request, Response } from 'express';

import Signature from '@schemas/Signature';

class SignatureController {
  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const { idLote, idProposta, idUsuario, nomeUsuario, blob } = req.body;
      const signature = await Signature.create({
        idLote,
        idProposta,
        idUsuario,
        nomeUsuario,
        blob
      });
      return res.status(200).send({ res: signature });
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { idLote, idUsuario, idProposta } = req.body;
    const signature = await Signature.findOne({
      idLote,
      idUsuario,
      idProposta
    });
    if (!signature) {
      return res.status(404).json({ message: 'Assinatura não existe' });
    }
    return res.status(200).json(signature);
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    try {
      const { idLote, idUsuario, idProposta } = req.body;
      await Signature.findOneAndDelete({ idLote, idUsuario, idProposta });

      return res.status(200).send();
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }
}

export default new SignatureController();
