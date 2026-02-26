import { NextResponse } from "next/server";
import { requireManagerOrAdmin } from "@/lib/auth";
import { presetsController } from "@/lib/controllers/PresetsController";

export async function GET() {
  await requireManagerOrAdmin();
  const presets = await presetsController.get({ createdAt: -1 });
  return NextResponse.json({ success: true, data: presets });
}
