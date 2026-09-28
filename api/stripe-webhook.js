/**
 * Stripe webhook – praneša savininkui, kai PaymentIntent sėkmingai apmokėtas.
 * Stripe Dashboard → Developers → Webhooks → https://vinscanner.eu/api/stripe-webhook
 * Eventai: visi payment_intent.* (created, processing, failed, succeeded ir kt.)
 * Env: STRIPE_WEBHOOK_SECRET, PAYMENT_NOTIFY_EMAIL (nebūtina – tada SMTP_FROM / SMTP_USER)
 */
import Stripe from 'stripe';
import { captureError } from './_sentry.js';
import { sendOwnerEmail } from './_ownerMail.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const PLAN_LABELS = ['1 ataskaita', '2 ataskaitos', '3 ataskaitos'];

const EVENT_LABELS = {
  'payment_intent.created': 'Pradėtas mokėjimas (atidaryta mokėjimo forma)',
  'payment_intent.processing': 'Mokėjimas apdorojamas',
  'payment_intent.requires_action': 'Reikia papildomo patvirtinimo (3D Secure ir pan.)',
  'payment_intent.payment_failed': 'Mokėjimas nepavyko',
  'payment_intent.canceled': 'Mokėjimas atšauktas',
  'payment_intent.succeeded': 'Mokėjimas sėkmingas',
  'payment_intent.amount_capturable_updated': 'Atnaujinta nuskaičiuojama suma',
  'payment_intent.partially_funded': 'Mokėjimas dalinai apmokėtas',
};

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not configured' });
  }

  let event;
  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }
    const stripe = new Stripe(secretKey);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (e) {
    captureError(e, { context: 'stripe-webhook-verify' });
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (!event.type.startsWith('payment_intent.')) {
    return res.status(200).json({ received: true });
  }

  const pi = event.data.object;
  const metadata = pi.metadata || {};
  const amount = (Number(pi.amount_received || pi.amount) || 0) / 100;
  const planIndex = Math.max(0, Math.min(2, Number(metadata.planIndex) || 0));
  const vin = String(metadata.vin || '').trim();
  const email = String(metadata.email || pi.receipt_email || '').trim();
  const orderId = String(metadata.orderId || '').trim();
  const amountText = `${amount.toFixed(2)} ${(pi.currency || 'eur').toUpperCase()}`;
  const stripeUrl = `https://dashboard.stripe.com/payments/${pi.id}`;
  const actionLabel = EVENT_LABELS[event.type] || event.type;
  const lastError = pi.last_payment_error?.message
    ? `<p><strong>Klaida:</strong> ${String(pi.last_payment_error.message)}</p>`
    : '';

  try {
    await sendOwnerEmail({
      subject: `${actionLabel} ${amountText}${orderId ? ` [${orderId}]` : ''}${vin ? ` (${vin})` : ''}`,
      html: `
        <p>${actionLabel} per vinscanner.eu.</p>
        <p><strong>Įvykis:</strong> ${event.type}</p>
        <p><strong>Būsena:</strong> ${pi.status || '–'}</p>
        <p><strong>Suma:</strong> ${amountText}</p>
        <p><strong>Planas:</strong> ${PLAN_LABELS[planIndex]}</p>
        <p><strong>VIN:</strong> ${vin || '–'}</p>
        <p><strong>Kliento el. paštas:</strong> ${email || '–'}</p>
        ${orderId ? `<p><strong>Užsakymas:</strong> ${orderId}</p>` : ''}
        ${lastError}
        <p><strong>Stripe:</strong> <a href="${stripeUrl}">${pi.id}</a></p>
      `,
    });
    return res.status(200).json({ received: true });
  } catch (e) {
    captureError(e, { context: 'stripe-webhook-notify', paymentIntentId: pi.id });
    return res.status(500).json({ error: 'Notify failed' });
  }
}
