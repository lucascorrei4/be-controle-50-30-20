import { Document, Schema, model } from 'mongoose';

export interface InfoLoteInterface extends Document {
  idEmpresa: number;
  padraoDescMaterial: number;
  nomeUsuario?: string;
  telefoneUsuario?: string;
  emailUsuario?: string;
  nomeFantasia?: string;
  jsonForm: string;
}

const infoLoteSchema: Schema<InfoLoteInterface> = new Schema(
  {
    idEmpresa: { type: Number, required: true },
    padraoDescMaterial: { type: Number, required: true },
    nomeUsuario: String,
    telefoneUsuario: String,
    emailUsuario: String,
    nomeFantasia: String,
    jsonForm: String
  },
  { timestamps: true, versionKey: false }
);

infoLoteSchema.index({ idEmpresa: 1, padraoDescMaterial: 1 }, { unique: true });

export default model<InfoLoteInterface>('InfoLote', infoLoteSchema);
