import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3090),
  JWT_PRIVATE_kEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_USER_ACCESS_EXPIRES_IN: z.string(),
  JWT_USER_REFRESH_EXPIRES_IN: z.string(),
  JWT_ADM_ACCESS_EXPIRES_IN: z.string(),
  JWT_ADM_REFRESH_EXPIRES_IN: z.string(),
  ADM_REFRESH_EXPIRES_IN: z.coerce.number(),
  USER_REFRESH_EXPIRES_IN: z.coerce.number(),
  FIREBASE_CONFIG_PATH: z.string().trim(),
  NODE_ENV: z
    .enum(['development', 'production', 'debug', 'test'])
    .default('production'),
  CLOUDFLARE_END_POINT: z.string().url(),
  CLOUDFLARE_VIEW_URL: z.string().url(),
  CLOUDFLARE_ACCESS_KEY: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_BUCKET: z.string(),
  ACCEPT_ORIGINS: z.string().transform((origins) => origins.split(',')),
  NEW_RELIC_APP_NAME: z.string(),
  NEW_RELIC_LICENSE_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
