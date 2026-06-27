"use client";

import ProviderCard from "@/components/ProviderCard";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function PostJobPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, city: profile?.city }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("postJob.errorDefault"));
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-brand mb-1">{t("postJob.title")}</h1>
        <p className="text-sm text-text-muted mb-5">
          {t("postJob.subtitle")}
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder={t("postJob.placeholder")}
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 mb-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !input.trim()}
          className="bg-brand text-white px-5 py-2 rounded-lg font-medium hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? t("postJob.loading") : t("postJob.button")}
        </button>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        {result && (
          <div className="mt-6 space-y-5">
            <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase">{t("postJob.category")}</p>
                <p className="text-lg font-semibold text-brand">{result.category}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase">{t("postJob.description")}</p>
                <p className="text-text leading-relaxed">{result.description}</p>
              </div>
              {result.saved && <p className="text-xs text-green-600">{t("postJob.saved")}</p>}
            </div>

            {/* Smart Recommendations */}
            <div>
              <h2 className="text-lg font-semibold mb-3">{t("postJob.recommendationsTitle")}</h2>
              {result.recommendations?.length ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {result.recommendations.map((p) => (
                    <ProviderCard key={p.id} provider={p} score={p.score} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">{t("postJob.empty")}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}