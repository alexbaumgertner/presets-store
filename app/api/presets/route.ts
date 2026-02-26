import { NextResponse, NextRequest } from "next/server";
import { presetsController } from "@/lib/controllers/PresetsController";
import { getCurrentAppUser, requireManagerOrAdmin } from "@/lib/auth";
import { uploadFileToBlob } from "@/lib/controllers/storeFile";
import { ApiResponse, PresetDto } from "@/types/api";

export async function GET() {
  const user = await getCurrentAppUser();
  const filter = user?.role === "admin" || user?.role === "manager" ? {} : { isPublished: true };
  const presets = await presetsController.get({ ...filter, createdAt: -1 });

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
      previewVideoUrl: preset.previewVideoUrl,
      coverImageUrl: preset.coverImageUrl,
      isPublished: preset.isPublished
    }))
  });
}

export async function POST(request: NextRequest) {
  try {
    const managerOrAdmin = await requireManagerOrAdmin();

    const formData = await request.formData();

    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");
    const processorType = String(formData.get("processorType") ?? "");

    // tags may be JSON or comma string
    let tags: string[] = [];
    const tagsRaw = formData.get("tags");
    if (typeof tagsRaw === "string") {
      try {
        const parsed = JSON.parse(tagsRaw);
        if (Array.isArray(parsed)) tags = parsed.map((t) => String(t));
        else tags = String(tagsRaw).split(",").map((t) => t.trim()).filter(Boolean);
      } catch {
        tags = String(tagsRaw).split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    const price = Number(formData.get("price") ?? 0);
    const isPublished = String(formData.get("isPublished") ?? "false") === "true";

    const previewVideoUrl = String(formData.get("previewVideoUrl") ?? "").trim();
    const presetFile = formData.get("presetFile") as File | null;
    const previewAudio = formData.get("previewAudio") as File | null;
    const coverImage = formData.get("coverImage") as File | null;

    if (!title || !processorType || !presetFile) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const [presetPath, audioPath, coverPath] = await Promise.all([
      uploadFileToBlob(`presets/${Date.now()}-${(presetFile as File).name}`, presetFile),
      previewAudio ? uploadFileToBlob(`previews/${Date.now()}-${(previewAudio as File).name}`, previewAudio) : Promise.resolve(null),
      coverImage ? uploadFileToBlob(`covers/${Date.now()}-${(coverImage as File).name}`, coverImage) : Promise.resolve(null)
    ]);

    const authorId = typeof managerOrAdmin === "object" && managerOrAdmin !== null
      ? String((managerOrAdmin as any)._id ?? (managerOrAdmin as any).email ?? "manager")
      : "manager";

    const preset = await presetsController.create({
      title,
      description,
      processorType,
      tags,
      price,
      isPublished,
      authorId,
      presetFileUrl: String(presetPath ?? ""),
      previewAudioUrl: String(audioPath ?? ""),
      previewVideoUrl: previewVideoUrl || "",
      coverImageUrl: String(coverPath ?? "")
    });

    return NextResponse.json<ApiResponse<{ id: string }>>({ success: true, data: { id: String(preset._id) } });
  } catch (error) {
    console.log(':>>> error', error);
    return NextResponse.json<ApiResponse<null>>({ success: false, error: (error as Error).message }, { status: 403 });
  }
}
