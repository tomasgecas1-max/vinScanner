/**
 * Sukuria pirkimą – neprisijungusiam vartotojui, kuris įsigijo kelias ataskaitas.
 * POST { email, planIndex, vin, paymentIntentId? }
 * planIndex: 0=1 ataskaita, 1=2, 2=3. reportsTotal = planIndex + 1.
 * Grąžina { token, orderId } – nuoroda: /?token=XXX
 */
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

  const { email, planIndex, vin, paymentIntentId } = body;
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  if (!vin || typeof vin !== 'string' || vin.trim().length < 6) {
    return res.status(400).json({ error: 'vin required' });
  }

  const pi = Math.max(0, Math.min(2, Number(planIndex) || 0));
  const reportsTotal = pi + 1;
  
  if (reportsTotal <= 1) {
    return res.status(400).json({ error: 'Only for plans with 2+ reports' });
  }

  try {
    const token = crypto.randomBytes(24).toString('base64url');
    const orderId = generateOrderId();
    const col = getDb().collection('purchases');

    await col.doc(token).set({
      orderId,
      email: String(email).trim(),
      reportsTotal,
      reportsUsed: 1,
      usedVins: [String(vin).trim()],
      paymentIntentId: paymentIntentId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ token, orderId });
  } catch (err) {
    console.error('[create-purchase] FIREBASE ERROR:', err.message, err.code);
    captureError(err, { context: 'create-purchase', email, planIndex });
    return res.status(500).json({ error: 'Failed to create purchase: ' + err.message });
  }
}
