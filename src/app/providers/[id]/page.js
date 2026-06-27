"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import RatingStars from "@/components/RatingStars";
import { useLanguage } from "@/context/LanguageContext";

export default function ProviderProfilePage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [supabase] = useState(() => createClient());
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: prov } = await supabase
        .from("providers")
        .select("*, categories(name), profiles(full_name, city)")
        .eq("id", id).single();
      setProvider(prov);

      const { data: svc } = await supabase
        .from("services").select("*, categories(name)")
        .eq("provider_id", id).eq("is_active", true);
      setServices(svc || []);

      const { data: rev } = await supabase
        .from("reviews").select("*, profiles(full_name)")
        .eq("provider_id", id).order("created_at", { ascending: false });
      setReviews(rev || []);

      setLoading(false);
    };
    load();
  }, [id, supabase]);

  if (loading) return <main className="min-h-screen flex items-center justify-center text-text-muted">{t("common.loading")}</main>;
  if (!provider) return <main className="min-h-screen flex items-center justify-center text-text-muted">{t("providerProfile.notFound")}</main>;

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Profile header */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-text">
                {provider.profiles?.full_name}
                {provider.is_verified && <span className="ml-2 text-sm text-green-600">✓ {t("providerProfile.verified")}</span>}
              </h1>
              <p className="text-text-muted">{provider.categories?.name} · {provider.profiles?.city}</p>
            </div>
            <RatingStars value={provider.rating} />
          </div>
          <p className="text-text-muted mt-3">{provider.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {provider.skills?.map((s, i) => (
              <span key={i} className="text-xs bg-brand-light/30 text-brand-dark px-2 py-1 rounded-full">{s}</span>
            ))}
          </div>
          <p className="text-sm text-text-muted mt-3">
            {provider.experience_years || 0} {t("providerProfile.years")} · Rs.{provider.hourly_rate || 0}/{t("providerProfile.rate")}
          </p>
        </div>

        {/* Services */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{t("providerProfile.servicesTitle")} ({services.length})</h2>
          <div className="space-y-3">
            {services.map((s) => (
              <Link key={s.id} href={`/services/${s.id}`}
                className="flex justify-between items-center border border-border rounded-lg p-3 hover:bg-bg">
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-text-muted">{s.categories?.name}</p>
                </div>
                <span className="font-bold text-brand">Rs.{s.price || 0}</span>
              </Link>
            ))}
            {services.length === 0 && <p className="text-sm text-text-muted">{t("providerProfile.emptyServices")}</p>}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{t("providerProfile.reviewsTitle")} ({reviews.length})</h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-border pb-3 last:border-0">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">{r.profiles?.full_name}</p>
                  <RatingStars value={r.rating} />
                </div>
                <p className="text-sm text-text-muted mt-1">{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-text-muted">{t("providerProfile.emptyReviews")}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}