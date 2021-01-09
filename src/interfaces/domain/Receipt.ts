import { IReceipt } from '@interfaces/ebarnPay/responseReceipt';

export enum ReceiptType {
  MENSALIDADE = 'MENSALIDADE',
  INTERMEDIACAO = 'TX. INTERMEDIACAO'
}

export type ReceiptInterface = IReceipt & { type: ReceiptType };
