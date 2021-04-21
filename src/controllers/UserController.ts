import { Request, Response } from 'express';

import User, { UserInterface } from '@schemas/User';
import UserService from '@services/UserService';

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      await UserService.validateAllFields(req);
      let user = await User.findOne({ email: req.body.email });
      if (req.body?._id) {
        user = await user.updateOne({ _id: req.body._id }, req.body);
      } else {
        if (user) return res.status(202).send({ status: 202 });
        user = await User.create(req.body);
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error(err); // eslint-disable-line
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async findByEmail(req: Request, res: Response): Promise<Response> {
    await UserService.validateFields(req);
    const { email } = req.query;
    const user = await User.findOne({ email });
    return res.status(200).json(user);
  }

  public async findByEmailAndPassword(req: Request, res: Response): Promise<Response> {
    await UserService.validateFields(req);
    const { email, password } = req.query;
    const user = await User.findOne({ email, password });
    return res.status(200).json(user);
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    const leads: UserInterface[] = await User.find().sort({ createdAt: -1 });
    return res.json(leads);
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      await User.findOneAndDelete({ email });
      return res.status(200).send();
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }
}

export default new UserController();
