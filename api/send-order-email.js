/**
 * Vercel serverless – siunčia el. laišką klientui po sėkmingo mokėjimo.
 * Naudoja Hostinger SMTP (arba bet kurį SMTP).
 * POST: { to, vin }
 */
import nodemailer from 'nodemailer';
import { captureError } from './_sentry.js';

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

  const { to, vin, pdfBase64, token, reportsRemaining, orderId } = body;
  if (!to || typeof to !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  const vinStr = String(vin || '').trim().slice(0, 50);
  const orderIdStr = orderId ? String(orderId).trim() : null;

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

  const subject = `Jūsų VIN ataskaita paruošta – vinscanner.eu${orderIdStr ? ` [${orderIdStr}]` : ''}${vinStr ? ` (${vinStr})` : ''}`;
  const baseUrl = 'https://vinscanner.eu';
  const n = Math.max(0, Number(reportsRemaining) || 0);
  const reportsLink = token && n > 0
    ? `
    <div style="margin:24px 0;padding:20px;background:#eef2ff;border:2px solid #4f46e5;border-radius:16px;">
      <p style="margin:0 0 12px 0;font-size:18px;font-weight:bold;color:#1e1b4b;">Turite dar ${n} ataskait${n === 1 ? 'ą' : 'as'}!</p>
      <p style="margin:0 0 16px 0;font-size:15px;color:#3730a3;">Norėdami sugeneruoti kit${n === 1 ? 'ą' : 'as'} VIN ataskait${n === 1 ? 'ą' : 'as'}, atidarykite šią nuorodą ir įveskite naują VIN kodą:</p>
      <p style="margin:0;"><a href="${baseUrl}/?token=${encodeURIComponent(token)}" style="display:inline-block;padding:14px 24px;background:#4f46e5;color:white;font-weight:bold;font-size:16px;text-decoration:none;border-radius:12px;">Peržiūrėti likusias ataskaitas →</a></p>
      <p style="margin:16px 0 0 0;font-size:12px;color:#6366f1;">Arba nukopijuokite: ${baseUrl}/?token=${String(token).slice(0, 20)}...</p>
    </div>`
    : n > 0 && !token
    ? `
    <div style="margin:24px 0;padding:20px;background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;">
      <p style="margin:0 0 12px 0;font-size:18px;font-weight:bold;color:#78350f;">Turite dar ${n} ataskait${n === 1 ? 'ą' : 'as'}!</p>
      <p style="margin:0;font-size:15px;color:#92400e;">Deja, techninės klaidos dėka nuoroda negali būti rodoma. Susisiekite su mumis: <a href="mailto:info@vinscanner.eu" style="color:#d97706;font-weight:bold;">info@vinscanner.eu</a> – mes padėsime pasiekti likusias ataskaitas.</p>
    </div>`
    : '';
  const orderInfo = orderIdStr
    ? `<p style="margin:0 0 8px 0;font-size:14px;color:#64748b;">Užsakymo Nr.: <strong style="color:#1e293b;">${orderIdStr}</strong></p>`
    : '';
  const html = `
    <p>Sveikiname!</p>
    ${orderInfo}
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
    captureError(e, { context: 'send-order-email', to, vin: vinStr });
    return res.status(502).json({ error: message });
  }
}
