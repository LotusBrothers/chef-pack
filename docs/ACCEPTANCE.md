# Acceptance checks and evidence

Scope integration: every case below must pass before READY.
Scope visual: VISUAL and MOCK-SAFETY must pass; explain why integration cases are unchanged.
Use BLOCKED when a dependency prevents verification. Never convert NOT RUN into PASS.
CI checks report completeness and freshness; a self-reported PASS is not proof of browser behavior. Tyler reviews evidence.

Golden journey:
A new test user signs in -> sees server catalog -> opens Quick Bite -> sees exactly one non-redeemable
$15 demo result -> refreshes and sees the same card in wallet -> signs out -> another test user cannot see it.
Retry the first order with the same key: same order ID, same pull ID, same wallet count.
Run in a combined Vercel preview containing Justin's UI and this backend, not GitHub Pages.

Case CATALOG: render the three server IDs and prices. Extra demo themes cannot masquerade as supported paid packs.
Case SIGNIN: registered-user signup/confirmation/login/logout works; expired session requests sign-in.
Case OPEN: one intentional action sends one logical attempt, renders the SERVER result, and adds one server wallet item.
Case RETRY: double click, timeout/retry, and reload-with-pending-attempt reuse the original key; no duplicate card.
Case WALLET: refresh, logout and login preserve the server item; fabricated local demo cards do not appear as real inventory.
Case ISOLATION: second test account cannot see the first user's order/pull; no previous-user data remains in UI.
Case ERROR: offline, rejected auth and backend 503 show errors/retry, never success; new-key retries are not automatic.
Case MOCK-SAFETY: TEST MODE and NOT REDEEMABLE visible, no real payment/provider calls, invented upgrade,
balance deduction, fee payment, brand fulfillment claim or redeemable barcode.
Case VISUAL: 390px mobile and desktop screenshots; catalog -> pack -> reveal -> wallet; keyboard controls,
labels, focus, loading/empty/error states. Preserve Justin's design.

## Repeatable API check

node scripts/eval-api.mjs
Defaults to read-only catalog/health checks. Set CHEFPACK_BASE_URL to an accessible combined preview.
Protected previews require authenticated access; a Vercel login page is BLOCKED, not an API pass.
Do not disable protection. A protected deployment can be inspected with the existing Vercel connection.

For authenticated writes, explicitly run:
node scripts/eval-api.mjs --write-tests
Provide CHEFPACK_TOKEN_A and CHEFPACK_TOKEN_B as protected local environment variables for two distinct,
dedicated registered TEST accounts. This creates ONE non-redeemable mock order in account A.
Never use live users or paste tokens in PRs. Results are sanitized JSON printed to stdout; no tokens are recorded.
The script verifies API behavior, not UI interactions. Report SIGNIN, VISUAL and pending-attempt reload behavior separately.
Save sanitized output under reports/frontend/evidence/ when relevant.

## Report structure

reports/frontend/current.json contains:
schema_version: 1; scope: integration or visual; readiness: ready or blocked;
tested_commit: full code commit SHA; base_commit: exact current main SHA;
preview_url: HTTPS combined preview; summary: concise outcome;
cases: one object per case above with id, status (pass/fail/blocked/not_run), evidence (string array), notes.

Record observable evidence: preview URL, specific UI screenshot, exact command and sanitized result,
observed order/pull IDs for TEST accounts, failure explanation. Do not invent results.
A passing API script does not mark the browser-only checks as passed.

feedback.md is the human-readable handoff: result, tested commit/base, preview, checks/evidence,
contract mismatches, blockers, and the precise next action/owner. Keep current state at top; git history preserves older reports.
No separate push is needed after a merge merely to restate status; the merged report remains tied to tested_commit.
