# Playable guest landing handoff

Readiness: BLOCKED for full integration; playable preview ready for user review.
Tested code: fea8d524acd62e0b2d10d2fd8e3f88d3100aded1
Main included: 65fee1b112d65f4d5a46070d04584c69ada7c467
Preview: https://chef-pack-3o55db9b9-ctbedfords-projects.vercel.app/

Visitors now land directly in a starter-pack scene with no login or catalog dependency. Tap/Enter opens; a left drag continuously peels the seal, short release returns sealed, threshold release completes. Retains recorded contact sound, branded sample card and tilt. Guest opens create no order/wallet card. Replay and Explore packs are available after the result. Root HTML points directly at this experience. Existing authenticated test-order and wallet paths remain available behind Choose pack.

Verified local keyboard/open/replay/browse, hosted guest landing/short-swipe/full-swipe, actual390x844 viewport with no horizontal document overflow, syntax and frontend scope. Evidence: reports/frontend/evidence/playable-landing.json and playable-landing-mobile.png. Full integration acceptance, real Android measurement, and human taste review remain outstanding. Keep PR draft; blocked report check is intentional.

---

## Prior study handoff

# Current motion and sound handoff

Readiness: BLOCKED for integration; ready for a human audition of the study.
Tested code: 80dbdca3d77c833f5f14dff31d07d7d2f2743e98
Main included: 65fee1b112d65f4d5a46070d04584c69ada7c467
Combined preview: https://chef-pack-ao1h1pdg3-ctbedfords-projects.vercel.app/prototype/index.html

Replaced the long reel with a native tear/lift/flip reveal. Added no-order replay. Latest iteration adds a 27KB edited CC0 golf contact recording, decoded once and replayed using Web Audio, plus an isolated sound audition button. Synthetic reveal impact removed. Added a portrait Burger King artwork sample and adapted React Bits spring tilt, glare, and rim; licenses and asset sources are under prototype/. Real API results retain server labels; branded sample never enters wallet. No dependencies/backend/auth contract changes.

Checks: inline script syntax, 7 backend tests, scope check, hosted catalog/health, audio decode/start UI, branded artwork render, local zero-order preview; see reports/frontend/evidence/motion-sound-study.json. Screenshots accompany this handoff.

Outstanding: Tyler and Justin judge sound/art/motion; test actual Android speaker, latency, and frame pacing. Complete the current golden integration journey before accepting or merging. The old missing publishable-key/preview blockers were resolved by main and this combined deployment; do not repeat them. Keep PR draft.

---

## Historical handoff (older revisions; not current proof)

# Frontend handoff feedback

Readiness: BLOCKED. The frontend is connected to the mock API contract, but the golden journey has not run on a combined Vercel preview.
Report scope: integration.
Tested code commit: 53b2bedf9621aaecc97c3727a07c1e05d0ffebaf (frontend/justin). The local suite was re-run on this commit; screenshots are from cd8f344, before the c67f155 merge.
Main included: 28515f4539c79dab41a21bbef8e0ca1c234d97d7.
Later commit 1cfd1fb: a visual-only logo change (white chef hat on a black badge in the top bar and sign-in sheet). The case results below were not re-run on it. It was checked at iPhone 13 size with no page errors, and the scope check passes.
Later visual-only redesign (this push): a new type and color system, a slim TEST MODE bar (it still reads TEST MODE and NOT REDEEMABLE), a featured pack card, dark pack tiles, a full-width pack showcase, an iOS-style details list, the buy button in a fixed bottom bar, and a wallet total card. API calls, idempotency, auth and data handling are unchanged. Checked at iPhone 13 and 1280px on the local contract harness (catalog, sign-up, open, reveal, wallet, gift cards) with no page errors. The case results below were not re-run.
Combined preview: none available (see blockers).
Machine-readable report: reports/frontend/current.json. Evidence: reports/frontend/evidence/.

