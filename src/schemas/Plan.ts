import { Document, Schema, model } from 'mongoose';

export enum ChargeType {
  mensal = 1,
  semestral = 6,
  anual = 12
}

export interface PlanInterface extends Document {
  name: string;
  price: number;
  description: string;
  profile: string;
  chargeType: 'mensal' | 'semestral' | 'anual';
  discount: number;
  tax: number;
  isActive?: boolean;
}

const PlanSchema: Schema<PlanInterface> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, maxlength: 250 },
    profile: { type: String, required: true, uppercase: true },
    chargeType: { type: String, required: true },
    discount: { type: Number, required: true },
    tax: { type: Number, required: true, min: 0, max: 1 },
    isActive: { type: Boolean, default: true, select: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<PlanInterface>('Plan', PlanSchema);
