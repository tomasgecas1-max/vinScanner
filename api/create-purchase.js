/**
 * Sukuria pirkimą po mokėjimo – visiems planams (1–3 ataskaitos).
 * POST { email?, planIndex?, vin?, paymentIntentId? }
 * Jei yra paymentIntentId – paima el. paštą / planą iš Stripe metadata ir nekuria dublikato.
 */
import Stripe from 'stripe';
import admin from 'firebase-admin';
import crypto from 'crypto';
import { captureError } from './_sentry.js';

function generateOrderId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const random = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
  return `VS-${yy}${mm}${dd}-${random}`;
}

function getDb() {
  if (admin.apps.length === 0) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!key) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY not configured');
    const cred = typeof key === 'string' ? JSON.parse(key) : key;
    admin.initializeApp({ credential: admin.credential.cert(cred) });
  }
  return admin.firestore();
}

async function findByPaymentIntent(col, paymentIntentId) {
  if (!paymentIntentId) return null;
  const existing = await col.where('paymentIntentId', '==', paymentIntentId).limit(1).get();
  if (existing.empty) return null;
  const doc = existing.docs[0];
  const d = doc.data() || {};
  return { token: doc.id, orderId: d.orderId || null, refunded: !!d.refunded };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  let email = typeof body?.email === 'string' ? body.email.trim() : '';
  let vin = typeof body?.vin === 'string' ? body.vin.trim() : '';
  let planIndex = body?.planIndex;
  const paymentIntentId = typeof body?.paymentIntentId === 'string' ? body.paymentIntentId.trim() : '';

  try {
    if (paymentIntentId) {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
      }
      const stripe = new Stripe(secretKey);
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== 'succeeded') {
        return res.status(400).json({ error: 'payment_not_succeeded' });
      }
      const md = pi.metadata || {};
      if (!email && md.email) email = String(md.email).trim();
      if ((!vin || vin === 'PENDING') && md.vin) vin = String(md.vin).trim();
      if ((planIndex === undefined || planIndex === null || planIndex === '') && md.planIndex !== undefined) {
        planIndex = md.planIndex;
      }
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    if (!vin || vin.length < 6) {
      vin = 'PENDING';
    }

    const col = getDb().collection('purchases');
    if (paymentIntentId) {
      const existing = await findByPaymentIntent(col, paymentIntentId);
      if (existing) {
        return res.status(200).json({ token: existing.token, orderId: existing.orderId, existing: true, refunded: existing.refunded });
      }
    }

    const pi = Math.max(0, Math.min(2, Number(planIndex) || 0));
    const reportsTotal = pi + 1;
    const token = crypto.randomBytes(24).toString('base64url');
    const orderId = generateOrderId();

    await col.doc(token).set({
      orderId,
      email,
      reportsTotal,
      reportsUsed: 0,
      usedVins: [],
      paymentIntentId: paymentIntentId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ token, orderId });
  } catch (err) {
    console.error('[create-purchase] ERROR:', err.message, err.code);
    captureError(err, { context: 'create-purchase', email, planIndex, paymentIntentId });
    return res.status(500).json({ error: 'Failed to create purchase: ' + err.message });
  }
}
