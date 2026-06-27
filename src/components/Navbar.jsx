"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { user, profile, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    router.push("/");
  };

  const dashHref =
    profile?.role === "provider" ? "/dashboard/provider"
    : profile?.role === "admin" ? "/dashboard/admin"
    : "/dashboard/customer";

  const links = !user
    ? [{ href: "/", label: t("nav.home") }, { href: "/services", label: t("nav.services") }, { href: "/about", label: t("nav.about") }]
    : profile?.role === "customer"
    ? [
        { href: dashHref, label: t("nav.dashboard") },
        { href: "/services", label: t("nav.services") },
        { href: "/post-job", label: t("nav.aiPost") },
        { href: "/bookings", label: t("nav.bookings") },
      ]
    : profile?.role === "provider"
    ? [{ href: dashHref, label: t("nav.dashboard") }, { href: "/services", label: t("nav.browseServices") }, { href: "/about", label: t("nav.about") }]
    : [{ href: dashHref, label: t("nav.dashboard") }, { href: "/about", label: t("nav.about") }];

  const isActive = (href) => pathname === href;
  const initial = (profile?.full_name || "U").charAt(0).toUpperCase();

  return (
    <nav className="bg-surface/90 backdrop-blur border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-brand">
          HunarLink<span className="text-text"> AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                isActive(l.href) ? "bg-brand/10 text-brand font-medium" : "text-text-muted hover:bg-bg"
              }`}>
              {l.label}
            </Link>
          ))}

          <div className="w-px h-6 bg-border mx-2" />

          {!loading && (user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-medium">{initial}</div>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-text">{profile?.full_name}</p>
                  <p className="text-xs text-text-muted capitalize">{profile?.role}</p>
                </div>
              </div>
              <Link href="/settings" className="text-text-muted hover:text-brand p-2 rounded-lg hover:bg-bg" title="Settings">⚙️</Link>
              <button onClick={handleLogout}
                className="text-sm text-text-muted hover:text-red-500 border border-border px-3 py-1.5 rounded-lg">
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-text-muted px-3 py-2 hover:text-brand">{t("nav.login")}</Link>
              <Link href="/register" className="text-sm bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark">{t("nav.signup")}</Link>
            </div>
          ))}
        </div>

        {/* Mobile button */}
        <button className="md:hidden text-2xl text-text" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border px-6 py-4 space-y-2">
          {user && (
            <div className="flex items-center gap-2 pb-3 mb-2 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-medium">{initial}</div>
              <div>
                <p className="text-sm font-medium text-text">{profile?.full_name}</p>
                <p className="text-xs text-text-muted capitalize">{profile?.role}</p>
              </div>
            </div>
          )}
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm text-text-muted py-1.5 hover:text-brand">{l.label}</Link>
          ))}
          {user && (
            <Link href="/settings" onClick={() => setOpen(false)} className="block text-sm text-text-muted py-1.5 hover:text-brand">⚙️ {t("settings.title")}</Link>
          )}
          {!loading && (user ? (
            <button onClick={handleLogout} className="block text-sm text-red-500 py-1.5">{t("nav.logout")}</button>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block text-sm text-text-muted py-1.5">{t("nav.login")}</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="block text-sm text-brand font-medium py-1.5">{t("nav.signup")}</Link>
            </>
          ))}
        </div>
      )}
    </nav>
  );
}