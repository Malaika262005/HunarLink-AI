"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [supabase] = useState(() => createClient());

  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    setError("");
    // Pakistani mobile: 03XXXXXXXXX (11 digits)
    const phoneClean = form.phone.replace(/[\s-]/g, "");
    if (!/^03\d{9}$/.test(phoneClean)) {
      setError(t("register.phoneError"));
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          phone: form.phone,
          city: form.city,
          role: role,
        },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
    router.push(role === "provider" ? "/dashboard/provider" : "/dashboard/customer");
  };

  const input =
    "w-full bg-surface border border-border rounded-lg px-3 py-2 mb-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="bg-surface shadow-md rounded-xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-brand mb-1">{t("register.title")}</h1>
        <p className="text-sm text-text-muted mb-4">{t("register.subtitle")}</p>

        {/* Role toggle */}
        <div className="flex gap-2 mb-4">
          {["customer", "provider"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize ${
                role === r
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-text-muted"
              }`}
            >
              {r === "customer" ? t("register.customer") : t("register.provider")}
            </button>
          ))}
        </div>

        <input className={input} name="full_name" placeholder={t("register.fullName")}
          value={form.full_name} onChange={onChange} />
        <input className={input} name="email" type="email" placeholder={t("register.email")}
          value={form.email} onChange={onChange} />
        <input className={input} name="password" type="password" placeholder={t("register.password")}
          value={form.password} onChange={onChange} />
        <input className={input} name="phone" placeholder={t("register.phone")}
          value={form.phone} onChange={onChange} />
        <input className={input} name="city" placeholder={t("register.city")}
          value={form.city} onChange={onChange} />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-brand text-white py-2 rounded-lg font-medium hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? t("register.loading") : t("register.button")}
        </button>

        <p className="text-sm text-center text-text-muted mt-4">
          {t("register.loginPrompt")} {" "}
          <Link href="/login" className="text-brand font-medium">{t("register.loginLink")}</Link>
        </p>
      </div>
    </main>
  );
}