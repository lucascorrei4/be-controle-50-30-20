import { Request, Response } from 'express';

import Category from '@schemas/Category';

class CategoryController {
  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const category = await Category.create(req.body);
      return res.status(201).json(category);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const category = await Category.find();
      return res.status(200).json(category);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }

  public async removeAll(req: Request, res: Response): Promise<Response> {
    try {
      const remove = await Category.deleteMany({});
      return res.status(200).json(remove);
    } catch (err) {
      return res.status(400).send({ error: 'Error' });
    }
  }
}

export default new CategoryController();
