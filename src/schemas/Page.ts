import { Schema, model, Document } from 'mongoose';

export interface PageInterface extends Document {
  slug: string;
  tituloSeo: string;
  descricaoSeo: string;
  noFollow: boolean;
  titulo: string;
  conteudoHTML: string;
  dataLimite?: Date;
  icone?: string;
  image?: string;
  habilitado?: boolean;
  isDestaque?: boolean;
  eventoFb: string;
}

const PageSchema: Schema<PageInterface> = new Schema(
  {
    slug: { type: String, unique: true, required: true },
    tituloSeo: { type: String, required: true },
    descricaoSeo: { type: String, required: true },
    noFollow: { type: Boolean, required: false },
    titulo: { type: String, required: true },
    conteudoHTML: { type: String, required: true },
    dataLimite: Date,
    icone: { type: String, required: true },
    image: { type: String },
    habilitado: { type: Boolean, default: true },
    isDestaque: { type: Boolean, default: false },
    eventoFb: { type: String, default: null }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<PageInterface>('Page', PageSchema);
