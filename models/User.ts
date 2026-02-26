import mongoose, { Document, Schema } from "mongoose";
import { ROLES, type AppRole } from "@/lib/constants";

export { ROLES };
export type UserRole = AppRole;

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
  purchasedPresets: string[];
  createdAt: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    image: { type: String, required: false },
    role: { type: String, enum: ROLES, default: "user" },
    purchasedPresets: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;

