import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { PresetModel } from "@/models/Preset";

export async function GET() {
  await requireAdmin();
  await connectToDatabase();
  const presets = await PresetModel.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, data: presets });
}
