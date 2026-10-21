# Development backend

Supabase: chef-pack-dev in Individual, project umhbsphrgplijlrkzgps, us-east-1.
Vercel: chef-pack-dev in ctbedford's projects, project prj_wCJBa7oPUh8EvzoVUMjhMAHsbOaO.

Both migrations in this PR are already applied to the development project. Their filenames match remote migration history. Do not replay them there; new environments can apply them normally.

The backend/foundation branch is deployed to the development project's Vercel production alias. This is the deployment target within a development project, not a live-payment launch. Main and Justin's frontend branch have not been changed.

GET /api/health reports mock-mode configuration. GET /api/packs queries the database. POST /api/orders simulates one base-value pull atomically; GET /api/wallet reads the signed-in user's latest pulls. See TEST-API.md for request shapes. There are no real payments, gift-card orders, SMS or emails.

Verification:
- RLS is enabled on all three public tables.
- Anonymous catalog reads return three demo packs.
- Browser roles have SELECT only; direct writes are denied.
- Rolled-back database tests verified idempotency, server pricing, cross-user read isolation, conflicting-key rejection, and anonymous execution denial.
- Supabase security advisors returned no lints after the mock RPC migration.
- Node API/health tests pass; CI runs them for backend pushes and PRs.
- Vercel deployment reached READY. Its /api/packs and /api/health now return 200; catalog contains the three Supabase packs. The runtime credential mismatch is resolved. The connected Vercel account still cannot read or update environment settings (403).

Connection and implementation work remaining:
- Integrate Justin's UI using docs/FRONTEND-HANDOFF.md and evaluate with docs/ACCEPTANCE.md.
- Confirm Git linkage for automatic deploys; manual Git-source deployments work.
- Complete browser signup/login integration and end-to-end tests using actual sessions.
- Stripe access is unavailable. Add an isolated sandbox and implement Checkout plus signed, idempotent payment webhooks separately.
- Replace simulated gift-card fulfillment only through a later reviewed provider integration.

Frontend work stays on frontend/justin. Backend changes enter main through this PR before Justin merges main into his branch.
