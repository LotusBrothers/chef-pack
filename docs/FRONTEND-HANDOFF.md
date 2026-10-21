# Justin's frontend handoff

Read this, AGENTS.md, docs/ACCEPTANCE.md, docs/TEST-API.md, and feedback.md before integration work.
Use .agents/skills/chef-pack-frontend/SKILL.md even when your editor does not discover skills automatically.

## Starting point

Justin's frontend/justin branch has newer UI than main. Preserve that UI.
backend/foundation has the API and these instructions; PR #2 must land in main before normal synchronization.
After Tyler merges #2: fetch, switch to frontend/justin, fast-forward from its remote, merge origin/main.
Do not reset frontend/justin to main. If both branches changed a file, preserve Justin's UI and Tyler's backend.
Create a PR from frontend/justin to main; Tyler reviews and merges. No direct main push or automatic merge.

## First assignment

Connect the existing interface to the mock backend. Preserve its appearance, add signup/login/logout,
fetch catalog, open a test pack, render the returned result, and reload the wallet from the server.
Do not add Stripe or Reloadly yet. The frontend must say TEST MODE and NOT REDEEMABLE.
Use same-origin API routes in a combined Vercel branch preview. GitHub Pages and file:// cannot execute these APIs.

## System sketch

    Browser /prototype/index.html
        |
        +-- Supabase Auth --> user access token
        |
        +-- GET /api/packs --------------------> public active catalog
        |
        +-- POST /api/orders + Bearer token
        |       + Idempotency-Key
        |       + { pack_id }
        |             |
        |             v
        |       Supabase: one atomic MOCK order + pull
        |       price and owner determined on server
        |
        +-- reveal server result; animation decorates it
        |
        +-- GET /api/wallet + Bearer token ----> only this user's mock pulls

    Justin branch --> PR + feedback.md + report + preview
                         |
                         v
                    Tyler review
                         |
                         v
                       main --> Justin merges main before next handoff

## Exact integration boundaries

API origin: window.location.origin. The working development API is https://chef-pack-dev.vercel.app.
That URL serves the backend branch, not Justin's latest UI. A combined branch preview is required
to verify his finished interface. Do not point GitHub Pages at it and work around missing CORS with wildcard access.

Supabase project: chef-pack-dev, umhbsphrgplijlrkzgps.
Auth URL: https://umhbsphrgplijlrkzgps.supabase.co.
Use only its publishable key with a pinned client library and approved dependency changes.
Tyler configures auth redirect URLs for the preview; do not change auth settings or expose privileged keys yourself.
Email signup may require confirmation. Report an auth/redirect blocker rather than turning confirmation off.
No auth UI has been built yet; the APIs accept Supabase registered-user bearer tokens.

Catalog is authoritative:
- quick-bite = $15; sit-down = $40; treat-yourself = $100, currently USD.
- Existing frontend quick/sitdown and the many themed packs are demo IDs, not API IDs.
- Render the API catalog or explicitly map quick -> quick-bite and sitdown -> sit-down.
- Do not map another priced/theme pack to an arbitrary API ID. Disable it with an explanation until backend support exists.
- The current order API charges no real money and models only pack face value, with no service fee.
  Do not claim a $1.99 fee was paid or decrement a fictitious balance in API mode.
- No branded restaurant, randomized rarity, upgrade, barcode, redeem code, swap, or real inventory is supplied by the API.
  Display its demo label honestly. Keep Free Pick separate as a no-card local suggestion.

Request contract:
GET /api/packs -> { mode: "mock", packs: [{ id, name, price_cents, currency }] }
POST /api/orders with JSON { pack_id: "quick-bite" }, Authorization: Bearer <access-token>,
and Idempotency-Key: <8-128 letters/digits/underscore/hyphen>.
Result -> { mode: "mock", order: { id, pack_id, amount_cents, currency, status, mode, ... },
pull: { id, order_id, restaurant_label, face_value_cents, delivery_status: "simulated", mode, ... } }
GET /api/wallet -> { mode: "mock", pulls: [...] } (newest first, max 100).

## Client behavior

Use a new crypto.randomUUID() key per intentional purchase. Save a pending attempt with its pack and
user ID before sending. Retry the SAME attempt with the SAME key after a timeout, connection error,
or accidental double click, including after reload. Create a new key only for an explicit new purchase.
Clear successful pending attempts; never replay an old user's attempt after account switching.
An uncertain response must not display a success or create a second purchase automatically.

The API does not accept client amount, owner, result or rarity. Generate no paid pull outcomes with Math.random().
Do not use localStorage wallet entries as backend cards or migrate fabricated barcodes.
Read the server wallet on reload/sign-in; clear user-specific UI on logout/account switch.
Keep auth through the approved Supabase client, and never write tokens or credentials into feedback, screenshots, fixtures, or PR text.

Handle 400 invalid input, 401 sign-in required/expired, 405 wrong method, and 503 dependency/configuration failure.
Show usable loading, empty, and retry states. No silent fallback from API failure to fabricated success.

## Handoff procedure

1. Merge latest main; read current contract.
2. Implement and run relevant checks. Complete the golden journey in docs/ACCEPTANCE.md.
3. Commit code first. Record that code commit as tested_commit.
4. Write feedback.md and reports/frontend/current.json, then commit those reports separately.
   If code changes after tested_commit, rerun and regenerate the report.
5. Include sanitized screenshots/logs under reports/frontend/evidence/ and link them in the report and PR.
6. Open/update the PR, include preview URL, report links, test outcome and concrete asks for Tyler.
   Repeated pushes update the SAME PR and current report.
7. Tyler reads the PR summary and feedback.md. He can ask his agent to inspect the branch/report.
   Files do not send a chat/email notification; GitHub PR notifications are the communication channel.
   The frontend agent does not message other chats, send emails, or merge on Tyler's behalf.

Current verification: the deployed /api/packs returns 200 with three database packs; /api/health returns 200.
This proves backend catalog connectivity, not frontend integration. Complete the browser journey before reporting integration ready.
