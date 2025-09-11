import { jest } from '@jest/globals'
import request from 'supertest'

// Mocks
const mockAdd = jest.fn(async () => ({ id: 'order123', update: jest.fn() }))
const mockDocGet = jest.fn()
const mockDoc = jest.fn(() => ({ get: mockDocGet }))
const mockCollection = jest.fn((name) => {
  if (name === 'orders') return { add: mockAdd, doc: mockDoc }
  return {}
})

await jest.unstable_mockModule('../src/services/firestore.js', () => ({
  db: { collection: mockCollection }
}))

const mockCreateCheckoutSession = jest.fn(async () => ({ id: 'cs_123', url: 'https://checkout' }))
await jest.unstable_mockModule('../src/services/stripe.js', () => ({
  createCheckoutSession: mockCreateCheckoutSession
}))

const mockValidateAddress = jest.fn(async (addr) => addr)
await jest.unstable_mockModule('../src/services/addressValidation.js', () => ({
  validateAddress: mockValidateAddress
}))

const mockSend = jest.fn(async () => {})
await jest.unstable_mockModule('../src/services/email.js', () => ({
  sendTransactional: mockSend
}))

const { default: app } = await import('../src/index.js')

describe('Orders API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST /orders creates order and returns checkout URL', async () => {
    const res = await request(app)
      .post('/orders')
      .send({ customerId: 'c1', email: 'u@example.com', size: '8x7', photos: [], address: { line1:'123', city:'x', state:'CA', zip:'90001' } })
      .expect(201)
    expect(res.body.orderId).toBe('order123')
    expect(res.body.checkoutUrl).toBe('https://checkout')
    expect(mockAdd).toHaveBeenCalled()
    expect(mockCreateCheckoutSession).toHaveBeenCalledWith({ orderId: 'order123' })
    expect(mockSend).toHaveBeenCalled()
  })

  it('GET /orders/:id returns order', async () => {
    mockDocGet.mockResolvedValueOnce({ exists: true, data: () => ({ status: 'created' }) })
    const res = await request(app).get('/orders/abc').expect(200)
    expect(res.body.id).toBeDefined()
    expect(res.body.status).toBe('created')
  })

  it('GET /orders/:id returns 404 when not found', async () => {
    mockDocGet.mockResolvedValueOnce({ exists: false })
    await request(app).get('/orders/missing').expect(404)
  })

  it('POST /orders handles errors', async () => {
    mockCreateCheckoutSession.mockRejectedValueOnce(new Error('boom'))
    await request(app)
      .post('/orders')
      .send({ customerId: 'c1', email: 'u@example.com', size: '8x7', photos: [], address: { line1:'123' } })
      .expect(400)
  })
})

