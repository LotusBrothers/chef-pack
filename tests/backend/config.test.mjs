import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../../api/config.mjs';
test('public config exposes only publishable keys and fails closed',async()=>{
 const old={...process.env};
 const response=()=>({setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;}});
 try{
  process.env.PAYMENTS_MODE='mock';process.env.GIFT_CARDS_MODE='mock';
  process.env.SUPABASE_URL='https://umhbsphrgplijlrkzgps.supabase.co';
  for(const key of ['sb_publishable_test123','sb_secret_do_not_expose','eyJlegacy_service_role']){
   process.env.SUPABASE_PUBLISHABLE_KEY=key;
   const r=response();await handler({method:'GET'},r);
   assert.equal(r.code,key.startsWith('sb_publishable_')?200:503);
   if(r.code===200)assert.deepEqual(Object.keys(r.body).sort(),['supabase_publishable_key','supabase_url']);
   else assert.ok(!JSON.stringify(r.body).includes(key));
  }
  process.env.PAYMENTS_MODE='live';const r=response();await handler({method:'GET'},r);assert.equal(r.code,503);
 }finally{process.env=old;}
});
