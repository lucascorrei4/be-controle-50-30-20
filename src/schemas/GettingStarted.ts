import { Document, Schema, model } from 'mongoose';

export interface GettingStartedInterface extends Document {
  idEmpresa: number;
  emailConfirmado: boolean;
  empresaCadastrada: boolean;
  possuiCertificadoDigital: boolean;
  enviouPrimeiraProposta: boolean;
}

const GettingStartedSchema: Schema<GettingStartedInterface> = new Schema(
  {
    idEmpresa: { type: Number, required: true },
    emailConfirmado: { type: Boolean, default: false },
    empresaCadastrada: { type: Boolean, default: false },
    possuiCertificadoDigital: { type: Boolean, default: false },
    enviouPrimeiraProposta: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

export default model<GettingStartedInterface>('GettingStarted', GettingStartedSchema);
