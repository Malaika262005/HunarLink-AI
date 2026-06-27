import { askGemini } from "@/lib/gemini";

export async function enhanceJob(userInput, category) {
  const prompt = `Ek customer (Pakistan) ne ye choti service request bheji: "${userInput}".
Detected category: ${category}.

Is ko ek saaf, professional job description (3-4 jumlay) mein likho jo service provider asaani se samajh sake.

ZAROORI: Sirf ROMAN URDU mein likho (Urdu English/Latin letters mein, jaise "AC ki cooling kaam nahi kar rahi"). Urdu script (اردو) BILKUL use mat karo. English technical terms (AC, wiring, gas) normal istemaal kar sakte ho.

Likely masla aur zaroori details shamil karo. Sirf description text do, koi heading nahi.`;

  const text = await askGemini(prompt);
  return (text || "").trim();
}