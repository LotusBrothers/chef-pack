import {ApiError,authenticate,database,endpoint} from '../backend/http.mjs';
export default endpoint('POST',async(req)=>{
  const token=await authenticate(req);
  let body;
  try { body=typeof req.body==='string'?JSON.parse(req.body):req.body; }
  catch { throw new ApiError(400,'invalid_json'); }
  const key=req.headers?.['idempotency-key'];
  if (!body || typeof body.pack_id!=='string' || !/^[a-z0-9-]{1,64}$/.test(body.pack_id) ||
      typeof key!=='string' || !/^[A-Za-z0-9_-]{8,128}$/.test(key) ||
      Object.keys(body).some(k=>k!=='pack_id')) throw new ApiError(400,'invalid_order_request');
  return database('/rest/v1/rpc/create_mock_pull',token,{method:'POST',body:JSON.stringify({p_pack_id:body.pack_id,p_idempotency_key:key})});
});
