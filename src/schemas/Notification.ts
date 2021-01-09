import { Document, Schema, model } from 'mongoose';

export interface UserNotificationInterface {
  idUsuario: number;
  isPushReceived?: boolean;
  isPushRead?: boolean;
}

export interface NotificationInterface extends Document {
  title: string;
  body: string;
  image: string;
  profile: string;
  tags: string[];
  users: UserNotificationInterface[];
  createdAt?: Date;
}

const userNotificationSchema: Schema<UserNotificationInterface> = new Schema(
  {
    idUsuario: { type: Number, required: true },
    isPushReceived: { type: Boolean, default: false },
    isPushRead: { type: Boolean, default: false }
  },
  { _id: false, timestamps: false, versionKey: false }
);

const NotificationSchema: Schema<NotificationInterface> = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: String,
    profile: { type: String, required: true },
    tags: [String],
    users: [userNotificationSchema]
  },
  {
    timestamps: true
  }
);

export default model<NotificationInterface>('Notification', NotificationSchema);
