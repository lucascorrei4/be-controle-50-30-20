import { Document, Schema, model } from 'mongoose';

export interface AttachedDocInterface extends Document {
  idLote: number;
  idProposta: number;
  nfe?: string;
  compPag?: string;
  nfeAttached?: boolean;
  compPagAttached?: boolean;
}

const AttachedDocSchema: Schema<AttachedDocInterface> = new Schema(
  {
    idLote: { type: Number, required: true },
    idProposta: { type: Number, required: true },
    nfe: String,
    compPag: String,
    nfeAttached: { type: Boolean, default: false },
    compPagAttached: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

AttachedDocSchema.index({ idLote: 1, idProposta: 1 }, { unique: true });

export default model<AttachedDocInterface>('AttachedDoc', AttachedDocSchema);
