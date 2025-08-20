"use client";
import { useEffect, useRef, useState } from "react";

type Session = { title: string; intensity: string; duration_minutes: number; notes: string };
type Week = { week_number: number; sessions: Session[] };

export default function CoachPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const evtRef = useRef<EventSource | null>(null);

  function startStream(userText: string) {
    if (evtRef.current) { evtRef.current.close(); evtRef.current = null; }
    const es = new EventSource("/api/chat", { withCredentials: true } as any);
    evtRef.current = es;
    es.addEventListener("tool.call", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setMessages((m) => [...m, { role: "tool", text: JSON.stringify(data.args).slice(0, 200) + "…" }]);
      if (data.args?.weeks) setWeeks(data.args.weeks);
    });
    es.addEventListener("plan.full", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.plan?.weeks) setWeeks(data.plan.weeks);
    });
    es.addEventListener("done", () => { es.close(); evtRef.current = null; });
    es.addEventListener("error", () => { es.close(); evtRef.current = null; });
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
    startStream(text);
  }

  useEffect(() => () => { if (evtRef.current) evtRef.current.close(); }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Coach</h1>
        <div className="border rounded p-3 h-[60vh] overflow-auto space-y-2">
          {messages.map((m, i) => (
            <div key={i} className="text-sm"><b>{m.role}:</b> {m.text}</div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 border rounded px-3 py-2" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Tell the coach how you feel…" />
          <button onClick={send} className="px-4 py-2 bg-black text-white rounded">Send</button>
        </div>
        <div className="flex gap-2 text-sm">
          {[
            "Feeling fatigued",
            "Injury note",
            "Shorten long ride",
          ].map((t) => (
            <button key={t} onClick={() => setInput(t)} className="px-2 py-1 border rounded">{t}</button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Week</h2>
        {weeks.length === 0 && <div className="text-sm text-gray-500">No plan yet. Ask the coach to generate week 1.</div>}
        {weeks.map((w) => (
          <div key={w.week_number} className="space-y-2">
            <h3 className="font-medium">Week {w.week_number}</h3>
            <div className="grid gap-3">
              {w.sessions.map((s, i) => (
                <div key={i} className="p-3 border rounded">
                  <div className="flex justify-between">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm opacity-70">{s.intensity} • {s.duration_minutes}m</div>
                  </div>
                  <div className="text-sm mt-1">{s.notes}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

