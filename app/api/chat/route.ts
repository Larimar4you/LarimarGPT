// app/api/chat/route.ts
import { aiClient } from "@/lib/ai";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return new Response(JSON.stringify({ error: "No message provided" }), {
      status: 400,
    });
  }

  try {
    const completion = await aiClient.chat.completions.create({
      model: "llama3", // или gpt-4
      messages: [{ role: "user", content: message }],
    });

    return new Response(
      JSON.stringify({ reply: completion.choices[0].message.content })
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "AI request failed" }), {
      status: 500,
    });
  }
}
