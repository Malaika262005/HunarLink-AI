"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ServiceCard from "@/components/ServiceCard";
import SearchBar from "@/components/SearchBar";
import { useLanguage } from "@/context/LanguageContext";

function ServicesInner() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [supabase] = useState(() => createClient());
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: cats } = await supabase.from("categories").select("*").order("name");
      setCategories(cats || []);

      const catSlug = searchParams.get("cat");
      if (catSlug && cats) {
        const found = cats.find((c) => c.slug === catSlug);
        if (found) setCategory(found.name);
      }

      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services || []);
      setLoading(false);
    };
    load();
  }, [supabase, searchParams]);

  const filtered = services.filter((s) => {
    const text = ((s.title || "") + " " + (s.description || "")).toLowerCase();
    const matchQ = query ? text.includes(query.toLowerCase()) : true;
    const matchCat = category ? s.categories?.name === category : true;
    const matchCity = city ? (s.city || "").toLowerCase().includes(city.toLowerCase()) : true;
    return matchQ && matchCat && matchCity;
  });

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-brand">{t("services.title")}</h1>
          <Link href="/post-job" className="text-sm text-brand font-medium">{t("services.cta")}</Link>
        </div>
        <p className="text-sm text-text-muted mb-6">{t("services.subtitle")}</p>

        <SearchBar
          query={query} setQuery={setQuery}
          category={category} setCategory={setCategory}
          city={city} setCity={setCity}
          categories={categories}
        />

        {loading ? (
          <p className="text-text-muted">{t("services.loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="text-text-muted">{t("services.empty")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center text-text-muted">Loading...</main>}>
      <ServicesInner />
    </Suspense>
  );
}