export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-MBX-APIKEY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path, ...queryParams } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const binancePath = Array.isArray(path) ? path.join('/') : path;
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `https://api.binance.com/${binancePath}${queryString ? '?' + queryString : ''}`;

  try {
    const binanceRes = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers['x-mbx-apikey'] ? { 'X-MBX-APIKEY': req.headers['x-mbx-apikey'] } : {})
      },
      ...(req.method !== 'GET' && req.body ? { body: JSON.stringify(req.body) } : {})
    });

    const data = await binanceRes.json();
    return res.status(binanceRes.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
