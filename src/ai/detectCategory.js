import { askGemini } from "@/lib/gemini";

const CATEGORIES = [
  "Electrician", "Plumber", "Carpenter",
  "Painter", "Mechanic", "Tutor", "Beautician",
];

export async function detectCategory(userInput) {
  const prompt = `Tum Pakistan ke local services marketplace ka category classifier ho.
Available categories: ${CATEGORIES.join(", ")}.

Rahnumai (hints):
- AC, fridge, fan, wiring, bijli, electric, appliance => Electrician
- pani, pipe, leakage, nalka, tap, bathroom fitting => Plumber
- lakkar, furniture, darwaza, almari, table => Carpenter
- paint, rang, deewar, polish => Painter
- gaari, car, bike, engine, motor => Mechanic
- parhai, tuition, study, subject, math => Tutor
- makeup, hair, facial, beauty => Beautician

User ka masla: "${userInput}"

Sirf list mein se ek best category ka naam likho. Koi extra lafz, jumla ya explanation nahi.`;

  const raw = await askGemini(prompt);
  const cleaned = (raw || "").trim();
  const match = CATEGORIES.find((c) =>
    cleaned.toLowerCase().includes(c.toLowerCase())
  );
  return match || "Other";
}