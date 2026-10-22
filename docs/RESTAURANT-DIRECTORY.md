# Restaurant directory

`GET /api/restaurants` returns public restaurant metadata from the development Supabase project, alongside the existing server-owned pack tiers. It does not require a user account. The response includes `mode: mock`, `catalog_type: restaurant_directory` and `redemption_available: false`.

The first seed contains nine brands: McDonald's, Subway, Taco Bell, Slim Chickens and Little Caesars in Quick Bite; Chili's and Olive Garden in Sit-Down; The Capital Grille and Ruth's Chris in Treat Yourself. These groupings are product design choices, not affiliations, guarantees, odds or gift-card availability. Existing pack prices remain unchanged at $15/$40/$100.

The directory stores each brand's official HTTPS site, cuisine, theme color and optional local sample artwork filename. All nine logo files are now on the frontend branch, and every directory row has a card_art filename. The second additive migration assigns the official Chili’s, Olive Garden, Ruth’s Chris and The Capital Grille logos; original asset URLs are recorded in prototype/art/SOURCES.md on that branch. Logo artwork still does not establish fulfillment availability. Official source links are returned in each record.

The additive migration is applied to `chef-pack-dev`. Its filename is aligned with the version returned by Supabase's migration history after the CLI created the initial migration scaffold. RLS permits only active public directory rows. Anonymous and authenticated clients have SELECT only, with no INSERT/UPDATE/DELETE grants. The table cannot store redeemable inventory. Existing order and wallet tables/functions are unchanged.

## Verification

- All 8 backend tests pass, including GET-only access, unauthenticated metadata, fixed response flags, dependency failure and unsafe-mode rejection.
- A transaction using the `anon` database role reads 9 rows.
- Security advisor reports no new table/RLS warning; its existing leaked-password-protection warning remains unrelated to this change.
- Tier counts: Quick Bite 5, Sit-Down 2, Treat Yourself 2.
- Check the deployed `/api/restaurants` endpoint before connecting the frontend.

## Guest welcome coin

The user proposed a guest coin arrival instead of a restaurant card on first visit and clarified that its eventual value should redeem for gift cards rather than cash. Whether purchased credits guarantee a gift-card value or fund chance-based rewards remains unanswered. This migration adds no guest balances, grants, randomness, paid chances, redemption or cash value. Do not use browser state as proof of funds or award inventory. A welcome grant needs server confirmation and an actual funding/fulfillment integration before it can be represented as spendable.

The existing frontend integration PR still needs its registered-account golden journey before merge. This additive metadata backend change is separate from that branch.

## Logo completion verification

The development directory has 9 rows and 9 non-null artwork filenames. Official assets are retained locally on the frontend branch. Deploy that branch’s current preview to view the four newly added files; older immutable previews do not include them. The metadata-only migration changes no grants, RLS, prices or order functions.
