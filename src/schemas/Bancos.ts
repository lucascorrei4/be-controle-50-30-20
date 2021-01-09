import { Document, Schema, model } from 'mongoose';

export interface BancoInterface extends Document {
  value: number;
  label: string;
}

const BancosSchema: Schema<BancoInterface> = new Schema(
  {
    value: { type: Number },
    label: { type: String }
  },
  {
    versionKey: false
  }
);

export default model<BancoInterface>('Bancos', BancosSchema);
