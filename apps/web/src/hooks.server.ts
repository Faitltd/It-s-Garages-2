import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { env } from '$lib/server/config';

Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });

// naive in-memory rate limiter (per instance). Replace with Redis in prod.
const rateBuckets = new Map<string, { count: number; reset: number }>();
const windowMs = 60_000; // 1 min
const limits: Record<string, number> = {
  '/api/estimate': 30,
  '/api/leads': 20
};

export const handle = (async ({ event, resolve }) => {
  const urlPath = event.url.pathname;

  // Hardened CSP + security headers
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "script-src 'self' 'unsafe-inline' https: http:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://maps.googleapis.com",
    "connect-src 'self' https://api.stripe.com https://rs.send.net https://api.resend.com",
    "frame-src https://js.stripe.com https://checkout.stripe.com https://cal.com https://*.cal.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  // rate limit select endpoints
  const limit = limits[urlPath];
  if (limit) {
    const ip = event.getClientAddress?.() || event.request.headers.get('x-forwarded-for') || 'unknown';
    const key = `${ip}:${urlPath}`;
    const now = Date.now();
    const b = rateBuckets.get(key);
    if (!b || now > b.reset) {
      rateBuckets.set(key, { count: 1, reset: now + windowMs });
    } else if (b.count >= limit) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'content-security-policy': csp }
      });
    } else {
      b.count++;
      rateBuckets.set(key, b);
    }
  }

  const response = await resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-type'
  });
  response.headers.set('content-security-policy', csp);
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  response.headers.set('permissions-policy', 'geolocation=(), microphone=(), camera=()');
  return response;
}) satisfies Handle;

