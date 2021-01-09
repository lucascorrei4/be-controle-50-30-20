import { Schema, model, Document } from 'mongoose';

export interface SignatureInterface extends Document {
  idLote: number;
  idProposta: number;
  idUsuario: number;
  nomeUsuario: string;
  blob: string;
}

const SignatureSchema: Schema<SignatureInterface> = new Schema(
  {
    idLote: { type: Number, required: true },
    idProposta: { type: Number, required: true },
    idUsuario: { type: Number, required: true },
    nomeUsuario: { type: String, required: true },
    blob: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export default model<SignatureInterface>('Signature', SignatureSchema);
