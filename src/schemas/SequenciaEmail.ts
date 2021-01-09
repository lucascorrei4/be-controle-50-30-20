import { Document, Schema, model } from 'mongoose';

export interface Email extends Document {
  idSequenciaEmail: number;
  assunto: string;
  corpo: string;
  template?: string;
  dataEnvio?: Date;
  enviarParaAdmin: boolean;
  enviarSMS: boolean;
}

export interface SequenciaEmailInterface extends Document {
  nome: string;
  codigoAtivacao: string;
  enviarPara: string;
  perfil: string;
  periodoDeEnvio: string;
  excluirQuemTemEmailAReceber: boolean;
  ativo: boolean;
  dataInicio?: Date;
  emails: Email[];
}

const SequenciaEmailsSchema: Schema<SequenciaEmailInterface> = new Schema(
  {
    nome: { type: String, required: true },
    codigoAtivacao: { type: String, required: true },
    enviarPara: String,
    perfil: { type: String, required: true },
    periodoDeEnvio: { type: String },
    excluirQuemTemEmailAReceber: Boolean,
    ativo: { type: Boolean, required: false, default: true },
    dataInicio: { type: Date, required: false, default: new Date() },
    emails: { type: Array<Email>() }
  },
  {
    versionKey: false
  }
);

export default model<SequenciaEmailInterface>('SequenciaEmails', SequenciaEmailsSchema);
