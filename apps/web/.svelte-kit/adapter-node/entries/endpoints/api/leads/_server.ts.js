import { z } from "zod";
import { d as db } from "../../../../chunks/index.js";
import { l as leads } from "../../../../chunks/schema.js";
import { Resend } from "resend";
import { ServerClient } from "postmark";
import twilio from "twilio";
import { s as sanitizeRecord } from "../../../../chunks/security.js";
const LeadInput = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  address1: z.string(),
  city: z.string(),
  state: z.string().length(2),
  zip: z.string(),
  estimateId: z.number().int().optional(),
  utm: z.record(z.string()).optional(),
  token: z.string().optional()
  // captcha token
});
const resendKey = process.env.RESEND_API_KEY;
const postmarkKey = process.env.POSTMARK_API_KEY;
async function sendEmail({ to, subject, html, from: from2 }) {
  const sender = from2 || "Its Garages <no-reply@itsgarages.com>";
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
  console.warn("No email provider configured");
}
const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_FROM;
async function sendSMS(to, body) {
  if (!sid || !token || !from) {
    console.warn("Twilio not configured");
    return;
  }
  const client = twilio(sid, token);
  await client.messages.create({ to, from, body });
}
async function verifyCaptcha(token2) {
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret || !token2) return false;
    try {
      const body = new URLSearchParams({ secret, response: token2 });
      const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body
      });
      const data = await r.json();
      return !!data.success;
    } catch {
      return false;
    }
  }
  return true;
}
const POST = async ({ request, url }) => {
  try {
    const json = await request.json();
    const parsed = LeadInput.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input", issues: parsed.error.format() }), { status: 400 });
    }
    const input = sanitizeRecord(parsed.data);
    const ok = await verifyCaptcha(input.token);
    if (!ok) return new Response(JSON.stringify({ error: "Captcha failed" }), { status: 400 });
    const [row] = await db.insert(leads).values({
      name: input.name,
      email: input.email,
      phone: input.phone,
      address1: input.address1,
      city: input.city,
      state: input.state,
      zip: input.zip,
      utm: input.utm,
      estimateId: input.estimateId
    }).returning({ id: leads.id });
    const base = process.env.BASE_URL || `${url.origin}`;
    const bookingUrl = `${base}/book${input.estimateId ? `?estimateId=${input.estimateId}` : ""}`;
    sendEmail({ to: input.email, subject: "We received your request", html: `<p>Thanks ${input.name}, book here: <a href="${bookingUrl}">${bookingUrl}</a></p>` }).catch(() => {
    });
    sendSMS(input.phone, `Its Garages: book your service here ${bookingUrl}`).catch(() => {
    });
    return new Response(JSON.stringify({ id: row.id, bookingUrl }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Server error" }), { status: 500 });
  }
};
export {
  POST
};
