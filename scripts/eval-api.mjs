// Uses dedicated test accounts only. No tokens are printed or written.
import {randomUUID} from 'node:crypto';
const base=process.env.CHEFPACK_BASE_URL||'https://chef-pack-dev.vercel.app';
if(!base.startsWith('https://')&&!base.startsWith('http://localhost:'))throw Error('Use HTTPS or localhost');
const results=[];
const request=async(path,token,options={})=>{
 const response=await fetch(new URL(path,base),{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...options.headers},redirect:'manual',signal:AbortSignal.timeout(15000)});
 let body;try{body=await response.json();}catch{throw Error('Non-JSON response: deployment access/authentication may be required');}
 return {status:response.status,body};
};
const assert=(ok,message)=>{if(!ok)throw Error(message);};
async function check(id,fn){try{await fn();results.push({id,status:'pass'});}catch(e){results.push({id,status:'fail',reason:e.message});throw e;}}
try {
 await check('HEALTH',async()=>{const r=await request('/api/health');assert(r.status===200&&r.body.payments==='mock_only'&&r.body.giftCards==='mock_only','Mock-mode health required');});
 await check('CATALOG',async()=>{const r=await request('/api/packs');assert(r.status===200&&r.body.mode==='mock'&&r.body.packs.some(p=>p.id==='quick-bite'&&p.price_cents===1500),'Expected database catalog');});
 if(process.argv.includes('--write-tests')){
  const a=process.env.CHEFPACK_TOKEN_A,b=process.env.CHEFPACK_TOKEN_B;
  assert(a&&b&&a!==b,'Provide two distinct dedicated test-user access tokens');
  const key='eval-'+randomUUID();
  const options={method:'POST',headers:{'Idempotency-Key':key},body:JSON.stringify({pack_id:'quick-bite'})};
  let first;
  await check('AUTH_DENIAL',async()=>{const r=await request('/api/orders',null,options);assert(r.status===401&&r.body.error==='authentication_required','App must reject unsigned orders');});
  await check('OPEN',async()=>{first=await request('/api/orders',a,options);assert(first.status===200&&first.body.mode==='mock'&&first.body.order.amount_cents===1500&&first.body.pull.delivery_status==='simulated','Mock order failed');});
  await check('RETRY',async()=>{const r=await request('/api/orders',a,options);assert(r.status===200&&r.body.order.id===first.body.order.id&&r.body.pull.id===first.body.pull.id,'Duplicate logical purchase');});
  await check('KEY_CONFLICT',async()=>{const r=await request('/api/orders',a,{...options,body:JSON.stringify({pack_id:'sit-down'})});assert(r.status===400,'Same key/different pack must fail');});
  await check('WALLET',async()=>{const r=await request('/api/wallet',a);assert(r.status===200&&r.body.pulls.filter(p=>p.id===first.body.pull.id).length===1,'Expected exactly one wallet item');});
  await check('ISOLATION',async()=>{const r=await request('/api/wallet',b);assert(r.status===200&&!r.body.pulls.some(p=>p.id===first.body.pull.id),'Different user can see private pull (or token invalid)');});
 }
} catch {process.exitCode=1;}
console.log(JSON.stringify({scope:'api_only',base,write_tests:process.argv.includes('--write-tests'),results,browser_verification:'not_run'},null,2));
