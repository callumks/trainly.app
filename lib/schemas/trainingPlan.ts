export const trainingPlanTool = {
  type: "function",
  function: {
    name: "return_training_plan",
    description: "Return a structured training plan for the athlete.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["athlete", "plan_summary", "weeks"],
      properties: {
        athlete: {
          type: "object",
          additionalProperties: false,
          required: ["sport", "level", "goal"],
          properties: {
            sport: { type: "string", enum: ["cycling", "running", "climbing"] },
            level: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
            goal: { type: "string", maxLength: 200 }
          }
        },
        plan_summary: { type: "string", maxLength: 500 },
        weeks: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["week_number", "sessions"],
            properties: {
              week_number: { type: "integer", minimum: 1 },
              sessions: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["title", "intensity", "duration_minutes", "notes"],
                  properties: {
                    title: { type: "string", maxLength: 80 },
                    intensity: { type: "string", enum: ["Z2", "tempo", "threshold", "VO2", "skills", "rest"] },
                    duration_minutes: { type: "integer", minimum: 10, maximum: 240 },
                    notes: { type: "string", maxLength: 240 }
                  }
                }
              }
            }
          }
        }
      }
    },
    strict: true
  }
} as const;

export type TrainingPlan = {
  athlete: { sport: "cycling"|"running"|"climbing"; level: "beginner"|"intermediate"|"advanced"; goal: string };
  plan_summary: string;
  weeks: Array<{
    week_number: number;
    sessions: Array<{
      title: string;
      intensity: "Z2"|"tempo"|"threshold"|"VO2"|"skills"|"rest";
      duration_minutes: number;
      notes: string;
    }>;
  }>;
};

