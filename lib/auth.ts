import { auth, currentUser } from "@clerk/nextjs/server";
import { UserModel } from "@/models/User";
import { connectToDatabase } from "@/lib/mongoose";

export async function getCurrentAppUser() {
  const { userId } = await auth();
  if (!userId) return null;

  await connectToDatabase();
  const clerkUser = await currentUser();
  if (!clerkUser?.emailAddresses?.[0]?.emailAddress) return null;

  const email = clerkUser.emailAddresses[0].emailAddress;
  const user = await UserModel.findOneAndUpdate(
    { email },
    { $setOnInsert: { email, role: "user", purchasedPresets: [] } },
    { new: true, upsert: true }
  );

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentAppUser();
  if (!user || user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}
