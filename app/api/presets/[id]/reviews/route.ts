import { NextResponse } from "next/server";
import { presetsController } from "@/lib/controllers/PresetsController";
import { reviewController } from "@/lib/controllers/ReviewController";
import { getCurrentAppUser } from "@/lib/auth";
import { ApiResponse, ReviewDto } from "@/types/api";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: presetId } = await params;
  const preset = await presetsController.getById(presetId);
  if (!preset || !preset.isPublished) {
    return NextResponse.json<ApiResponse<ReviewDto[]>>(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  }
  const reviews = await reviewController.getByPresetId(presetId);
  return NextResponse.json<ApiResponse<ReviewDto[]>>({
    success: true,
    data: reviews
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentAppUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Not authorized" },
      { status: 401 }
    );
  }
  const { id: presetId } = await params;
  const preset = await presetsController.getById(presetId);
  if (!preset || !preset.isPublished) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  }
  try {
    const body = await request.json();
    const { score, comment } = body as { score?: number; comment?: string };
    const review = await reviewController.create(presetId, user._id, {
      score: score ?? 0,
      comment
    });
    return NextResponse.json<ApiResponse<ReviewDto>>({
      success: true,
      data: review
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
