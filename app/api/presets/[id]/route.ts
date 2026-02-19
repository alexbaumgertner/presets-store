import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { PresetModel } from "@/models/Preset";
import { getCurrentAppUser, requireAdmin } from "@/lib/auth";
import { ApiResponse, PresetDto } from "@/types/api";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const user = await getCurrentAppUser();
  const preset = await PresetModel.findById(params.id).lean();

  if (!preset || (!preset.isPublished && user?.role !== "admin")) {
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json<ApiResponse<PresetDto>>({
    success: true,
    data: {
      _id: String(preset._id),
      title: preset.title,
      description: preset.description,
      processorType: preset.processorType,
      tags: preset.tags,
      price: preset.price,
      previewAudioUrl: preset.previewAudioUrl,
      coverImageUrl: preset.coverImageUrl,
      isPublished: preset.isPublished
    }
  });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const body = await request.json();

    const preset = await PresetModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!preset) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: { id: String(preset._id) } });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 403 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await connectToDatabase();
    await PresetModel.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 403 });
  }
}
