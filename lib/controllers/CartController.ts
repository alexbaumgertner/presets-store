import { connectToDatabase } from "@/lib/controllers/db";
import CartModel from "@/models/Cart";
import { presetsController } from "./PresetsController";

export class CartController {
  async getByUser(userId: string) {
    await connectToDatabase();
    const cart = await CartModel.findOne({ userId }).lean().exec();
    // #region agent log
    ;(function () {
      try {
        fetch('http://127.0.0.1:7364/ingest/72c0686f-b405-4f98-81f4-77e8261d35c8', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': 'c4a4d1'
          },
          body: JSON.stringify({
            sessionId: 'c4a4d1',
            runId: 'initial',
            hypothesisId: 'A2',
            location: 'lib/controllers/CartController.ts:getByUser',
            message: 'cart fetched (controller)',
            data: {
              found: !!cart,
              id_type: typeof (cart as any)?._id,
              id_toString: cart ? String((cart as any)?._id) : null,
              items_isArray: Array.isArray((cart as any)?.items),
              first_item: (cart as any)?.items?.[0] ? {
                presetId_type: typeof (cart as any).items[0].presetId,
                presetId_string: String((cart as any).items[0].presetId),
                price_type: typeof (cart as any).items[0].price
              } : null
            },
            timestamp: Date.now()
          })
        }).catch(()=>{});
      } catch (e) {}
    })();
    // #endregion
    if (!cart) return { userId, items: [] as any[] };
    return cart;
  }

  async addItem(userId: string, presetId: string, price: number) {
    await connectToDatabase();
    // ensure preset exists
    const preset = await presetsController.getById(presetId);
    if (!preset) throw new Error("Preset not found");

    const cart = await CartModel.findOne({ userId }).exec();
    if (!cart) {
      return await CartModel.create({ userId, items: [{ presetId, price, addedAt: new Date() }] });
    }

    // dedupe by presetId
    const exists = cart.items.find((i: any) => String(i.presetId) === String(presetId));
    if (!exists) {
      cart.items.push({ presetId, price, addedAt: new Date() } as any);
      await cart.save();
    }
    return cart.toObject();
  }

  async removeItem(userId: string, presetId: string) {
    await connectToDatabase();
    const cart = await CartModel.findOne({ userId }).exec();
    if (!cart) return null;
    cart.items = cart.items.filter((i: any) => String(i.presetId) !== String(presetId));
    await cart.save();
    return cart.toObject();
  }

  async clearCart(userId: string) {
    await connectToDatabase();
    const cart = await CartModel.findOne({ userId }).exec();
    if (!cart) return null;
    cart.items = [];
    await cart.save();
    return cart.toObject();
  }
}

export const cartController = new CartController();

