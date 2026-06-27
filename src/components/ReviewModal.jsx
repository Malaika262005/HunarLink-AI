"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ReviewModal({ booking, onClose, onSubmitted }) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!rating) return setError(t("reviewModal.ratingError"));
    setError(""); setBusy(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: booking.id,
        provider_id: booking.provider_id,
        rating,
        comment,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error || t("common.error"));
    onSubmitted(data.review);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-1">{t("reviewModal.title")}</h2>
        <p className="text-sm text-text-muted mb-4">{booking.services?.title || t("reviewModal.serviceLabel")}</p>

        {/* Stars */}
        <div className="flex gap-1 mb-4 text-3xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={(hover || rating) >= star ? "text-yellow-500" : "text-gray-300"}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          placeholder={t("reviewModal.placeholder")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 mb-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex gap-2">
          <button onClick={submit} disabled={busy}
            className="flex-1 bg-brand text-white py-2 rounded-lg font-medium hover:bg-brand-dark disabled:opacity-50">
            {busy ? t("reviewModal.submitting") : t("reviewModal.submit")}
          </button>
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-text-muted bg-bg">{t("reviewModal.cancel")}</button>
        </div>
      </div>
    </div>
  );
}