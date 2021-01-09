import { Request, Response } from 'express';

import EbarnException from '@exceptions/Ebarn.exception';
import Charge, { ChargeInterface } from '@schemas/Charge';
import PlanSubscription from '@schemas/PlanSubscription';
import ChargeService from '@services/ChargeService';

class ChargeController {
  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.params;

      const charge = await Charge.findOne({ companyId, isActive: true });
      if (!charge) {
        const planSubs = await PlanSubscription.findOne({ companyId: Number(companyId) }).populate(
          'plan'
        );

        return res.send({
          companyId,
          taxDiscountPlan: planSubs?.plan.discount ?? null,
          taxIntermediation: planSubs?.plan.tax ?? null
        });
      }

      return res.send({ ...charge.toObject(), isActive: undefined });
    } catch (error) {
      const { message } = error;

      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }

      return res.status(500).send({ message });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      await ChargeService.validateStore(req);
      const {
        companyId,
        taxDiscountPlan,
        qtyInstallments,
        taxIntermediation,
        planId
      }: Partial<ChargeInterface> = req.body;
      const payloadPlanSub: any = { companyId, plan: planId };

      await Charge.create({
        companyId,
        taxDiscountPlan,
        qtyInstallments,
        taxIntermediation,
        planId
      });
      const { id } = await PlanSubscription.create(payloadPlanSub);

      return res.status(201).send({ id });
    } catch (error) {
      const { message } = error;

      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }

      return res.status(500).send({ message });
    }
  }

  public async destroy(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.params;

      await Charge.updateOne({ companyId }, { isActive: false });

      return res.status(204).send();
    } catch (error) {
      const { message } = error;

      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }

      return res.status(500).send({ message });
    }
  }
}

export default new ChargeController();
