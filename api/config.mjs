import {ApiError,config,endpoint} from '../backend/http.mjs';
export default endpoint('GET',async()=>{
  const {url,key}=config();
  const parsed=new URL(url);
  if (parsed.protocol!=='https:' || !parsed.hostname.endsWith('.supabase.co') ||
      parsed.username || parsed.password || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
    throw new ApiError(503,'public_auth_config_unavailable');
  }
  return {supabase_url:parsed.origin,supabase_publishable_key:key};
});
