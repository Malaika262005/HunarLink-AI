"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [supabase] = useState(() => createClient());
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    supabase.from("categories").select("*").order("name")
      .then(({ data }) => setCategories(data || []));
  }, [supabase]);

  const steps = [
    { icon: "📝", title: t("home.steps.oneTitle"), desc: t("home.steps.oneDesc") },
    { icon: "🎯", title: t("home.steps.twoTitle"), desc: t("home.steps.twoDesc") },
    { icon: "✅", title: t("home.steps.threeTitle"), desc: t("home.steps.threeDesc") },
  ];

  return (
    <main className="flex-1 bg-bg">
      {/* Hero */}
      <section className="bg-bg py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-text">
          {t("home.heroTitle")} <span className="text-brand">{t("home.heroHighlight")}</span>
        </h1>
        <p className="text-text-muted mt-4 max-w-xl mx-auto">
          {t("home.heroSubtitle")}
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Link href="/services" className="bg-brand text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-dark">
            {t("home.browseServices")}
          </Link>
          <Link href="/post-job" className="bg-surface border border-brand text-brand px-6 py-3 rounded-lg font-medium hover:bg-brand/5">
            {t("home.postJob")}
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-text mb-2">{t("home.categoriesTitle")}</h2>
        <p className="text-center text-text-muted mb-8">{t("home.categoriesSubtitle")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link key={c.id} href={`/services?cat=${c.slug}`}
              className="bg-surface border border-border rounded-xl p-6 text-center hover:shadow-md hover:border-brand transition">
              <div className="text-3xl mb-2">{c.icon}</div>
              <p className="font-medium text-text">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-bg py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-text mb-10">{t("home.howTitle")}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand/10 flex items-center justify-center text-2xl mb-4">
                  {s.icon}
                </div>
                <h3 className="font-semibold text-text">{s.title}</h3>
                <p className="text-sm text-text-muted mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-white">{t("home.ctaTitle")}</h2>
        <p className="text-white/90 mt-2">{t("home.ctaText")}</p>
        <Link href="/register" className="inline-block mt-6 bg-surface text-brand px-6 py-3 rounded-lg font-medium hover:bg-bg">
          {t("home.ctaButton")}
        </Link>
      </section>
    </main>
  );
}