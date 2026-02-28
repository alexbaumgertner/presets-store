"use client";

import { useEffect, useState } from "react";
import { Button, Rate, Input, Card, Avatar } from "antd";
import type { ReviewDto } from "@/types/api";

const { TextArea } = Input;

export function PresetReviews({
  presetId,
  initialReviews,
  isSignedIn
}: {
  presetId: string;
  initialReviews: ReviewDto[];
  isSignedIn: boolean;
}) {
  const [reviews, setReviews] = useState<ReviewDto[]>(initialReviews);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/presets/${presetId}/reviews`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setReviews(data.data);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!isSignedIn) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/presets/${presetId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, comment: comment || undefined })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReviews((prev) => [data.data, ...prev]);
        setScore(5);
        setComment("");
      } else {
        alert(data.error ?? "Failed to submit review");
      }
    } catch (e) {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const average = reviews.length
    ? (reviews.reduce((a, r) => a + r.score, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Reviews {average != null && `(avg: ${average} ★)`}</h3>
      {isSignedIn && (
        <Card size="small" style={{ marginBottom: 16 }}>
          <p>Your rating</p>
          <Rate value={score} onChange={setScore} count={5} />
          <TextArea
            placeholder="Optional comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{ marginTop: 8 }}
          />
          <Button
            type="primary"
            onClick={onSubmit}
            loading={submitting}
            style={{ marginTop: 8 }}
          >
            Submit review
          </Button>
        </Card>
      )}
      <div>
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((r) => (
            <Card key={r._id} size="small" style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Avatar src={r.userImage ?? undefined}>{r.userName?.[0] ?? "?"}</Avatar>
                <strong>{r.userName ?? "Anonymous"}</strong>
                <Rate disabled value={r.score} count={5} />
                <span style={{ color: "#888", fontSize: 12 }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              {r.comment && <p style={{ margin: 0 }}>{r.comment}</p>}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
