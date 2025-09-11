import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import ordersRouter from './routes/orders.js'
import webhooksRouter from './routes/webhooks.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())

// Stripe webhooks require raw body: register BEFORE json parser
app.use('/webhooks/stripe', bodyParser.raw({ type: 'application/json' }))

// JSON body for the rest of the API
app.use(bodyParser.json())

app.use('/webhooks', webhooksRouter)
app.use('/orders', ordersRouter)

app.get('/healthz', (_req, res) => res.json({ status: 'ok', timestamp: Date.now() }))

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`API listening on :${PORT}`))
}

export default app

