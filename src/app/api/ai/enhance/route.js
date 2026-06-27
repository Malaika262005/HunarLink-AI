import { NextResponse } from "next/server";
import { detectCategory } from "@/ai/detectCategory";
import { enhanceJob } from "@/ai/enhanceJob";
import { recommendProviders } from "@/ai/recommend";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const { input, city } = await request.json();
    if (!input)
      return NextResponse.json({ error: "Input required" }, { status: 400 });

    const category = await detectCategory(input);
    const description = await enhanceJob(input, category);

    // Smart Recommendations (slide ka 3rd AI feature)
    const recommendations = await recommendProviders({ category, city, limit: 4 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("job_requests").insert({
        customer_id: user.id,
        raw_input: input,
        detected_category: category,
        enhanced_description: description,
        city: city || null,
      });
    }

    return NextResponse.json({ category, description, recommendations, saved: !!user });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}