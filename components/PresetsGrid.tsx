"use client";

import { useState } from "react";
import { Col, Row } from "antd";
import { PresetCard } from "@/components/PresetCard";
import { PresetDto } from "@/types/api";

export function PresetsGrid({ presets }: { presets: PresetDto[] }) {
  const [playingPresetId, setPlayingPresetId] = useState<string | null>(null);

  return (
    <Row gutter={[16, 16]}>
      {presets.map((preset) => (
        <Col key={preset._id} xs={24} md={12} lg={8}>
          <PresetCard
            preset={preset}
            playingPresetId={playingPresetId}
            onPlayStart={setPlayingPresetId}
          />
        </Col>
      ))}
    </Row>
  );
}
