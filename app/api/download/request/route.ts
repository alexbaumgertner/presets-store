import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getCurrentAppUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { DownloadTokenModel } from "@/models/DownloadToken";

export async function POST(request: Request) {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { presetId } = await request.json();
  const purchased = user.purchasedPresets.some((id) => String(id) === presetId);
  if (!purchased) return NextResponse.json({ success: false, error: "Not purchased" }, { status: 403 });

  await connectToDatabase();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await DownloadTokenModel.create({ presetId, userId: user._id, expiresAt });

  const token = jwt.sign({ presetId, userId: String(user._id), exp: Math.floor(expiresAt.getTime() / 1000) }, process.env.DOWNLOAD_TOKEN_SECRET || "dev-secret");
  return NextResponse.json({ success: true, data: { url: `/api/download/${token}` } });
}
