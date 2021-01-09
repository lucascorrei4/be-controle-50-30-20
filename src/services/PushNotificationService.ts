import webpush from 'web-push';

import Notification from '@schemas/Notification';
import PushSubscription, { PushSubscriptionInterface } from '@schemas/PushSubscription';

import config from '../config';

interface ParamsSend {
  title: string;
  body: string;
  image: string;
  data: any;
  subscriptions: PushSubscriptionInterface[];
}

class PushNotificationService {
  public async send({ title, body, image, data, subscriptions }: ParamsSend) {
    try {
      await Promise.all(
        subscriptions.map(sub => {
          data.idUsuario = sub.idUsuario;

          return webpush.sendNotification(
            sub,
            this.createPushNotificationPayload({
              title,
              body,
              image,
              data
            })
          );
        })
      );
    } catch (err) {
      console.error(err);
      const codeErrorsForDelete = [404, 410];

      await Notification.updateOne(
        {
          _id: data.id
        },
        {
          $pull: {
            users: {
              idUsuario: data.idUsuario
            }
          }
        }
      );

      if (codeErrorsForDelete.some(codeError => codeError === err.statusCode)) {
        await PushSubscription.deleteMany({
          endpoint: err.endpoint
        });
      }

      if (err.statusCode === 403) {
        await PushSubscription.updateMany(
          {
            endpoint: err.endpoint
          },
          {
            isOneSignal: true
          }
        );
        console.error('Subscription OneSignal mark');
      }
    }
  }

  private createPushNotificationPayload({
    title,
    body,
    image,
    data
  }: Omit<ParamsSend, 'subscriptions'>): string {
    const baseUrlAssets = `${config.urlApp}/assets/server`;

    const payload = {
      notification: {
        title,
        body,
        data,
        image,
        icon: `${baseUrlAssets}/logo.png`,
        badge: `${baseUrlAssets}/badge.png`,
        vibrate: [200, 100, 200]
      }
    };

    return JSON.stringify(payload);
  }
}

export default new PushNotificationService();
