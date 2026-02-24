import Link from "next/link";
import { Button, Space, Switch, Table, Tag, Typography } from "antd";
import { requireAdmin } from "@/lib/auth";
import { presetsController } from "@/lib/controllers/PresetsController";
import { AdminPresetActions } from "@/components/AdminPresetActions";

export default async function AdminPresetsPage() {
  await requireAdmin();
  const presets = await presetsController.get({ createdAt: -1 });

  return (
    <>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Admin Presets</h2>
        <Link href="/admin/presets/new">
          <Button type="primary">New preset</Button>
        </Link>
      </Space>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #e8e8e8", textAlign: "left", padding: 8 }}>
              Title
            </th>
            <th style={{ borderBottom: "1px solid #e8e8e8", textAlign: "left", padding: 8 }}>
              Processor
            </th>
            <th style={{ borderBottom: "1px solid #e8e8e8", textAlign: "left", padding: 8 }}>
              Price
            </th>
            <th style={{ borderBottom: "1px solid #e8e8e8", textAlign: "left", padding: 8 }}>
              Tags
            </th>
            <th style={{ borderBottom: "1px solid #e8e8e8", textAlign: "left", padding: 8 }}>
              Published
            </th>
            <th style={{ borderBottom: "1px solid #e8e8e8", textAlign: "left", padding: 8 }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {presets.map((row: any) => (
            <tr key={row._id}>
              <td style={{ borderBottom: "1px solid #e8e8e8", padding: 8 }}>{row.title}</td>
              <td style={{ borderBottom: "1px solid #e8e8e8", padding: 8 }}>{row.processorType}</td>
              <td style={{ borderBottom: "1px solid #e8e8e8", padding: 8 }}>
                ${Number(row.price).toFixed(2)}
              </td>
              <td style={{ borderBottom: "1px solid #e8e8e8", padding: 8 }}>
                {row.tags.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </td>
              <td style={{ borderBottom: "1px solid #e8e8e8", padding: 8 }}>
                <Switch checked={row.isPublished} disabled />
              </td>
              <td style={{ borderBottom: "1px solid #e8e8e8", padding: 8 }}>
                <AdminPresetActions id={String(row._id)} isPublished={row.isPublished} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
