"use client";
import { useState } from "react";

type Plan = {
  athlete: { sport: string; level: string; goal: string };
  plan_summary: string;
  weeks: { week_number: number; sessions: { title: string; intensity: string; duration_minutes: number; notes: string }[] }[];
};

export default function DemoPlanPage() {
  const [message, setMessage] = useState(
    "Athlete: cycling, intermediate, goal=upgrade to Cat 3 in 12 weeks. Generate week 1."
  );
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setPlan(data.plan);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Generate Week Plan (Demo)</h1>
      <textarea
        className="w-full border rounded p-3"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={generate}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Generating…" : "Generate"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {plan && (
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">
              {plan.athlete.sport} • {plan.athlete.level}
            </div>
            <div className="font-medium">{plan.athlete.goal}</div>
            <p className="mt-2">{plan.plan_summary}</p>
          </div>

          {plan.weeks.map((w) => (
            <div key={w.week_number} className="space-y-2">
              <h2 className="text-xl font-semibold">Week {w.week_number}</h2>
              <div className="grid gap-3">
                {w.sessions.map((s, i) => (
                  <div key={i} className="p-3 border rounded">
                    <div className="flex justify-between">
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm opacity-70">
                        {s.intensity} • {s.duration_minutes}m
                      </div>
                    </div>
                    <div className="text-sm mt-1">{s.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

