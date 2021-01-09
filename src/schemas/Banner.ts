import { Schema, model } from 'mongoose';

const BannerSchema: Schema = new Schema(
  {
    ref: { type: String, required: true },
    name: { type: String, required: true },
    habilitar: { type: Boolean, required: true }
  },
  {
    timestamps: true
  }
);

export default model('Banner', BannerSchema);
