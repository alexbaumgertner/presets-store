import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import { DownloadTokenModel } from "@/models/DownloadToken";
import { PresetModel } from "@/models/Preset";

export async function GET(_: Request, { params }: { params: { token: string } }) {
  try {
    const decoded = jwt.verify(params.token, process.env.DOWNLOAD_TOKEN_SECRET || "dev-secret") as { presetId: string; userId: string };
    await connectToDatabase();

    const record = await DownloadTokenModel.findOne({
      presetId: decoded.presetId,
      userId: decoded.userId,
      expiresAt: { $gt: new Date() }
    });

    if (!record) return NextResponse.json({ success: false, error: "Token invalid" }, { status: 403 });

    const preset = await PresetModel.findById(decoded.presetId).lean();
    if (!preset) return NextResponse.json({ success: false, error: "Preset missing" }, { status: 404 });

    return NextResponse.redirect(preset.presetFileUrl);
  } catch {
    return NextResponse.json({ success: false, error: "Token invalid or expired" }, { status: 403 });
  }
}
