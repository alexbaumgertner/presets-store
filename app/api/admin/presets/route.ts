import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { presetsController } from "@/lib/controllers/PresetsController";

export async function GET() {
  await requireAdmin();
  await connectToDatabase();
  const presets = await presetsController.get({ createdAt: -1 });
  return NextResponse.json({ success: true, data: presets });
}
