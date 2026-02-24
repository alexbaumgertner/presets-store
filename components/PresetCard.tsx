"use client";

import Link from "next/link";
import { Button, Card, Tag, message } from "antd";
import styles from "./PresetCard.module.css";
import { PresetDto } from "@/types/api";

export function PresetCard({ preset }: { preset: PresetDto }) {
  const handleAddToCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId: preset._id, price: preset.price })
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

  return (
    <Card
      title={preset.title}
      extra={<span>${preset.price.toFixed(2)}</span>}
      actions={[
        <Link key="view" href={`/presets/${preset._id}`}>
          View
        </Link>
      ]}
    >
      <img src={preset.coverImageUrl} alt={preset.title} className={styles.cardImage} />
      <p>{preset.processorType}</p>
      <div className={styles.tags}>
        {preset.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <audio controls className={styles.audio} src={preset.previewAudioUrl} />
      <Button type="primary" style={{ marginTop: 12 }} block onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </Card>
  );
}

