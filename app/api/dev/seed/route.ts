import { NextResponse } from "next/server";
import { runSeed } from "@/scripts/seed";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const secret = request.headers.get("x-dev-seed-secret") || "";
  if (process.env.DEV_SEED_SECRET && secret !== process.env.DEV_SEED_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    await runSeed({ shouldClear: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

