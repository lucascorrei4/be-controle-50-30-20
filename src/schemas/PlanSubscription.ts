import { Document, Schema, model } from 'mongoose';

import { PlanInterface } from './Plan';

export interface PlanSubscriptionInterface extends Document {
  plan: Partial<PlanInterface>;
  requestPlan?: Partial<PlanInterface> | string;
  companyId: number;
  status?: 'pendente' | 'em processamento' | 'ativo';
  signDate?: Date;
  startDate?: Date;
  expirationDate?: Date;
  isRecurrence?: boolean;
  isDisabled?: boolean;
}

const PlanSubscriptionSchema: Schema<PlanSubscriptionInterface> = new Schema({
  plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  requestPlan: { type: Schema.Types.ObjectId, ref: 'Plan', required: false },
  companyId: { type: Number, unique: true, required: true },
  status: { type: String, required: true, default: 'pendente' },
  signDate: { type: Date, required: false, default: Date.now() },
  startDate: { type: Date, required: false },
  expirationDate: { type: Date, required: false },
  isRecurrence: { type: Boolean, default: false },
  isDisabled: { type: Boolean, default: false }
});

export default model<PlanSubscriptionInterface>('PlanSubscription', PlanSubscriptionSchema);
