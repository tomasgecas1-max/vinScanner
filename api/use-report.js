/**
 * Sunaudoja vieną ataskaitą iš pirkimo (token).
 * POST { token, vin }
 * Grąžina { success: true, reportsRemaining } arba klaidą.
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

  const { token, vin } = body;
  if (!token || typeof token !== 'string' || token.trim().length < 10) {
    return res.status(400).json({ error: 'token required' });
  }
  if (!vin || typeof vin !== 'string' || vin.trim().length < 6) {
    return res.status(400).json({ error: 'vin required' });
  }

  const col = getDb().collection('purchases');
  const ref = col.doc(token.trim());
  const snap = await ref.get();

  if (!snap.exists) {
    return res.status(404).json({ error: 'Purchase not found' });
  }

  const d = snap.data();
  const reportsTotal = d?.reportsTotal ?? 1;
  const reportsUsed = d?.reportsUsed ?? 0;
  const reportsRemaining = reportsTotal - reportsUsed;
  const usedVins = Array.isArray(d?.usedVins) ? [...d.usedVins] : [];

  if (reportsRemaining <= 0) {
    return res.status(400).json({ error: 'No reports remaining' });
  }

  const vinStr = String(vin).trim();
  await ref.update({
    reportsUsed: admin.firestore.FieldValue.increment(1),
    usedVins: admin.firestore.FieldValue.arrayUnion(vinStr),
  });

  return res.status(200).json({
    success: true,
    reportsRemaining: reportsRemaining - 1,
  });
}
