import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { PresetModel } from "@/models/Preset";
import { getCurrentAppUser, requireAdmin } from "@/lib/auth";
import { uploadFileToBlob } from "@/lib/blob";
import { ApiResponse, PresetDto } from "@/types/api";

export async function GET() {
  await connectToDatabase();
  const user = await getCurrentAppUser();
  const filter = user?.role === "admin" ? {} : { isPublished: true };
  const presets = await PresetModel.find(filter).sort({ createdAt: -1 }).lean();

  return NextResponse.json<ApiResponse<PresetDto[]>>({
    success: true,
    data: presets.map((preset) => ({
      _id: String(preset._id),
      title: preset.title,
      description: preset.description,
      processorType: preset.processorType,
      tags: preset.tags,
      price: preset.price,
      previewAudioUrl: preset.previewAudioUrl,
      coverImageUrl: preset.coverImageUrl,
      isPublished: preset.isPublished
    }))
  });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    await connectToDatabase();

    const formData = await request.formData();
    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");
    const processorType = String(formData.get("processorType") ?? "");
    const tags = String(formData.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean);
    const price = Number(formData.get("price") ?? 0);
    const isPublished = String(formData.get("isPublished") ?? "false") === "true";
    const presetFile = formData.get("presetFile") as File;
    const previewAudio = formData.get("previewAudio") as File;
    const coverImage = formData.get("coverImage") as File;

    if (!title || !description || !processorType || !presetFile || !previewAudio || !coverImage) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const [presetBlob, audioBlob, coverBlob] = await Promise.all([
      uploadFileToBlob(`presets/${Date.now()}-${presetFile.name}`, presetFile),
      uploadFileToBlob(`previews/${Date.now()}-${previewAudio.name}`, previewAudio),
      uploadFileToBlob(`covers/${Date.now()}-${coverImage.name}`, coverImage)
    ]);

    const preset = await PresetModel.create({
      title,
      description,
      processorType,
      tags,
      price,
      isPublished,
      authorId: String(admin._id),
      presetFileUrl: presetBlob.url,
      previewAudioUrl: audioBlob.url,
      coverImageUrl: coverBlob.url
    });

    return NextResponse.json<ApiResponse<{ id: string }>>({ success: true, data: { id: String(preset._id) } });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>({ success: false, error: (error as Error).message }, { status: 403 });
  }
}
