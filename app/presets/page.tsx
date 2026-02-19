import { Col, Empty, Row, Typography } from "antd";
import { connectToDatabase } from "@/lib/mongoose";
import { PresetModel } from "@/models/Preset";
import { PresetCard } from "@/components/PresetCard";

export default async function PresetsPage() {
  await connectToDatabase();
  const presets = await PresetModel.find({ isPublished: true }).sort({ createdAt: -1 }).lean();

  return (
    <>
      <Typography.Title>Preset Marketplace</Typography.Title>
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
                  isPublished: preset.isPublished
                }}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}
