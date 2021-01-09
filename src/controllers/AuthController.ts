import { Request, Response } from 'express';

import AuthService from '@services/AuthService';

class AuthController {
  public async auth(req: Request, res: Response): Promise<Response> {
    const { password } = req.body;

    if (password !== 'agro@ebarn') {
      return res.status(400).json({ error: 'Senha inválida!' });
    }

    const token = await AuthService.generateToken();

    return res.json({ token });
  }
}

export default new AuthController();
