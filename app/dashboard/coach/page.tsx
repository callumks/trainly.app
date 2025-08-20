"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Session = { title: string; intensity: string; duration_minutes: number; notes: string };
type Week = { week_number: number; sessions: Session[] };

export default function DashboardCoachPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const esRef = useRef<EventSource | null>(null);

  function openStream(payload: { message: string }) {
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    const es = new EventSource("/api/chat", { withCredentials: true } as any);
    esRef.current = es;
    es.addEventListener("tool.call", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setMessages((m) => [...m, { role: "tool", text: JSON.stringify(data.args).slice(0, 200) + "…" }]);
      if (data.args?.weeks) setWeeks(data.args.weeks);
    });
    es.addEventListener("plan.full", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.plan?.weeks) setWeeks(data.plan.weeks);
    });
    es.addEventListener("done", () => { es.close(); esRef.current = null; });
    es.addEventListener("error", () => { es.close(); esRef.current = null; });
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    openStream({ message: text });
  }

  useEffect(() => () => { if (esRef.current) esRef.current.close(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Coach</h1>
        <div className="hidden md:flex gap-2 text-sm">
          {["Feeling fatigued","Injury note","Shorten long ride"].map((t)=> (
            <Button key={t} variant="outline" size="sm" onClick={()=>setInput(t)}>{t}</Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[70vh] flex flex-col">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">Tell the coach how you feel or ask to generate week 1.</p>
            )}
            {messages.map((m,i)=> (
              <div key={i} className="text-sm">
                <span className="font-medium mr-2">{m.role}:</span>
                <span>{m.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="h-[70vh] flex flex-col">
          <CardHeader>
            <CardTitle>Current Week</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-4">
            {weeks.length === 0 && (
              <p className="text-sm text-muted-foreground">No plan yet.</p>
            )}
            {weeks.map((w)=> (
              <div key={w.week_number} className="space-y-2">
                <h3 className="font-medium">Week {w.week_number}</h3>
                <div className="grid gap-3">
                  {w.sessions.map((s, idx)=> (
                    <div key={idx} className="border rounded p-3">
                      <div className="flex justify-between">
                        <div className="font-medium">{s.title}</div>
                        <div className="text-sm text-muted-foreground">{s.intensity} • {s.duration_minutes}m</div>
                      </div>
                      <div className="text-sm mt-1">{s.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message…"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}

