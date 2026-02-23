import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { presetsController, Preset } from "@/lib/controllers/PresetsController";
import { getCurrentAppUser, requireAdmin } from "@/lib/auth";
import { ApiResponse, PresetDto } from "@/types/api";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const user = await getCurrentAppUser();
  const { id } = await params;
  const preset = await presetsController.getById(id);

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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireAdmin();
    await connectToDatabase();
    const body = await request.json();
    const preset = await presetsController.update(id, body);
    if (!preset) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: { id: String(preset._id) } });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 403 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireAdmin();
    await connectToDatabase();
    await presetsController.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 403 });
  }
}
