import { h as handleWebhook } from "../../../../../chunks/stripe.js";
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
export {
  POST
};
