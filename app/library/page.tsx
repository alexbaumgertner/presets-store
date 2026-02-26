import { redirect } from "next/navigation";
import { Card, Row, Col } from "antd";
import { getCurrentAppUser } from "@/lib/auth";
import { presetsController } from "@/lib/controllers/PresetsController";
import Link from "next/link";
import { DownloadButton } from "@/components/DownloadButton";

export default async function LibraryPage() {
  const user = await getCurrentAppUser();
  if (!user) redirect("/signin");

  const presets = (
    await Promise.all(user.purchasedPresets.map((id: string) => presetsController.getById(id)))
  ).filter(Boolean);

  console.log(presets);

  return (
    <Card>
      <h2>My Library</h2>
      <Row gutter={[16, 16]}>
        {presets.map((preset) => (
          <Col key={String(preset?._id)} xs={24} md={12} lg={8}>
            <Card
              variant="outlined"
              cover={
                <img
                  src={preset?.coverImageUrl}
                  alt={preset?.title}
                  style={{ maxHeight: 200, objectFit: "cover" }}
                />
              }
            >
              <div>
                <h5>{preset?.title}</h5>
                <p>${preset?.price.toFixed(2)}</p>
                <Link href={preset?.presetFileUrl ?? ""}>
                  <DownloadButton presetId={preset?._id ?? ""} />
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
