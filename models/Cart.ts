import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  presetId: string;
  price: number;
  addedAt: Date;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt?: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    presetId: { type: String, required: true },
    price: { type: Number, default: 0 },
    addedAt: { type: Date, default: () => new Date() }
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, index: true },
    items: { type: [CartItemSchema], default: [] }
  },
  { timestamps: true }
);

const Cart = (mongoose.models.Cart as mongoose.Model<ICart>) || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;

