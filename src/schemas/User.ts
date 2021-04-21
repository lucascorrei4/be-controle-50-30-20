import { Document, Schema, model } from 'mongoose';

export interface UserInterface extends Document {
  nome?: string;
  email?: string;
  password?: string;
  telefone?: string;
  ref?: string;
  status?: 'NOVO' | 'ATIVO' | 'INVATIVO';
  obs?: string;
}

const userSchema: Schema<UserInterface> = new Schema(
  {
    nome: String,
    telefone: String,
    email: String,
    password: String,
    ref: String,
    status: { type: String, required: true, default: 'NOVA' },
    obs: { type: String, default: 'NENHUMA' }
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ email: 1 });

export default model<UserInterface>('User', userSchema);
