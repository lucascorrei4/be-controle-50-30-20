import { Schema, model, Document } from 'mongoose';

export interface VersionAppInterface extends Document {
  version: number;
}

const VersionAppSchema: Schema<VersionAppInterface> = new Schema(
  {
    version: { type: Number, unique: true, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<VersionAppInterface>('VersionApp', VersionAppSchema);
