import { Card, Typography } from "antd";
import { requireAdmin } from "@/lib/auth";
import { NewPresetForm } from "@/components/NewPresetForm";

export default async function NewPresetPage() {
  await requireAdmin();

  return (
    <Card>
      <h2>Create New Preset</h2>
      <NewPresetForm />
    </Card>
  );
}
