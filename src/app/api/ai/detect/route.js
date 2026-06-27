import { NextResponse } from "next/server";
import { detectCategory } from "@/ai/detectCategory";

export async function POST(request) {
  try {
    const { input } = await request.json();
    if (!input)
      return NextResponse.json({ error: "Input required" }, { status: 400 });

    const category = await detectCategory(input);
    return NextResponse.json({ category });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}