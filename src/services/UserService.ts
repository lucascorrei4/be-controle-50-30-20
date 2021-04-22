import User, { UserInterface } from '@schemas/User';
import { Request, Response } from 'express';

class UserService {
  public validateFields(req: Request) {
    const { mail } = req.query;

    if (!mail) {
      throw new Error('"E-mail" is required');
    }
  }

  public validateAllFields(req: Request) {
    const { mail } = req.body;
    if (!mail) {
      throw new Error('"mail" is required');
    }
  }

  public async find(mail: string): Promise<UserInterface> {
    const user = await User.findOne({
      mail
    });
    return user;
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json(users);
  }
}

export default new UserService();
