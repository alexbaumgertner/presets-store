import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  presetId: string;
  price: number;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  total: number;
  status: "pending" | "paid";
  paidAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    presetId: { type: String, required: true },
    price: { type: Number, default: 0 }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true, index: true },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const Order = (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

