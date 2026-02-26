"use client";

import { Button, Card, Divider, Empty, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { CartDto } from "@/types/api";

export function CartView({ cart }: { cart: CartDto }) {
  const router = useRouter();

  const handleRemove = async (presetId: string) => {
    try {
      const res = await fetch(`/api/cart?presetId=${encodeURIComponent(presetId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json?.success) {
        message.success("Removed");
        router.refresh();
      } else {
        message.error(json?.error ?? "Failed to remove");
      }
    } catch (err) {
      message.error("Network error");
    }
  };

  const handleBuy = async () => {
    try {
      const res = await fetch("/api/orders", { method: "POST" });
      const json = await res.json();
      if (json?.success) {
        message.success("Purchase successful");
        router.push("/library");
      } else {
        message.error(json?.error ?? "Purchase failed");
      }
    } catch (err) {
      message.error("Network error");
    }
  };

  const items = cart?.items || [];
  const total = items.reduce((s: number, it: any) => s + Number(it.price || 0), 0);

  return (
    <div>
      <h2>Cart</h2>
      {items.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((item: any) => (
            <Card
              key={item.presetId}
              variant="outlined"
              size="small"
              extra={
                <Button danger onClick={() => handleRemove(item.presetId)}>
                  Remove
                </Button>
              }
            >
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {item.coverImageUrl && (
                  <img
                    src={item.coverImageUrl}
                    alt={item.title || "Preset"}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Typography.Text strong>{item.title || item.presetId}</Typography.Text>
                  {item.processorType && (
                    <>
                      {" "}
                      <Typography.Text type="secondary">({item.processorType})</Typography.Text>
                    </>
                  )}
                  {item.authorId && (
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        By {item.authorId}
                      </Typography.Text>
                    </div>
                  )}
                  {item.description && (
                    <div style={{ marginTop: 4 }}>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {item.description}
                      </Typography.Text>
                    </div>
                  )}
                  {item.previewAudioUrl && (
                    <div style={{ marginTop: 8 }}>
                      <audio src={item.previewAudioUrl} controls style={{ width: "100%", maxWidth: 300, height: 32 }} />
                    </div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <Typography.Text type="secondary">${Number(item.price).toFixed(2)}</Typography.Text>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Divider />
      <Typography.Text strong>Total: ${total.toFixed(2)}</Typography.Text>
      <div style={{ marginTop: 12 }}>
        <Button type="primary" onClick={handleBuy} disabled={items.length === 0}>
          Buy
        </Button>
      </div>
    </div>
  );
}

export default CartView;
