import { Resend } from 'resend';
import { ServerClient } from 'postmark';

const resendKey = process.env.RESEND_API_KEY;
const postmarkKey = process.env.POSTMARK_API_KEY;

export async function sendEmail({ to, subject, html, from }: { to: string; subject: string; html: string; from?: string }) {
  const sender = from || 'Its Garages <no-reply@itsgarages.com>';
  if (resendKey) {
    const resend = new Resend(resendKey);
    await resend.emails.send({ from: sender, to, subject, html });
    return;
  }
  if (postmarkKey) {
    const client = new ServerClient(postmarkKey);
    await client.sendEmail({ From: sender, To: to, Subject: subject, HtmlBody: html });
    return;
  }
  console.warn('No email provider configured');
}

