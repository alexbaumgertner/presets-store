import { Card, Typography } from "antd";
import { requireManagerOrAdmin } from "@/lib/auth";
import { NewPresetForm } from "@/components/NewPresetForm";

export default async function NewPresetPage() {
  await requireManagerOrAdmin();

  return (
    <Card style={{ width: "100%" }}>
      <h2>Create New Preset</h2>
      <NewPresetForm />
    </Card>
  );
}
