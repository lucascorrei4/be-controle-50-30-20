import { Request, Response } from 'express';

import PushSubscription, { PushSubscriptionInterface } from '@schemas/PushSubscription';
import PushSubscriptionService from '@services/PushSubscriptionService';

class PushSubscriptionController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const pushNotifications = await PushSubscription.find();
      return res.json(pushNotifications);
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }

  public async quantity(req: Request, res: Response): Promise<Response> {
    const profile = req.query.profile as string;
    let filter = {};

    if (profile) {
      filter = { perfil: profile.toUpperCase() };
    }

    try {
      const quantity = await PushSubscription.find(filter).countDocuments();
      return res.json({ quantity });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }

  public async exists(req: Request, res: Response): Promise<Response> {
    const { idUsuario } = req.params;

    try {
      PushSubscriptionService.validateFilterExists(req);
      const { auth, p256dh } = req.query;

      const exists = await PushSubscription.exists({
        idUsuario: Number(idUsuario),
        'keys.auth': auth,
        'keys.p256dh': p256dh
      });

      return res.send({ exists });
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const { idUsuario, idsEmpresa, keys } = req.body;

    let pushSubscription: PushSubscriptionInterface;

    try {
      const push = await PushSubscription.findOne({ idUsuario, keys });
      if (push) {
        if (push.isOneSignal) {
          return res.status(403).send({ error: 'PushSubscription refers to OneSingal' });
        }

        push.idsEmpresa = Array.from(new Set([...push.idsEmpresa, ...idsEmpresa]));
        await PushSubscription.updateOne({ _id: push._id }, push);
        res.json(push);
      } else {
        pushSubscription = await PushSubscription.create(req.body);
      }
    } catch (e) {
      return res.status(400).send(e);
    }

    return res.json(pushSubscription);
  }
}

export default new PushSubscriptionController();
