import twilio from 'twilio';

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_FROM;

export async function sendSMS(to: string, body: string) {
  if (!sid || !token || !from) {
    console.warn('Twilio not configured');
    return;
  }
  const client = twilio(sid, token);
  await client.messages.create({ to, from, body });
}

