import sg from '@sendgrid/mail'

export function initSendGrid(){
  if (!process.env.SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY missing')
  sg.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function sendTransactional({ to, subject, text }){
  initSendGrid()
  const from = process.env.SENDGRID_FROM_EMAIL || 'no-reply@example.com'
  await sg.send({ to, from, subject, text })
}

