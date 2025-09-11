import Stripe from "stripe";
import { d as db } from "./index.js";
import { p as payments } from "./schema.js";
import { eq } from "drizzle-orm";
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
async function createCheckoutSession(params) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    allow_promotion_codes: true,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: params.currency || "usd",
          unit_amount: params.amount,
          product_data: { name: "Garage Service Deposit" }
        }
      }
    ],
    success_url: params.success_url,
    cancel_url: params.cancel_url,
    customer_email: params.customer_email,
    metadata: params.metadata
  });
  return session;
}
async function handleWebhook(rawBody, sig) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET missing");
  const event = stripe.webhooks.constructEvent(rawBody, sig || "", webhookSecret);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;
    await db.update(payments).set({ status: "paid" }).where(eq(payments.stripeSessionId, sessionId));
  }
  return { received: true };
}
export {
  createCheckoutSession as c,
  handleWebhook as h
};
