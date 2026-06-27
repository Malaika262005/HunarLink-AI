"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

const inputCls =
  "w-full bg-surface border border-border rounded-lg px-3 py-2 mb-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand";
const card = "bg-surface border border-border rounded-xl p-5 mb-6";

export default function ProviderDashboard() {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [supabase] = useState(() => createClient());

  const [categories, setCategories] = useState([]);
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: cats } = await supabase.from("categories").select("*").order("name");
      setCategories(cats || []);

      const pData = await (await fetch("/api/providers")).json();
      setProvider(pData.provider);

      if (pData.provider) {
        setServices((await (await fetch("/api/services?mine=true")).json()).services || []);
        setBookings((await (await fetch("/api/bookings")).json()).bookings || []);
      }
      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading)
    return <main className="min-h-screen flex items-center justify-center text-text-muted">{t("common.loading")}</main>;

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand">{t("providerDashboard.title")}</h1>
            <p className="text-sm text-text-muted">{t("providerDashboard.welcome")} {profile?.full_name} 👋</p>
          </div>
        </div>

        {/* Profile na ho to banao, warna show karo */}
        {!provider || editing ? (
          <ProfileForm
            categories={categories}
            existing={editing ? provider : null}
            onSaved={(p) => { setProvider(p); setEditing(false); }}
            onCancel={editing ? () => setEditing(false) : null}
          />
        ) : (
          <ProfileCard provider={provider} onEdit={() => setEditing(true)} />
        )}

        {/* Profile ke baad hi services/bookings */}
        {provider && !editing && (
          <>
            <AddService
              categories={categories}
              defaultCity={profile?.city}
              defaultCat={provider.category_id}
              onAdded={(s) => setServices([s, ...services])}
            />
            <ServiceList services={services} onChange={setServices} />
            <BookingList bookings={bookings} onChange={setBookings} />
          </>
        )}
      </div>
    </main>
  );
}

/* ---------- Provider Profile Form ---------- */
function ProfileForm({ categories, existing, onSaved, onCancel }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    category_id: existing?.category_id || "",
    bio: existing?.bio || "",
    skills: existing?.skills?.join(", ") || "",
    experience_years: existing?.experience_years || "",
    area: existing?.area || "",
    hourly_rate: existing?.hourly_rate || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setError(""); setSaving(true);
    const res = await fetch("/api/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category_id: form.category_id ? Number(form.category_id) : null,
        bio: form.bio,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        experience_years: form.experience_years ? Number(form.experience_years) : 0,
        area: form.area,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error || "Error");
    onSaved(data.provider);
  };

  return (
    <div className={card}>
      <h2 className="text-lg font-semibold mb-4">
        {existing ? t("providerDashboard.profileTitle") : t("providerDashboard.profileCreateTitle")}
      </h2>

      <select name="category_id" value={form.category_id} onChange={onChange} className={inputCls}>
        <option value="">{t("providerDashboard.categoryPlaceholder")}</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <textarea name="bio" rows={3} placeholder={t("providerDashboard.bioPlaceholder")}
        value={form.bio} onChange={onChange} className={inputCls} />
      <input name="skills" placeholder={t("providerDashboard.skillsPlaceholder")}
        value={form.skills} onChange={onChange} className={inputCls} />
      <input name="experience_years" type="number" placeholder={t("providerDashboard.experiencePlaceholder")}
        value={form.experience_years} onChange={onChange} className={inputCls} />
      <input name="area" placeholder={t("providerDashboard.areaPlaceholder")}
        value={form.area} onChange={onChange} className={inputCls} />
      <input name="hourly_rate" type="number" placeholder={t("providerDashboard.ratePlaceholder")}
        value={form.hourly_rate} onChange={onChange} className={inputCls} />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="bg-brand text-white px-5 py-2 rounded-lg font-medium hover:bg-brand-dark disabled:opacity-50">
          {saving ? t("providerDashboard.savingProfile") : t("providerDashboard.saveProfile")}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="px-5 py-2 rounded-lg text-text-muted bg-bg">{t("providerDashboard.cancel")}</button>
        )}
      </div>
    </div>
  );
}

