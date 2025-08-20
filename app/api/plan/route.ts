import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { trainingPlanTool, TrainingPlan } from "@/lib/schemas/trainingPlan";

export async function POST(req: NextRequest) {
  try {
    const { message, profile } = await req.json().catch(() => ({}));
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message (string) is required" }, { status: 400 });
    }

    const oai = getOpenAI();

    const response = await oai.responses.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_output_tokens: 1000,
      input: [
        { role: "system", content: "Always call return_training_plan with valid JSON only. Keep notes short. No extra prose." },
        profile ? { role: "assistant", content: `PROFILE: ${JSON.stringify(profile)}` } : undefined,
        { role: "user", content: message }
      ].filter(Boolean) as any,
      tools: [trainingPlanTool as any],
      tool_choice: { type: "function", name: "return_training_plan" } as any
    });

    const blocks = (response.output?.[0]?.content ?? []) as any[];
    const call = blocks.find((b) => b.type === "tool_use" || b.type === "tool_call");
    const argsStr: string | undefined = call?.input ? JSON.stringify(call.input) : call?.function?.arguments;

    if (!argsStr) {
      return NextResponse.json({ error: "No tool_call returned" }, { status: 502 });
    }

    let plan: TrainingPlan | null = null;
    try {
      plan = JSON.parse(argsStr);
    } catch {
      return NextResponse.json({ error: "Invalid JSON from tool_call" }, { status: 502 });
    }

    return NextResponse.json({ plan }, { status: 200 });
  } catch (err: any) {
    console.error("plan error", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

