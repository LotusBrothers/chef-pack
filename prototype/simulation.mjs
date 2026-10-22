// Free play only: play credits with no cash value, stored in this browser. Never a money ledger.
// Loop: spend COST credits -> pull one restaurant card -> redeem it (keep it in the collection)
// or sell it back for SELL_BACK of its value in play credits. Each card is decided once.
export const COST = 20;
export const SELL_BACK = 0.9;
export const TIERS = Object.freeze([
  {id:'base',name:'Base',chance:75,credits:20},
  {id:'foil',name:'Foil',chance:18,credits:30},
  {id:'holo',name:'Holo',chance:6,credits:40},
  {id:'black',name:'Black Label',chance:1,credits:100}
]);
export const sellValue = credits => Math.round(credits * SELL_BACK);
const STATUS = ['open','redeemed','sold'];
const KEY = 'chefpack.free-simulation.v2';
export const newGame = () => ({version:2,balance:100,plays:0,history:[]});
export function loadGame(storage = globalThis.localStorage) {
  try {
    const s = JSON.parse(storage.getItem(KEY));
    if (s?.version !== 2 || !Number.isSafeInteger(s.balance) || s.balance < 0 || !Number.isSafeInteger(s.plays) || s.plays < 0 || !Array.isArray(s.history) || s.history.length > 30) return newGame();
    if (s.history.some(r => !/^[a-z0-9-]+$/.test(r.brand?.id || '') || typeof r.brand.name !== 'string' || !Number.isSafeInteger(r.number) || !STATUS.includes(r.status) || !TIERS.some(t => t.id === r.tier?.id && t.name === r.tier.name && t.credits === r.tier.credits))) return newGame();
    return s;
  } catch { return newGame(); }
}
export function saveGame(state, storage = globalThis.localStorage) {
  try { storage.setItem(KEY, JSON.stringify(state)); return true; } catch { return false; }
}
// Rejection sampling avoids modulo bias. Used only for valueless local play.
export function randomIndex(size) {
  if (!Number.isInteger(size) || size < 1) throw new Error('Empty choice set');
  const n = new Uint32Array(1), limit = Math.floor(2 ** 32 / size) * size;
  do { crypto.getRandomValues(n); } while (n[0] >= limit);
  return n[0] % size;
}
export function tierFor(roll) {
  let edge = 0;
  for (const t of TIERS) { edge += t.chance; if (roll < edge) return t; }
  return TIERS[TIERS.length - 1];
}
// Spends COST and adds one undecided card. Credits change again only when the card is sold back.
export function playRound(state, brands, draw = randomIndex) {
  if (state.balance < COST || !brands.length) return null;
  const t = tierFor(draw(100));
  const b = brands[draw(brands.length)];
  const brand = {id:b.id,name:b.name,art:b.art,bg:b.bg,ink:b.ink,orbit:b.orbit,accent:b.accent};
  const tier = {id:t.id,name:t.name,credits:t.credits};
  return {...state,balance:state.balance-COST,plays:state.plays+1,history:[{brand,tier,number:state.plays+1,status:'open'},...state.history].slice(0,30)};
}
// Redeem or sell back one undecided card. Returns null if the card is missing or already decided.
export function decide(state, number, action) {
  const card = state.history.find(r => r.number === number);
  if (!card || card.status !== 'open' || !['redeem','sell'].includes(action)) return null;
  const status = action === 'redeem' ? 'redeemed' : 'sold';
  return {...state,
    balance: state.balance + (action === 'sell' ? sellValue(card.tier.credits) : 0),
    history: state.history.map(r => r === card ? {...r,status} : r)};
}
