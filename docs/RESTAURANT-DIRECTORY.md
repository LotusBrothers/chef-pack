# Restaurant directory

`GET /api/restaurants` returns public restaurant metadata from the development Supabase project, alongside the existing server-owned pack tiers. It does not require a user account. The response includes `mode: mock`, `catalog_type: restaurant_directory` and `redemption_available: false`.

The first seed contains nine brands: McDonald's, Subway, Taco Bell, Slim Chickens and Little Caesars in Quick Bite; Chili's and Olive Garden in Sit-Down; The Capital Grille and Ruth's Chris in Treat Yourself. These groupings are product design choices, not affiliations, guarantees, odds or gift-card availability. Existing pack prices remain unchanged at $15/$40/$100.

The directory stores each brand's official HTTPS site, cuisine, theme color and optional local sample artwork filename. The first five logo files are on the frontend branch. The other four entries have no logo file yet; clients should display their names rather than inventing logos or fulfillment claims. Official source links are returned in each record.

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
