/**
 * Gauna pirkimo info pagal token.
 * GET ?token=XXX
 * Grąžina { email, reportsTotal, reportsUsed, reportsRemaining, usedVins }
 */
import admin from 'firebase-admin';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
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
  const reportsTotal = d?.reportsTotal ?? 1;
  const reportsUsed = d?.reportsUsed ?? 0;
  const reportsRemaining = Math.max(0, reportsTotal - reportsUsed);

  return res.status(200).json({
    orderId: d?.orderId ?? null,
    email: d?.email ?? '',
    reportsTotal,
    reportsUsed,
    reportsRemaining,
    usedVins: Array.isArray(d?.usedVins) ? d.usedVins : [],
    paymentIntentId: d?.paymentIntentId ?? null,
  });
}
