import type { RequestHandler } from '@sveltejs/kit';
import { BookingInput } from '$lib/validation/booking';
import { createBooking } from '$lib/server/services/bookings';
import { sanitizeRecord } from '$lib/server/security';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const json = await request.json();
    const parsed = BookingInput.safeParse(json);
    if (!parsed.success) return new Response(JSON.stringify({ error: 'Invalid input', issues: parsed.error.format() }), { status: 400 });
    const clean = sanitizeRecord(parsed.data);
    const row = await createBooking(clean);
    return new Response(JSON.stringify({ booking: row }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Server error' }), { status: 500 });
  }
};

