import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
  OPENAI_API_KEY: z.string().min(10),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
})

export const env = (() => {
  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables', parsed.error.flatten().fieldErrors)
    throw new Error('Missing/invalid env vars')
  }
  return parsed.data
})()

