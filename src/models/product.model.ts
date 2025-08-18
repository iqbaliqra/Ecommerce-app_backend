import mongoose, { Document, Schema } from 'mongoose';

export interface ProductDocument extends Document {
  title: string;
  price: number;
  description?: string;
  images: string[];
  category?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: { type: [String], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
