/* eslint-disable camelcase */
import { Schema, model, Document } from 'mongoose';

export interface SMSQueue extends Document {
  numero: string;
  mensagem: string;
  data_envio: Date;
  enviado?: boolean;
}

const SMSQueueSchema: Schema<SMSQueue> = new Schema(
  {
    numero: { type: String, required: true },
    mensagem: { type: String, required: true },
    data_envio: { type: Date, default: new Date() },
    enviado: { type: Boolean, default: false }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

export default model<SMSQueue>('SMSQueue', SMSQueueSchema);
