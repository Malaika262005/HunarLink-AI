"use client";

import { useLanguage } from "@/context/LanguageContext";
export default function AboutPage() {
  const { t } = useLanguage();
  const features = [
    { icon: "🤖", title: t("about.features.smartTitle"), desc: t("about.features.smartDesc") },
    { icon: "📄", title: t("about.features.aiTitle"), desc: t("about.features.aiDesc") },
    { icon: "🎯", title: t("about.features.matchTitle"), desc: t("about.features.matchDesc") },
    { icon: "✅", title: t("about.features.verifiedTitle"), desc: t("about.features.verifiedDesc") },
  ];

  return (
    <main className="flex-1 bg-bg">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-brand mb-3">{t("about.title")}</h1>
        <p className="text-text-muted leading-relaxed">
          {t("about.intro")}
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {features.map((f, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-text">{f.title}</h3>
              <p className="text-sm text-text-muted mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}