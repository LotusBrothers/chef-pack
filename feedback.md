# Frontend handoff feedback

Readiness: BLOCKED. The frontend is connected to the mock API contract, but the golden journey has not run on a combined Vercel preview.
Report scope: integration.
Tested code commit: cd8f3445e1e21be5b806e31cad1d614dc607eed9 (frontend/justin).
Main included: 28515f4539c79dab41a21bbef8e0ca1c234d97d7.
Combined preview: none available (see blockers).
Machine-readable report: reports/frontend/current.json. Evidence: reports/frontend/evidence/.

## What changed (prototype/index.html)
- **Sign-in:** signup (with email-confirmation handling and redirect), login, token refresh and logout via Supabase Auth REST over fetch. No client library was added; see ask 4.
- **Catalog:** home renders GET /api/packs (quick-bite, sit-down, treat-yourself). The other themes are labeled "Demo only" with buying disabled. Free Pick stays a local no-card suggestion.
- **Orders:** each intentional purchase saves `{key: crypto.randomUUID(), pack_id, user_id}` before POST /api/orders. Timeouts, lost connections, 503s and reloads retry the same key. 400/404/405 retire the key. A pending attempt is never replayed for another user.
- **Reveal:** the reveal and reel play back the server pull (base tier only, because the server has no tier). No paid outcome is drawn in the browser.
- **Wallet:** GET /api/wallet on sign-in, refresh and visit. The old localStorage play wallet and barcodes are deleted, never shown.
- **Mock safety:** TEST MODE / NOT REDEEMABLE on every screen. API mode has no balance, fee, Swap Pass, payment picker, upgrade or barcode.
- **Merged work:** includes the parallel UI work on this branch (tiered reveal, slot-machine reel).
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
