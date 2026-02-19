import { notFound } from "next/navigation";
import { Button, Card, Tag, Typography } from "antd";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongoose";
import { PresetModel } from "@/models/Preset";
import { BuyButton } from "@/components/BuyButton";

export default async function PresetDetailsPage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  const preset = await PresetModel.findOne({ _id: params.id, isPublished: true }).lean();
  if (!preset) notFound();

  return (
    <Card cover={<img src={preset.coverImageUrl} alt={preset.title} style={{ maxHeight: 450, objectFit: "cover" }} />}>
      <Typography.Title>{preset.title}</Typography.Title>
      <Typography.Paragraph>{preset.description}</Typography.Paragraph>
      <Typography.Text strong>{preset.processorType}</Typography.Text>
      <div style={{ margin: "12px 0" }}>{preset.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
      <audio controls src={preset.previewAudioUrl} style={{ width: "100%" }} />
      <Typography.Title level={4}>${preset.price.toFixed(2)}</Typography.Title>
      <BuyButton presetId={String(preset._id)} />
      <div style={{ marginTop: 16 }}>
        <Link href="/presets">
          <Button>Back to presets</Button>
        </Link>
      </div>
    </Card>
  );
}
