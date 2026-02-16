/**
 * Vercel serverless – Stripe PaymentIntent kūrimas.
 * Frontend kviečia su amount (EUR), vin, planIndex, email.
 * Grąžina client_secret Payment Element / confirmPayment naudojimui.
 * @see https://docs.stripe.com/api/payment_intents/create
 */
import Stripe from 'stripe';

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

  const { amountEur, vin, planIndex, email } = body;
  const amountCents = Math.round(Number(amountEur) * 100);

  if (!Number.isFinite(amountCents) || amountCents < 50) {
    return res.status(400).json({ error: 'Invalid amount (min 0.50 EUR)' });
  }
  if (!vin || typeof vin !== 'string' || vin.trim().length < 6) {
    return res.status(400).json({ error: 'vin required' });
  }

  const stripe = new Stripe(secretKey);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        vin: String(vin).trim().slice(0, 100),
        planIndex: String(planIndex ?? ''),
        email: String(email || '').slice(0, 500),
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return res.status(502).json({ error: message });
  }
}
