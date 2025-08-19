import { stripe } from "../utils/stripe.utils";
import { OrderModel } from "../models/order.model";
import Stripe from "stripe";

export const paymentService = {
  async createCheckoutSession(orderId: string, successUrl: string, cancelUrl: string) {
    const order = await OrderModel.findById(orderId).populate("items.product");
    if (!order) throw new Error("Order not found");

    const line_items = order.items.map(item => ({
      price_data: {
        currency: "pkr",
        product_data: { name: (item.product as any).title },
        unit_amount: (item.product as any).price * 100,
      },
      quantity: item.quantity,
    }));

  const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items,
  mode: "payment",
  success_url: successUrl,
  cancel_url: cancelUrl,
   metadata: {
    orderId: order.id.toString(),
    fullName: order.shippingAddress.fullName,
    address: order.shippingAddress.address,
    city: order.shippingAddress.city,
    postalCode: order.shippingAddress.postalCode,
    country: order.shippingAddress.country
  },
});
    return session;
  },

  async handleWebhook(payload: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err) {
      throw new Error("Webhook signature verification failed");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.metadata.orderId;
      await OrderModel.findByIdAndUpdate(orderId, { status: "paid" });
    }

    return { received: true };
  },
};
