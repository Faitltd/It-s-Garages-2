import { h as handleWebhook } from './stripe-BU8goQRx.js';
import 'stripe';
import './index-D2j6Gy4i.js';
import 'drizzle-orm/node-postgres';
import 'pg';
import './schema-CaDzoj12.js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

const POST = async ({ request }) => {
  try {
    const sig = request.headers.get("stripe-signature");
    const raw = await request.text();
    const res = await handleWebhook(raw, sig);
    return new Response(JSON.stringify(res), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Webhook error" }), { status: 400 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-B3vEe_4D.js.map
