# Card drop, twirl and victory cascade handoff

Readiness: BLOCKED for integration and merge.
Tested code: b1f1d0d48186c70d3a5ce289ce90b4edde7ee96e
Main included: 65fee1b112d65f4d5a46070d04584c69ada7c467
Combined preview: https://chef-pack-4o2mofa42-ctbedfords-projects.vercel.app/

The guest landing opens without sign-in. A 3D card drops face-down onto the plate, then spins upright. The metal cover is removed. A finite fullscreen perspective card cascade travels over the text at the reveal cue, then removes itself. Five labeled sample brands: McDonald's, Subway, Taco Bell, Slim Chickens and Little Caesars. Plate/card contact and the selected restrained completion cue use cached audio.

Seven automated tests pass. Syntax and frontend scope pass. Hosted WebGL reveal, sound-start events, cleanup, read-only health/catalog and 390px layout verified. No real Android performance claim. See evidence/card-drop-verification.json and JUSTIN-HANDOFF.md in this directory.

Merge is withheld because this branch also contains earlier account/order/wallet integration, and its required real-account golden journey has not been verified on the current combined preview. No dedicated real test accounts are configured here. Local contract-harness checks are not real backend acceptance. Report gate must remain blocked rather than inventing a pass.

Next owner: Tyler/Justin provide or sign into two dedicated test accounts, run docs/ACCEPTANCE.md on the combined preview, then update this report and rerun the report check before merging. User authorized push and merge only if checks work; main remains unchanged until the acceptance condition is met.
