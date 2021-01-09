import { Request, Response } from 'express';
import { IRequestDirect } from 'src/interfaces/ebarnPay/requestDirect.interface';

import EbarnException from '@exceptions/Ebarn.exception';
import ParamBodyRequiredException from '@exceptions/ParamBodyRequired.exception';
import Plan from '@schemas/Plan';
import PlanSubscription, { PlanSubscriptionInterface } from '@schemas/PlanSubscription';
import ChargeService from '@services/ChargeService';
import PlanSubscriptionService from '@services/PlanSubscriptionService';

class PlanSubscriptionController {
  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.params;

      let planSubscription = await PlanSubscription.findOne({
        companyId: Number(companyId)
      }).populate('plan requestPlan');

      if (!planSubscription) {
        return res.json({
          plan: {
            name: 'Plano FREE',
            price: 0,
            description: 'Plano gratuito',
            isFree: true
          }
        });
      }
      planSubscription = await PlanSubscriptionService.updateStatusPlanSubscription(
        planSubscription
      );

      const extraDataPlanSubs = await PlanSubscriptionService.getExtraDataPlanSubscription(
        planSubscription
      );

      return res.json({ ...planSubscription.toObject(), ...extraDataPlanSubs });
    } catch ({ message }) {
      return res.status(400).json({ message });
    }
  }

  public async verifyPayment(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      PlanSubscriptionService.validateId(id);

      let planSubscription = await PlanSubscription.findById(id).populate('plan');

      if (!planSubscription) {
        throw new EbarnException('PlanSubscription not found', 404);
      }

      planSubscription = await PlanSubscriptionService.updateStatusPlanSubscription(
        planSubscription
      );

      if (planSubscription.isRecurrence) {
        throw new EbarnException('Payment already made', 409);
      }

      const voucher = await ChargeService.getCharge(
        String(planSubscription.companyId),
        planSubscription.plan.id
      );

      return res.json({ ...planSubscription.toObject(), voucher });
    } catch (error) {
      const { message } = error;

      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }

      return res.status(500).send({ message });
    }
  }

  public async isActive(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.params;
      let planSubs = await PlanSubscription.findOne({
        companyId: Number(companyId)
      }).populate('plan');

      if (!planSubs) {
        return res.send({ companyId: Number(companyId), status: 'pendente', isFree: true });
      }

      planSubs = await PlanSubscriptionService.updateStatusPlanSubscription(planSubs);

      const { expirationDate, status } = planSubs;
      return res.send({ companyId: Number(companyId), status, expirationDate });
    } catch ({ message }) {
      return res.status(500).send({ message });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      PlanSubscriptionService.validatePlanSubscription(req);
      const { body } = req;
      const {
        planId,
        companyId
      }: Partial<IRequestDirect> & { planId: string; companyId: number } = body;

      const payload: any = {
        plan: planId,
        companyId
      };

      const planSubscription = await PlanSubscription.findOne({ companyId });
      const isSubscription = !!planSubscription;
      const equalPlans = String(planSubscription?.plan._id) === planId;

      if (equalPlans) {
        if (planSubscription.requestPlan) {
          await PlanSubscriptionService.removeRequestPlan(Number(companyId));
        }

        return res.status(200).send({ id: planSubscription.id });
      }

      if (isSubscription) {
        const updatePlan: Partial<PlanSubscriptionInterface> = {
          ...payload,
          plan: undefined,
          startDate: undefined,
          expirationDate: undefined,
          requestPlan: planId
        };

        const { id } = await PlanSubscription.findOneAndUpdate({ companyId }, updatePlan, {
          omitUndefined: true
        });
        return res.status(200).send({ id });
      }

      const plan = await Plan.findById(planId);
      if (plan.price === 0) {
        payload.status = 'ativo';
      }

      const createdPlanSub = await PlanSubscription.create(payload);
      return res.status(201).send({ _id: createdPlanSub.id });
    } catch (err) {
      const { message } = err;
      if (err instanceof ParamBodyRequiredException) {
        return res.status(err.statusCode).send({ message });
      }

      return res.status(500).send({ message });
    }
  }

  public async requestRecurrence(req: Request, res: Response): Promise<Response> {
    try {
      PlanSubscriptionService.validateRequestRecurrence(req);
      const { companyId } = req.body;

      const planSub = await PlanSubscription.findOne({ companyId }).populate('plan');
      if (!planSub) {
        throw new EbarnException('PlanSubscription not found', 404);
      }

      const receipt = await PlanSubscriptionService.requestPaymentRecurrence(planSub, {
        userId: companyId,
        ...req.body
      });

      return res.send(receipt);
    } catch (err) {
      const { message } = err;
      if (err instanceof EbarnException) {
        return res.status(err.statusCode).send({ message });
      }

      return res.status(500).send({ message });
    }
  }

  public async requestCharge(req: Request, res: Response): Promise<Response> {
    try {
      PlanSubscriptionService.validateRequestPayment(req);
      const { companyId } = req.body;
      const { amountTotal } = req.body;

      const planSub = await PlanSubscription.findOne({ companyId }).populate('plan');
      if (!planSub) {
        throw new EbarnException('PlanSubscription not found', 404);
      }

      const receipt = await PlanSubscriptionService.requestCharge(planSub, {
        userId: companyId,
        amountTotal: amountTotal || planSub.plan.price
      });

      return res.send(receipt);
    } catch (error) {
      const { message } = error;
      if (error instanceof EbarnException) {
        return res.status(error.statusCode).send({ message });
      }
      return res.status(500).send({ message });
    }
  }

  public async destroyRequestPlan(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.params;

      await PlanSubscriptionService.removeRequestPlan(Number(companyId));

      return res.status(204).send();
    } catch ({ message }) {
      return res.status(500).send({ message });
    }
  }
}

export default new PlanSubscriptionController();
