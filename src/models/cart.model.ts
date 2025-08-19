import mongoose, { Document, Schema } from "mongoose";

interface CartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface CartDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: CartItem[];
}

const cartItemSchema = new Schema<CartItem>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 }
  },
  { _id: false }   // ✅ disable subdocument _id
);

const cartSchema = new Schema<CartDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

export const CartModel = mongoose.model<CartDocument>("Cart", cartSchema);
