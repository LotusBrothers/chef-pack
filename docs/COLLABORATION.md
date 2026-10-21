# Tyler and Justin's workflow

## Branches and responsibility

- main: integrated work, production Pages deployment.
- frontend/justin: Justin's shared UI workspace.
- backend/<topic>: Tyler's backend work, reviewed and merged separately.
- chore/frontend-workflow: initial collaboration setup PR; merge this before ordinary frontend PRs.

Justin starts his AI with: "Read AGENTS.md and use $chef-pack-frontend. Work on frontend/justin, merge the latest origin/main, and keep this task within the frontend scope."

The skill lives in .agents/skills/chef-pack-frontend/SKILL.md and travels in the repository. Codex supports repository-local skills there. If Justin uses another AI editor, explicitly have it read AGENTS.md and this skill; do not assume automatic discovery. Opening a new session after pulling setup lets Codex discover the skill.

## How Tyler handles his pushes

Justin pushes frontend/justin; Tyler reviews its PR into main. Tyler can fetch and push the same branch using his existing write access. Before modifying it, fetch and fast-forward so Justin's latest commits are preserved. Both must coordinate edits and avoid force pushes.

To bring backend updates in: merge backend work into main, then in a clean frontend checkout fetch origin, fast-forward frontend/justin from origin/frontend/justin, merge origin/main, resolve conflicts with both sets of work preserved, validate, and push frontend/justin. This can be done by Justin's AI or by Tyler. Never merge Justin's branch into a backend feature branch merely to update Justin.

Synchronization occurs at task start and before handoff/push. It is deliberately not an unattended background merge: conflicts need informed handling. GitHub's up-to-date requirement closes the gap between a branch being tested and main changing again. CI scope validates frontend changes; it does not update branches or prove the future backend API works. Add API integration and build tests when that backend exists.

## Owner activation required

The connected ctbedford account has push access but not repository administration. The owner must grant Tyler admin/edit-rules permission or configure these settings. They are not enabled by committing this file:

1. Merge the setup PR into main.
2. Protect main: require PRs, one approval, CODEOWNER review, dismiss stale approvals, conversation resolution, and required check "Frontend scope". Enable "Require branches to be up to date before merging". Select the check after it has appeared in a run. Do not allow force pushes/deletion; apply restrictions to administrators too.
3. Protect frontend/justin against force pushes and deletion, while permitting ordinary pushes and merge commits. Keep the branch after merging; disable automatic head-branch deletion or recreate it from main before another task. Use merge commits for this long-lived branch to retain shared ancestry.
4. Check CODEOWNERS recognizes @ctbedford as an eligible write-access owner. That is what makes Tyler's approval required for Justin's changes. Tyler cannot approve his own PRs; another eligible reviewer/owner must handle Tyler-authored setup/backend PRs or the owner must design an explicit limited bypass policy. Do not silently bypass a rule.
5. Verify with a harmless test PR: a frontend UI change passes, a frontend change to data/ or .github/ fails, and main cannot be updated without the required review/checks. The setup PR may need the newly added workflow rerun after merge so its guard is available on the base.
6. Pages should deploy only main. Existing workflow_dispatch also permits manual selection of other branches; add a main-only job condition before treating deployment as enforced. This setup adds that condition. Other hosting providers must also restrict production to main and use branch previews for Justin.

Branches isolate commits; they do not enforce file permissions. Scope CI plus required ownership review protects merges into main. A write collaborator can create differently named branches, and trusted reviewers must catch role/scope violations. This is protection against accidental interference, not a sandbox for hostile collaborators.

## Current scope and future backend

UI: index.html, prototype/, assets/, frontend/, tests/frontend/.
Handoff artifacts: feedback.md and reports/frontend/. Every frontend PR updates them under docs/FRONTEND-HANDOFF.md.
The trusted Frontend scope CI job also validates the report. It rejects blocked, stale or incomplete reports;
it cannot prove the truth of screenshots or manual test claims. Tyler reviews that evidence.
Tyler owns all remaining paths and updates the explicit allowlist when the frontend moves. In particular, data/tiers.json is legacy odds data and stays under technical review.

Current prototype needs no package installation/build. Browser-check the changed UI. The repository has no backend or API integration tests yet; introduce those alongside backend work rather than implying this branch setup verifies them.
