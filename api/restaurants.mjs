import {database,endpoint} from '../backend/http.mjs';

// Brand metadata is public. It does not determine order outcomes or issue gift cards.
export default endpoint('GET',async()=>({
  mode:'mock',catalog_type:'restaurant_directory',redemption_available:false,
  tiers:await database('/rest/v1/pack_catalog?select=id,name,price_cents,currency&active=eq.true&order=price_cents.asc'),
  restaurants:await database('/rest/v1/restaurant_directory?select=id,name,tier_id,cuisine,official_url,card_art,color,redemption_available&active=eq.true&order=name.asc&limit=200')
}));
