// lib/ai.ts
import { OpenAI } from "ai";

export const aiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // твой ключ
});
