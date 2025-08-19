import { Request, Response } from "express";
import { orderService } from "../services/order.service";

export const orderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const shippingAddress = req.body?.shippingAddress;
      const productIds: string[] = req.body?.products; // optional array

      if (!shippingAddress) return res.status(400).json({ message: "Shipping address is required" });

      const order = await orderService.createOrder(userId, shippingAddress, productIds);

      res.json({ message: "Order placed successfully", order });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async getUserOrders(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const orders = await orderService.getUserOrders(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async getOrderById(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const { id } = req.params;
      const order = await orderService.getOrderById(userId, id);
      res.json(order);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  },

  async updateShippingAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const { id } = req.params;
      const shippingAddress = req.body?.shippingAddress;

      if (!shippingAddress) return res.status(400).json({ message: "Shipping address is required" });

      const order = await orderService.updateShippingAddress(userId, id, shippingAddress);

      if (!order) return res.status(404).json({ message: "Order not found or cannot be updated" });

      res.json({ message: "Shipping address updated", order });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getOrderByAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderByIdAdmin(id);
      res.json(order);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  },
};
