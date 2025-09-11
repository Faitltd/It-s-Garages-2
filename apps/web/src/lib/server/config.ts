import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  DATABASE_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(16).optional(),
  RESEND_API_KEY: z.string().optional(),
  POSTMARK_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM: z.string().optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  BASE_URL: z.string().url().optional(),
  ADMIN_API_KEY: z.string().optional(),
  CAL_WEBHOOK_SECRET: z.string().optional(),
  RECAPTCHA_SECRET: z.string().optional()
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = (() => {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // In dev/test environments, do not crash SSR; return partial env
    const partial = parsed.data ?? ({} as Env);
    console.warn('Environment validation warnings (non-fatal in dev/test):', parsed.error.flatten());
    return partial;
  }
  return parsed.data;
})();

