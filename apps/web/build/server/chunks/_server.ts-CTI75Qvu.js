import { c as createCheckoutSession } from './stripe-BU8goQRx.js';
import { d as db } from './index-D2j6Gy4i.js';
import { p as payments } from './schema-CaDzoj12.js';
import 'stripe';
import 'drizzle-orm';
import 'drizzle-orm/node-postgres';
import 'pg';
import 'drizzle-orm/pg-core';

const POST = async ({ request, url }) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Stripe not configured" }), { status: 503 });
    }
    const { estimateId, amount, email } = await request.json();
    if (!estimateId || !amount) return new Response(JSON.stringify({ error: "estimateId and amount required" }), { status: 400 });
    const success = `${process.env.BASE_URL || url.origin}/book?estimateId=${estimateId}`;
    const cancel = `${process.env.BASE_URL || url.origin}/pricing`;
    const session = await createCheckoutSession({ amount, success_url: success, cancel_url: cancel, customer_email: email, metadata: { estimateId: String(estimateId) } });
    await db.insert(payments).values({ estimateId, stripeSessionId: session.id, amount: (amount / 100).toFixed(2), status: "created" });
    return new Response(JSON.stringify({ url: session.url, id: session.id }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Server error" }), { status: 500 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-CTI75Qvu.js.map
