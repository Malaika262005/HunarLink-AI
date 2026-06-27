import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — ek provider ke reviews (?provider_id=)  ya  apne diye reviews
export async function GET(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("provider_id");

  let query = supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (providerId) query = query.eq("provider_id", providerId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data });
}

// POST — customer review de
export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { booking_id, provider_id, rating, comment } = await request.json();

  if (!rating || rating < 1 || rating > 5)
    return NextResponse.json({ error: "Rating 1-5 ke darmiyan honi chahiye" }, { status: 400 });

  // verify: ye booking isi customer ki hai aur completed hai
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, customer_id, provider_id")
    .eq("id", booking_id)
    .single();

  if (!booking || booking.customer_id !== user.id)
    return NextResponse.json({ error: "Ye booking aapki nahi" }, { status: 403 });
  if (booking.status !== "completed")
    return NextResponse.json({ error: "Sirf completed booking pe review de sakte hain" }, { status: 400 });

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      booking_id,
      provider_id: provider_id || booking.provider_id,
      customer_id: user.id,
      rating,
      comment: comment || null,
    })
    .select("*, profiles(full_name)")
    .single();

  if (error) {
    // duplicate review ka friendly message
    if (error.code === "23505")
      return NextResponse.json({ error: "Is booking ka review pehle se mojood hai" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review: data });
}