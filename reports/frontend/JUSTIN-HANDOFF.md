# Justin's agent: current Chef Pack handoff

Tested implementation: e9cfed80496956faebdea79d2e0a4fee87b46301
Frontend branch: frontend/justin
Base main: 65fee1b112d65f4d5a46070d04584c69ada7c467
Combined preview: https://chef-pack-3niua0ze6-ctbedfords-projects.vercel.app/

## Current experience

Guest landing, Choose Packs and tier-detail previews use a shared plate/card drop, twirl and fullscreen perspective victory cascade. Choose Packs has three readable stacked tiers. Restaurant selections are filtered by tier; previews require no account and create no order. Signed-in test orders use the same 3D scene but preserve the server label and value. The central card/plate are WebGL meshes; the fullscreen cascade uses perspective DOM images. Rendering stops when still, DPR is capped at 1.5 and shadows at 512px. No package manifests changed; pinned Three.js and its MIT license are under prototype/vendor/three/.

The silver cover is removed. Six restrained original confirmation sounds remain, with plate/card contact cues and one reveal cue. Replay loads the selected cue. Browser autoplay can suppress arrival sounds before the first user gesture.

## Restaurant logos and data

Nine brands have actual logo assets: McDonald’s, Subway, Taco Bell, Slim Chickens, Little Caesars, Chili’s, Olive Garden, Ruth’s Chris and The Capital Grille. The last four were retrieved from official restaurant sites; sources are in prototype/art/SOURCES.md. Olive Garden needs a white logo backing for contrast. Hosted image checks pass 5/5 Quick Bite, 2/2 Sit-Down and 2/2 Treat Yourself. SVG and PNG logos render in 3D textures.

The development Supabase restaurant_directory has nine active rows and nine card_art filenames. Metadata is public SELECT-only with RLS. The frontend prefers /api/restaurants, then reads that public table on endpoint 404. The backend PR https://github.com/LotusBrothers/chef-pack/pull/5 contains the additive directory and logo metadata migrations. It cannot merge without an approving review. No unmerged backend branch was merged into this frontend branch. Older immutable previews lack the newly added files; use the current preview above.

## Verification and merge status

Current logo pass: syntax/scope and 9 hosted image loads pass; Olive Garden and Capital Grille 3D artwork inspected. See reports/frontend/evidence/restaurant-logo-verification.json. Earlier integrated-flow evidence is in integrated-pack-experience.json: hosted tier previews plus disposable local harness signup -> one Quick Bite order -> generic server-result 3D reveal -> one $15 wallet item. The harness's auth/orders/wallet are in-memory stand-ins, not real Supabase acceptance. Its directory can read live public metadata via an external public-config JSON file configured by CHEFPACK_DIRECTORY_CONFIG; never commit privileged keys.

Frontend PR https://github.com/LotusBrothers/chef-pack/pull/3 stays draft. The real registered-user golden journey, retry/pending reload, wallet persistence and second-account isolation are incomplete. The BLOCKED report gate intentionally fails. Android hardware and final reduced-motion checks are also outstanding. Do not turn these into PASS or switch to visual scope to hide integration work already on this branch. User authorized merge only if everything works; main remains unchanged. Synchronize normally from origin/main after reviewed backend changes land, preserving shared history.

## Credit request remains separate

User proposed a guest welcome coin and actual credit redeemable for gift cards, not cash. Guaranteed-value versus chance-based rewards remains unanswered. No funds, welcome grant, paid funding, redemption or actual gift-card fulfillment is implemented. Do not treat the animation or local browser state as proof of a real balance or inventory.

## Latest cosmetic correction and pending direction

Cascade sprites now default to opacity zero and apply their starting keyframe during the delay (fill both). This removes the stray upper-left card stack. Hosted first-frame and replay checks are recorded in evidence/cascade-corner-fix.json. The user requested broader lottery-like mechanics with redeemable value; none were implemented. The pending offered directions are a free game with non-purchasable/non-redeemable points or guaranteed-value gift-card purchases with decorative animation.
