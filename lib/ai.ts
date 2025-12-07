// lib/ai.ts
// lib/ai.ts
import OpenAI from "openai";

export const aiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // ключ из .env.local
});

console.log("OpenAI key loaded:", !!process.env.OPENAI_API_KEY);
