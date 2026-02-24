import { connectToDatabase } from "@/lib/controllers/db";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import { cartController } from "./CartController";

export class OrderController {
  // Create an order from the user's cart and mark it as paid (mock payment)
  async createOrderFromCart(userId: string) {
    await connectToDatabase();
    const cart = await cartController.getByUser(userId);
    const items = (cart.items || []).map((i: any) => ({ presetId: String(i.presetId), price: Number(i.price) }));
    const total = items.reduce((s: number, it: any) => s + Number(it.price || 0), 0);

    const order = await OrderModel.create({
      userId,
      items,
      total,
      status: "paid",
      paidAt: new Date()
    });

    // grant presets to user
    const user = await UserModel.findOne({ _id: userId }).exec();
    if (user) {
      const existing = new Set(user.purchasedPresets || []);
      for (const it of items) existing.add(it.presetId);
      user.purchasedPresets = Array.from(existing);
      await user.save();
    } else {
      // try to find by email? skip for now
    }

    // clear cart
    await cartController.clearCart(userId);

    return order.toObject();
  }
}

export const orderController = new OrderController();

