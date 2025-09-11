import express from 'express'
import Stripe from 'stripe'
import { db } from '../services/firestore.js'
import { sendTransactional } from '../services/email.js'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature']
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const orderId = session.metadata?.orderId
      if (orderId) {
        const ref = db.collection('orders').doc(orderId)
        await ref.update({ 'stripe.paymentStatus': 'paid', status: 'paid', 'timestamps.updatedAt': Date.now() })
        const doc = await ref.get()
        const data = doc.data()
        if (data?.email) {
          await sendTransactional({ to: data.email, subject: 'Payment received', text: `We received your payment for order ${orderId}.` })
        }
      }
    }

    res.json({ received: true })
  } catch (err) {
    console.error('Webhook error', err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

export default router

