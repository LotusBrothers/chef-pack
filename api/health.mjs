export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const safe = process.env.PAYMENTS_MODE === 'mock' && process.env.GIFT_CARDS_MODE === 'mock';
  return res.status(safe ? 200 : 503).json({
    service: 'chef-pack', status: safe ? 'ok' : 'unsafe_configuration',
    payments: 'mock_only', giftCards: 'mock_only',
    database: 'not_probed'
  });
}
