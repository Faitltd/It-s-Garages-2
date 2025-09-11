import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const required = (name) => {
  const v = process.env[name]
  if (!v) throw new Error(`${name} missing`)
  return v
}

function client() {
  const region = required('SES_REGION')
  const ses = new SESClient({ region })
  return ses
}

export async function sendTransactional({ to, subject, text }) {
  const from = process.env.SES_FROM_EMAIL || 'no-reply@example.com'
  const ses = client()
  const cmd = new SendEmailCommand({
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: { Text: { Data: text, Charset: 'UTF-8' } },
    },
    Source: from,
  })
  await ses.send(cmd)
}

