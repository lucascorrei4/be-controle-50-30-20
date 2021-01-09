import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import nconf from 'nconf';

class TokenJava {
  public async authorize(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string = req.headers.authorization;

      if (!token) {
        throw new Error('Acesso Restrito');
      }

      await axios.get(`${nconf.get('urlService')}/auth/token/${token}`);
      return next();
    } catch (error) {
      return res.status(401).json({
        error: 'Acesso Restrito'
      });
    }
  }
}

export default new TokenJava();
