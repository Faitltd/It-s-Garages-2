import express from 'express'
import { db } from '../services/firestore.js'
import { createCheckoutSession } from '../services/stripe.js'
import { validateAddress } from '../services/addressValidation.js'
import { sendTransactional } from '../services/email.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { customerId, size, photos = [], address } = req.body
    const valid = await validateAddress(address)
    const orderRef = await db.collection('orders').add({
      customerId, size, photos, address: valid, status: 'created',
      stripe: { paymentStatus: 'unpaid' }, timestamps: { createdAt: Date.now(), updatedAt: Date.now() }
    })
    const orderId = orderRef.id
    const session = await createCheckoutSession({ orderId })
    await orderRef.update({ 'stripe.sessionId': session.id })
    await sendTransactional({
      to: req.body.email,
      subject: 'Order created',
      text: `Your order ${orderId} has been created. Complete payment to proceed.`
    })
    res.status(201).json({ orderId, checkoutUrl: session.url })
  } catch (e) {
    console.error(e)
    res.status(400).json({ error: 'Failed to create order' })
  }
})

router.get('/:id', async (req, res) => {
  const doc = await db.collection('orders').doc(req.params.id).get()
  if (!doc.exists) return res.status(404).json({ error: 'Not found' })
  res.json({ id: doc.id, ...doc.data() })
})

export default router

