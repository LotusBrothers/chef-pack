# Chef Pack collaboration

Tyler owns backend architecture, integration, reviews, and releases. Justin owns frontend presentation.

For Justin's work, frontend tasks, or any `frontend/*` branch, read and follow `.agents/skills/chef-pack-frontend/SKILL.md` before editing or pushing. This applies throughout the repository. Backend tasks use separate `backend/<topic>` branches from main.

Never infer a developer's identity from git configuration. If role is ambiguous and affects permission, establish the role before pushing. Skills guide behavior; repository rules enforce merges.

Repository-wide changes to API contracts, authentication, money, fulfillment, database, deployment, dependencies, and these collaboration rules belong to Tyler. Frontend may consume approved APIs but must not implement real payment, gift-card issuance, odds, or balances in browser code.

Frontend handoffs: read docs/FRONTEND-HANDOFF.md and docs/ACCEPTANCE.md. Update feedback.md and reports/frontend/current.json on each PR handoff. Run the golden journey for integration work; report blocked/not-run cases honestly. Reports are review evidence, not permission to merge or message Tyler elsewhere.
