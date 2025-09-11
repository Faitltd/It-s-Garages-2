import { z } from "zod";
import { c as createBooking } from "../../../../chunks/bookings.js";
import { s as sanitizeRecord } from "../../../../chunks/security.js";
const BookingInput = z.object({
  leadId: z.number().int(),
  techId: z.number().int(),
  start: z.string(),
  // ISO
  end: z.string(),
  notes: z.string().optional()
});
const POST = async ({ request }) => {
  try {
    const json = await request.json();
    const parsed = BookingInput.safeParse(json);
    if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid input", issues: parsed.error.format() }), { status: 400 });
    const clean = sanitizeRecord(parsed.data);
    const row = await createBooking(clean);
    return new Response(JSON.stringify({ booking: row }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Server error" }), { status: 500 });
  }
};
export {
  POST
};
