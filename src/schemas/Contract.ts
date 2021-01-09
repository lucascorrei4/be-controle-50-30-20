import { Document, Schema, model } from 'mongoose';

export interface UserCertificate {
  cert: Buffer;
  passphrase: string;
  idEmpresa: number;
  updatedAt?: Date;
}

export interface ContractInterface extends Document {
  idLote: number;
  idProposta: number;
  pdf?: Buffer;
  hashPdf?: string;
  producerCert?: UserCertificate;
  industryCert?: UserCertificate;
  producerSigned?: boolean;
  industrySigned?: boolean;
  hasContractGenerated?: boolean;
}

const CertP12Schema: Schema<UserCertificate> = new Schema(
  {
    cert: { type: Buffer, default: null },
    passphrase: { type: String, default: null },
    idEmpresa: { type: Number, default: null }
  },
  {
    _id: false,
    timestamps: true,
    versionKey: false
  }
);
const ContractSchema: Schema<ContractInterface> = new Schema(
  {
    idLote: { type: Number, required: true },
    idProposta: { type: Number, required: true },
    pdf: Buffer,
    hashPdf: String,
    producerCert: { type: CertP12Schema, select: false, default: {} },
    industryCert: { type: CertP12Schema, select: false, default: {} },
    producerSigned: { type: Boolean, default: false },
    industrySigned: { type: Boolean, default: false },
    hasContractGenerated: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

ContractSchema.index({ idLote: 1, idProposta: 1 }, { unique: true });

export default model<ContractInterface>('Contract', ContractSchema);
