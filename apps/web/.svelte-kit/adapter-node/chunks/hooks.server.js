import * as Sentry from "@sentry/sveltekit";
import { z } from "zod";
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
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
(() => {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const partial = parsed.data ?? {};
    console.warn("Environment validation warnings (non-fatal in dev/test):", parsed.error.flatten());
    return partial;
  }
  return parsed.data;
})();
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
const rateBuckets = /* @__PURE__ */ new Map();
const windowMs = 6e4;
const limits = {
  "/api/estimate": 30,
  "/api/leads": 20
};
const handle = async ({ event, resolve }) => {
  const urlPath = event.url.pathname;
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "script-src 'self' 'unsafe-inline' https: http:",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://maps.googleapis.com",
    "connect-src 'self' https://api.stripe.com https://rs.send.net https://api.resend.com",
    "frame-src https://js.stripe.com https://checkout.stripe.com https://cal.com https://*.cal.com",
    "font-src 'self' data:",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join("; ");
  const limit = limits[urlPath];
  if (limit) {
    const ip = event.getClientAddress?.() || event.request.headers.get("x-forwarded-for") || "unknown";
    const key = `${ip}:${urlPath}`;
    const now = Date.now();
    const b = rateBuckets.get(key);
    if (!b || now > b.reset) {
      rateBuckets.set(key, { count: 1, reset: now + windowMs });
    } else if (b.count >= limit) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "content-type": "application/json", "cache-control": "no-store", "content-security-policy": csp }
      });
    } else {
      b.count++;
      rateBuckets.set(key, b);
    }
  }
  const response = await resolve(event, {
    filterSerializedResponseHeaders: (name) => name === "content-type"
  });
  response.headers.set("content-security-policy", csp);
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("x-frame-options", "DENY");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("permissions-policy", "geolocation=(), microphone=(), camera=()");
  return response;
};
export {
  handle
};
