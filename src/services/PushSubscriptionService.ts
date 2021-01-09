import { Request } from 'express';

import PushSubscription, { PushSubscriptionInterface } from '@schemas/PushSubscription';

class PushSubscriptionService {
  public async findPushSubscriptionsProfileAndTags({
    profile,
    tags
  }: {
    profile: string;
    tags: string[];
  }): Promise<PushSubscriptionInterface[]> {
    const filter: any = {};

    if (profile && profile.toUpperCase() !== 'TODOS') {
      filter.perfil = profile.toUpperCase();
    }

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    const allPushSubscriptions = await PushSubscription.find(filter);
    const added = {};
    const uniquePushSubscriptions = allPushSubscriptions.filter(subscription => {
      if (added.hasOwnProperty(subscription.endpoint)) {
        return false;
      }

      added[subscription.endpoint] = true;
      return true;
    });

    return uniquePushSubscriptions;
  }

  public validateFilterExists(req: Request) {
    const { auth, p256dh } = req.query;

    if (!auth) {
      throw new Error('Query params "auth" is required');
    }

    if (!p256dh) {
      throw new Error('Query params "p256dh" is required');
    }
  }
}

export default new PushSubscriptionService();
