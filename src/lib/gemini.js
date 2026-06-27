import { GoogleGenAI } from "@google/genai";

// Gemini client — sirf server pe chalega (key safe rahegi)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Simple helper: prompt do, text wapas lo.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function askGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // fast + sasta; chaho to badal sakti ho
    contents: prompt,
  });
  return response.text;
}

export default ai;