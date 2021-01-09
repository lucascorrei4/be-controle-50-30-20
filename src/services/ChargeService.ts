import { Request } from 'express';

import EbarnException from '@exceptions/Ebarn.exception';
import ParamBodyRequiredException from '@exceptions/ParamBodyRequired.exception';
import Charge, { ChargeInterface } from '@schemas/Charge';
import PlanSubscription from '@schemas/PlanSubscription';

class ChargeService {
  public async getCharge(companyId: string, planId: string): Promise<ChargeInterface> {
    return Charge.findOne({
      companyId,
      planId,
      isActive: true
    });
  }

  public async validateStore(req: Request): Promise<void> {
    const requiredFields = [
      'companyId',
      'taxDiscountPlan',
      'qtyInstallments',
      'taxIntermediation',
      'planId'
    ];

    requiredFields.forEach(field => {
      if (!req.body[field]) {
        throw new ParamBodyRequiredException(field);
      }
    });

    const { companyId, planId } = req.body;
    const planSubs = await PlanSubscription.findOne({ companyId });
    if (planSubs) {
      throw new EbarnException('Company already subscription plan', 409);
    }

    const voucher = await Charge.findOne({ companyId, planId, isActive: true });
    if (voucher) {
      throw new EbarnException('Company already has an active tax', 409);
    }
  }
}

export default new ChargeService();
