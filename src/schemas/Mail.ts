/* eslint-disable camelcase */
import { Schema, model, Document } from 'mongoose';

export interface MailInterface extends Document {
  data?: Date;
  emails: [
    {
      id: number;
      data_envio: Date;
      email: string;
      assunto: string;
      obj1: string;
      is_aberto: boolean;
      enviado?: boolean;
    }
  ];
}

const MailSchema: Schema<MailInterface> = new Schema(
  {
    data: { type: Date, unique: true, default: Date() },
    emails: [
      {
        id: Number,
        data_envio: Date,
        email: String,
        assunto: String,
        obj1: String,
        is_aberto: Boolean,
        enviado: { type: Boolean, default: false }
      }
    ]
  },
  {
    timestamps: false,
    versionKey: false
  }
);

export default model<MailInterface>('Mail', MailSchema);
