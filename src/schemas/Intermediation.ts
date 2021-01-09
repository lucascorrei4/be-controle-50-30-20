import { Document, model, Schema } from 'mongoose';

export interface IntermediationInterface extends Document {
  productId?: string;
  idLote: number;
  idProposta: number;
  companyId: number;
  tax: number;
  amount: number;
}

const IntermediationSchema: Schema<IntermediationInterface> = new Schema(
  {
    productId: String,
    idLote: { type: Number, required: true },
    idProposta: { type: Number, required: true },
    companyId: { type: Number, required: true },
    tax: { type: Number, required: true, min: 0, max: 1 },
    amount: { type: Number, required: true, min: 0 }
  },
  { timestamps: true, versionKey: false }
);

// eslint-disable-next-line func-names
IntermediationSchema.pre<IntermediationInterface & Document>('save', function (next) {
  this.productId = `${this.idLote}-${this.idProposta}-${this.companyId}-${new Date().getTime()}`;

  next();
});

export default model<IntermediationInterface>('Intermediation', IntermediationSchema);
