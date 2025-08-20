"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function GeneratorPanel({ onGenerate }: { onGenerate: (payload: { duration: string; focus?: string; goal?: string }) => void }) {
  const [duration, setDuration] = useState("8 weeks");
  const [focus, setFocus] = useState<string | undefined>(undefined);
  const [goal, setGoal] = useState("");

  return (
    <Card className="p-5 md:p-6 bg-gradient-to-b from-card to-[#0B1324] border-border/70">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-wider text-brand-200">AI Training Plan Generator</n>
          <h2 className="text-xl font-semibold mt-1">Create a personalized plan from your Strava data</h2>
        </div>
        <div className="hidden md:block text-xs text-muted-foreground px-2 py-1 rounded bg-secondary/40 border border-border">Beta</div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-sm mb-2">Plan Duration</div>
          <Select defaultValue={duration} onValueChange={(v) => setDuration(v)}>
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Choose duration" />
            </SelectTrigger>
            <SelectContent>
              {["4 weeks","6 weeks","8 weeks","10 weeks","12 weeks"].map((d)=> (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-sm mb-2">Focus Area (Optional)</div>
          <Select onValueChange={(v)=>setFocus(v)}>
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="No specific focus" />
            </SelectTrigger>
            <SelectContent>
              {["endurance","climbing","sprinting","threshold","recovery"].map((f)=> (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <div className="text-sm mb-2">Specific Goal (Optional)</div>
          <Input className="bg-input" placeholder="e.g., 'Cat 3 upgrade by Nov' or 'Increase weekly TSS safely'" value={goal} onChange={(e)=>setGoal(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">The AI adapts after every synced activity. Best with 2–3 weeks of recent data.</p>
        <Button onClick={()=>onGenerate({ duration, focus, goal: goal || undefined })} className="bg-brand hover:bg-brand/90 text-[15px] h-10 px-4 rounded-lg font-medium">✨ Generate Plan</Button>
      </div>
    </Card>
  );
}

