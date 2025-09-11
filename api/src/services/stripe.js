import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createCheckoutSession({ orderId }) {
  const params = {
    mode: 'payment',
    line_items: [
      { price_data: { currency: 'usd', unit_amount: 50000, product_data: { name: 'Garage door' } }, quantity: 1 }
    ],
    success_url: `${process.env.FRONTEND_URL}/success?orderId=${orderId}`,
    cancel_url: `${process.env.FRONTEND_URL}/wizard?canceled=1`,
    metadata: { orderId }
  }
  return await stripe.checkout.sessions.create(params)
}

