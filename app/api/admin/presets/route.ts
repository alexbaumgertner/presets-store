import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { presetsController } from "@/lib/controllers/PresetsController";

export async function GET() {
  await requireAdmin();
  const presets = await presetsController.get({ createdAt: -1 });
  return NextResponse.json({ success: true, data: presets });
}
