import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  role: string;
  purchasedPresets: string[];
  createdAt: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },
    purchasedPresets: { type: [String], default: [] }
  },
  { timestamps: true }
);

const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;

