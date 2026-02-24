import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import { downloadTokensController } from "@/lib/controllers/DownloadTokensController";
import { presetsController, type Preset } from "@/lib/controllers/PresetsController";

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const decoded = jwt.verify(token, process.env.DOWNLOAD_TOKEN_SECRET || "dev-secret") as { presetId: string; userId: string };
    await connectToDatabase();

    const tokens = await downloadTokensController.get({
      presetId: decoded.presetId,
      userId: decoded.userId
    });
    const record = tokens.find((t) => new Date(t.expiresAt) > new Date());
    if (!record) return NextResponse.json({ success: false, error: "Token invalid" }, { status: 403 });

    const preset = await presetsController.getById(decoded.presetId);
    if (!preset) return NextResponse.json({ success: false, error: "Preset missing" }, { status: 404 });

    return NextResponse.redirect(preset.presetFileUrl);
  } catch {
    return NextResponse.json({ success: false, error: "Token invalid or expired" }, { status: 403 });
  }
}
