import {database,endpoint} from '../backend/http.mjs';
export default endpoint('GET',async()=>({mode:'mock',packs:await database('/rest/v1/pack_catalog?select=id,name,price_cents,currency&active=eq.true&order=price_cents.asc')}));
