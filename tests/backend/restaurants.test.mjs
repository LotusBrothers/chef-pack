import test from 'node:test';
import assert from 'node:assert/strict';
import restaurants from '../../api/restaurants.mjs';
const response=()=>({setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}});

test('restaurant directory is public metadata, read-only and fails closed',async()=>{
  const previous={...process.env},fetch=globalThis.fetch;
  Object.assign(process.env,{PAYMENTS_MODE:'mock',GIFT_CARDS_MODE:'mock',SUPABASE_URL:'https://example.invalid',SUPABASE_PUBLISHABLE_KEY:'publishable-test'});
  try{
    const requests=[];
    globalThis.fetch=async(url,options)=>{requests.push({url:String(url),options});return Response.json(String(url).includes('pack_catalog')?[{id:'quick-bite',price_cents:1500}]:[{id:'little-caesars',redemption_available:false}]);};
    let r=response();await restaurants({method:'POST'},r);assert.equal(r.code,405);assert.equal(requests.length,0);
    r=response();await restaurants({method:'GET'},r);assert.equal(r.code,200);assert.equal(r.body.redemption_available,false);assert.equal(r.body.catalog_type,'restaurant_directory');assert.equal(r.body.tiers[0].price_cents,1500);assert.equal(r.body.restaurants[0].id,'little-caesars');
    assert.equal(requests.length,2);assert.ok(requests.every(x=>!x.options.headers.Authorization));assert.ok(requests[1].url.includes('active=eq.true'));assert.ok(requests[1].url.includes('limit=200'));
    globalThis.fetch=async()=>Response.json({message:'unavailable'},{status:503});
    r=response();await restaurants({method:'GET'},r);assert.equal(r.code,503);assert.deepEqual(r.body,{error:'database_request_failed'});
    process.env.PAYMENTS_MODE='live';globalThis.fetch=()=>{throw new Error('must not contact database in live mode');};
    r=response();await restaurants({method:'GET'},r);assert.equal(r.code,503);assert.deepEqual(r.body,{error:'unsafe_configuration'});
  }finally{process.env=previous;globalThis.fetch=fetch;}
});
