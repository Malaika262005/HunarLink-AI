import { createClient } from "@/lib/supabase/server";

export async function recommendProviders({ category, city, limit = 4 }) {
  const supabase = await createClient();

  const { data: providers, error } = await supabase
    .from("providers")
    .select("*, profiles(full_name, city, avatar_url), categories(name)");

  if (error || !providers) return [];

  // SIRF isi category ke providers (Tutor AC pe nahi aayega)
  const pool = providers.filter(
    (p) => p.categories?.name?.toLowerCase() === category?.toLowerCase()
  );

  // is category mein koi nahi to khali — galat suggestion se behtar hai
  if (pool.length === 0) return [];

  // Real percentage match (sab ka alag hoga)
  const scored = pool.map((p) => {
    let score = 60; // sahi category = base 60%
    if (city && p.profiles?.city?.toLowerCase() === city.toLowerCase()) score += 20; // same shehar
    score += Math.round(((p.rating || 0) / 5) * 15); // rating: 0-15%
    if (p.is_verified) score += 5; // verified +5
    return { ...p, score: Math.min(score, 100) };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}