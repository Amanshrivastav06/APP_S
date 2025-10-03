"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Paperclip, X } from "lucide-react";
import * as React from "react";
import { MediaUploadLocal, UploadedFile } from "@/components/media-upload-local";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export function AIChat() {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [attachments, setAttachments] = React.useState<UploadedFile[]>([]);

  const removeAttachment = (idx: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = text.trim();
    if (!q || loading) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: q };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat-plain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          attachments, // <- send uploaded files (url, type, name)
        }),
      });

      const data = await res.json();
      const assistantMsg: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data?.text ?? data?.error ?? "Sorry, I couldn’t generate a reply.",
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Network or server error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setAttachments([]); // clear after send (optional)
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">AI Study Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Media upload section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm">Attach images / PDFs / audio / video (optional)</span>
          </div>

          <MediaUploadLocal
            onUploaded={(files) => setAttachments((prev) => [...prev, ...files])}
          />

          {attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {attachments.map((f, i) => (
                <span
                  key={`${f.url}-${i}`}
                  className="inline-flex items-center gap-2 text-xs bg-gray-100 text-gray-800 rounded-full px-3 py-1"
                  title={f.name}
                >
                  <a href={f.url} target="_blank" rel="noreferrer" className="underline">
                    {f.name}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="opacity-70 hover:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <ScrollArea className="h-[420px] pr-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Ask me anything about your NCERT subjects!</p>
              <p className="text-sm mt-2">
                I can help explain concepts, solve problems, and answer questions.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                </div>
              </div>
            </div>
          ))}

          {loading && <div className="text-center text-sm text-gray-500 mt-4">Thinking…</div>}
        </ScrollArea>

        <form onSubmit={onSubmit} className="flex gap-2 mt-4">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
            placeholder="Ask a question about your studies..."
            className="flex-1 text-gray-900 placeholder:text-gray-400"
          />
          <Button type="submit" disabled={loading || text.trim().length === 0}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
