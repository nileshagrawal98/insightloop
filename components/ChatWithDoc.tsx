"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  docId: string;
};

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function ChatWithDoc({ docId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    const trimmedMessage = input.trim();
    if (!trimmedMessage) return;

    const userMessage: Message = { role: "user", content: trimmedMessage };
    setMessages((prev) => [...prev, userMessage]);

    //TODO: Send message to bot

    const botMessage: Message = { role: "bot", content: "Banananana" };
    setMessages((prev) => [...prev, botMessage]);

    setInput("");
  };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-2">Chat with Document</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm p-2 rounded ${
              msg.role === "user" ? "bg-muted" : "bg-secondary"
            }`}
          >
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}
