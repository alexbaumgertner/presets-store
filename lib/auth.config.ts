import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
// import Facebook from "next-auth/providers/facebook";
// import GitHub from "next-auth/providers/github";

/**
 * Edge-safe auth config (no DB). Used by middleware and merged with callbacks in auth.ts.
 */
export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // Facebook({
    //   clientId: process.env.AUTH_FACEBOOK_ID,
    //   clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    // GitHub({
    //   clientId: process.env.AUTH_GITHUB_ID,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    // }),
  ],
  session: { strategy: "jwt" as const, maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/signin" },
} satisfies NextAuthConfig;
