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

  console.log('[get-purchase-by-email] Request:', req.method, req.query);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const email = req.query?.email?.trim?.();
  console.log('[get-purchase-by-email] Looking for email:', email);
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log('[get-purchase-by-email] Invalid email');
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const snap = await getDb()
      .collection('purchases')
      .where('email', '==', email)
      .get();

    console.log('[get-purchase-by-email] Found documents:', snap.size);

    if (snap.empty) {
      console.log('[get-purchase-by-email] No documents found for email:', email);
      return res.status(404).json({ error: 'No purchase found' });
    }

    let best = null;
    let bestRemaining = -1;

    snap.docs.forEach((doc) => {
      const d = doc.data();
      const reportsTotal = d?.reportsTotal ?? 1;
      const reportsUsed = d?.reportsUsed ?? 0;
      const reportsRemaining = Math.max(0, reportsTotal - reportsUsed);
      console.log('[get-purchase-by-email] Doc:', doc.id, { reportsTotal, reportsUsed, reportsRemaining });
      if (reportsRemaining > 0 && reportsRemaining > bestRemaining) {
        bestRemaining = reportsRemaining;
        best = {
          token: doc.id,
          orderId: d?.orderId ?? null,
          reportsTotal,
          reportsUsed,
          reportsRemaining,
          usedVins: Array.isArray(d?.usedVins) ? d.usedVins : [],
          paymentIntentId: d?.paymentIntentId ?? null,
        };
      }
    });

    if (!best) {
      console.log('[get-purchase-by-email] No purchase with remaining reports');
      return res.status(404).json({ error: 'No purchase with remaining reports' });
    }

    console.log('[get-purchase-by-email] SUCCESS - returning:', best.token, 'orderId:', best.orderId, 'remaining:', best.reportsRemaining);
    return res.status(200).json({
      token: best.token,
      orderId: best.orderId,
      email,
      reportsTotal: best.reportsTotal,
      reportsUsed: best.reportsUsed,
      reportsRemaining: best.reportsRemaining,
      usedVins: best.usedVins,
      paymentIntentId: best.paymentIntentId,
    });
  } catch (err) {
    console.error('[get-purchase-by-email] ERROR:', err.message, err.code);
    return res.status(500).json({ error: 'Failed to get purchase: ' + err.message });
  }
}
