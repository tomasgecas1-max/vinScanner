/**
 * GET ?token=XXX – pirkimo info.
 * POST { token, action: 'refund' } – Stripe grąžinimas, tik jei reportsUsed === 0.
 */
import Stripe from 'stripe';
import admin from 'firebase-admin';
import { captureError } from './_sentry.js';
import { sendOwnerEmail } from './_ownerMail.js';

function getDb() {
  if (admin.apps.length === 0) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!key) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY not configured');
    const cred = typeof key === 'string' ? JSON.parse(key) : key;
    admin.initializeApp({ credential: admin.credential.cert(cred) });
  }
  return admin.firestore();
}

function purchasePayload(d, refunded) {
  const reportsTotal = d?.reportsTotal ?? 1;
  const reportsUsed = d?.reportsUsed ?? 0;
  const reportsRemaining = refunded ? 0 : Math.max(0, reportsTotal - reportsUsed);
  return {
    orderId: d?.orderId ?? null,
    email: d?.email ?? '',
    reportsTotal,
    reportsUsed,
    reportsRemaining,
    usedVins: Array.isArray(d?.usedVins) ? d.usedVins : [],
    paymentIntentId: d?.paymentIntentId ?? null,
    refunded,
  };
}

async function handleRefund(req, res) {
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const token = String(body?.token || '').trim();
  if (!token || token.length < 10) {
    return res.status(400).json({ error: 'token required' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
  }

  const ref = getDb().collection('purchases').doc(token);
  const snap = await ref.get();
  if (!snap.exists) {
    return res.status(404).json({ error: 'Purchase not found' });
  }

  const d = snap.data() || {};
  const reportsUsed = d.reportsUsed ?? 0;
  if (d.refunded) {
    return res.status(400).json({ error: 'already_refunded', refunded: true });
  }
  if (reportsUsed > 0) {
    return res.status(400).json({ error: 'report_used', refunded: false });
  }
  const paymentIntentId = d.paymentIntentId ? String(d.paymentIntentId) : '';
  if (!paymentIntentId) {
    return res.status(400).json({ error: 'no_payment' });
  }

  const stripe = new Stripe(secretKey);
  let refundId = '';
  let amountText = '';
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    const amount = (Number(pi.amount_received || pi.amount) || 0) / 100;
    amountText = `${amount.toFixed(2)} ${(pi.currency || 'eur').toUpperCase()}`;
    if (pi.status !== 'succeeded' && pi.status !== 'paid') {
      return res.status(400).json({ error: 'payment_not_succeeded' });
    }
    const alreadyRefunded = (pi.amount_received || 0) > 0 && pi.amount_received === (pi.amount_refunded || 0);
    if (!alreadyRefunded) {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        reason: 'requested_by_customer',
      });
      refundId = refund.id || '';
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const already = /already been refunded|charge_already_refunded/i.test(message);
    if (!already) {
      captureError(e, { context: 'refund-stripe', token, paymentIntentId });
      return res.status(502).json({ error: 'stripe_refund_failed' });
    }
  }

  await ref.update({
    refunded: true,
    refundedAt: admin.firestore.FieldValue.serverTimestamp(),
    refundId: refundId || null,
  });

  const orderId = d.orderId || '';
  const email = d.email || '';
  const vin = Array.isArray(d.usedVins) && d.usedVins[0] ? d.usedVins[0] : '';
  try {
    await sendOwnerEmail({
      subject: `Grąžinimas ${amountText || ''}${orderId ? ` [${orderId}]` : ''}`,
      html: `
        <p>Klientas grąžino mokėjimą (VIN nerastas, ataskaita nepanaudota).</p>
        <p><strong>Užsakymas:</strong> ${orderId || '–'}</p>
        <p><strong>Suma:</strong> ${amountText || '–'}</p>
        <p><strong>Kliento el. paštas:</strong> ${email || '–'}</p>
        ${vin ? `<p><strong>VIN:</strong> ${vin}</p>` : ''}
        <p><strong>Stripe:</strong> <a href="https://dashboard.stripe.com/payments/${paymentIntentId}">${paymentIntentId}</a></p>
      `,
    });
  } catch (notifyErr) {
    captureError(notifyErr, { context: 'refund-notify', token, paymentIntentId });
  }

  return res.status(200).json({ success: true, refunded: true });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      let body;
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch {
        return res.status(400).json({ error: 'Invalid JSON' });
      }
      if (body?.action === 'refund') {
        return await handleRefund(req, res);
      }
      return res.status(400).json({ error: 'Unknown action' });
    }

    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const token = req.query?.token?.trim();
    if (!token || token.length < 10) {
      return res.status(400).json({ error: 'token required' });
    }

    const snap = await getDb().collection('purchases').doc(token).get();
    if (!snap.exists) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const d = snap.data();
    return res.status(200).json(purchasePayload(d, !!d?.refunded));
  } catch (err) {
    captureError(err, { context: 'get-purchase' });
    return res.status(500).json({ error: 'Failed' });
  }
}
