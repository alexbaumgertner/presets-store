"use client";

import { Button, Popconfirm, Space, message } from "antd";

export function AdminPresetActions({ id, isPublished }: { id: string; isPublished: boolean }) {
  const togglePublish = async () => {
    const res = await fetch(`/api/presets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !isPublished })
    });
    const data = await res.json();
    if (!data.success) return message.error(data.error || "Update failed");
    window.location.reload();
  };

  const remove = async () => {
    const res = await fetch(`/api/presets/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) return message.error(data.error || "Delete failed");
    window.location.reload();
  };

  return (
    <Space>
      <Button onClick={togglePublish}>{isPublished ? "Unpublish" : "Publish"}</Button>
      <Popconfirm title="Delete preset?" onConfirm={remove}>
        <Button danger>Delete</Button>
      </Popconfirm>
    </Space>
  );
}
