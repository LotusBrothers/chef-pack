---
name: chef-pack-frontend
description: Develop Chef Pack frontend on Justin's isolated branch, synchronize backend changes from main, and hand off pushes to Tyler for integration. Use for Justin's work, frontend tasks, and frontend branches in LotusBrothers/chef-pack.
---

# Chef Pack frontend

Repository: https://github.com/LotusBrothers/chef-pack.
Tyler (@ctbedford) is the technical maintainer. Justin develops UI on `frontend/justin`; Tyler develops backend on `backend/<topic>`. Main contains integrated, approved work. Only changes merged into main flow into Justin's branch; never pull an unmerged backend branch without Tyler's instruction.

## Start and synchronize

1. Read root AGENTS.md and docs/COLLABORATION.md. Verify origin is this repository, inspect the current branch, status, and remote refs. Never overwrite dirty work or another developer's checkout.
2. Fetch origin. In a clean checkout, switch to frontend/justin tracking origin/frontend/justin. If absent, create it from origin/main and publish only when pushing is authorized. Use an isolated worktree if this checkout contains backend work.
3. Fast-forward from origin/frontend/justin, then merge origin/main into the frontend branch. Do this before starting a task, before every handoff/push, and again when Tyler requests an update. Use ordinary merges to preserve shared history; never force push, reset shared history, or rebase the shared branch.
4. If merging conflicts, resolve only clearly understood UI conflicts. Stop the merge and report affected files to Tyler for backend, contract, dependency, or infrastructure conflicts. Never choose ours/theirs globally or delete backend changes to make UI work. Preserve existing local work; abort only a merge you started in a clean checkout.
5. Reread guidance and API contracts brought in by the merge. Synchronizing backend code does not authorize editing it.

## Scope

Current UI paths: index.html, prototype/, assets/, frontend/, tests/frontend/.
Everything outside these paths needs Tyler's explicit scope approval and a separately reviewed change. In particular, do not edit data/, docs/PRODUCT.md, API schemas, backend/server/api/supabase/database code, migrations, .github/, skill files, dependencies, lockfiles, or environment settings as part of a frontend task. If a future frontend framework adds paths, Tyler updates the scope check and this skill first.

Use approved backend responses. Put temporary UI mocks in frontend code, label them as demo-only, and keep real credentials, production records, balances, payment decisions, odds, and gift-card fulfillment out of the browser. If an API is missing, describe the required request/response for Tyler rather than silently changing the contract.

## Verify and hand off

- Fetch and merge the latest origin/main again; confirm `git merge-base --is-ancestor origin/main HEAD` succeeds. This proves freshness at that instant, not after later main changes.
- Run `node scripts/check-frontend-scope.mjs origin/main HEAD`. Review `git diff origin/main...HEAD` for unintended changes. A failing scope check means separate the change for Tyler; do not weaken the guard.
- The current demo has no package build: inspect the affected HTML in a browser and exercise navigation, pack selection/open/reveal, wallet, and narrow-screen layout as relevant. Run new project build/tests if Tyler later introduces them. State which checks actually ran.
- Push only frontend/justin (or a Tyler-approved frontend/<topic> branch) when the user has authorized publishing. Never push main, merge a PR, enable auto-merge, trigger production deployment, or edit protections on Justin's behalf.
- Open/update a PR to main when requested; include UI changes, screenshots where useful, tests, origin/main SHA included, and backend dependencies. Tyler reviews and merges. Later main changes require another synchronization and passing checks.
- Report branch, commit, PR link, checks, and unresolved integration needs. Do not claim branch protections or skill installation on Justin's computer were verified unless actually checked.
