import { Document, Schema, model } from 'mongoose';

export interface LaunchInterface extends Document {
  userId?: string;
  month?: string;
  type?: 'FIXAS' | 'VARIAVEIS' | 'INVESTIMENTOS';
  categoryId?: number;
  description?: string;
  valor?: number;
  obs?: string;
}

const LaunchSchema: Schema<LaunchInterface> = new Schema(
  {
    userId: { type: String, required: true },
    month: { type: String, required: true },
    type: { type: String, required: true, default: 'FIXAS' },
    categoryId: { type: Number, required: true },
    description: { type: String, required: true, default: 'NENHUMA' },
    valor: { type: Number, required: true, min: 0 },
    obs: { type: String, default: 'NENHUMA' }
  },
  { timestamps: true, versionKey: false }
);

LaunchSchema.index({ userId: 1 });

export default model<LaunchInterface>('Launch', LaunchSchema);
