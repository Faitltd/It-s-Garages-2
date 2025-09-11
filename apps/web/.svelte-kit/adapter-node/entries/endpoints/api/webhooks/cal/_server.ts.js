import crypto from "crypto";
import { d as db } from "../../../../../chunks/index.js";
import { a as appointments } from "../../../../../chunks/schema.js";
function verifySignature(raw, sig, secret) {
  if (!secret || !sig) return false;
  const hmac = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(sig));
}
const POST = async ({ request }) => {
  try {
    const sig = request.headers.get("x-cal-signature") || request.headers.get("x-signature");
    const secret = process.env.CAL_WEBHOOK_SECRET;
    const raw = await request.text();
    if (!verifySignature(raw, sig, secret)) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
    }
    const evt = JSON.parse(raw);
    if (evt.type === "booking.created") {
      const payload = evt.data || {};
      const start = new Date(payload.startTime || payload.start || Date.now());
      const end = new Date(payload.endTime || payload.end || Date.now());
      const leadId = Number(payload.metadata?.leadId || payload.customFields?.leadId);
      const techId = Number(payload.metadata?.techId || payload.hostId);
      if (leadId && techId) {
        await db.insert(appointments).values({ leadId, techId, start, end, notes: "Cal.com booking" });
      }
    }
    return new Response(JSON.stringify({ received: true }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Webhook error" }), { status: 400 });
  }
};
export {
  POST
};
