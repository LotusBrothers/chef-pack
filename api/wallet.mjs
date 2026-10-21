import {authenticate,database,endpoint} from '../backend/http.mjs';
export default endpoint('GET',async(req)=>{
  const token=await authenticate(req);
  return {mode:'mock',pulls:await database('/rest/v1/pack_pulls?select=id,order_id,restaurant_label,face_value_cents,mode,delivery_status,created_at&order=created_at.desc&limit=100',token)};
});
