import { ReceiptInterface, ReceiptType } from '@interfaces/domain/Receipt';
import { IReceipt } from '@interfaces/ebarnPay/responseReceipt';

import EbarnPayService from './EbarnPayService';
import PlanSubscriptionService from './PlanSubscriptionService';

class ReceiptService {
  public async getUserReceipts(
    userId: string,
    queryParams: { merchantPaymentCode?: string; status?: string[] } = {}
  ): Promise<ReceiptInterface[]> {
    const receipts = await EbarnPayService.getUserReceipts(userId, queryParams);

    return Promise.all(
      receipts.map<Promise<ReceiptInterface>>(async receipt => {
        const type = await this.getType(receipt);
        return { ...receipt, type };
      })
    );
  }

  public async getDetailsReceipt(merchantPaymentCode: string) {
    const receipt = await EbarnPayService.getDetailsReceipt(merchantPaymentCode);
    const type = await this.getType(receipt);

    return { ...receipt, type };
  }

  private async getType(receipt: IReceipt): Promise<ReceiptType> {
    const planSubscription = await PlanSubscriptionService.getCurrenctPlanSubscription(
      Number(receipt.userId)
    );

    return receipt.productId.startsWith(planSubscription?.id)
      ? ReceiptType.MENSALIDADE
      : ReceiptType.INTERMEDIACAO;
  }
}

export default new ReceiptService();
