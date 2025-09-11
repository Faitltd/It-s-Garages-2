import Stripe from 'stripe';
import { db } from '../db';
import { payments } from '../db/schema';
import { eq } from 'drizzle-orm';

const stripeKey = process.env.STRIPE_SECRET_KEY || '';
export const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });

export async function createCheckoutSession(params: {
  amount: number; // cents
  currency?: string;
  customer_email?: string;
  success_url: string;
  cancel_url: string;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    allow_promotion_codes: true,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: params.currency || 'usd',
          unit_amount: params.amount,
          product_data: { name: 'Garage Service Deposit' }
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

export async function handleWebhook(rawBody: string, sig: string | null) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET missing');

  const event = stripe.webhooks.constructEvent(rawBody, sig || '', webhookSecret);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;
    await db
      .update(payments)
      .set({ status: 'paid' })
      .where(eq(payments.stripeSessionId, sessionId));
  }

  return { received: true } as const;
}

