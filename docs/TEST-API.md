# Mock-only API

All requests require PAYMENTS_MODE=mock and GIFT_CARDS_MODE=mock.
SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are runtime settings; no service-role key is used.

- GET /api/packs returns the active database catalog.
- POST /api/orders requires a Supabase registered-user access token in Authorization: Bearer <token>, an Idempotency-Key header (8–128 letters/digits/underscore/hyphen), and JSON {"pack_id":"quick-bite"}.
- GET /api/wallet requires the same bearer token and returns up to 100 of that user's latest mock pulls.

POST /api/orders immediately simulates payment and fulfills one base-value, non-redeemable demo card. No random upgrade odds, money movement, real gift cards, email, or SMS. Amount and owner come from the database and verified session, never request fields. Repeating a key returns the same order/pull; reusing it for a different pack fails.

The privileged database operation is isolated in a private schema. Its public wrapper uses invoker privileges; both require authenticated execution. The operation checks auth.uid(), locks the per-user key, and creates order and pull in one transaction. Browser table writes remain forbidden.

Use Supabase Auth signup/login to obtain a registered-user access token; no login UI is supplied in this backend PR. Vercel deployment protection is a separate access layer. Do not disable it to test the API.

Database verification uses temporary synthetic users inside a transaction and rolls back every record. HTTP handler tests mock upstream auth/database responses; deployed catalog checks cover real database connectivity. Full browser signup and frontend integration remain pending.

Run: node --test tests/backend/*.test.mjs
