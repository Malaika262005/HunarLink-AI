import { useLanguage } from "@/context/LanguageContext";

export default function SearchBar({ query, setQuery, category, setCategory, city, setCity, categories }) {
  const { t } = useLanguage();
  const base =
    "bg-surface border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand";
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchBar.searchPlaceholder")}
        className={`${base} flex-1`}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className={base}>
        <option value="">{t("searchBar.categoryPlaceholder")}</option>
        {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
      </select>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder={t("searchBar.cityPlaceholder")}
        className={base}
      />
    </div>
  );
}