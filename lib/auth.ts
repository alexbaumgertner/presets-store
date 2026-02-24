
import { connectToDatabase } from "@/lib/controllers/db";
import UserModel from "@/models/User";

const useStubAuth = true;

const STUB_EMAIL = "dev@example.com";

export async function getCurrentAppUser() {
  if (useStubAuth) {
    await connectToDatabase();
    // find or create a dev user in DB so we can persist purchasedPresets
    let user = await UserModel.findOne({ email: STUB_EMAIL }).lean().exec();
    if (!user) {
      const created = await UserModel.create({ email: STUB_EMAIL, role: "admin", purchasedPresets: [] });
      user = created.toObject();
    }
    return {
      _id: String((user as any)._id),
      email: String(user.email),
      role: String(user.role),
      purchasedPresets: Array.isArray(user.purchasedPresets) ? user.purchasedPresets : []
    };
  }
  return null;
}

export async function requireAdmin() {
  const user = await getCurrentAppUser();
  if (!user || user.role !== "admin") throw new Error("Not authorized");
  return user;
}
