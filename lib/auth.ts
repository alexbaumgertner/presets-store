import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { ROLES, type AppRole } from "@/lib/constants";
import { connectToDatabase } from "@/lib/controllers/db";
import UserModel from "@/models/User";

export type { AppRole };

function isAppRole(r: string): r is AppRole {
  return ROLES.includes(r as AppRole);
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, profile }) {
      const email = user?.email ?? (profile as any)?.email;
      if (!email) return false;
      await connectToDatabase();
      let dbUser = await UserModel.findOne({ email }).lean().exec();
      if (!dbUser) {
        const role = process.env.ADMIN_EMAIL === email ? "admin" : "customer";
        const created = await UserModel.create({
          email,
          name: user.name ?? (profile as any)?.name ?? undefined,
          image: user.image ?? (profile as any)?.picture ?? (profile as any)?.avatar_url ?? undefined,
          role,
          purchasedPresets: [],
        });
        dbUser = created.toObject();
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user?.email) {
        await connectToDatabase();
        const dbUser = await UserModel.findOne({ email: user.email }).lean().exec();
        if (dbUser) {
          token.userId = String(dbUser._id);
          token.role = dbUser.role;
        }
      }
      if (trigger === "update" && token.email) {
        await connectToDatabase();
        const dbUser = await UserModel.findOne({ email: token.email }).lean().exec();
        if (dbUser) {
          token.userId = String(dbUser._id);
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId ?? token.sub;
        (session.user as any).role = isAppRole(String(token.role)) ? token.role : "user";
      }
      return session;
    },
  },
});

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role: AppRole;
};

/**
 * Get current app user from session (Server Components or Route Handlers).
 * Returns null if not signed in.
 */
export async function getCurrentAppUser(): Promise<{
  _id: string;
  email: string;
  role: AppRole;
  purchasedPresets: string[];
} | null> {
  const session = await auth();
  const su = session?.user as SessionUser | undefined;
  if (!su?.id) return null;
  await connectToDatabase();
  const dbUser = await UserModel.findById(su.id).lean().exec();
  if (!dbUser) return null;
  return {
    _id: String(dbUser._id),
    email: String(dbUser.email),
    role: isAppRole(dbUser.role) ? dbUser.role : "user",
    purchasedPresets: Array.isArray(dbUser.purchasedPresets) ? dbUser.purchasedPresets : [],
  };
}

export async function requireAdmin() {
  const user = await getCurrentAppUser();
  if (!user || user.role !== "admin") throw new Error("Not authorized");
  return user;
}

export async function requireManagerOrAdmin() {
  const user = await getCurrentAppUser();
  if (!user || (user.role !== "manager" && user.role !== "admin")) throw new Error("Not authorized");
  return user;
}
