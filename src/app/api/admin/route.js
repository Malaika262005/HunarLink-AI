import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// chhota helper: request bhejne wala admin hai ya nahi
async function requireAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, error: "Not logged in" };

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin")
    return { ok: false, status: 403, error: "Sirf admin ke liye" };

  return { ok: true, user };
}

// GET — saara admin data (stats + providers + categories)
export async function GET() {
  const supabase = await createClient();
  const auth = await requireAdmin(supabase);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  // counts
  const [{ count: totalUsers }, { count: totalProviders }, { count: totalBookings }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("providers").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }),
    ]);

  // saare providers (verify karne ke liye)
  const { data: providers } = await supabase
    .from("providers")
    .select("*, categories(name), profiles(full_name, city, phone)")
    .order("created_at", { ascending: false });

  // categories
  const { data: categories } = await supabase
    .from("categories").select("*").order("name");

  return NextResponse.json({
    stats: {
      totalUsers: totalUsers || 0,
      totalProviders: totalProviders || 0,
      totalBookings: totalBookings || 0,
      verifiedProviders: (providers || []).filter((p) => p.is_verified).length,
    },
    providers: providers || [],
    categories: categories || [],
  });
}

// PATCH — provider verify on/off
export async function PATCH(request) {
  const supabase = await createClient();
  const auth = await requireAdmin(supabase);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { provider_id, is_verified } = await request.json();
  const { data, error } = await supabase
    .from("providers").update({ is_verified }).eq("id", provider_id)
    .select("*, categories(name), profiles(full_name, city, phone)").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ provider: data });
}

// POST — nai category add
export async function POST(request) {
  const supabase = await createClient();
  const auth = await requireAdmin(supabase);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { name, icon } = await request.json();
  if (!name?.trim()) return NextResponse.json({ error: "Naam zaroori hai" }, { status: 400 });

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  const { data, error } = await supabase
    .from("categories")
    .insert({ name: name.trim(), slug, icon: icon || "🔧" })
    .select().single();

  if (error) {
    if (error.code === "23505")
      return NextResponse.json({ error: "Ye category pehle se hai" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ category: data });
}

// DELETE — category hatao
export async function DELETE(request) {
  const supabase = await createClient();
  const auth = await requireAdmin(supabase);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await request.json();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}