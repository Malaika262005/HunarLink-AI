"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <p className="text-lg font-bold text-white">HunarLink AI</p>
          <p className="text-sm mt-2 text-text-muted">
            {t("footer.description")}
          </p>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">{t("footer.quickLinks")}</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-brand-light">{t("footer.services")}</Link></li>
            <li><Link href="/post-job" className="hover:text-brand-light">{t("footer.aiJobPost")}</Link></li>
            <li><Link href="/about" className="hover:text-brand-light">{t("footer.about")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">{t("footer.getStarted")}</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/register" className="hover:text-brand-light">{t("footer.becomeCustomer")}</Link></li>
            <li><Link href="/register" className="hover:text-brand-light">{t("footer.becomeProvider")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-text-muted">
        © © {new Date().getFullYear()} HunarLink AI · {t("footer.copyright")}
      </div>
    </footer>
  );
}