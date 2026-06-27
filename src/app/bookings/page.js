"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewModal from "@/components/ReviewModal";
import { useLanguage } from "@/context/LanguageContext";

export default function BookingsPage() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [reviewedIds, setReviewedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { bookings } = await (await fetch("/api/bookings")).json();
      setBookings(bookings || []);

      // pehle se kin bookings ka review diya hai
      const { reviews } = await (await fetch("/api/reviews")).json();
      setReviewedIds((reviews || []).map((r) => r.booking_id));

      setLoading(false);
    };
    load();
  }, []);

  const colors = {
    pending: "text-yellow-600", accepted: "text-blue-600",
    completed: "text-green-600", cancelled: "text-red-500",
  };

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-brand mb-6">{t("bookings.title")}</h1>

        {loading ? (
          <p className="text-text-muted">{t("common.loading")}</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-text-muted mb-3">{t("bookings.empty")}</p>
            <Link href="/services" className="text-brand font-medium">{t("bookings.browse")}</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const reviewed = reviewedIds.includes(b.id);
              return (
                <div key={b.id} className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex justify-between">
                    <p className="font-medium">{b.services?.title || "Service"}</p>
                    <span className={`text-sm font-medium ${colors[b.status]}`}>{t(`bookings.status.${b.status}`)}</span>
                  </div>
                  {b.scheduled_date && <p className="text-sm text-text-muted">📅 {b.scheduled_date}</p>}
                  {b.notes && <p className="text-sm text-text-muted mt-1">📝 {b.notes}</p>}

                  {/* Review button sirf completed + abhi tak review nahi diya */}
                  {b.status === "completed" && (
                    reviewed ? (
                      <p className="text-xs text-green-600 mt-2">{t("bookings.reviewDone")}</p>
                    ) : (
                      <button
                        onClick={() => setActiveBooking(b)}
                        className="mt-3 text-sm bg-brand text-white px-4 py-1.5 rounded-lg hover:bg-brand-dark">
                        {t("bookings.reviewButton")}
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeBooking && (
        <ReviewModal
          booking={activeBooking}
          onClose={() => setActiveBooking(null)}
          onSubmitted={(review) => {
            setReviewedIds([...reviewedIds, activeBooking.id]);
            setActiveBooking(null);
          }}
        />
      )}
    </main>
  );
}