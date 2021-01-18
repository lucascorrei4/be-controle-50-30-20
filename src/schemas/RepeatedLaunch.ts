import { Document, Schema, model } from 'mongoose';

export interface RepeatedLaunchInterface extends Document {
  userId?: string;
  type?: 'FIXAS' | 'VARIAVEIS' | 'INVESTIMENTOS';
  categoryId?: number;
  description?: string;
  valor?: number;
  obs?: string;
}

const launchSchema: Schema<RepeatedLaunchInterface> = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true, default: 'FIXAS' },
    categoryId: { type: Number, required: true },
    description: { type: String, required: true, default: 'NENHUMA' },
    valor: { type: Number, required: true, min: 0 },
    obs: { type: String, default: 'NENHUMA' }
  },
  { timestamps: true, versionKey: false }
);

launchSchema.index({ userId: 1 });

export default model<RepeatedLaunchInterface>('RepeatedLaunch', launchSchema);
