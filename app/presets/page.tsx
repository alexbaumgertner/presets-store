import { Empty } from "antd";
import { presetsController } from "@/lib/controllers/PresetsController";
import { PresetsGrid } from "@/components/PresetsGrid";
import { connectToDatabase } from "@/lib/controllers/db";

export const dynamic = "force-dynamic";

export default async function PresetsPage() {
  await connectToDatabase();
  const presets = await presetsController.get({ isPublished: true, createdAt: -1 });

  const presetDtos = presets.map((preset) => ({
    _id: String(preset._id),
    title: preset.title,
    description: preset.description,
    processorType: preset.processorType,
    tags: preset.tags,
    price: preset.price,
    presetFileUrl: preset.presetFileUrl,
    previewAudioUrl: preset.previewAudioUrl,
    previewVideoUrl: preset.previewVideoUrl,
    coverImageUrl: preset.coverImageUrl,
    isPublished: preset.isPublished,
  }));

  return (
    <>
      <h2>Preset Marketplace</h2>
      {presetDtos.length === 0 ? (
        <Empty description="No presets published yet" />
      ) : (
        <PresetsGrid presets={presetDtos} />
      )}
    </>
  );
}
