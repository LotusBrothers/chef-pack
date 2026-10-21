// Local contract harness. NOT the real backend: mirrors docs/FRONTEND-HANDOFF.md for UI testing.
// /api/packs and /api/health proxy the deployed test API; auth, orders and wallet are local stand-ins with fault injection.
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { randomUUID } from 'node:crypto';

const ROOT = process.argv[2], PORT = +process.argv[3] || 5317, UPSTREAM = 'https://chef-pack-dev.vercel.app';
const users = new Map(), tokens = new Map(), orders = new Map(), pulls = [];
const fault = { orders: '', packs: '', wallet: '', confirm: false };
const log = [];
const json = (res, code, body) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
const body = req => new Promise(r => { let d = ''; req.on('data', c => d += c); req.on('end', () => { try { r(JSON.parse(d || '{}')); } catch { r(null); } }); });
const session = u => { const t = 'tok_' + randomUUID().replace(/-/g, ''), rt = 'rt_' + randomUUID(); tokens.set(t, { uid: u.id, exp: Date.now() + 3600e3 }); tokens.set(rt, { uid: u.id, refresh: true }); return { access_token: t, refresh_token: rt, expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, token_type: 'bearer', user: { id: u.id, email: u.email } }; };
const who = req => { const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); const t = m && tokens.get(m[1]); return t && !t.refresh && t.exp > Date.now() ? t.uid : null; };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  if (p.startsWith('/api/') || p.startsWith('/mock-auth/')) log.push({ t: new Date().toISOString(), m: req.method, p, key: req.headers['idempotency-key'] || undefined, auth: !!req.headers.authorization });
  if (p === '/__fault') { for (const [k, v] of url.searchParams) fault[k] = v === 'true' ? true : v === 'false' ? false : v; return json(res, 200, fault); }
  if (p === '/__log') return json(res, 200, { log, orders: [...orders.values()].length, pulls: pulls.length });
  if (p === '/__expire') { for (const v of tokens.values()) v.exp = 0; return json(res, 200, { expired: true }); }
  if (p === '/__expire_all') { tokens.clear(); return json(res, 200, { cleared: true }); }

  // Supabase Auth stand-in
  if (p.startsWith('/mock-auth/auth/v1/')) {
    if (req.headers.apikey !== 'local-test-key') return json(res, 401, { message: 'No API key found in request' });
    const a = p.slice('/mock-auth/auth/v1/'.length), b = req.method === 'POST' ? await body(req) : {};
    if (a === 'signup') {
      if (users.has(b.email)) return json(res, 200, { id: randomUUID(), email: b.email });
      const u = { id: randomUUID(), email: b.email, password: b.password, confirmed: !fault.confirm }; users.set(b.email, u);
      return fault.confirm ? json(res, 200, { id: u.id, email: u.email, confirmation_sent_at: new Date().toISOString() }) : json(res, 200, session(u));
    }
    if (a === 'token' && url.searchParams.get('grant_type') === 'password') {
      const u = users.get(b.email);
      if (!u || u.password !== b.password) return json(res, 400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' });
      if (!u.confirmed) return json(res, 400, { code: 400, error_code: 'email_not_confirmed', msg: 'Email not confirmed' });
      return json(res, 200, session(u));
    }
    if (a === 'token' && url.searchParams.get('grant_type') === 'refresh_token') {
      const t = tokens.get(b.refresh_token); if (!t?.refresh) return json(res, 400, { error_code: 'refresh_token_not_found', msg: 'Invalid Refresh Token' });
      tokens.delete(b.refresh_token); const u = [...users.values()].find(x => x.id === t.uid); return json(res, 200, session(u));
    }
    if (a === 'user') { const uid = who(req); const u = [...users.values()].find(x => x.id === uid); return u ? json(res, 200, { id: u.id, email: u.email }) : json(res, 401, { msg: 'invalid JWT' }); }
    if (a === 'logout') { const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (m) tokens.delete(m[1]); res.writeHead(204); return res.end(); }
    return json(res, 404, { msg: 'not found' });
  }

  if (p === '/api/packs' || p === '/api/health') {
    if (p === '/api/packs' && fault.packs === '503') return json(res, 503, { error: 'database_unreachable' });
    try { const r = await fetch(UPSTREAM + p); res.writeHead(r.status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return res.end(await r.text()); }
    catch { return json(res, 503, { error: 'upstream_unreachable' }); }
  }
  if (p === '/api/orders') {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return json(res, 405, { error: 'method_not_allowed' }); }
    if (fault.orders === '503') return json(res, 503, { error: 'database_request_failed' });
    if (fault.orders === 'hang') return; // client times out
    const uid = who(req); if (!uid) return json(res, 401, { error: 'authentication_required' });
    const b = await body(req), key = req.headers['idempotency-key'];
    if (!b || typeof b.pack_id !== 'string' || !/^[A-Za-z0-9_-]{8,128}$/.test(key || '') || Object.keys(b).some(k => k !== 'pack_id')) return json(res, 400, { error: 'invalid_order_request' });
    const prices = { 'quick-bite': 1500, 'sit-down': 4000, 'treat-yourself': 10000 };
    if (!prices[b.pack_id]) return json(res, 400, { error: 'invalid_order_request' });
    const k = uid + ':' + key; let o = orders.get(k);
    if (o && o.order.pack_id !== b.pack_id) return json(res, 400, { error: 'invalid_order_request' });
    if (!o) {
      const order = { id: randomUUID(), user_id: uid, pack_id: b.pack_id, amount_cents: prices[b.pack_id], currency: 'usd', status: 'fulfilled', mode: 'mock', idempotency_key: key, created_at: new Date().toISOString() };
      const pull = { id: randomUUID(), order_id: order.id, user_id: uid, restaurant_label: 'Demo restaurant — not redeemable', face_value_cents: order.amount_cents, mode: 'mock', delivery_status: 'simulated', created_at: order.created_at };
      o = { mode: 'mock', order, pull }; orders.set(k, o); pulls.unshift(pull);
    }
    if (fault.orders === 'drop') { fault.orders = ''; return req.socket.destroy(); } // committed, response lost
    return json(res, 200, o);
  }
  if (p === '/api/wallet') {
    if (req.method !== 'GET') return json(res, 405, { error: 'method_not_allowed' });
    if (fault.wallet === '503') return json(res, 503, { error: 'database_request_failed' });
    const uid = who(req); if (!uid) return json(res, 401, { error: 'authentication_required' });
    return json(res, 200, { mode: 'mock', pulls: pulls.filter(x => x.user_id === uid).slice(0, 100).map(({ user_id, ...x }) => x) });
  }
  if (p.startsWith('/api/')) return json(res, 404, { error: 'not_found' });

  // Static files; the page's auth constants point at this stand-in.
  let f = join(ROOT, p === '/' ? 'prototype/index.html' : decodeURIComponent(p));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  let data = readFileSync(f);
  if (f.endsWith('.html')) data = data.toString()
    .replace('const AUTH_URL = "https://umhbsphrgplijlrkzgps.supabase.co";', `const AUTH_URL = "http://localhost:${PORT}/mock-auth";`)
    .replace('const AUTH_KEY = "";', 'const AUTH_KEY = "local-test-key";');
  const types = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.js': 'text/javascript' };
  res.writeHead(200, { 'Content-Type': types[extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(data);
}).listen(PORT, () => console.log('harness on http://localhost:' + PORT));
