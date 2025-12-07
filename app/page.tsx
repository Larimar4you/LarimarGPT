"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();
      const fullText = data.reply || "No response";

      // Эффект печати
      let index = 0;
      const aiMessage = { role: "ai", text: "" };
      setMessages((prev) => [...prev, aiMessage]);

      const interval = setInterval(() => {
        index++;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText.slice(0, index);
          return newMessages;
        });
        if (index >= fullText.length) clearInterval(interval);
      }, 25); // скорость печати (мс)
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error: failed to get response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-4">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
        AI Chat
      </h1>

      <div className="border rounded p-4 h-96 w-full max-w-3xl overflow-y-auto mb-4 flex flex-col gap-2 bg-white dark:bg-gray-800">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "text-right text-black dark:text-white"
                : "text-left text-blue-600"
            }
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-gray-400">AI is typing...</div>}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex w-full max-w-3xl gap-2">
        <input
          className="flex-1 border rounded p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </main>
  );
}
