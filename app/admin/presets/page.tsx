import Link from "next/link";
import { Button, Space, Switch, Table, Tag, Typography } from "antd";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { PresetModel } from "@/models/Preset";
import { AdminPresetActions } from "@/components/AdminPresetActions";

export default async function AdminPresetsPage() {
  await requireAdmin();
  await connectToDatabase();
  const presets = await PresetModel.find({}).sort({ createdAt: -1 }).lean();

  return (
    <>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Typography.Title level={2} style={{ margin: 0 }}>Admin Presets</Typography.Title>
        <Link href="/admin/presets/new"><Button type="primary">New preset</Button></Link>
      </Space>
      <Table
        rowKey={(row) => String(row._id)}
        dataSource={presets}
        columns={[
          { title: "Title", dataIndex: "title" },
          { title: "Processor", dataIndex: "processorType" },
          { title: "Price", render: (_, row) => `$${row.price.toFixed(2)}` },
          { title: "Tags", render: (_, row) => row.tags.map((tag: string) => <Tag key={tag}>{tag}</Tag>) },
          { title: "Published", render: (_, row) => <Switch checked={row.isPublished} disabled /> },
          { title: "Actions", render: (_, row) => <AdminPresetActions id={String(row._id)} isPublished={row.isPublished} /> }
        ]}
      />
    </>
  );
}
