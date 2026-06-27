import Link from "next/link";
import RatingStars from "./RatingStars";
import { useLanguage } from "@/context/LanguageContext";

export default function ProviderCard({ provider, score }) {
  const { t } = useLanguage();
  return (
    <Link
      href={`/providers/${provider.id}`}
      className="block bg-surface border border-border rounded-xl p-4 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-text">
            {provider.profiles?.full_name}
            {provider.is_verified && <span className="ml-1 text-green-600">✓</span>}
          </p>
          <p className="text-sm text-text-muted">
            {provider.categories?.name} · {provider.profiles?.city}
          </p>
        </div>
        {score != null && (
          <span className="text-xs bg-brand text-white px-2 py-1 rounded-full">
            {Math.round(score)}% {t("providerCard.match")}
          </span>
        )}
      </div>
      <div className="flex justify-between items-center mt-3">
        <RatingStars value={provider.rating} />
        <span className="text-sm text-text-muted">Rs.{provider.hourly_rate || 0}/hr</span>
      </div>
    </Link>
  );
}