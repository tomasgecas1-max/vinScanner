/**
 * VIN ataskaitų talpykla – Firestore vinReportCache kolekcija.
 * Jei ataskaita jau buvo sumokėta ir sugeneruota < 3 mėn., grąžinama iš talpyklos (be API).
 * GET ?vin=XXX – grąžina { report } jei talpykloje ir < 3 mėn.
 * POST { vin, report } – įrašo ataskaitą į talpyklą.
 */
import admin from 'firebase-admin';

const CACHE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 3 mėn.

function getDb() {
  if (admin.apps.length === 0) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!key) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY not configured');
    }
    const cred = typeof key === 'string' ? JSON.parse(key) : key;
    admin.initializeApp({ credential: admin.credential.cert(cred) });
  }
  return admin.firestore();
}

function normalizeVin(vin) {
  return String(vin || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 20) || 'unknown';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDb();
    const col = db.collection('vinReportCache');

    if (req.method === 'GET') {
      const vin = req.query?.vin;
      if (!vin || typeof vin !== 'string' || vin.trim().length < 6) {
        return res.status(400).json({ error: 'vin required' });
      }
      const docId = normalizeVin(vin);
      const docRef = col.doc(docId);
      const snap = await docRef.get();
      if (!snap.exists) {
        return res.status(404).json({ error: 'not in cache' });
      }
      const data = snap.data();
      const generatedAt = data?.generatedAt?.toMillis?.() ?? 0;
      const age = Date.now() - generatedAt;
      if (age > CACHE_MAX_AGE_MS) {
        return res.status(404).json({ error: 'cache expired' });
      }
      const report = data?.report;
      if (!report) {
        return res.status(404).json({ error: 'invalid cache' });
      }
      return res.status(200).json({ report });
    }

    if (req.method === 'POST') {
      let body;
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch {
        return res.status(400).json({ error: 'Invalid JSON' });
      }
      const { vin, report } = body;
      if (!vin || typeof vin !== 'string' || vin.trim().length < 6) {
        return res.status(400).json({ error: 'vin required' });
      }
      if (!report || typeof report !== 'object') {
        return res.status(400).json({ error: 'report required' });
      }
      const docId = normalizeVin(vin);
      await col.doc(docId).set({
        vin: String(vin).trim(),
        report,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return res.status(502).json({ error: message });
  }
}
