import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isSignInPage = req.nextUrl.pathname === "/signin";
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuth) return;

  if (isAdminRoute && !isLoggedIn) {
    const signIn = new URL("/signin", req.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(signIn);
  }

  if (isSignInPage && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }

  return;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
