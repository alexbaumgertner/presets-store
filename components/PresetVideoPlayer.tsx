"use client";

import { ReactPlayer } from "@/components/ReactPlayer";

export function PresetVideoPlayer({
  url,
  width = "100%",
  height = "180px",
}: {
  url: string;
  width?: string;
  height?: string;
}) {
  if (!url || url.trim() === "") return null;
  return (
    <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden" }}>
      <ReactPlayer url={url} width={width} height={height} controls />
    </div>
  );
}
