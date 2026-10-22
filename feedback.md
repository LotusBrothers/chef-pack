# Refined Play screen

Readiness: BLOCKED for full real-account integration.
Tested code: b96cce6fa2f083bf375f82d0b9d6124b9d4267c1
Main included: 65fee1b112d65f4d5a46070d04584c69ada7c467
Preview: https://chef-pack-r4lk248re-ctbedfords-projects.vercel.app/

Latest design pass follows the requested design-manager review. Play now uses the shared 3D mystery card and plate, a unified dark shell, one compact balance, direct Open pack wording and a gold primary action. Styles follow the base stylesheet, fixing the overridden button fill. Balance opens free refill; Rules stays in the header. Idle scene is disposed when opening or navigating. Local 390px check places the action at y468-524. Hosted Slim Chickens opening completes with +5 credits and a 95-credit balance. See reports/frontend/evidence/refined-play.json. Existing integration blockers below remain unchanged.

Tyler selected a free simulation with non-redeemable credits. Home is now the game: 100 initial free credits, 10 per opening, one random restaurant collectible and a free credit reward, with local collection, free refill and Rules. The restaurant picker and existing signed-in API test paths are behind Developer Tools. No purchased balance, redeemable prize, payment, or gift-card issuance was added.

The simulation stores its outcome before animation; skip/close/refresh do not reroll. It uses nine bundled brand designs independently of Supabase metadata availability. Credit rewards: Classic 70% / 5 CR; Signature 25% / 15 CR; Chef’s special 5% / 50 CR. Each restaurant is equally likely and independent. LocalStorage stores the last 30 pulls and the current balance. This is browser-local, user-editable simulation state, not a secure ledger. Changing preview origins creates separate local state.

Verified: hosted Capital Grille reveal 100 -> 95 CR and refresh persistence; local Taco Bell/Olive Garden results, refill, skip, mobile 390px; zero API orders/pulls/POSTs in local harness; two simulation tests and seven backend tests, syntax/scope pass. See reports/frontend/evidence/free-simulation.json and screenshots.

Main remains unchanged. Existing registered-user golden journey and required review blockers remain; draft integration report stays blocked. Justin's agent handoff: reports/frontend/JUSTIN-HANDOFF.md.
