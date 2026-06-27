"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [supabase] = useState(() => createClient());

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // role dekho aur sahi dashboard pe bhejo
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);
    router.refresh();

    if (profile?.role === "provider") router.push("/dashboard/provider");
    else if (profile?.role === "admin") router.push("/dashboard/admin");
    else router.push("/dashboard/customer");
  };

  const input =
    "w-full bg-surface border border-border rounded-lg px-3 py-2 mb-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="bg-surface shadow-md rounded-xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-brand mb-1">{t("login.title")}</h1>
        <p className="text-sm text-text-muted mb-4">{t("login.subtitle")}</p>

        <input className={input} name="email" type="email" placeholder={t("login.email")}
          value={form.email} onChange={onChange} />
        <input className={input} name="password" type="password" placeholder={t("login.password")}
          value={form.password} onChange={onChange} />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-brand text-white py-2 rounded-lg font-medium hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? t("login.loading") : t("login.button")}
        </button>

        <p className="text-sm text-center text-text-muted mt-4">
          {t("login.signupPrompt")} {" "}
          <Link href="/register" className="text-brand font-medium">{t("login.signupLink")}</Link>
        </p>
      </div>
    </main>
  );
}