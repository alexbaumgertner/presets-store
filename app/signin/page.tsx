"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Card } from "antd";
import { signIn } from "next-auth/react";

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <Card title="Sign in">
      <p style={{ marginBottom: 16 }}>Sign in with your account to continue.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Button block size="large" onClick={() => signIn("google", { callbackUrl })}>
          Sign in with Google
        </Button>
        {/* <Button block size="large" onClick={() => signIn("facebook", { callbackUrl })}>
          Sign in with Facebook
        </Button>
        <Button block size="large" onClick={() => signIn("github", { callbackUrl })}>
          Sign in with GitHub
        </Button> */}
      </div>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div style={{ maxWidth: 400, margin: "48px auto", padding: 24 }}>
      <Suspense
        fallback={
          <Card title="Sign in">
            <p>Loading…</p>
          </Card>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
