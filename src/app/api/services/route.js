import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — ?mine=true => apni services; warna saari active (browse ke liye)
export async function GET(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  if (searchParams.get("mine") === "true") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { data: provider } = await supabase
      .from("providers").select("id").eq("profile_id", user.id).maybeSingle();
    if (!provider) return NextResponse.json({ services: [] });

    const { data, error } = await supabase
      .from("services").select("*, categories(name)")
      .eq("provider_id", provider.id)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ services: data });
  }

  // public browse (Batch 5 mein use hoga)
  const { data, error } = await supabase
    .from("services")
    .select("*, categories(name), providers(rating, is_verified, profiles(full_name, city))")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ services: data });
}

// POST — nayi service add
export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { data: provider } = await supabase
    .from("providers").select("id, category_id").eq("profile_id", user.id).maybeSingle();
  if (!provider)
    return NextResponse.json({ error: "Pehle provider profile banayein" }, { status: 400 });

  const body = await request.json();
  const { data, error } = await supabase
    .from("services")
    .insert({
      provider_id: provider.id,
      category_id: body.category_id || provider.category_id,
      title: body.title,
      description: body.description || null,
      price: body.price || null,
      city: body.city || null,
    })
    .select("*, categories(name)").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ service: data });
}

// PATCH — service on/off
export async function PATCH(request) {
  const supabase = await createClient();
  const { id, is_active } = await request.json();
  const { data, error } = await supabase
    .from("services").update({ is_active }).eq("id", id).select("*, categories(name)").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ service: data });
}

// DELETE — service hatao
export async function DELETE(request) {
  const supabase = await createClient();
  const { id } = await request.json();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}