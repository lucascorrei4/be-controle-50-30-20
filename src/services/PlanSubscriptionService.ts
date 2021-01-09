import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrAfter';
import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { IRequestDirect } from 'src/interfaces/ebarnPay/requestDirect.interface';

import EbarnException from '@exceptions/Ebarn.exception';
import ParamBodyRequiredException from '@exceptions/ParamBodyRequired.exception';
import { IReceipt } from '@interfaces/ebarnPay/responseReceipt';
import { ChargeType } from '@schemas/Plan';
import PlanSubscription, { PlanSubscriptionInterface } from '@schemas/PlanSubscription';

import ChargeService from './ChargeService';
import EbarnPayService from './EbarnPayService';

class PlanSubscriptionService {
  constructor() {
    dayjs.extend(isSameOrBefore);
  }

  public async requestPaymentRecurrence(
    planSub: PlanSubscriptionInterface,
    data: IRequestDirect
  ): Promise<IReceipt> {
    const body = {
      productId: planSub.id.toString(),
      period: ChargeType[planSub.plan.chargeType],
      amountTotal: planSub.plan.price,
      isRecurrence: true,
      ...data
    };

    const charge = await ChargeService.getCharge(String(planSub.companyId), planSub.plan.id);
    if (charge) {
      body.discount = charge.taxDiscountPlan;
      body.discountQty = charge.qtyInstallments;
    }

    const respPayment = await EbarnPayService.requestPayment(body);

    planSub.isRecurrence = true;
    await planSub.save();

    await this.updateStatusPlanSubscription(planSub, respPayment);

    return respPayment;
  }

  public async requestCharge(
    planSub: PlanSubscriptionInterface,
    data: Pick<IRequestDirect, 'userId' | 'amountTotal'>
  ): Promise<IReceipt> {
    const body = {
      productId: `${planSub.id.toString()}M${new Date().getTime()}`,
      ...data
    };

    return EbarnPayService.requestCharge(body);
  }

  public async updateStatusPlanSubscription(
    planSub: PlanSubscriptionInterface,
    receipt: IReceipt = null
  ): Promise<PlanSubscriptionInterface> {
    if (
      !planSub.isRecurrence ||
      (planSub.status === 'ativo' && dayjs().isSameOrAfter(planSub.expirationDate, 'day'))
    ) {
      return planSub;
    }

    if (!receipt) {
      receipt = await EbarnPayService.getLastReceipt(planSub.companyId.toString(), planSub.id);
    }

    const period = ChargeType[planSub.plan.chargeType];

    if (!receipt) {
      planSub.status = 'ativo';
    } else if (receipt?.status === 'confirmed') {
      planSub.startDate = receipt.createdAt;
      planSub.expirationDate = dayjs(receipt.createdAt).add(period, 'month').toDate();
      planSub.status = 'ativo';
    } else {
      planSub.status = 'pendente';
    }

    return planSub.save();
  }

  public async getExtraDataPlanSubscription({
    id,
    companyId,
    status,
    isRecurrence
  }: PlanSubscriptionInterface) {
    if (!isRecurrence) {
      return null;
    }

    let receipt: IReceipt = null;
    const userId = String(companyId);
    const recurrencyMethodPayment = await EbarnPayService.getMethodPaymentRecurrency(userId, id);

    if (recurrencyMethodPayment.paymentTypeCode === 'boleto' && status === 'pendente') {
      receipt = await EbarnPayService.getLastReceipt(userId, id);
    }

    return { recurrencyMethodPayment, receipt };
  }

  public async getCurrenctPlanSubscription(companyId: number): Promise<PlanSubscriptionInterface> {
    return PlanSubscription.findOne({ companyId });
  }

  public getLastReceipt(userId: string, productId: string): Promise<IReceipt> {
    return EbarnPayService.getLastReceipt(userId, productId);
  }

  public async removeRequestPlan(companyId: number): Promise<void> {
    const planSubscription = await PlanSubscription.findOne({ companyId });
    planSubscription.requestPlan = undefined;
    await planSubscription.save();
  }

  public validatePlanSubscription(req: Request): void {
    const requiredFields = ['planId', 'companyId'];
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        throw new ParamBodyRequiredException(field);
      }
    });
  }

  public validateRequestRecurrence(req: Request) {
    const requiredFields = [
      'companyId',
      'name',
      'email',
      'document',
      'phoneNumber',
      'paymentTypeCode',
      'zipcode',
      'address',
      'streetNumber',
      'state',
      'city'
    ];
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        throw new ParamBodyRequiredException(field);
      }
    });

    const requiredFieldsCredicard = ['cardName', 'cardNumber', 'cardDueDate', 'cardCvv'];
    if (req.body?.paymentTypeCode === 'creditcard') {
      requiredFieldsCredicard.forEach(field => {
        if (!req.body.creditcard[field]) {
          throw new ParamBodyRequiredException(field);
        }
      });
    }
  }

  public validateRequestPayment(req: Request) {
    const requiredFields = ['companyId'];
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        throw new ParamBodyRequiredException(field);
      }
    });
  }

  public validateId(id: string) {
    if (!isValidObjectId(id)) {
      throw new EbarnException('id invalid', 400);
    }
  }
}

export default new PlanSubscriptionService();
