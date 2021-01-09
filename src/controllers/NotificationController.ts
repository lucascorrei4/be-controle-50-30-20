import { Request, Response } from 'express';

import Notification, { NotificationInterface } from '@schemas/Notification';
import NotificationService from '@services/NotificationService';
import PushNotificationService from '@services/PushNotificationService';
import PushSubscriptionService from '@services/PushSubscriptionService';

import config from '../config';

class NotificationController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { page = 1, pageSize = 10 } = req.query;

    try {
      const total = await Notification.countDocuments();
      const notifications = await Notification.find({}, 'title body profile tags users createdAt')
        .skip((Number(page) - 1) * Number(pageSize))
        .limit(Number(pageSize))
        .sort({ createdAt: -1 });

      const notificationResponse = notifications.map(
        ({ title, body, profile, tags, users, createdAt }: NotificationInterface) => ({
          title,
          body,
          profile,
          tags,
          createdAt,
          send: users.length,
          read: users.reduce((acc, user) => (user.isPushRead ? acc + 1 : acc), 0),
          received: users.reduce((acc, user) => (user.isPushReceived ? acc + 1 : acc), 0)
        })
      );

      res.header('x-total-count', String(total));

      return res.json(notificationResponse);
    } catch (err) {
      // console.warn(err);
      return res.status(400).send({ error: err.message });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      NotificationService.validateNotification(req);

      const { title, body, profile = 'TODOS' } = req.body;
      const tags = req.body?.tags?.split(',') ?? undefined;
      const filename = req?.file?.filename ?? null;

      const image = filename ? `${config.urlApp}/uploads/img/pushs/${filename}` : undefined;

      const subscriptions = await PushSubscriptionService.findPushSubscriptionsProfileAndTags({
        profile,
        tags
      });

      const users = subscriptions.map(sub => ({ idUsuario: sub.idUsuario }));

      const { _id: id } = await Notification.create({ title, body, image, profile, tags, users });

      await PushNotificationService.send({ title, body, image, data: { id }, subscriptions });

      return res.status(200).send();
    } catch (err) {
      // console.warn(err);
      return res.status(400).send({ error: err.message });
    }
  }

  public async markAsPushReceived(req: Request, res: Response): Promise<Response> {
    const { idUsuario, idNotification } = req.body;

    try {
      NotificationService.validateFields(req);

      await Notification.updateOne(
        { _id: idNotification, 'users.idUsuario': Number(idUsuario) },
        {
          $set: {
            'users.$.isPushReceived': true
          }
        }
      );

      return res.status(200).send();
    } catch (err) {
      // console.warn(err);
      return res.status(400).send({ error: err.message });
    }
  }

  public async markAsPushRead(req: Request, res: Response): Promise<Response> {
    const { idUsuario, idNotification } = req.body;

    try {
      NotificationService.validateFields(req);

      await Notification.updateOne(
        { _id: idNotification, 'users.idUsuario': Number(idUsuario) },
        {
          $set: {
            'users.$.isPushRead': true
          }
        }
      );

      return res.status(200).send();
    } catch (err) {
      // console.warn(err);
      return res.status(400).send({ error: err.message });
    }
  }
}

export default new NotificationController();
