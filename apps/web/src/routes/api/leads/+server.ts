import type { RequestHandler } from '@sveltejs/kit';
import { LeadInput } from '$lib/validation/lead';
import { db } from '$lib/server/db';
import { leads } from '$lib/server/db/schema';
import { sendEmail } from '$lib/server/services/email';
import { sendSMS } from '$lib/server/services/sms';
import { sanitizeRecord } from '$lib/server/security';

async function verifyCaptcha(token?: string) {
  // In production, verify via Google reCAPTCHA. In non-prod, allow.
  if (process.env.NODE_ENV === 'production') {
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret || !token) return false;
    try {
      const body = new URLSearchParams({ secret, response: token });
      const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body
      });
      const data = (await r.json()) as { success?: boolean };
      return !!data.success;
    } catch {
      return false;
    }
  }
  return true;
}

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const json = await request.json();
    const parsed = LeadInput.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid input', issues: parsed.error.format() }), { status: 400 });
    }
    const input = sanitizeRecord(parsed.data);
    const ok = await verifyCaptcha(input.token);
    if (!ok) return new Response(JSON.stringify({ error: 'Captcha failed' }), { status: 400 });

    const [row] = await db
      .insert(leads)
      .values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        address1: input.address1,
        city: input.city,
        state: input.state,
        zip: input.zip,
        utm: input.utm,
        estimateId: input.estimateId
      })
      .returning({ id: leads.id });

    const base = process.env.BASE_URL || `${url.origin}`;
    const bookingUrl = `${base}/book${input.estimateId ? `?estimateId=${input.estimateId}` : ''}`;

    // fire-and-forget notifications
    sendEmail({ to: input.email, subject: 'We received your request', html: `<p>Thanks ${input.name}, book here: <a href=\"${bookingUrl}\">${bookingUrl}</a></p>` }).catch(() => {});
    sendSMS(input.phone, `Its Garages: book your service here ${bookingUrl}`).catch(() => {});

    return new Response(JSON.stringify({ id: row.id, bookingUrl }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Server error' }), { status: 500 });
  }
};

