import { Schema, model, models, Types } from "mongoose";

export interface Order {
  _id: string;
  userId: Types.ObjectId;
  presets: Types.ObjectId[];
  totalPrice: number;
  stripeSessionId: string;
  status: "pending" | "paid" | "failed";
  createdAt: Date;
}

const orderSchema = new Schema<Order>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    presets: [{ type: Schema.Types.ObjectId, ref: "Preset", required: true }],
    totalPrice: { type: Number, required: true },
    stripeSessionId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const OrderModel = models.Order || model<Order>("Order", orderSchema);
