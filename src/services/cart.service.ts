import { CartModel } from "../models/cart.model";
import mongoose from "mongoose";

export const cartService = {
  async getCart(userId: string) {
    return CartModel.findOne({ user: userId }).populate("items.product");
  },

  async addToCart(userId: string, productId: string, quantity: number) {
    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({
        user: userId,
        items: [{ product: new mongoose.Types.ObjectId(productId), quantity }],
      });
      return cart.save();
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity; // ✅ Ab quantity increase hogi instead of error
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
      });
    }

    return cart.save();
  },

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) throw new Error("Product not found in cart");

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    if (cart.items.length === 0) {
      await CartModel.findByIdAndDelete(cart._id);
      return null;
    }

    return cart.save();
  },

  async removeFromCart(userId: string, productId: string) {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === 0) {
      await CartModel.findByIdAndDelete(cart._id);
      return null;
    }

    return cart.save();
  },
};
