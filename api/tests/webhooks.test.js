import { jest } from '@jest/globals'
import request from 'supertest'

process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
process.env.STRIPE_SECRET_KEY = 'sk_test'

// Firestore mock
const mockUpdate = jest.fn(async () => {})
const mockGet = jest.fn(async () => ({ data: () => ({ email: 'u@example.com' }) }))
const mockDoc = jest.fn(() => ({ update: mockUpdate, get: mockGet }))
const mockCollection = jest.fn(() => ({ doc: mockDoc }))
await jest.unstable_mockModule('../src/services/firestore.js', () => ({
  db: { collection: mockCollection }
}))

// SendGrid mock
const mockSend = jest.fn(async () => {})
await jest.unstable_mockModule('../src/services/email.js', () => ({
  sendTransactional: mockSend
}))

// Stripe mock
const eventObj = { type: 'checkout.session.completed', data: { object: { metadata: { orderId: 'order123' } } } }
class MockStripe {}
MockStripe.prototype.webhooks = { constructEvent: jest.fn(() => eventObj) }
await jest.unstable_mockModule('stripe', () => ({ default: MockStripe }))

const { default: app } = await import('../src/index.js')

describe('Stripe Webhook', () => {
  beforeEach(() => { jest.clearAllMocks() })
  it('handles checkout.session.completed and updates order', async () => {
    const payload = Buffer.from(JSON.stringify({ any: 'payload' }))
    await request(app)
      .post('/webhooks/stripe')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 't=123,v1=abc')
      .send(payload)
      .expect(200)
    expect(mockUpdate).toHaveBeenCalled()
    expect(mockSend).toHaveBeenCalled()
  })

  it('returns 400 on invalid signature', async () => {
    // Make constructEvent throw
    const { default: StripeDefault } = await import('stripe')
    StripeDefault.prototype.webhooks.constructEvent.mockImplementationOnce(() => { throw new Error('bad sig') })
    const payload = Buffer.from(JSON.stringify({ any: 'payload' }))
    await request(app)
      .post('/webhooks/stripe')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'bad')
      .send(payload)
      .expect(400)
  })

  it('ignores non-checkout events', async () => {
    const { default: StripeDefault } = await import('stripe')
    StripeDefault.prototype.webhooks.constructEvent.mockImplementationOnce(() => ({ type: 'ping', data: { object: {} } }))
    const payload = Buffer.from(JSON.stringify({ any: 'payload' }))
    await request(app)
      .post('/webhooks/stripe')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 't=123,v1=abc')
      .send(payload)
      .expect(200)
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('does not update when orderId metadata is missing', async () => {
    const { default: StripeDefault } = await import('stripe')
    StripeDefault.prototype.webhooks.constructEvent.mockImplementationOnce(() => ({ type: 'checkout.session.completed', data: { object: {} } }))
    const payload = Buffer.from(JSON.stringify({ any: 'payload' }))
    await request(app)
      .post('/webhooks/stripe')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 't=123,v1=abc')
      .send(payload)
      .expect(200)
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('does not send email when order has no email', async () => {
    // Next call: valid completed event but missing email in doc
    const { default: StripeDefault } = await import('stripe')
    StripeDefault.prototype.webhooks.constructEvent.mockImplementationOnce(() => ({ type: 'checkout.session.completed', data: { object: { metadata: { orderId: 'order123' } } } }))
    mockGet.mockResolvedValueOnce({ data: () => ({}) })
    const payload = Buffer.from(JSON.stringify({ any: 'payload' }))
    await request(app)
      .post('/webhooks/stripe')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 't=123,v1=abc')
      .send(payload)
      .expect(200)
    expect(mockSend).not.toHaveBeenCalled()
  })
})

