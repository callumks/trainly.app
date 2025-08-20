import { NextRequest } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { trainingPlanTool } from "@/lib/schemas/trainingPlan";
import { db } from "@/lib/supabase";

export const runtime = "edge";

async function requireAuth(req: NextRequest): Promise<string> {
  const token = req.headers.get("cookie") || "";
  // Replace with your real auth; using a stub here
  const userId = (token.match(/auth-token=([^;]+)/)?.[1]) || "00000000-0000-0000-0000-000000000001";
  return userId;
}

export async function POST(req: NextRequest) {
  const { threadId, message, profile, currentPlan } = await req.json();
  const userId = await requireAuth(req);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Persist user message (minimal)
        await db.query(
          'insert into chat_messages (thread_id, user_id, role, content) values ($1,$2,$3,$4)',
          [threadId, userId, 'user', JSON.stringify({ text: message })]
        );

        const oai = getOpenAI();
        const resp = await oai.responses.create({
          model: "gpt-4o-mini",
          temperature: 0.1,
          max_output_tokens: 1000,
          input: [
            { role: "system", content: "Always call return_training_plan with valid JSON only. Keep notes short. No prose." },
            currentPlan ? { role: "assistant", content: `CURRENT_PLAN: ${JSON.stringify(currentPlan)}` } : undefined,
            profile ? { role: "assistant", content: `PROFILE: ${JSON.stringify(profile)}` } : undefined,
            { role: "user", content: message }
          ].filter(Boolean) as any,
          tools: [trainingPlanTool as any],
          tool_choice: { type: "function", name: "return_training_plan" } as any
        });

        const blocks = (((resp as any).output?.[0]?.content) ?? []) as any[];
        const tool = blocks.find(b => b.type === 'tool_use' || b.type === 'tool_call');
        if (tool) {
          if (tool.type === 'tool_use') {
            send('tool.call', { name: tool.name, args: tool.input });
            // TODO: upsert into plans and compute diff
            send('plan.full', { plan: { weeks: tool.input?.weeks || [] } });
          } else {
            send('tool.call', { name: tool.function?.name, args: JSON.parse(tool.function?.arguments || '{}') });
          }
        }

        send('done', {});
        controller.close();
      } catch (e: any) {
        send('error', { message: e?.message || 'chat error' });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}

