"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  docId: string;
};

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatWithDoc({ docId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [input, setInput] = useState<string>("");
  const [isProcessingChat, setIsProcessingChat] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsFetchingMessages(true);
      const msgRes = await fetch(`/api/messages?docId=${docId}`);
      const { messages = [] } = await msgRes.json();
      setMessages(messages);
      setIsFetchingMessages(false);
    };
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (isProcessingChat) return true;
    setIsProcessingChat(true);
    const trimmedMessage = input.trim();
    if (!trimmedMessage) return;

    try {
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId, message: trimmedMessage }),
      });

      if (chatResponse.ok) {
        const botMessageContent =
          (await chatResponse.json())?.response || "No Response";

        const userMessage: Message = {
          role: "user",
          content: trimmedMessage,
        };

        const botMessage: Message = { role: "ai", content: botMessageContent };
        setMessages((prev) => [...prev, userMessage, botMessage]);
        setInput("");
      } else {
        alert("Chat failed. Try again");
      }
    } catch (err) {
      console.error("err: ", err);
      alert("Chat Failed. Try Again");
    } finally {
      setIsProcessingChat(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-2">Chat with Document</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
        {isFetchingMessages ? (
          <div>Loading chat...</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm p-2 rounded ${
                msg.role === "user" ? "bg-muted" : "bg-secondary"
              }`}
            >
              <strong>{msg.role === "ai" ? "AI" : "You"}:</strong>{" "}
              <pre className="text-wrap">{msg.content}</pre>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          disabled={isProcessingChat || isFetchingMessages}
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.keyCode === 13) handleSend();
          }}
        />
        <Button
          onClick={handleSend}
          disabled={isProcessingChat || isFetchingMessages}
        >
          {isProcessingChat ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
