export interface ICreditcard {
  cardName: string;
  cardNumber: string;
  cardDueDate: string;
  cardCvv: string;
}

export interface IRequestDirect {
  userId: string;
  productId: string;
  name?: string;
  document?: string;
  phoneNumber?: string;
  email?: string;
  zipcode?: string;
  address?: string;
  streetNumber?: string;
  city?: string;
  state?: string;
  paymentTypeCode?: string;
  creditcard?: ICreditcard;
  amountTotal: number;
  isRecurrence?: boolean;
  period?: number;
  discount?: number;
  discountQty?: number;
  personType?: string;
  responsible?: {
    name: string;
  };
}
