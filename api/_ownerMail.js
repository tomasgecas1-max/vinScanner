/**
 * Savininko pranešimai el. paštu (mokėjimai, VIN skenavimai).
 * Adresas: PAYMENT_NOTIFY_EMAIL → SMTP_FROM → SMTP_USER
 */
import nodemailer from 'nodemailer';

export function getNotifyEmail() {
  return process.env.PAYMENT_NOTIFY_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER || '';
}

export async function sendOwnerEmail({ subject, html }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromAddr = process.env.SMTP_FROM || user;
  const to = getNotifyEmail();
  if (!host || !user || !pass || !to) {
    throw new Error('SMTP or PAYMENT_NOTIFY_EMAIL not configured');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `vinscanner.eu <${fromAddr}>`,
    to,
    subject,
    html,
    text: html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
  });
}
