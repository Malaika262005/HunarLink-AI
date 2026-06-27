"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomerDashboard() {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then((d) => setBookings(d.bookings || []));
  }, []);

  const tiles = [
    { href: "/services", title: t("customerDashboard.tiles.browse"), icon: "🔍" },
    { href: "/post-job", title: t("customerDashboard.tiles.aiPost"), icon: "✨" },
    { href: "/bookings", title: t("customerDashboard.tiles.bookings"), icon: "📋" },
  ];

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand">{t("customerDashboard.title")}</h1>
            <p className="text-sm text-text-muted">{t("customerDashboard.welcome")} {profile?.full_name} 👋</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {tiles.map((t) => (
            <Link key={t.href} href={t.href}
              className="bg-surface border border-border rounded-xl p-5 text-center hover:shadow-md transition">
              <div className="text-3xl mb-2">{t.icon}</div>
              <p className="font-medium text-text">{t.title}</p>
            </Link>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-3">{t("customerDashboard.recent")}</h2>
        <div className="space-y-3">
          {bookings.slice(0, 3).map((b) => (
            <div key={b.id} className="bg-surface border border-border rounded-lg p-3 flex justify-between">
              <span>{b.services?.title || "Service"}</span>
              <span className="text-sm text-text-muted">{b.status}</span>
            </div>
          ))}
          {bookings.length === 0 && <p className="text-sm text-text-muted">{t("customerDashboard.empty")}</p>}
        </div>
      </div>
    </main>
  );
}