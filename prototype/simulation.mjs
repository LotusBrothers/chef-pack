export const COST = 10;
export const REWARDS = Object.freeze([
  {name:'Classic',chance:70,credits:5},
  {name:'Signature',chance:25,credits:15},
  {name:'Chef’s special',chance:5,credits:50}
]);
const KEY = 'chefpack.free-simulation.v1';
export const newGame = () => ({version:1,balance:100,plays:0,history:[]});
export function loadGame(storage = globalThis.localStorage) {
  try {
    const s = JSON.parse(storage.getItem(KEY));
    if (s?.version !== 1 || !Number.isSafeInteger(s.balance) || s.balance < 0 || !Number.isSafeInteger(s.plays) || s.plays < 0 || !Array.isArray(s.history) || s.history.length > 30) return newGame();
    if (s.history.some(r => !/^[a-z0-9-]+$/.test(r.brand?.id || '') || typeof r.brand.name !== 'string' || !REWARDS.some(v => v.name === r.reward?.name && v.credits === r.reward.credits))) return newGame();
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
export function playRound(state, brands, draw = randomIndex) {
  if (state.balance < COST || !brands.length) return null;
  const roll = draw(100), reward = roll < 70 ? REWARDS[0] : roll < 95 ? REWARDS[1] : REWARDS[2];
  const b = brands[draw(brands.length)];
  const brand = {id:b.id,name:b.name,art:b.art,bg:b.bg,ink:b.ink,orbit:b.orbit,accent:b.accent};
  return {...state,balance:state.balance-COST+reward.credits,plays:state.plays+1,history:[{brand,reward,number:state.plays+1},...state.history].slice(0,30)};
}
