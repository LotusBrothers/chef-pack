# Free guest mystery-pack simulation

Readiness: BLOCKED for full real-account integration.
Tested code: b16e7c7c7adaf0a346295ebd39f3493becfe46d5
Main included: 65fee1b112d65f4d5a46070d04584c69ada7c467
Preview: https://chef-pack-jh0m04bt1-ctbedfords-projects.vercel.app/

Tyler selected a free simulation with non-redeemable credits. Home is now the game: 100 initial free credits, 10 per opening, one random restaurant collectible and a free credit reward, with local collection, free refill and Rules. The restaurant picker and existing signed-in API test paths are behind Developer Tools. No purchased balance, redeemable prize, payment, or gift-card issuance was added.

The simulation stores its outcome before animation; skip/close/refresh do not reroll. It uses nine bundled brand designs independently of Supabase metadata availability. Credit rewards: Classic 70% / 5 CR; Signature 25% / 15 CR; Chef’s special 5% / 50 CR. Each restaurant is equally likely and independent. LocalStorage stores the last 30 pulls and the current balance. This is browser-local, user-editable simulation state, not a secure ledger. Changing preview origins creates separate local state.

Verified: hosted Capital Grille reveal 100 -> 95 CR and refresh persistence; local Taco Bell/Olive Garden results, refill, skip, mobile 390px; zero API orders/pulls/POSTs in local harness; two simulation tests and seven backend tests, syntax/scope pass. See reports/frontend/evidence/free-simulation.json and screenshots.

Main remains unchanged. Existing registered-user golden journey and required review blockers remain; draft integration report stays blocked. Justin's agent handoff: reports/frontend/JUSTIN-HANDOFF.md.
