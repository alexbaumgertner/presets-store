"use client";

import dynamic from "next/dynamic";

const DynamicPlayer = dynamic(
  () => import("react-player").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          background: "#f0f0f0",
          borderRadius: 8,
          minHeight: 120,
        }}
      />
    ),
  }
);

export interface ReactPlayerProps {
  url: string;
  width?: string;
  height?: string;
  playing?: boolean;
  onPlay?: () => void;
  controls?: boolean;
}

export function ReactPlayer({
  url,
  width,
  height,
  playing,
  onPlay,
  controls,
}: ReactPlayerProps) {
  return (
    <DynamicPlayer
      url={url}
      width={width}
      height={height}
      playing={playing}
      onPlay={onPlay}
      controls={controls}
    />
  );
}
