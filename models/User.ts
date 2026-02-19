import { Schema, model, models, Types } from "mongoose";

export interface User {
  _id: string;
  email: string;
  role: "user" | "admin";
  purchasedPresets: Types.ObjectId[];
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    purchasedPresets: [{ type: Schema.Types.ObjectId, ref: "Preset" }]
  },
  { timestamps: true }
);

export const UserModel = models.User || model<User>("User", userSchema);
