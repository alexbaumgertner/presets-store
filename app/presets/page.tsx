import { Col, Empty, Row, Typography } from "antd";
import { connectToDatabase } from "@/lib/mongoose";
import { presetsController } from "@/lib/controllers/PresetsController";
import { PresetCard } from "@/components/PresetCard";

export default async function PresetsPage() {
  await connectToDatabase();
  const presets = await presetsController.get({ isPublished: true, createdAt: -1 });

  return (
    <>
      <h2>Preset Marketplace</h2>
      {presets.length === 0 ? (
        <Empty description="No presets published yet" />
      ) : (
        <Row gutter={[16, 16]}>
          {presets.map((preset) => (
            <Col key={String(preset._id)} xs={24} md={12} lg={8}>
              <PresetCard
                preset={{
                  _id: String(preset._id),
                  title: preset.title,
                  description: preset.description,
                  processorType: preset.processorType,
                  tags: preset.tags,
                  price: preset.price,
                  previewAudioUrl: preset.previewAudioUrl,
                  coverImageUrl: preset.coverImageUrl,
                  isPublished: preset.isPublished,
                }}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}
