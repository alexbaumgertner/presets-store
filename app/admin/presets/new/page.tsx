import { Card, Typography } from "antd";
import { requireAdmin } from "@/lib/auth";
import { NewPresetForm } from "@/components/NewPresetForm";

export default async function NewPresetPage() {
  await requireAdmin();

  return (
    <Card>
      <Typography.Title level={2}>Create New Preset</Typography.Title>
      <NewPresetForm />
    </Card>
  );
}
