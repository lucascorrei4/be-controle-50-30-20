import { Request, Response } from 'express';

import Plan from '@schemas/Plan';

class PlanController {
  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id: _id } = req.params;

      const plan = await Plan.findOne({ _id });

      return res.json(plan);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { page = 1, pageSize = 12, profile } = req.query;

    try {
      const filter: any = {
        isActive: true
      };

      if (profile) {
        filter.profile = profile.toString().toUpperCase();
      }

      const total = await Plan.countDocuments(filter);
      const plans = await Plan.find(filter, null, {
        skip: (Number(page) - 1) * Number(pageSize),
        limit: Number(pageSize)
      }).sort({ createdAt: -1 });

      res.header('X-Total-Count', String(total));
      return res.json(plans);
    } catch ({ message }) {
      return res.status(500).send({ message });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = await Plan.create({ ...req.body });
      return res.status(201).send({ _id });
    } catch ({ message }) {
      return res.status(400).send({ message });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id: _id } = req.params;
      const updatePlan = { ...req.body, _id: undefined };

      const plan = await Plan.findOneAndUpdate({ _id }, updatePlan, {
        omitUndefined: true
      });

      if (!plan) {
        throw new Error(`'${_id}' não encontrado!`);
      }

      return res.status(204).send();
    } catch ({ message }) {
      return res.status(400).send({ message });
    }
  }

  public async destroy(req: Request, res: Response): Promise<Response> {
    try {
      const { id: _id } = req.params;
      await Plan.findOneAndUpdate({ _id }, { isActive: false });

      return res.status(204).send();
    } catch ({ message }) {
      return res.status(400).send({ message });
    }
  }
}

export default new PlanController();
