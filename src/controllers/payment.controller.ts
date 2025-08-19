import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

export const paymentController = {
  async createCheckoutSession(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const session = await paymentService.createCheckoutSession(
        orderId,
        "http://localhost:3000/success",
        "http://localhost:3000/cancel"
      );
      res.json({ url: session.url });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async stripeWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers["stripe-signature"] as string;
      const response = await paymentService.handleWebhook(req.body, signature);
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
