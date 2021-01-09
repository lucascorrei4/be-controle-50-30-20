/* eslint-disable camelcase */
import { Schema, model, Document } from 'mongoose';

export interface EmailQueue extends Document {
  email: string;
  data_envio: Date;
  assunto: string;
  idUsuario: number;
  corpo: string;
  is_aberto?: boolean;
  enviado?: boolean;
}

const EmailQueueSchema: Schema<EmailQueue> = new Schema(
  {
    email: { type: String, required: true },
    data_envio: { type: Date, default: new Date() },
    assunto: { type: String, required: true },
    idUsuario: { type: Number, required: false },
    corpo: { type: String, required: true },
    is_aberto: { type: Boolean, default: false },
    enviado: { type: Boolean, default: false }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

export default model<EmailQueue>('EmailQueue', EmailQueueSchema);
