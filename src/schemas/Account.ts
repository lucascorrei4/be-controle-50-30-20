import { Document, Schema, model } from 'mongoose';

export interface AccountInterface extends Document {
  accountId: number;
  users: [{ userId; email }];
  createdDate?: Date;
  expirationDate?: Date;
  isActive?: boolean;
}

const AccountSchema: Schema<AccountInterface> = new Schema(
  {
    accountId: { type: Number },
    users: [{ userId: Number, email: String }],
    createdDate: { type: Date },
    expirationDate: { type: Date },
    isActive: { type: Boolean }
  },
  {
    versionKey: false
  }
);

export default model<AccountInterface>('Account', AccountSchema);
