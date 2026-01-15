import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 3000;
// ❗ API key MUST be passed explicitly
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(express.json());

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
    contents: prompt,
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