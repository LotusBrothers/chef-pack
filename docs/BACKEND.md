# Development backend foundation

Supabase: chef-pack-dev in Individual, project umhbsphrgplijlrkzgps, us-east-1.
Vercel: chef-pack-dev in ctbedford's projects, project prj_wCJBa7oPUh8EvzoVUMjhMAHsbOaO.

The database migration in this PR is already applied to the development project. Do not replay it there. Its filename matches the remote migration history. New environments can apply it normally.

Database:
- pack_catalog exposes active demo packs for reading.
- pack_orders and pack_pulls permit authenticated users to read only their own rows.
- Browser roles cannot write any of these tables.
- Orders/pulls enforce mock mode. No real card numbers or redeemable gift cards exist.
- A unique per-user idempotency key and one pull per order are constraints for the future server implementation.

GET /api/health is the first Vercel endpoint. It fails closed unless both mode settings are mock and does not claim database connectivity.
Run locally: node --test tests/backend/*.test.mjs.

Completed verification: all three tables have RLS; anonymous catalog reads return three packs; anon/authenticated table grants contain only the intended SELECT permissions; Supabase security advisors returned no lints. End-to-end signup, per-user data isolation with real sessions, fulfillment, and checkout are not implemented or tested yet.

Remaining connections:
1. Authorize the Vercel GitHub app for LotusBrothers/chef-pack, then link the existing chef-pack-dev Vercel project (do not create a duplicate). The initial link failed because the GitHub integration is not installed/authorized for that repo.
2. Stripe account discovery returned USER_NOT_LOGGED_IN. Reauthorize and choose an isolated sandbox before implementing Checkout. No Stripe objects or keys have been created or used.
3. Runtime Supabase credentials and auth redirect URLs still need configuration once a deployment URL exists.

Next implementation: authenticated order API, atomic mock fulfillment, wallet reads, session isolation tests, then Stripe sandbox Checkout with signature-verified, idempotent webhooks. Gift-card fulfillment and messaging stay simulated. Live mode requires a separate reviewed change.

Frontend work remains on frontend/justin. Backend changes enter main through this PR before Justin merges main into his branch.
