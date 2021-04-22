import { Document, Schema, model } from 'mongoose';

export interface AccountInterface extends Document {
  users: [{ mail: string }];
  createdDate?: Date;
  expirationDate?: Date;
  isActive?: boolean;
  plan?: 'FREE' | 'PREMIUM';
}

const AccountSchema: Schema<AccountInterface> = new Schema(
  {
    users: [{ mail: String }],
    createdDate: { type: Date },
    expirationDate: { type: Date },
    isActive: { type: Boolean },
    plan: { type: String, required: true, default: 'FREE' }
  },
  {
    versionKey: false
  }
);

export default model<AccountInterface>('Account', AccountSchema);
