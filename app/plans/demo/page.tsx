"use client";
import { useState } from "react";
import AppShell from "@/components/app/AppShell";
import PageHeader from "@/components/app/PageHeader";

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
    <AppShell>
      <PageHeader eyebrow="Demo" title="Generate a week" sub="A quick demo of the plan engine — describe the athlete and goal." />
      <div className="card" style={{ maxWidth: 800 }}>
        <textarea
          style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 12, padding: 13, background: "var(--surface-2)", color: "var(--ink)", fontFamily: "var(--ui)", fontSize: 14, resize: "vertical" }}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div style={{ marginTop: 14 }}>
          <button className="btn accent" onClick={generate} disabled={loading}>
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        {error && <p style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 12.5, marginTop: 14 }}>{error}</p>}

        {plan && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
            <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16, background: "var(--surface-2)" }}>
              <div className="eyebrow">{plan.athlete.sport} · {plan.athlete.level}</div>
              <div style={{ fontFamily: "var(--disp)", fontWeight: 600, fontSize: 16, marginTop: 6 }}>{plan.athlete.goal}</div>
              <p style={{ marginTop: 8, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>{plan.plan_summary}</p>
            </div>

            {plan.weeks.map((w) => (
              <div key={w.week_number} style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <div className="eyebrow">Week {w.week_number}</div>
                {w.sessions.map((s, i) => (
                  <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 11, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontFamily: "var(--disp)", fontWeight: 600, fontSize: 13.5 }}>{s.title}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap" }}>{s.intensity} · {s.duration_minutes}m</div>
                    </div>
                    {s.notes && <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 5 }}>{s.notes}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
