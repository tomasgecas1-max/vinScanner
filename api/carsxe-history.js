/**
 * CarsXE Vehicle History API proxy.
 * CORS: naršyklė negali kreiptis tiesiai į api.carsxe.com.
 * GET /api/carsxe-history?vin=XXX
 * @see https://api.carsxe.com/docs/v1/history
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const vin = req.query?.vin?.trim();
  const apiKey = process.env.CARSXE_API_KEY || process.env.VITE_CARSXE_API_KEY;
  if (!vin || !apiKey) {
    return res.status(400).json({
      success: false,
      error: !apiKey ? 'CARSXE_API_KEY not set' : 'vin required',
    });
  }
  try {
    const r = await fetch(
      `https://api.carsxe.com/history?key=${encodeURIComponent(apiKey)}&vin=${encodeURIComponent(vin)}`
    );
    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({
      success: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
