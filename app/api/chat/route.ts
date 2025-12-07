// app/api/chat/route.ts
// app/api/chat/route.ts
import { aiClient } from "@/lib/ai";

export async function POST(req: Request) {
  const { message }: { message: string } = await req.json();

  if (!message) {
    return new Response(JSON.stringify({ error: "No message provided" }), {
      status: 400,
    });
  }

  try {
    const completion = await aiClient.chat.completions.create({
      model: "gpt-3.5-turbo", // более доступная модель
      messages: [{ role: "user", content: message }],
      max_tokens: 200,
    });

    return new Response(
      JSON.stringify({ reply: completion.choices[0].message.content }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("OpenAI API error:", err);
    return new Response(
      JSON.stringify({ error: message || "AI request failed" }),
      {
        status: 500,
      }
    );
  }
}
