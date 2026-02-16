/**
 * Vercel serverless – siunčia el. laišką klientui po sėkmingo mokėjimo.
 * Naudoja Hostinger SMTP (arba bet kurį SMTP).
 * POST: { to, vin }
 */
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromAddr = process.env.SMTP_FROM || user;

  if (!host || !user || !pass) {
    return res.status(500).json({ error: 'SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS)' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { to, vin, pdfBase64, token } = body;
  if (!to || typeof to !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  const vinStr = String(vin || '').trim().slice(0, 50);

  const attachments = [];
  if (pdfBase64 && typeof pdfBase64 === 'string' && pdfBase64.length > 0) {
    try {
      const buf = Buffer.from(pdfBase64, 'base64');
      if (buf.length > 0 && buf.length < 10 * 1024 * 1024) {
        attachments.push({
          filename: `vinscanner-ataskaita-${vinStr || 'report'}-${new Date().toISOString().slice(0, 10)}.pdf`,
          content: buf,
        });
      }
    } catch (_) {}
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const subject = `Jūsų VIN ataskaita paruošta – vinscanner.eu${vinStr ? ` (${vinStr})` : ''}`;
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://vinscanner.eu';
  const reportsLink = token ? `<p><strong>Norėdami naudoti likusias ataskaitas, paspauskite:</strong><br/><a href="${baseUrl}/?token=${encodeURIComponent(token)}" style="color:#4f46e5;font-weight:bold;">${baseUrl}/?token=${String(token).slice(0, 12)}...</a></p>` : '';
  const html = `
    <p>Sveikiname!</p>
    <p>Jūsų VIN <strong>${vinStr || '–'}</strong> ataskaita paruošta${attachments.length > 0 ? ' – PDF prisegtas prie šio laiško.' : '.'}</p>
    <p>Peržiūrėkite ją svetainėje <a href="${baseUrl}">vinscanner.eu</a>.</p>
    ${reportsLink}
    <p>Klausimams rašykite: <a href="mailto:info@vinscanner.eu">info@vinscanner.eu</a></p>
    <p>– vinscanner.eu komanda</p>
  `;

  try {
    await transporter.sendMail({
      from: `vinscanner.eu <${fromAddr}>`,
      to,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    return res.status(200).json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return res.status(502).json({ error: message });
  }
}
