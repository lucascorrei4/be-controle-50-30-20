import { Document, Schema, model } from 'mongoose';

export interface EarningInterface extends Document {
  userId?: string;
  accountId?: string;
  ref?: string;
  renda1?: number;
  renda2?: number;
  rendaExtra?: number;
}

const EarningSchema: Schema<EarningInterface> = new Schema(
  {
    userId: { type: String, required: true },
    accountId: { type: String, required: true },
    ref: { type: String, required: true },
    renda1: { type: Number, required: true },
    renda2: { type: Number, required: true },
    rendaExtra: { type: Number, required: true }
  },
  { timestamps: true, versionKey: false }
);

EarningSchema.index({ userId: 1 });

export default model<EarningInterface>('Earning', EarningSchema);
