// app/api/chat/route.ts
import { aiClient } from "@/lib/ai";

export async function POST(req: Request) {
  const { message }: { message: string } = await req.json();

  if (!message)
    return new Response(JSON.stringify({ error: "No message provided" }), {
      status: 400,
    });

  try {
    const completion = await aiClient.chat.completions.create({
      model: "gpt-4.1", // updated model
      messages: [{ role: "user", content: message }],
      max_tokens: 200,
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
