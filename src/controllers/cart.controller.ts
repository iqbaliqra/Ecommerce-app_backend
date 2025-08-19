import { Request, Response } from "express";
import { cartService } from "../services/cart.service";

export const cartController = {
  async getCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const cart = await cartService.getCart(userId);
      if (!cart) return res.json({ message: "Cart is empty" });
      res.json(cart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async addToCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const { productId, quantity } = req.body;
      const cart = await cartService.addToCart(userId, productId, quantity);
      res.json({ message: "Product added to cart", cart });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateQuantity(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const { productId, quantity } = req.body;
      const cart = await cartService.updateQuantity(userId, productId, quantity);
      if (!cart) return res.json({ message: "Cart is now empty and deleted." });
      res.json({ message: "Cart updated",cart });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async removeFromCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const { productId } = req.params;
      const cart = await cartService.removeFromCart(userId, productId);
      if (!cart) return res.json({ message: "Cart is now empty and deleted." });
      res.json({ message: "Product removed from cart" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
