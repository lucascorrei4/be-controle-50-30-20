import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import config from '../config';

class AuthService {
  public async generateToken(): Promise<string> {
    return jwt.sign({}, config.SALT_KEY);
  }

  public async decodeToken(token: string): Promise<string> {
    const data = jwt.verify(token, config.SALT_KEY) as string;
    return data;
  }

  public async authorize(req: Request, res: Response, next: NextFunction): Promise<any> {
    const token: string = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        error: 'Acesso Restrito'
      });
    }

    const verifyPromise: (string, any) => Promise<Response | NextFunction> = promisify(jwt.verify);
    verifyPromise(token, config.SALT_KEY)
      .then(() => next())
      .catch(() => res.status(401).json({ error: 'Token Inválido' }));

    return jwt.verify(token, config.SALT_KEY);
  }
}

export default new AuthService();
