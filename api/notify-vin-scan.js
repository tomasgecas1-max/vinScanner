/**
 * Praneša savininkui apie VIN skenavimo bandymą.
 * POST { vin, source?, email?, orderId? }
 */
import { captureError } from './_sentry.js';
import { sendOwnerEmail } from './_ownerMail.js';

const SOURCE_LABELS = {
  home: 'Pagrindinis puslapis (Tikrinti)',
  paid: 'Po mokėjimo / ataskaita',
};

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

  const vin = String(body?.vin || '').trim().toUpperCase().slice(0, 50);
  if (vin.length < 6) {
    return res.status(400).json({ error: 'vin required' });
  }

  const source = SOURCE_LABELS[body?.source] ? body.source : 'home';
  const email = String(body?.email || '').trim().slice(0, 200);
  const orderId = String(body?.orderId || '').trim().slice(0, 40);

  try {
    await sendOwnerEmail({
      subject: `VIN skenavimas (${vin})`,
      html: `
        <p>Bandymas skenuoti VIN per vinscanner.eu.</p>
        <p><strong>VIN:</strong> ${vin}</p>
        <p><strong>Kur:</strong> ${SOURCE_LABELS[source]}</p>
        ${email ? `<p><strong>Kliento el. paštas:</strong> ${email}</p>` : ''}
        ${orderId ? `<p><strong>Užsakymas:</strong> ${orderId}</p>` : ''}
      `,
    });
    return res.status(200).json({ success: true });
  } catch (e) {
    captureError(e, { context: 'notify-vin-scan', vin });
    return res.status(500).json({ error: 'Notify failed' });
  }
}
