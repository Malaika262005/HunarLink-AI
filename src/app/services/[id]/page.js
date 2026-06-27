"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import RatingStars from "@/components/RatingStars";
import { useLanguage } from "@/context/LanguageContext";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [supabase] = useState(() => createClient());

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ scheduled_date: "", address: "", notes: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("services")
        .select("*, categories(name), providers(id, rating, is_verified, experience_years, profiles(full_name, city, phone))")
        .eq("id", id)
        .single();
      setService(data);
      setLoading(false);
    };
    load();
  }, [id, supabase]);

  const handleBook = async () => {
    if (!user) return router.push("/login");
    setBusy(true); setMsg("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider_id: service.providers.id,
        service_id: service.id,
        ...booking,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setMsg("❌ " + (data.error || t("serviceDetail.errorDefault")));
    setMsg(t("serviceDetail.success"));
    setBooking({ scheduled_date: "", address: "", notes: "" });
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center text-text-muted">{t("common.loading")}</main>;
  if (!service) return <main className="min-h-screen flex items-center justify-center text-text-muted">{t("serviceDetail.notFound")}</main>;

  const p = service.providers;
  const inputCls = "w-full bg-surface border border-border rounded-lg px-3 py-2 mb-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/services" className="text-sm text-brand">{t("serviceDetail.back")}</Link>

        <div className="bg-surface border border-border rounded-xl p-6 mt-3">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-text">{service.title}</h1>
            <span className="text-xs bg-brand-light/30 text-brand-dark px-2 py-1 rounded-full">
              {service.categories?.name}
            </span>
          </div>
          <p className="text-text-muted mt-3">{service.description}</p>
          <p className="text-xl font-bold text-brand mt-4">Rs.{service.price || 0}</p>

          {p && (
            <Link href={`/providers/${p.id}`} className="block mt-5 pt-5 border-t border-border">
              <p className="text-sm text-text-muted uppercase">Provider</p>
              <div className="flex justify-between items-center mt-1">
                <p className="font-medium">
                  {p.profiles?.full_name}
                  {p.is_verified && <span className="ml-1 text-green-600">✓ {t("serviceDetail.verified")}</span>}
                </p>
                <RatingStars value={p.rating} />
              </div>
              <p className="text-sm text-text-muted">{p.profiles?.city} · {p.experience_years || 0} {t("serviceDetail.years")}</p>
            </Link>
          )}
        </div>

        {/* Booking form */}
        <div className="bg-surface border border-border rounded-xl p-6 mt-5">
          <h2 className="text-lg font-semibold mb-4">{t("serviceDetail.bookTitle")}</h2>
          <input type="date" className={inputCls}
            value={booking.scheduled_date}
            onChange={(e) => setBooking({ ...booking, scheduled_date: e.target.value })} />
          <input placeholder={t("serviceDetail.address")} className={inputCls}
            value={booking.address}
            onChange={(e) => setBooking({ ...booking, address: e.target.value })} />
          <textarea rows={2} placeholder={t("serviceDetail.notes")} className={inputCls}
            value={booking.notes}
            onChange={(e) => setBooking({ ...booking, notes: e.target.value })} />
          {msg && <p className="text-sm mb-3">{msg}</p>}
          <button onClick={handleBook} disabled={busy}
            className="w-full bg-brand text-white py-2 rounded-lg font-medium hover:bg-brand-dark disabled:opacity-50">
            {busy ? t("serviceDetail.bookingLoading") : t("serviceDetail.confirm")}
          </button>
        </div>
      </div>
    </main>
  );
}