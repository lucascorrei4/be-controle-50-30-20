import axios from 'axios';
import nconf from 'nconf';

import EbarnException from '@exceptions/Ebarn.exception';
import { ReceiptInterface } from '@interfaces/domain/Receipt';
import { IRequestDirect } from '@interfaces/ebarnPay/requestDirect.interface';
import { IReceipt } from '@interfaces/ebarnPay/responseReceipt';

export type IMethodPaymentRecurrency = Pick<IRequestDirect, 'paymentTypeCode' | 'creditcard'>;
export type IRequestCharge = Pick<IRequestDirect, 'productId' | 'userId' | 'amountTotal'> & {
  amountDiscount: number;
  amount: number;
};

class EbarnPayService {
  public async requestPayment(dataRequest: IRequestDirect): Promise<ReceiptInterface> {
    try {
      if (this.isCompany(dataRequest.document)) {
        dataRequest.personType = 'business';
        dataRequest.responsible = { name: dataRequest.name };
      }

      const data = await axios
        .post(`${this.baseUrl}/payments`, dataRequest)
        .then(request => request.data);

      return data;
    } catch (err) {
      const { message } = err.response?.data ?? err;
      throw new EbarnException(`eBarn Pay: ${message}`, err.response?.status);
    }
  }

  public async finalizesPayment(
    dataRequest: IRequestDirect & ReceiptInterface
  ): Promise<ReceiptInterface> {
    try {
      if (this.isCompany(dataRequest.document)) {
        dataRequest.personType = 'business';
        dataRequest.responsible = { name: dataRequest.name };
      }

      const data = await axios
        .post(`${this.baseUrl}/payments/${dataRequest.merchantPaymentCode}`, dataRequest)
        .then(request => request.data);

      return data;
    } catch (err) {
      const { message } = err.response?.data ?? err;
      throw new EbarnException(`eBarn Pay: ${message}`, err.response?.status);
    }
  }

  public async requestCharge(dataRequest: IRequestCharge): Promise<ReceiptInterface> {
    try {
      const data = await axios
        .post(`${this.baseUrl}/charges`, dataRequest)
        .then(request => request.data);

      return data;
    } catch (err) {
      const { message } = err.response?.data ?? err;
      throw new EbarnException(`eBarn Pay: ${message}`, err.response?.status);
    }
  }

  public async getUserReceipts(
    userId: string,
    queryParams: { merchantPaymentCode?: string; status?: string[] }
  ): Promise<IReceipt[]> {
    try {
      const data = await axios
        .get(`${this.baseUrl}/receipts/${userId}`, { params: queryParams })
        .then(request => request.data);

      return data;
    } catch (err) {
      const { message } = err.response?.data ?? err;
      throw new EbarnException(`eBarn Pay: ${message}`, err.response?.status);
    }
  }

  public async getLastReceipt(userId: string, productId: string): Promise<IReceipt> {
    try {
      const data = await axios
        .get(`${this.baseUrl}/receipts/last`, { params: { userId, productId } })
        .then(request => request.data);

      return data;
    } catch (err) {
      const { message } = err.response?.data ?? err;
      throw new EbarnException(`eBarn Pay: ${message}`, err.response?.status);
    }
  }

  public async getDetailsReceipt(merchantPaymentCode: string): Promise<IReceipt> {
    try {
      const data = await axios
        .get(`${this.baseUrl}/receipts/details/${merchantPaymentCode}`)
        .then(request => request.data);

      return data;
    } catch (err) {
      const { message } = err.response?.data ?? err;
      throw new EbarnException(`eBarn Pay: ${message}`, err.response?.status);
    }
  }

  public async getMethodPaymentRecurrency(
    userId: string,
    productId: string
  ): Promise<IMethodPaymentRecurrency> {
    try {
      const data = await axios
        .get(`${this.baseUrl}/recurrences/method-payment`, { params: { userId, productId } })
        .then(request => request.data);

      return data;
    } catch (err) {
      const { message } = err.response?.data ?? err;
      throw new EbarnException(`eBarn Pay: ${message}`, err.response?.status);
    }
  }

  public async updateRecurrence(
    dataRequest: Partial<Omit<IRequestDirect, 'isRecurrence'>> &
      Required<{ userId: string; productId: string }>
  ): Promise<void> {
    try {
      const { userId, productId, period } = dataRequest;
      const body = {
        userId,
        productId,
        period,
        payment: {
          ...dataRequest,
          userId: undefined,
          productId: undefined
        }
      };

      const data = await axios
        .patch(`${this.baseUrl}/recurrences`, body)
        .then(request => request.data);

      return data;
    } catch (err) {
      const { message } = err.response?.data ?? err;
      throw new EbarnException(`eBarn Pay: ${message}`, err.response?.status);
    }
  }

  private isCompany(document: string): boolean {
    return document?.length > 11;
  }

  private get baseUrl(): string {
    return nconf.get('urlPay');
  }
}

export default new EbarnPayService();
