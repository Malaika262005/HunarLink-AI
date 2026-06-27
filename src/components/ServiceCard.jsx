import Link from "next/link";
import RatingStars from "./RatingStars";
import { useLanguage } from "@/context/LanguageContext";

export default function ServiceCard({ service }) {
  const { t } = useLanguage();
  const provider = service.providers;
  return (
    <Link
      href={`/services/${service.id}`}
      className="block bg-surface border border-border rounded-xl p-5 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-text">{service.title}</h3>
        <span className="text-xs bg-brand-light/30 text-brand-dark px-2 py-1 rounded-full">
          {service.categories?.name}
        </span>
      </div>
      <p className="text-sm text-text-muted mt-2 line-clamp-2">{service.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-brand">Rs.{service.price || 0}</span>
        <span className="text-xs text-text-muted">{service.city}</span>
      </div>
      {provider && (
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
          <span className="text-sm text-text-muted">
            {provider.profiles?.full_name}
            {provider.is_verified && <span className="ml-1 text-green-600">✓ {t("serviceCard.verified")}</span>}
          </span>
          <RatingStars value={provider.rating} />
        </div>
      )}
    </Link>
  );
}