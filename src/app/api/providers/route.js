import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — current user ka provider profile
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { data, error } = await supabase
    .from("providers")
    .select("*, categories(name)")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ provider: data });
}

// POST — provider profile create ya update
export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json();
  const payload = {
    profile_id: user.id,
    category_id: body.category_id || null,
    bio: body.bio || null,
    skills: body.skills || [],
    experience_years: body.experience_years || 0,
    area: body.area || null,
    hourly_rate: body.hourly_rate || null,
  };

  // pehle se hai to update, warna insert
  const { data: existing } = await supabase
    .from("providers").select("id").eq("profile_id", user.id).maybeSingle();

  const result = existing
    ? await supabase.from("providers").update(payload).eq("id", existing.id).select("*, categories(name)").single()
    : await supabase.from("providers").insert(payload).select("*, categories(name)").single();

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ provider: result.data });
}