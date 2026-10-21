export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({error:'method_not_allowed'});
  }
  if (process.env.PAYMENTS_MODE !== 'mock' || process.env.GIFT_CARDS_MODE !== 'mock') {
    return res.status(503).json({error:'unsafe_configuration'});
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return res.status(503).json({error:'database_not_configured'});
  try {
    const response = await fetch(new URL('/rest/v1/pack_catalog?select=id,name,price_cents,currency&active=eq.true&order=price_cents.asc',url), {
      headers:{apikey:key}, signal:AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error('catalog_unavailable');
    const packs = await response.json();
    return res.status(200).json({mode:'mock',packs});
  } catch {
    return res.status(503).json({error:'catalog_unavailable'});
  }
}
