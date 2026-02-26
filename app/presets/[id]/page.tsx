import { notFound } from "next/navigation";
import { Button, Card, Tag } from "antd";
import Link from "next/link";
import { presetsController } from "@/lib/controllers/PresetsController";
import { PresetVideoPlayer } from "@/components/PresetVideoPlayer";

export default async function PresetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const preset = await presetsController.getById(id);
  if (!preset || !preset.isPublished) {
    return notFound();
  }

  const hasVideo = preset.previewVideoUrl && preset.previewVideoUrl.trim() !== "";

  return (
    <Card
      cover={
        hasVideo ? (
          <PresetVideoPlayer url={preset.previewVideoUrl!} height="450px" />
        ) : (
          <img
            src={preset.coverImageUrl}
            alt={preset.title}
            style={{ maxHeight: 450, objectFit: "cover" }}
          />
        )
      }
    >
      <h1>{preset.title}</h1>
      <p>{preset.description}</p>
      <strong>{preset.processorType}</strong>
      <div style={{ margin: "12px 0" }}>
        {preset.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <audio controls src={preset.previewAudioUrl} style={{ width: "100%" }} />
      <h4>${preset.price.toFixed(2)}</h4>
      <Link href={preset.presetFileUrl ?? ""}>
        <Button>Download</Button>
      </Link>
      <div style={{ marginTop: 16 }}>
        <Link href="/presets">
          <Button>Back to presets</Button>
        </Link>
      </div>
    </Card>
  );
}
