import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string(),
    MAIL_PROVIDER: z.enum(['fake', 'resend']).default('fake'),
    RESEND_API_KEY: z.string(),
    ENV_TYPE: z.enum(['staging', 'production']).default('staging'),
    STAGING_API_TOKEN: z.string().optional(),
  },

  client: {},

  shared: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    MAIL_PROVIDER: process.env.MAIL_PROVIDER,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    ENV_TYPE: process.env.ENV_TYPE,
    STAGING_API_TOKEN: process.env.STAGING_API_TOKEN,
  },
})
