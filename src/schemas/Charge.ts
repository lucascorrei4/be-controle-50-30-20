import { Document, model, Schema } from 'mongoose';

export interface ChargeInterface extends Document {
  companyId: string;
  taxDiscountPlan: number;
  taxIntermediation: number;
  qtyInstallments?: number;
  planId?: string;
  isActive?: boolean;
}

const ChargeSchema: Schema<ChargeInterface> = new Schema(
  {
    companyId: { type: String, required: true },
    taxDiscountPlan: { type: Number, required: true, min: 0, max: 1 },
    taxIntermediation: { type: Number, required: true, min: 0, max: 1 },
    qtyInstallments: { type: Number, required: true, min: 0 },
    planId: { type: Schema.Types.ObjectId, ref: 'Plan' },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<ChargeInterface>('Charge', ChargeSchema);
