import { connectToDatabase } from "@/lib/controllers/db";
import CartModel from "@/models/Cart";
import { presetsController } from "./PresetsController";

export const cartController = {
  getByUser: async (userId: string) => {
    await connectToDatabase();
    const cart = await CartModel.findOne({ userId }).lean().exec();
    if (!cart) return { userId, items: [] as any[] };
    const items = cart.items || [];
    const presets = await Promise.all(items.map((it: any) => presetsController.getById(String(it.presetId))));
    const enrichedItems = items.map((it: any, i: number) => {
      const preset = presets[i];
      return {
        presetId: String(it.presetId),
        price: Number(it.price),
        addedAt: it.addedAt ? new Date(it.addedAt).toISOString() : undefined,
        title: preset?.title ?? "",
        description: preset?.description ?? "",
        processorType: preset?.processorType ?? "",
        previewAudioUrl: preset?.previewAudioUrl ?? "",
        coverImageUrl: preset?.coverImageUrl ?? "",
        authorId: preset?.authorId ?? "",
      };
    });
    return {
      _id: String(cart._id),
      userId: cart.userId,
      items: enrichedItems,
      createdAt: cart.createdAt ? new Date(cart.createdAt).toISOString() : undefined,
      updatedAt: cart.updatedAt ? new Date(cart.updatedAt).toISOString() : undefined,
    };
  },

  addItem: async (userId: string, presetId: string, price: number) => {
    await connectToDatabase();
    // ensure preset exists
    const preset = await presetsController.getById(presetId);
    if (!preset) throw new Error("Preset not found");

    const cart = await CartModel.findOne({ userId }).exec();
    if (!cart) {
      const newCart = await CartModel.create({ userId, items: [{ presetId, price, addedAt: new Date() }] });
      return {
        ...newCart.toObject(),
        _id: String(newCart._id),
      };
    }

    // dedupe by presetId
    const exists = cart.items.find((i: any) => String(i.presetId) === String(presetId));
    if (!exists) {
      cart.items.push({ presetId, price, addedAt: new Date() } as any);
      await cart.save();
    }
    return {
      //userId,
      //items: cart.items.map((i: any) => ({ presetId: String(i.presetId), price: Number(i.price) })),
      // total: cart.items.reduce((s: number, it: any) => s + Number(it.price || 0), 0),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    };
  },

  removeItem: async (userId: string, presetId: string) => {
    await connectToDatabase();
    const cart = await CartModel.findOne({ userId }).exec();
    if (!cart) return null;
    cart.items = cart.items.filter((i: any) => String(i.presetId) !== String(presetId));
    await cart.save();
    return cart.toObject();
  },

  clearCart: async (userId: string) => {
    await connectToDatabase();
    const cart = await CartModel.findOne({ userId }).exec();
    if (!cart) return null;
    cart.items = [];
    await cart.save();
    return cart.toObject();
  }
};

