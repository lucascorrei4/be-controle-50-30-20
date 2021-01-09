import { Document, Schema, model } from 'mongoose';

export interface CategoryInterface extends Document {
  groupId: number;
  categoryId: number;
  type: string;
  title: string;
}

const CategorySchema: Schema<CategoryInterface> = new Schema(
  {
    groupId: { type: Number },
    categoryId: { type: Number },
    type: { type: String },
    title: { type: String }
  },
  {
    versionKey: false
  }
);

export default model<CategoryInterface>('Category', CategorySchema);
