"use client";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { theme, changeTheme } = useTheme();
  const { lang, changeLang, t } = useLanguage();
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const themeOptions = [
    { id: "light", label: t("settings.light"), desc: t("settings.lightDesc"), swatch: "#0f766e", bg: "#f9fafb" },
    { id: "dark", label: t("settings.dark"), desc: t("settings.darkDesc"), swatch: "#14b8a6", bg: "#0f172a" },
    { id: "brand", label: t("settings.brand"), desc: t("settings.brandDesc"), swatch: "#7c3aed", bg: "#faf5ff" },
  ];

  const langOptions = [
    { id: "en", label: "English", sub: "English" },
    { id: "roman", label: "Roman Urdu", sub: "Roman" },
    { id: "urdu", label: "اردو", sub: "Urdu" },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen p-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--brand)" }}>
          {t("settings.title")}
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          {t("settings.subtitle")}
        </p>

        {/* ===== APPEARANCE ===== */}
        <section className="rounded-xl p-6 mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-lg font-semibold mb-4">🎨 {t("settings.appearance")}</h2>

          {/* Theme */}
          <p className="text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>
            {t("settings.theme")}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((o) => (
              <button key={o.id} onClick={() => changeTheme(o.id)}
                className="rounded-xl p-4 text-left transition"
                style={{
                  border: theme === o.id ? `2px solid ${o.swatch}` : "1px solid var(--border)",
                  background: o.bg,
                }}>
                <div className="w-8 h-8 rounded-full mb-2" style={{ background: o.swatch }} />
                <p className="font-medium text-sm" style={{ color: o.id === "dark" ? "#f1f5f9" : "#1f2937" }}>{o.label}</p>
                <p className="text-xs" style={{ color: o.id === "dark" ? "#94a3b8" : "#6b7280" }}>{o.desc}</p>
                {theme === o.id && <span className="text-xs font-medium mt-2 block" style={{ color: o.swatch }}>✓ {t("settings.active")}</span>}
              </button>
            ))}
          </div>

          {/* Language (ab working!) */}
          <p className="text-sm font-medium mt-6 mb-3" style={{ color: "var(--text-muted)" }}>
            🌐 {t("settings.language")}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {langOptions.map((o) => (
              <button key={o.id} onClick={() => changeLang(o.id)}
                className="rounded-xl p-4 text-center transition"
                style={{
                  border: lang === o.id ? "2px solid var(--brand)" : "1px solid var(--border)",
                  background: "var(--bg)",
                }}>
                <p className="font-medium" style={{ color: "var(--text)" }}>{o.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{o.sub}</p>
                {lang === o.id && <span className="text-xs font-medium mt-1 block" style={{ color: "var(--brand)" }}>✓ {t("settings.active")}</span>}
              </button>
            ))}
          </div>
        </section>

        {/* ===== ACCOUNT ===== */}
        <section className="rounded-xl p-6 mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-lg font-semibold mb-4">👤 {t("settings.account")}</h2>
          <div className="space-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
            <p>{t("settings.name")}: <span style={{ color: "var(--text)" }}>{profile?.full_name || "—"}</span></p>
            <p>{t("settings.role")}: <span style={{ color: "var(--text)" }} className="capitalize">{profile?.role || "—"}</span></p>
            <p>{t("settings.city")}: <span style={{ color: "var(--text)" }}>{profile?.city || "—"}</span></p>
          </div>
          <p className="text-xs mt-3 italic" style={{ color: "var(--text-muted)" }}>{t("settings.accountSoon")}</p>
        </section>

        {/* ===== LOGOUT ===== */}
        <button onClick={handleLogout}
          className="w-full py-3 rounded-xl font-medium text-white" style={{ background: "#ef4444" }}>
          {t("settings.logout")}
        </button>
      </div>
    </main>
  );
}