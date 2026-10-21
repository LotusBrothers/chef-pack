export class ApiError extends Error {
  constructor(status, code) { super(code); this.status=status; }
}
export function config() {
  if (process.env.PAYMENTS_MODE !== 'mock' || process.env.GIFT_CARDS_MODE !== 'mock') throw new ApiError(503,'unsafe_configuration');
  const url=process.env.SUPABASE_URL?.trim(), key=process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) throw new ApiError(503,'database_not_configured');
  return {url,key};
}
export async function database(path, token, options={}) {
  const {url,key}=config();
  let response;
  try {
    response=await fetch(new URL(path,url),{...options,headers:{apikey:key,...(token?{Authorization:token}:{}),'Content-Type':'application/json'},signal:AbortSignal.timeout(10000)});
  } catch { throw new ApiError(503,'database_unreachable'); }
  if (!response.ok) {
    if (path.startsWith('/auth/')) throw new ApiError(response.status===401||response.status===403?401:503,'authentication_failed');
    if (response.status===401) throw new ApiError(503,'database_credentials_rejected');
    if (response.status===400) throw new ApiError(400,'invalid_order_request');
    throw new ApiError(503,'database_request_failed');
  }
  return response.json();
}
export async function authenticate(req) {
  const token=req.headers?.authorization;
  if (!/^Bearer [A-Za-z0-9_.-]+$/.test(token||'')) throw new ApiError(401,'authentication_required');
  const user=await database('/auth/v1/user',token);
  if (!user.id || user.is_anonymous) throw new ApiError(401,'registered_account_required');
  return token;
}
export function endpoint(method, fn) {
  return async (req,res)=>{
    res.setHeader('Cache-Control','no-store');
    if(req.method!==method) {res.setHeader('Allow',method);return res.status(405).json({error:'method_not_allowed'});}
    try {config();return res.status(200).json(await fn(req));}
    catch(error) {return res.status(error instanceof ApiError?error.status:500).json({error:error instanceof ApiError?error.message:'internal_error'});}
  };
}
