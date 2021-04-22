import { Document, Schema, model } from 'mongoose';

export interface UserInterface extends Document {
  mail?: string;
  inviteMail?: string;
  password?: string;
  phone?: string;
  ref?: string;
  status?: 'NEW' | 'ACTIVE' | 'INATIVE';
  obs?: string;
}

const userSchema: Schema<UserInterface> = new Schema(
  {
    phone: String,
    mail: String,
    inviteMail: String,
    password: String,
    ref: String,
    status: { type: String, required: true, default: 'NEW' },
    obs: { type: String, default: 'NENHUMA' }
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ email: 1 });

export default model<UserInterface>('User', userSchema);
