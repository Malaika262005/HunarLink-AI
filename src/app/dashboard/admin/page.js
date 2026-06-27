"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const card = "bg-surface border border-border rounded-xl p-5 mb-6";

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin");
    const json = await res.json();
    if (!res.ok) { setError(json.error || t("common.error")); setLoading(false); return; }
    setData(json);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading)
    return <main className="min-h-screen flex items-center justify-center text-text-muted">{t("common.loading")}</main>;
  if (error)
    return <main className="min-h-screen flex items-center justify-center text-red-500">{error}</main>;

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand">{t("adminDashboard.title")}</h1>
            <p className="text-sm text-text-muted">{profile?.full_name}</p>
          </div>
        </div>

        <StatsGrid stats={data.stats} />
        <ProviderVerification
          providers={data.providers}
          onUpdate={(p) => setData({ ...data, providers: data.providers.map((x) => x.id === p.id ? p : x) })}
        />
        <CategoryManager
          categories={data.categories}
          onChange={(cats) => setData({ ...data, categories: cats })}
        />
      </div>
    </main>
  );
}

/* ---------- Stats ---------- */
function StatsGrid({ stats }) {
  const { t } = useLanguage();
  const items = [
    { label: t("adminDashboard.stats.users"), value: stats.totalUsers, icon: "👥" },
    { label: t("adminDashboard.stats.providers"), value: stats.totalProviders, icon: "🔧" },
    { label: t("adminDashboard.stats.verified"), value: stats.verifiedProviders, icon: "✅" },
    { label: t("adminDashboard.stats.bookings"), value: stats.totalBookings, icon: "📋" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {items.map((i) => (
        <div key={i.label} className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">{i.icon}</div>
          <p className="text-2xl font-bold text-brand">{i.value}</p>
          <p className="text-xs text-text-muted">{i.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Provider Verification ---------- */
function ProviderVerification({ providers, onUpdate }) {
  const { t } = useLanguage();
  const toggle = async (p) => {
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider_id: p.id, is_verified: !p.is_verified }),
    });
    const data = await res.json();
    if (res.ok) onUpdate(data.provider);
  };

  return (
    <div className={card}>
      <h2 className="text-lg font-semibold mb-4">{t("adminDashboard.verificationTitle")} ({providers.length})</h2>
      {providers.length === 0 && <p className="text-sm text-text-muted">{t("adminDashboard.noProviders")}</p>}
      <div className="space-y-3">
        {providers.map((p) => (
          <div key={p.id} className="flex justify-between items-center border border-border rounded-lg p-3">
            <div>
              <p className="font-medium">
                {p.profiles?.full_name}
                {p.is_verified && <span className="ml-2 text-xs text-green-600">✅ {t("common.verified")}</span>}
              </p>
              <p className="text-sm text-text-muted">
                {p.categories?.name || "—"} · {p.profiles?.city} · {p.profiles?.phone}
              </p>
            </div>
            <button
              onClick={() => toggle(p)}
              className={`text-sm px-3 py-1.5 rounded-lg ${
                p.is_verified
                  ? "bg-bg text-text-muted border border-border"
                  : "bg-brand text-white hover:bg-brand-dark"
              }`}>
              {p.is_verified ? t("adminDashboard.unverify") : t("adminDashboard.verify")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Category Manager ---------- */
function CategoryManager({ categories, onChange }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");

  const add = async () => {
    if (!name.trim()) return setError(t("adminDashboard.categoryRequired"));
    setError("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || t("common.error"));
    onChange([...categories, data.category].sort((a, b) => a.name.localeCompare(b.name)));
    setName(""); setIcon("");
  };

  const remove = async (id) => {
    const res = await fetch("/api/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) onChange(categories.filter((c) => c.id !== id));
  };

  return (
    <div className={card}>
      <h2 className="text-lg font-semibold mb-4">{t("adminDashboard.categoriesTitle")} ({categories.length})</h2>

      <div className="flex gap-2 mb-4">
        <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder={t("adminDashboard.addCategoryPlaceholder")}
          className="w-16 bg-surface border border-border rounded-lg px-3 py-2 text-center text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand" />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("adminDashboard.categoryNamePlaceholder")}
          className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand" />
        <button onClick={add} className="bg-brand text-white px-4 rounded-lg hover:bg-brand-dark">{t("adminDashboard.addButton")}</button>
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <span key={c.id} className="flex items-center gap-2 bg-bg border border-border text-text rounded-full pl-3 pr-2 py-1 text-sm">
            {c.icon} {c.name}
            <button onClick={() => remove(c.id)} className="text-red-400 hover:text-red-600">✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}