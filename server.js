import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
// ❗ API key MUST be passed explicitly
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are a compassionate mental health consultant AI.
Your role is to provide emotional support, active listening, and practical coping strategies.

Rules you must follow:
- Do NOT diagnose mental illnesses
- Do NOT prescribe medication
- Do NOT replace professional therapy
- Use simple, calm, non-judgmental language
- Answer in only 70 words or less.
- Validate emotions before giving guidance
- Ask at most 1–2 gentle reflective questions
- Encourage real human support when distress seems intense

Your goal is to help users feel heard, calmer, and more hopeful.
`;

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

app.post("/generate", async (req, res) => {
  try{
  const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
   const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",

  systemInstruction: {
    parts: [{ text: SYSTEM_PROMPT }],
  },

  contents: [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ],
});

  res.json({output:response.text});

    } catch (error) {
      console.error('Promise Catch:', error);
      res.status(500).json({error:"AI Generation Failed"})
    }
});


// Health check
app.get("/", (req, res) => {
  res.send("Gemini API server running");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});