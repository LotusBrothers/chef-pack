# Frontend handoff feedback

**Readiness:** BLOCKED. This is a design handoff; integration with the mock backend has not been done yet.
**Report scope:** integration (the first assignment in docs/FRONTEND-HANDOFF.md), recorded honestly as blocked.
**Code commit tested:** `c67f155c552bc87bbba910192703afc7cbfa8bc6`
**Main included:** `28515f4539c79dab41a21bbef8e0ca1c234d97d7`
**Preview:** https://claude.ai/artifact/ExrxCuuKtcyzVLfw9NftgH. This is a design preview of `prototype/index.html` only (a Claude artifact). It is **not** the combined Vercel preview, and it cannot reach the API.

## What changed since the last report (c08d01e)

All of it is in `prototype/index.html` and runs in TEST MODE in the browser:

- **Pack page** modeled on slab-pack sites: a sealed black foil pack, a showcase carousel of possible pulls with tier and odds (Base 88%, Upgrade 10%, Big hit 1.8%, Jackpot 0.2%), and a buy panel with an optional Swap Pass and a choice of payment (wallet or Apple Pay).
- **Opening:** the pack fills most of the screen, the viewer taps or swipes to rip it, then a slot-machine reel of gift cards spins (about 5.6s, or about 1.9s with Fast spin) and lands. The reveal scales with the tier: banner, glow, rays and sparks, and the value counts up from the pack price. There's sound after the tap (with mute) and vibration where supported.
- **Accounts (simulated):** a welcome screen with Apple, Google or email; email create-account and sign-in forms with validation; an account sheet with sign out. Data is stored per account in `localStorage`. Passwords are never stored.
- **Wallet (simulated):** a balance card, an Add funds sheet ($25–$250) using simulated Apple Pay or Google Pay sheets, and an activity list of deposits and purchases.
- **Catalog:** 72 dining gift cards (from DoorDash's Dining & Food shelf, with card ranges) in 13 themed packs, plus Free Pick.
- A **TEST MODE · DEMO MONEY · GIFT CARDS NOT REDEEMABLE** strip on every screen.

## Checks run and evidence

All runs were against the tested build, served locally (`python3 -m http.server`) and driven with Playwright Chromium. See `reports/frontend/evidence/run-log.json`.

- **390px iPhone 13 emulation, 12 screenshots** (`reports/frontend/evidence/mobile-*.webp`): welcome, then create account, $0 home, Add funds, simulated Apple Pay ($50), pack showcase, buy panel, sealed pack (287×435 of a 390×664 viewport), reel spinning, Upgrade reveal, wallet and activity. Balance went $50 → $33.01 after one $16.99 pack. No console errors, no horizontal overflow.
- **Desktop 1280px, 3 screenshots** (`desktop-*.webp`) and a keyboard path: Tab to "Continue with Apple", Enter to sign in, Enter on a focused pack tile, Enter on Buy now (focus moves to the pack), Enter to rip, result shown, Escape closes. The run set the demo balance in the console to skip the deposit sheet.
- **Earlier runs in this session (not re-recorded as files):** reload keeps the session; after sign out, a second account sees none of the first account's cards or balance; forced Base, Upgrade and Jackpot pulls each land on the drawn card with the right banner and value.
- `node scripts/check-frontend-scope.mjs origin/main HEAD`: **fails**, but not because of this branch's code. See the blocker below.
- `node --test tests/backend/*.test.mjs`: 6/6 pass (run as a sanity check only; no backend files were changed).

## Cases failed, blocked or not run

CATALOG, SIGNIN, OPEN, WALLET and ISOLATION are **blocked**, and RETRY and ERROR are **not run**, because the UI isn't connected to the API yet. **MOCK-SAFETY fails** on purpose for now: the browser demo invents tiers and upgrades, deducts a local balance, shows a $1.99 fee and demo barcodes. Those must be gated off in API mode. VISUAL passes. Details are in `reports/frontend/current.json`.

## Blockers and asks for Tyler

1. **Line endings on frontend/justin (owner: Tyler).** Commit `386a19d` saved 21 of your files with CRLF line endings, while `main` has LF. The content is identical (`git diff --ignore-cr-at-eol` is empty), but the scope check lists them as changed, so this PR's "Frontend scope" check fails. Please re-commit them with LF, or add a `.gitattributes`. I haven't touched them because they're outside frontend scope.
2. **Network access for the frontend agent (owner: Justin).** The Claude Code environment can't reach `chef-pack-dev.vercel.app` or `umhbsphrgplijlrkzgps.supabase.co`, so the API and auth are untestable from here.
3. **Combined Vercel preview plus Supabase auth redirect URLs for it (owner: Tyler).**
4. **Approved Supabase client dependency (owner: Tyler).** Which package and version, and how it's loaded (pinned script tag or package).
5. **Two dedicated test accounts** for ISOLATION and RETRY. Share them through environment secrets, not the PR.
6. **Contract request for the game (owner: Tyler).** The product depends on odds: the pull needs a server-drawn `tier` (0–3) and `face_value_cents` that can exceed the pack price, plus the brand ID. Today's mock always returns base value. Proposed shapes are in `frontend/API_NEEDS.md`. The animation already plays back whatever tier it's given.
7. **Pack IDs:** the API has `quick-bite`, `sit-down` and `treat-yourself`. In API mode I'll map quick → quick-bite and sitdown → sit-down, and show the other 11 themed packs as unavailable until the backend supports them (per the handoff).

## Next action

- **Tyler:** fix the line endings (1), then provide 3–5 and decide on 6.
- **Justin:** unblock network access (2).
- **Frontend agent:** after that, add an API mode with Supabase sign-in, server catalog, `POST /api/orders` with persisted idempotency keys and a server wallet. Gate off the demo-only economics. Run the golden journey on the combined preview, then update this report.

## Required per-PR update
- Readiness and scope: blocked · integration
- Code commit tested / main commit included: c67f155c552bc87bbba910192703afc7cbfa8bc6 / 28515f4539c79dab41a21bbef8e0ca1c234d97d7
- Combined preview URL: not available yet (design preview: https://claude.ai/artifact/ExrxCuuKtcyzVLfw9NftgH)
- Checks run and evidence links: reports/frontend/evidence/ (run-log.json, mobile-*.webp, desktop-*.webp)
- Cases failed, blocked or not run, with reasons: see above and reports/frontend/current.json
- API/contract changes needed from Tyler: items 1, 3–7
- Next action and owner: see Next action
