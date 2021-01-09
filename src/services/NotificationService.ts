import { Request } from 'express';

class NotificationService {
  public validateNotification(req: Request) {
    const { title, body } = req.body;

    if (!title) {
      throw new Error('"title" is required');
    }

    if (!body) {
      throw new Error('"body" is required');
    }
  }

  public validateFields(req: Request) {
    const { idUsuario, idNotification } = req.body;

    if (!idUsuario) {
      throw new Error('"idUsuario" is required');
    }

    if (!idNotification) {
      throw new Error('"idNotification" is required');
    }
  }
}

export default new NotificationService();