/* ---------- Profile Summary Card ---------- */
function ProfileCard({ provider, onEdit }) {
  const { t } = useLanguage();
  return (
    <div className={card}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{provider.categories?.name || t("providerDashboard.profileSummary")}</h2>
          <p className="text-sm text-text-muted mt-1">{provider.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {provider.skills?.map((s, i) => (
              <span key={i} className="text-xs bg-brand-light/30 text-brand-dark px-2 py-1 rounded-full">{s}</span>
            ))}
          </div>
          <p className="text-sm text-text-muted mt-3">
            ⭐ {provider.rating || 0} · {provider.experience_years || 0} {t("providerProfile.years")} · Rs.{provider.hourly_rate || 0}/hr
            {provider.is_verified ? ` · ✅ ${t("providerDashboard.verification")}` : ` · ⏳ ${t("providerDashboard.verificationPending")}`}
          </p>
        </div>
        <button onClick={onEdit} className="text-sm text-brand">{t("common.edit")}</button>
      </div>
    </div>
  );
}

/* ---------- Add Service ---------- */
function AddService({ categories, defaultCity, defaultCat, onAdded }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    title: "", description: "", price: "",
    city: defaultCity || "", category_id: defaultCat || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const add = async () => {
    if (!form.title.trim()) return setError(t("providerDashboard.titleRequired"));
    setError(""); setSaving(true);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title, description: form.description,
        price: form.price ? Number(form.price) : null,
        city: form.city,
        category_id: form.category_id ? Number(form.category_id) : null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error || t("providerDashboard.errorDefault"));
    onAdded(data.service);
    setForm({ ...form, title: "", description: "", price: "" });
  };

  return (
    <div className={card}>
      <h2 className="text-lg font-semibold mb-4">{t("providerDashboard.addServiceTitle")}</h2>
      <input name="title" placeholder={t("providerDashboard.serviceTitlePlaceholder")}
        value={form.title} onChange={onChange} className={inputCls} />
      <textarea name="description" rows={2} placeholder={t("providerDashboard.serviceDescPlaceholder")}
        value={form.description} onChange={onChange} className={inputCls} />
      <div className="flex gap-3">
        <input name="price" type="number" placeholder={t("providerDashboard.pricePlaceholder")}
          value={form.price} onChange={onChange} className={inputCls} />
        <input name="city" placeholder={t("providerDashboard.cityPlaceholder")}
          value={form.city} onChange={onChange} className={inputCls} />
      </div>
      <select name="category_id" value={form.category_id} onChange={onChange} className={inputCls}>
        <option value="">{t("providerDashboard.categoryLabel")}</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button onClick={add} disabled={saving}
        className="bg-brand text-white px-5 py-2 rounded-lg font-medium hover:bg-brand-dark disabled:opacity-50">
        {saving ? t("providerDashboard.addingService") : t("providerDashboard.addServiceButton")}
      </button>
    </div>
  );
}

/* ---------- Service List ---------- */
function ServiceList({ services, onChange }) {
  const { t } = useLanguage();
  const toggle = async (s) => {
    const res = await fetch("/api/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, is_active: !s.is_active }),
    });
    const data = await res.json();
    if (res.ok) onChange(services.map((x) => (x.id === s.id ? data.service : x)));
  };
  const remove = async (s) => {
    const res = await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id }),
    });
    if (res.ok) onChange(services.filter((x) => x.id !== s.id));
  };

  return (
    <div className={card}>
      <h2 className="text-lg font-semibold mb-4">{t("providerDashboard.myServices")} ({services.length})</h2>
      {services.length === 0 && <p className="text-sm text-text-muted">{t("providerDashboard.noServices")}</p>}
      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="flex justify-between items-center border border-border rounded-lg p-3">
            <div>
              <p className="font-medium">{s.title}
                <span className={`ml-2 text-xs ${s.is_active ? "text-green-600" : "text-text-muted"}`}>
                  {s.is_active ? t("providerDashboard.active") : t("providerDashboard.off")}
                </span>
              </p>
              <p className="text-sm text-text-muted">{s.categories?.name} · Rs.{s.price || 0} · {s.city}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => toggle(s)} className="text-brand">{s.is_active ? t("providerDashboard.turnOff") : t("providerDashboard.turnOn")}</button>
              <button onClick={() => remove(s)} className="text-red-500">{t("providerDashboard.delete")}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Booking List ---------- */
function BookingList({ bookings, onChange }) {
  const { t } = useLanguage();
  const setStatus = async (b, status) => {
    const res = await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, status }),
    });
    const data = await res.json();
    if (res.ok) onChange(bookings.map((x) => (x.id === b.id ? { ...x, status: data.booking.status } : x)));
  };

  const colors = {
    pending: "text-yellow-600", accepted: "text-blue-600",
    completed: "text-green-600", cancelled: "text-red-500",
  };

  return (
    <div className={card}>
      <h2 className="text-lg font-semibold mb-4">{t("providerDashboard.bookingRequests")} ({bookings.length})</h2>
      {bookings.length === 0 && <p className="text-sm text-text-muted">{t("providerDashboard.noBookings")}</p>}
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="border border-border rounded-lg p-3">
            <div className="flex justify-between">
              <p className="font-medium">{b.services?.title || "Service"}</p>
              <span className={`text-xs font-medium ${colors[b.status]}`}>{t(`bookings.status.${b.status}`)}</span>
            </div>
            <p className="text-sm text-text-muted">
              {b.profiles?.full_name} · {b.profiles?.phone} · {b.profiles?.city}
            </p>
            {b.notes && <p className="text-sm text-text-muted mt-1">📝 {b.notes}</p>}
            {b.status === "pending" && (
              <div className="flex gap-3 mt-2 text-sm">
                <button onClick={() => setStatus(b, "accepted")} className="text-blue-600">{t("providerDashboard.accept")}</button>
                <button onClick={() => setStatus(b, "cancelled")} className="text-red-500">{t("providerDashboard.reject")}</button>
              </div>
            )}
            {b.status === "accepted" && (
              <button onClick={() => setStatus(b, "completed")} className="text-green-600 text-sm mt-2">
                {t("providerDashboard.complete")}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}