"use client";

import { Button, message } from "antd";

export function DownloadButton({ presetId }: { presetId: string }) {
  const onDownload = async () => {
    const res = await fetch("/api/download/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presetId })
    });
    const data = await res.json();
    if (!data.success) return message.error(data.error || "Unable to generate download link");
    window.location.href = data.data.url;
  };

  return <Button onClick={onDownload}>Download</Button>;
}
