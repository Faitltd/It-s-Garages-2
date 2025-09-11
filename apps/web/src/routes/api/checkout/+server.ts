import type { RequestHandler } from '@sveltejs/kit';
import { createCheckoutSession } from '$lib/server/services/stripe';
import { db } from '$lib/server/db';
import { payments } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 503 });
    }
    const { estimateId, amount, email } = await request.json();
    if (!estimateId || !amount) return new Response(JSON.stringify({ error: 'estimateId and amount required' }), { status: 400 });

    const success = `${process.env.BASE_URL || url.origin}/book?estimateId=${estimateId}`;
    const cancel = `${process.env.BASE_URL || url.origin}/pricing`;

    const session = await createCheckoutSession({ amount, success_url: success, cancel_url: cancel, customer_email: email, metadata: { estimateId: String(estimateId) } });

    await db.insert(payments).values({ estimateId, stripeSessionId: session.id, amount: (amount/100).toFixed(2) as any, status: 'created' });

    return new Response(JSON.stringify({ url: session.url, id: session.id }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Server error' }), { status: 500 });
  }
};

