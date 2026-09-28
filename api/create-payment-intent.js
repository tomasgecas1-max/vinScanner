/**
 * Vercel serverless – Stripe PaymentIntent kūrimas.
 * Frontend kviečia su amount (EUR), vin, planIndex, email.
 * Grąžina client_secret ir orderId Payment Element / confirmPayment naudojimui.
 * @see https://docs.stripe.com/api/payment_intents/create
 */
import Stripe from 'stripe';
import crypto from 'crypto';
import { captureError } from './_sentry.js';
import { sendOwnerEmail } from './_ownerMail.js';

const PLAN_LABELS = ['1 ataskaita', '2 ataskaitos', '3 ataskaitos'];

function generateOrderId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const random = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
  return `VS-${yy}${mm}${dd}-${random}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { amountEur, amountPln, currency: reqCurrency, vin, planIndex, email } = body;
  const currency = (reqCurrency === 'pln' ? 'pln' : 'eur');
  const amountMajor = currency === 'pln' ? Number(amountPln) : Number(amountEur);
  const amountMinor = Math.round(amountMajor * 100);

  if (!Number.isFinite(amountMinor) || amountMinor < 50) {
    return res.status(400).json({ error: currency === 'pln' ? 'Invalid amount (min 0.50 PLN)' : 'Invalid amount (min 0.50 EUR)' });
  }
  if (!vin || typeof vin !== 'string' || vin.trim().length < 6) {
    return res.status(400).json({ error: 'vin required' });
  }

  const stripe = new Stripe(secretKey);
  const orderId = generateOrderId();

  try {
    const vinStr = String(vin).trim().slice(0, 100);
    const emailStr = String(email || '').slice(0, 500);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountMinor,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        vin: vinStr,
        planIndex: String(planIndex ?? ''),
        email: emailStr,
        orderId,
      },
    });

    const planLabel = PLAN_LABELS[Math.max(0, Math.min(2, Number(planIndex) || 0))];
    const amountText = `${amountMajor.toFixed(2)} ${currency.toUpperCase()}`;
    try {
      await sendOwnerEmail({
        subject: `Pradėtas mokėjimas ${amountText} [${orderId}] (${vinStr})`,
        html: `
          <p>Pradėtas mokėjimas (atidaryta mokėjimo forma) per vinscanner.eu.</p>
          <p><strong>Būsena:</strong> ${paymentIntent.status || 'requires_payment_method'}</p>
          <p><strong>Suma:</strong> ${amountText}</p>
          <p><strong>Planas:</strong> ${planLabel}</p>
          <p><strong>VIN:</strong> ${vinStr}</p>
          <p><strong>Kliento el. paštas:</strong> ${emailStr || '–'}</p>
          <p><strong>Užsakymas:</strong> ${orderId}</p>
          <p><strong>Stripe:</strong> <a href="https://dashboard.stripe.com/payments/${paymentIntent.id}">${paymentIntent.id}</a></p>
        `,
      });
    } catch (notifyErr) {
      captureError(notifyErr, { context: 'create-payment-intent-notify', orderId, vin: vinStr });
    }

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId,
      paymentIntentId: paymentIntent.id,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    captureError(e, { context: 'create-payment-intent', vin, amountMinor, currency });
    return res.status(502).json({ error: message });
  }
}
