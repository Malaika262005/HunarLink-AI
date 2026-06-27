import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — role ke hisaab se bookings (provider => aane wali, customer => apni)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { data: provider } = await supabase
    .from("providers").select("id").eq("profile_id", user.id).maybeSingle();

  let query = supabase
    .from("bookings")
    .select("*, services(title), profiles(full_name, phone, city)")
    .order("created_at", { ascending: false });

  query = provider ? query.eq("provider_id", provider.id) : query.eq("customer_id", user.id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data });
}

// POST — customer booking banaye
export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      customer_id: user.id,
      provider_id: body.provider_id,
      service_id: body.service_id || null,
      scheduled_date: body.scheduled_date || null,
      address: body.address || null,
      notes: body.notes || null,
    })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data });
}

// PATCH — provider status update (accept/complete/cancel)
export async function PATCH(request) {
  const supabase = await createClient();
  const { id, status } = await request.json();
  const { data, error } = await supabase
    .from("bookings").update({ status }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data });
}