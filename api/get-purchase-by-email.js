/**
 * Gauna pirkimo info pagal prisijungusio vartotojo el. paštą.
 * GET ?email=xxx
 * Grąžina { token, email, reportsTotal, reportsUsed, reportsRemaining, usedVins }
 * arba 404 jei nerasta pirkimo su likusiais ataskaitomis.
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

  const email = req.query?.email?.trim?.();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const snap = await getDb()
    .collection('purchases')
    .where('email', '==', email)
    .get();

  if (snap.empty) {
    return res.status(404).json({ error: 'No purchase found' });
  }

  let best = null;
  let bestRemaining = -1;

  snap.docs.forEach((doc) => {
    const d = doc.data();
    const reportsTotal = d?.reportsTotal ?? 1;
    const reportsUsed = d?.reportsUsed ?? 0;
    const reportsRemaining = Math.max(0, reportsTotal - reportsUsed);
    if (reportsRemaining > 0 && reportsRemaining > bestRemaining) {
      bestRemaining = reportsRemaining;
      best = {
        token: doc.id,
        reportsTotal,
        reportsUsed,
        reportsRemaining,
        usedVins: Array.isArray(d?.usedVins) ? d.usedVins : [],
      };
    }
  });

  if (!best) {
    return res.status(404).json({ error: 'No purchase with remaining reports' });
  }

  return res.status(200).json({
    token: best.token,
    email,
    reportsTotal: best.reportsTotal,
    reportsUsed: best.reportsUsed,
    reportsRemaining: best.reportsRemaining,
    usedVins: best.usedVins,
  });
}
