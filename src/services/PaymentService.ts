import { ReceiptInterface } from '@interfaces/domain/Receipt';

import EbarnPayService from './EbarnPayService';

class PaymentService {
  public async finalize(data): Promise<ReceiptInterface> {
    return EbarnPayService.finalizesPayment({ ...data, userId: data.companyId });
  }
}

export default new PaymentService();
