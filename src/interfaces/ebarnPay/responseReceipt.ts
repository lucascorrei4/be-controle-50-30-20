export interface IDataPayment {
  name?: string;
  email?: string;
  document?: string;
  paymentTypeCode: string;
  cardName?: string;
  cardNumber?: string;
  dueDate?: Date;
  address?: string;
}

export interface IReceipt {
  userId: string;
  productId?: string;
  amountTotal: number;
  confirmDate?: Date;
  merchantPaymentCode: string;
  dataPayment: IDataPayment;
  hash: string;
  status: 'waiting_customer' | 'pending' | 'confirmed' | 'canceled';
  createdAt: Date;
}
