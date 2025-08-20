"use client";
import { GeneratorPanel } from "@/components/generator-panel";

export function GeneratorPanelWrapper() {
  async function handleGenerate(payload: { duration: string; focus?: string; goal?: string }) {
    try {
      await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Generate ${payload.duration} plan${payload.focus ? ` with focus on ${payload.focus}` : ''}${payload.goal ? `, goal: ${payload.goal}` : ''}.` })
      });
      // In a real implementation, show a toast and/or refresh widgets
    } catch (e) {
      // swallow for now; could show toast
      console.error(e);
    }
  }

  return <GeneratorPanel onGenerate={handleGenerate} />;
}

