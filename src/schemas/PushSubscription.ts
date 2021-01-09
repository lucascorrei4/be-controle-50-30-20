import { Document, Schema, model } from 'mongoose';

export interface PushSubscriptionInterface extends Document {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
  perfil: string;
  idUsuario: number;
  idsEmpresa: number[];
  tags?: string[];
  isOneSignal: boolean;
}

const PushSubscriptionSchema: Schema<PushSubscriptionInterface> = new Schema({
  endpoint: { type: String, required: true },
  keys: {
    auth: { type: String, required: true },
    p256dh: { type: String, required: true }
  },
  perfil: { type: String, required: true },
  idUsuario: { type: Number, required: true },
  idsEmpresa: [{ type: Number, required: true }],
  tags: [String],
  isOneSignal: Boolean
});

export default model<PushSubscriptionInterface>('PushSubscription', PushSubscriptionSchema);
