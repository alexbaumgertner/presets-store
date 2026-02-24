import { notFound } from "next/navigation";
import { Button, Card, Tag, Typography } from "antd";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongoose";
import { presetsController, type Preset } from "@/lib/controllers/PresetsController";
import { BuyButton } from "@/components/BuyButton";

export default async function PresetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const preset = await presetsController.getById(id);
  if (!preset || !preset.isPublished) {
    return notFound();
  }

  return (
    <Card
      cover={
        <img
          src={preset.coverImageUrl}
          alt={preset.title}
          style={{ maxHeight: 450, objectFit: "cover" }}
        />
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
      <BuyButton presetId={String(preset._id)} />
      <div style={{ marginTop: 16 }}>
        <Link href="/presets">
          <Button>Back to presets</Button>
        </Link>
      </div>
    </Card>
  );
}
