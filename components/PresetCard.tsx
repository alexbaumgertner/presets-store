"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button, Card, Tag, message } from "antd";
import { ReactPlayer } from "@/components/ReactPlayer";
import styles from "./PresetCard.module.css";
import { PresetDto } from "@/types/api";

export interface PresetCardProps {
  preset: PresetDto;
  playingPresetId?: string | null;
  onPlayStart?: (id: string) => void;
}

export function PresetCard({ preset, playingPresetId = null, onPlayStart }: PresetCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (
      playingPresetId !== undefined &&
      playingPresetId !== null &&
      playingPresetId !== preset._id
    ) {
      audioRef.current?.pause();
    }
  }, [playingPresetId, preset._id]);

  const handleAddToCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId: preset._id, price: preset.price }),
      });
      const json = await res.json();
      if (json?.success) {
        message.success("Added to cart");
      } else {
        message.error(json?.error ?? "Failed to add to cart");
      }
    } catch (err) {
      message.error("Network error");
    }
  };

  const isPlaying = playingPresetId === preset._id;
  const hasVideo = preset.previewVideoUrl && preset.previewVideoUrl.trim() !== "";

  return (
    <Card
      title={preset.title}
      extra={<span>${preset.price.toFixed(2)}</span>}
      actions={[
        <Link key="view" href={`/presets/${preset._id}`}>
          View
        </Link>,
      ]}
    >
      {hasVideo ? (
        <div className={styles.cardVideo}>
          <ReactPlayer
            url={preset.previewVideoUrl!}
            width="100%"
            height="180px"
            playing={isPlaying}
            onPlay={() => onPlayStart?.(preset._id)}
            controls
          />
        </div>
      ) : (
        <img src={preset.coverImageUrl} alt={preset.title} className={styles.cardImage} />
      )}
      <p>{preset.processorType}</p>
      <div className={styles.tags}>
        {preset.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      {preset.previewAudioUrl && (
        <audio
          ref={audioRef}
          controls
          className={styles.audio}
          src={preset.previewAudioUrl}
          onPlay={() => onPlayStart?.(preset._id)}
        />
      )}
      <Button type="primary" style={{ marginTop: 12 }} block onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </Card>
  );
}
