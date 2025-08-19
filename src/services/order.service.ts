import { OrderModel } from "../models/order.model";
import { CartModel } from "../models/cart.model";

export const orderService = {
  async createOrder(userId: string, shippingAddress: any, productIds?: string[]) {
    const cart = await CartModel.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) throw new Error("Order Placed and Now Cart is empty");

    let itemsToOrder = cart.items;

    // Agar productIds diye ho → filter cart items
    if (productIds && productIds.length > 0) {
      itemsToOrder = cart.items.filter(item => productIds.includes(item.product._id.toString()));
      if (itemsToOrder.length === 0) throw new Error("Selected products not found in cart");
    }

    const totalAmount = itemsToOrder.reduce(
      (acc, item) => acc + (item.product as any).price * item.quantity,
      0
    );

    const order = new OrderModel({
      user: userId,
      items: itemsToOrder.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      shippingAddress,
      totalAmount,
      status: "pending",
    });

    await order.save();

    // Remove ordered items from cart
    const remainingItems = cart.items.filter(
      item => !itemsToOrder.find(i => i.product._id.toString() === item.product._id.toString())
    );

    if (remainingItems.length > 0) {
      cart.items = remainingItems;
      await cart.save();
    } else {
      await CartModel.findByIdAndDelete(cart._id);
    }

    return order;
  },

  async getUserOrders(userId: string) {
    return OrderModel.find({ user: userId }).populate("items.product");
  },

  async getOrderById(userId: string, orderId: string) {
    const order = await OrderModel.findOne({ _id: orderId, user: userId }).populate("items.product");
    if (!order) throw new Error("Order not found");
    return order;
  },

  async updateShippingAddress(userId: string, orderId: string, shippingAddress: any) {
    return OrderModel.findOneAndUpdate(
      { _id: orderId, user: userId, status: "pending" },
      { shippingAddress },
      { new: true }
    );
  },

  async getAllOrders() {
    return OrderModel.find().populate("items.product").populate("user");
  },

  async getOrderByIdAdmin(orderId: string) {
    const order = await OrderModel.findById(orderId).populate("items.product").populate("user");
    if (!order) throw new Error("Order not found");
    return order;
  },
};
