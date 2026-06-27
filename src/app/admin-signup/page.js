"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminSignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [supabase] = useState(() => createClient());

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    code: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    setError("");

    // secret code check
    if (form.code !== process.env.NEXT_PUBLIC_ADMIN_CODE) {
      setError(t("adminSignup.codeError"));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, role: "admin" },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
    router.push("/dashboard/admin");
  };

  const input =
    "w-full bg-surface border border-border rounded-lg px-3 py-2 mb-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-white shadow-md rounded-xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-brand mb-1">{t("adminSignup.title")}</h1>
        <p className="text-sm text-gray-500 mb-4">{t("adminSignup.subtitle")}</p>

        <input className={input} name="full_name" placeholder={t("adminSignup.fullName")}
          value={form.full_name} onChange={onChange} />
        <input className={input} name="email" type="email" placeholder={t("adminSignup.email")}
          value={form.email} onChange={onChange} />
        <input className={input} name="password" type="password" placeholder={t("adminSignup.password")}
          value={form.password} onChange={onChange} />
        <input className={input} name="code" type="password" placeholder={t("adminSignup.code")}
          value={form.code} onChange={onChange} />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-black disabled:opacity-50"
        >
          {loading ? t("adminSignup.loading") : t("adminSignup.button")}
        </button>
      </div>
    </main>
  );
}