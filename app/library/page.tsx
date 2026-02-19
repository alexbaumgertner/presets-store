import { redirect } from "next/navigation";
import { Card, List, Typography } from "antd";
import { getCurrentAppUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { PresetModel } from "@/models/Preset";
import { DownloadButton } from "@/components/DownloadButton";

export default async function LibraryPage() {
  const user = await getCurrentAppUser();
  if (!user) redirect("/sign-in");

  await connectToDatabase();
  const presets = await PresetModel.find({ _id: { $in: user.purchasedPresets } }).lean();

  return (
    <Card>
      <Typography.Title level={2}>My Library</Typography.Title>
      <List
        dataSource={presets}
        renderItem={(item) => (
          <List.Item actions={[<DownloadButton key="download" presetId={String(item._id)} />]}>
            <List.Item.Meta title={item.title} description={`${item.processorType} · ${item.tags.join(", ")}`} />
          </List.Item>
        )}
      />
    </Card>
  );
}
