import test from 'node:test';
import assert from 'node:assert/strict';
import orders from '../../api/orders.mjs';
import wallet from '../../api/wallet.mjs';
import packs from '../../api/packs.mjs';
const res=()=>({setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}});
test('API authorization, server pricing boundary, mock guard, and wallet forwarding',async()=>{
  const old={...process.env}, oldFetch=globalThis.fetch;
  process.env.PAYMENTS_MODE='mock';process.env.GIFT_CARDS_MODE='mock';
  process.env.SUPABASE_URL='https://example.invalid';process.env.SUPABASE_PUBLISHABLE_KEY='test';
  try {
    let calls=[];globalThis.fetch=async(url,opts)=>{calls.push({url:String(url),opts});return Response.json(String(url).includes('/auth/')?{id:'user-a'}:[]);};
    let r=res();await orders({method:'POST',headers:{},body:{pack_id:'quick-bite'}},r);assert.equal(r.code,401);assert.equal(calls.length,0);
    r=res();await orders({method:'POST',headers:{authorization:'Bearer token','idempotency-key':'order-123'},body:{pack_id:'quick-bite',amount_cents:1}},r);assert.equal(r.code,400);assert.equal(calls.length,1);
    r=res();await orders({method:'POST',headers:{authorization:'Bearer token','idempotency-key':'order-123'},body:{pack_id:'quick-bite'}},r);assert.equal(r.code,200);assert.deepEqual(JSON.parse(calls.at(-1).opts.body),{p_pack_id:'quick-bite',p_idempotency_key:'order-123'});
    r=res();await wallet({method:'GET',headers:{authorization:'Bearer token'}},r);assert.equal(r.code,200);assert.equal(calls.at(-1).opts.headers.Authorization,'Bearer token');
    process.env.PAYMENTS_MODE='live';const count=calls.length;r=res();await packs({method:'GET'},r);assert.equal(r.code,503);assert.equal(calls.length,count);
  } finally {process.env=old;globalThis.fetch=oldFetch;}
});
