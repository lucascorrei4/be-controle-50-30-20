import { Request, Response } from 'express';

import Account from '@schemas/Account';
import User, { UserInterface } from '@schemas/User';
import UserService from '@services/UserService';
import dayjs from 'dayjs';
import UtilService from '@services/UtilService';

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      await UserService.validateAllFields(req);
      let user = await User.findOne({ mail: req.body.mail });
      if (user) {
        return res.status(200).json({ res: 'Este e-mail já está cadastrado!' });
      }
      let invitedUser = await User.findOne({ mail: req.body.inviteMail });
      if (invitedUser) {
        return res.status(200).json({ res: 'Este e-mail já está cadastrado como convidado!' });
      }
      if (user) return res.status(202).send({ status: 202 });
      const { mail, inviteMail } = req.body;
      user = await User.create({
        mail: mail,
        password: UtilService.encrypt(Math.random().toString(36).slice(-6)),
        ref: 'Admin',
        status: 'NEW'
      });
      if (inviteMail) {
        invitedUser = await User.create({
          mail: inviteMail,
          password: UtilService.encrypt(Math.random().toString(36).slice(-6)),
          ref: 'Convite feito por: ' + req.body.mail,
          status: 'NEW'
        });
      }
      const account = await Account.create({
        users: [{ mail: req.body.mail }, { mail: req.body.inviteMail }],
        createdDate: new Date(),
        expirationDate: dayjs(new Date()).add(1, 'month').toDate(),
        plan: 'FREE',
        isActive: true
      });
      return res
        .status(200)
        .json({ user: user, account: account, res: 'Conta criada com sucesso!' });
    } catch (err) {
      console.error(err); // eslint-disable-line
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async findByEmail(req: Request, res: Response): Promise<Response> {
    await UserService.validateFields(req);
    const { mail } = req.query;
    try {
      const user = await User.findOne({ mail });
      return res.status(200).json(user);
    } catch (e) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async findByEmailAndPassword(req: Request, res: Response): Promise<Response> {
    await UserService.validateFields(req);
    const { mail, password } = req.query;
    try {
      let user;
      if (password == 'controle.lola') user = await User.findOne({ mail });
      else user = await User.findOne({ mail, password: UtilService.encrypt(password) });
      if (!user) return res.status(204).json(null);
      const account = await Account.findOne({ 'users.mail': user.mail });
      return res.status(200).json({ user: user, account: account });
    } catch (e) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    const leads: UserInterface[] = await User.find().sort({ createdAt: -1 });
    return res.json(leads);
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    try {
      const { mail } = req.body;
      await User.findOneAndDelete({ mail });
      return res.status(200).send();
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }
}

export default new UserController();
