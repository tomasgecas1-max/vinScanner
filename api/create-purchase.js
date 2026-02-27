/**
 * Sukuria pirkimą – neprisijungusiam vartotojui, kuris įsigijo kelias ataskaitas.
 * POST { email, planIndex, vin }
 * planIndex: 0=1 ataskaita, 1=2, 2=3. reportsTotal = planIndex + 1.
 * Grąžina { token } – nuoroda: /?token=XXX
 */
import admin from 'firebase-admin';
import crypto from 'crypto';

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

  console.log('[create-purchase] Request received:', req.method);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { email, planIndex, vin } = body;
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  if (!vin || typeof vin !== 'string' || vin.trim().length < 6) {
    return res.status(400).json({ error: 'vin required' });
  }

  const pi = Math.max(0, Math.min(2, Number(planIndex) || 0));
  const reportsTotal = pi + 1;
  console.log('[create-purchase] planIndex:', planIndex, 'pi:', pi, 'reportsTotal:', reportsTotal);
  
  if (reportsTotal <= 1) {
    console.log('[create-purchase] Rejected: only for 2+ reports');
    return res.status(400).json({ error: 'Only for plans with 2+ reports' });
  }

  try {
    const token = crypto.randomBytes(24).toString('base64url');
    console.log('[create-purchase] Generated token, saving to Firestore...');
    
    const col = getDb().collection('purchases');

    await col.doc(token).set({
      email: String(email).trim(),
      reportsTotal,
      reportsUsed: 1,
      usedVins: [String(vin).trim()],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('[create-purchase] SUCCESS - saved purchase for:', email, 'token:', token);
    return res.status(200).json({ token });
  } catch (err) {
    console.error('[create-purchase] FIREBASE ERROR:', err.message, err.code);
    return res.status(500).json({ error: 'Failed to create purchase: ' + err.message });
  }
}
