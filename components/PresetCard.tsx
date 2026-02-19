import Link from "next/link";
import { Button, Card, Tag } from "antd";
import styles from "./PresetCard.module.css";
import { PresetDto } from "@/types/api";

export function PresetCard({ preset }: { preset: PresetDto }) {
  return (
    <Card
      title={preset.title}
      extra={<span>${preset.price.toFixed(2)}</span>}
      actions={[<Link key="view" href={`/presets/${preset._id}`}>View</Link>]}
    >
      <img src={preset.coverImageUrl} alt={preset.title} className={styles.cardImage} />
      <p>{preset.processorType}</p>
      <div className={styles.tags}>
        {preset.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <audio controls className={styles.audio} src={preset.previewAudioUrl} />
      <Link href={`/presets/${preset._id}`}>
        <Button type="primary" style={{ marginTop: 12 }} block>
          Details
        </Button>
      </Link>
    </Card>
  );
}