## What changed (prototype/index.html)
- **Sign-in:** signup (with email-confirmation handling and redirect), login, token refresh and logout via Supabase Auth REST over fetch. No client library was added; see ask 4.
- **Catalog:** home renders GET /api/packs (quick-bite, sit-down, treat-yourself). The other themes are labeled "Demo only" with buying disabled. Free Pick stays a local no-card suggestion.
- **Orders:** each intentional purchase saves `{key: crypto.randomUUID(), pack_id, user_id}` before POST /api/orders. Timeouts, lost connections, 503s and reloads retry the same key. 400/404/405 retire the key. A pending attempt is never replayed for another user.
- **Reveal:** the reveal and reel play back the server pull (base tier only, because the server has no tier). No paid outcome is drawn in the browser.
- **Wallet:** GET /api/wallet on sign-in, refresh and visit. The old localStorage play wallet and barcodes are deleted, never shown.
- **Mock safety:** TEST MODE / NOT REDEEMABLE on every screen. API mode has no balance, fee, Swap Pass, payment picker, upgrade or barcode.
- **Merged work:** includes the parallel UI work on this branch (tiered reveal, slot-machine reel, plus the larger pack opening and Fast spin from c67f155).
- **c67f155 accounts and payments not kept:** that commit's browser-only accounts, wallet balance, deposits and simulated Apple Pay / Google Pay checkout were dropped, keeping the server API as the source of truth. The handoff forbids a fictitious balance or payment in API mode, and real accounts are Supabase Auth. Its welcome gate was built on those simulated sign-ins, so the Supabase sign-in sheet remains.
- **Line endings:** restored line-ending-only differences in Tyler-owned files to main's exact bytes, so the scope check passes. An earlier merge (386a19d) had introduced them.

## Checks run
- `node scripts/check-frontend-scope.mjs origin/main HEAD`: passed (10 frontend files).
- `node --test tests/backend/*.test.mjs`: 6/6 pass.
- `node scripts/eval-api.mjs` (read-only, chef-pack-dev.vercel.app): HEALTH pass, CATALOG pass. Saved to evidence/api-eval-readonly.json.
- **Browser (local only):** same-origin harness `tests/frontend/contract-harness.mjs`.
  - Real /api/packs is proxied from chef-pack-dev.vercel.app.
  - Auth, orders and wallet are a local stand-in that follows docs/FRONTEND-HANDOFF.md, with fault injection.
  - Results are in each case's notes in current.json. They show the UI logic works and are not golden-journey passes.
- `node scripts/check-frontend-report.mjs`: expected to FAIL because readiness is blocked, so the PR stays draft.

## Case status
All integration cases are BLOCKED on a real combined preview. Local harness results:
- **CATALOG, OPEN, RETRY, WALLET, ISOLATION:** behaved correctly locally (one order per attempt, same-key retries, server-only wallet, no cross-user data).
- **SIGNIN:** only the stand-in auth ran. Real Supabase signup, confirmation and redirects were not run.
- **ERROR:** timeout, 503 and expired session were checked locally. Real offline and a real server 400 through the UI were NOT RUN.
- **MOCK-SAFETY:** verified locally only.
- **VISUAL:** NOT RUN as a full pass. Mobile and desktop screenshots were taken; the keyboard and focus walkthrough was not done.

## Asks for Tyler (blocking)
1. **Supabase publishable key for the frontend.** Either approve committing the chef-pack-dev publishable key into `AUTH_KEY` in prototype/index.html, or add `GET /api/config` returning `{ "supabase_url": "...", "supabase_publishable_key": "..." }` from runtime env. The page already tries `/api/config` when `AUTH_KEY` is empty.
2. **Combined Vercel preview of frontend/justin.** Justin's Vercel account (jhoai) cannot see the chef-pack project, and the repo has no Vercel Git integration, so pushing does not create a preview. Please connect the repo or deploy this branch as a preview with PAYMENTS_MODE=mock, GIFT_CARDS_MODE=mock, SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY. Share the URL, and preview access if it is protected.
3. **Auth redirect URLs.** Add the preview origin plus `/prototype/index.html` to Supabase Auth redirect URLs. Signup sends `redirect_to=<origin>/prototype/index.html`, and the page reads the session from the URL hash on return.
4. **Auth client approval.** Confirm that Supabase Auth REST over fetch is acceptable, or approve a pinned supabase-js version. Today no dependency was added.
5. **Two dedicated test accounts** (or approval for Justin's agent to create them on the preview), so the golden journey and `eval-api.mjs --write-tests` can run.

## Known mismatches and notes
- **No tier:** the server pull has no tier, rarity or upgrade, so the reel always lands on the base tile in API mode.
- **Demo restaurant label:** `restaurant_label` is "Demo restaurant — not redeemable". Branded art appears only in demo themes, the demo catalog and the promo fan.
- **Wallet cap:** the API returns at most 100 pulls; the UI shows what it gets.
- **Wallet header on errors:** during a wallet 503 the header keeps the last-known count above the error message.

## Next action and owner
Tyler: asks 1–3 above. Then Justin's agent reruns the golden journey on the preview, regenerates this report, and marks the PR ready only if every case passes.

Note: the parallel session's report for c67f155 (commit 2204932) is superseded by this one. Its welcome/checkout screenshots were removed from evidence/ because those screens are not in the tested code; they remain in git history.
