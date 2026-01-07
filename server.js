import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// ❗ API key MUST be passed explicitly
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words in 80 words",
  });

  console.log(response.text);
}

main();