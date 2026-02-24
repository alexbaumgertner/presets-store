import { redirect } from "next/navigation";
import { Card, Row, Col } from "antd";
import { getCurrentAppUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { presetsController } from "@/lib/controllers/PresetsController";

export default async function LibraryPage() {
  const user = await getCurrentAppUser();
  if (!user) redirect("/sign-in");

  await connectToDatabase();
  const presets = (
    await Promise.all(user.purchasedPresets.map((id: string) => presetsController.getById(id)))
  ).filter(Boolean);

  console.log(presets);

  return (
    <Card>
      <h2>My Library</h2>
      <Row gutter={[16, 16]}>
        {presets.map((preset) => (
          <Col key={String(preset._id)} xs={24} md={12} lg={8}>
            <Card
              hoverable
              cover={<img src={preset.coverImageUrl} alt={preset.title} style={{ maxHeight: 200, objectFit: "cover" }} />}
            >
              <Card.Meta
                title={preset.title}
                description={`${preset.processorType} · ${preset.tags.join(", ")}`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
