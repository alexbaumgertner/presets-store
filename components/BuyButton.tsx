"use client";

import { Button, message } from "antd";

export function BuyButton({ presetId }: { presetId: string }) {
  const onBuy = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presetId })
    });
    const data = await res.json();
    if (!data.success) return message.error(data.error || "Checkout failed");
    window.location.href = data.data.checkoutUrl;
  };

  return (
    <Button type="primary" size="large" onClick={onBuy}>
      Buy now
    </Button>
  );
}
