# What the Chef Pack app needs from the backend

**From:** Justin (frontend) · **For:** Tyler (backend, API contracts) · **Status:** proposal, not an approved contract

This is the request and response shape the app is built to consume. Tyler owns the contract, so rename fields, change paths, or push back wherever it makes sense. Once it's agreed, the app swaps its demo data (`prototype/index.html`) for these calls.

The gift card provider is **Reloadly** (sandbox first). Everything that touches Reloadly, money, odds or card codes stays on the server.

---

## 1. Ground rules

1. **The server decides every outcome.** It picks the restaurant and card value, charges the customer, buys the card from Reloadly and stores the code. The app only shows the result it's given.
2. **No secrets in the app.** The Reloadly client ID and secret, payment keys and the odds seed live on the server only.
3. **Card values must be real denominations.** Every value a pack can pay out must be one every restaurant in that pack sells. The server enforces this when packs are defined. The demo checks it in the browser today, and that check moves to the server.
4. **Opening a pack is idempotent.** The app sends an `Idempotency-Key` header. A retry with the same key returns the same result and never charges twice.
5. **Money is in integer cents** (`1500` = $15.00) and is always US dollars for now.

---

## 2. Endpoints

| Method | Path | Auth | Used for |
|---|---|---|---|
| GET | `/api/catalog` | none | Gift cards tab, card art everywhere |
| GET | `/api/packs` | none | Home, pack page |
| GET | `/api/me` | user | Balance, top bar |
| POST | `/api/packs/{packId}/open` | user | "Open pack" button |
| POST | `/api/opens/{openId}/swap` | user | "Swap restaurant for $2" |
| POST | `/api/free-pick` | user | Free daily pick |
| GET | `/api/wallet` | user | Wallet list |
| GET | `/api/wallet/{cardId}` | user | "Show card" (code, barcode) |

Auth: Tyler's choice (for example Supabase Auth with Apple, Google and email). The app needs a session token it can send as `Authorization: Bearer <token>`, plus screens for sign-in, which I'll build once the provider is chosen.

### 2.1 `GET /api/catalog`

All brands that can appear in a pack, built from Reloadly's product list.

```json
{
  "updatedAt": "2026-10-21T02:00:00Z",
  "brands": [
    {
      "id": "taco-bell",
      "name": "Taco Bell",
      "cuisine": "Tex-Mex",
      "logoUrl": "https://…/taco-bell-logo.png",
      "cardImageUrl": "https://…/taco-bell-card.png",
      "denominations": { "type": "range", "minCents": 1500, "maxCents": 50000 },
      "available": true
    },
    {
      "id": "pizza-hut",
      "name": "Pizza Hut",
      "cuisine": "Pizza",
      "logoUrl": "https://…",
      "cardImageUrl": "https://…",
      "denominations": { "type": "fixed", "valuesCents": [1000, 2500, 5000, 10000] },
      "available": true
    }
  ]
}
```

- `id`: our stable slug. Keep Reloadly's `productId` server-side only.
- `logoUrl` / `cardImageUrl`: HTTPS URLs the app can load directly. If Reloadly's image URLs expire or block hotlinking, serve them from our own storage. Either can be `null`; the app falls back to the black card with a wordmark.
- `cuisine`: Reloadly won't provide this, so we keep it in our own brand table.
- `available: false` hides the brand when it's out of stock or unavailable in the US.

### 2.2 `GET /api/packs`

```json
{
  "packs": [
    {
      "id": "quick-bite",
      "name": "Quick Bite",
      "blurb": "Fast food favorites",
      "category": "fast",
      "tag": "Popular",
      "priceCents": 1500,
      "feeCents": 199,
      "brandIds": ["burger-king", "taco-bell", "kfc", "arbys", "sonic", "zaxbys", "five-guys", "subway"],
      "tiers": [
        { "valueCents": 1500,  "chance": 0.88,  "label": "Guaranteed" },
        { "valueCents": 2000,  "chance": 0.10 },
        { "valueCents": 4000,  "chance": 0.018 },
        { "valueCents": 10000, "chance": 0.002 }
      ],
      "swapFeeCents": 200,
      "available": true
    }
  ]
}
```

- The `tiers[].chance` values add up to 1. They're for display only; the server draws the result.
- `tiers[0].valueCents` is never lower than `priceCents`. That's the "always worth at least what you paid" promise.
- A brand stays equally likely within a pack unless we add per-brand weights later. If we do, add `"weights"` here so the app can show them.
- Categories the app filters on today: `fast`, `casual`, `pizza`, `mexican`, `italian`, `seafood`, `steak`, `breakfast`, `dessert`, `fine`.

### 2.3 `GET /api/me`

```json
{ "id": "usr_…", "balanceCents": 25000, "freePickAvailableAt": "2026-10-21T00:00:00Z" }
```

If we charge cards directly instead of keeping a balance, drop `balanceCents` and I'll change the top bar.

### 2.4 `POST /api/packs/{packId}/open`

Request headers: `Authorization`, `Idempotency-Key: <uuid>`

```json
{ "payment": { "method": "balance" } }
```

or, for a direct charge, `{ "payment": { "method": "card", "token": "<processor token>" } }`.

Response `201`:

```json
{
  "openId": "opn_…",
  "packId": "quick-bite",
  "brandId": "taco-bell",
  "valueCents": 2000,
  "tierIndex": 1,
  "upgraded": true,
  "chargedCents": 1699,
  "balanceCents": 23301,
  "swapAvailable": true,
  "fairness": { "serverSeedHash": "sha256:…", "clientSeed": "…", "nonce": 42 },
  "card": { "id": "gc_…", "status": "issued" }
}
```

- `card.status` is `"issued"` once Reloadly returns the code, or `"pending"` if it's still processing. For `pending`, the app shows "Your card is on the way" and polls `GET /api/wallet/{cardId}`.
- The app plays its short card shuffle while the request is in flight and lands on `brandId`. It never chooses the brand itself.
- `fairness` is optional for the MVP. It's here so a "Provably fair" check can be added later without changing the shape.

### 2.5 `POST /api/opens/{openId}/swap`

One swap per open. The value stays the same, and the server picks a different restaurant from the same pack. Charges `swapFeeCents`.

```json
{ "brandId": "chipotle", "valueCents": 2000, "chargedCents": 200, "balanceCents": 23101, "swapAvailable": false, "card": { "id": "gc_…", "status": "issued" } }
```

Question for Tyler: if the first card was already issued, do we void it with Reloadly, or swap only before issuing? This may mean issuing the card a moment after the reveal.

### 2.6 `POST /api/free-pick`

There's no money involved, but it's on the server so the once-a-day limit can't be bypassed.

```json
{ "brandId": "olive-garden", "suggestedPackId": "italian-night", "nextAvailableAt": "2026-10-22T00:00:00Z" }
```

### 2.7 `GET /api/wallet` and `GET /api/wallet/{cardId}`

The list leaves out codes. The detail call, made when the user taps "Show card", includes them.

```json
{
  "cards": [
    { "id": "gc_…", "brandId": "taco-bell", "valueCents": 2000, "upgraded": true, "status": "issued", "createdAt": "2026-10-21T02:11:00Z" }
  ]
}
```

```json
{
  "id": "gc_…",
  "brandId": "taco-bell",
  "valueCents": 2000,
  "status": "issued",
  "redemption": { "code": "XXXX-XXXX-XXXX", "pin": "1234", "url": null, "barcode": { "format": "CODE128", "value": "XXXXXXXXXXXX" }, "instructions": "Show at the register or enter online." }
}
```

`redemption` fields depend on what Reloadly returns for each brand. Any can be `null`, and the app shows whatever is present.

---

## 3. Errors

Every error uses one shape:

```json
{ "error": { "code": "insufficient_funds", "message": "Add $1.99 to open this pack." } }
```

| HTTP | `code` | What the app does |
|---|---|---|
| 401 | `unauthenticated` | Sends to sign-in |
| 402 | `insufficient_funds` | Shows "Add credit" |
| 404 | `pack_not_found` | Back to home |
| 409 | `pack_unavailable` / `brand_unavailable` | Refreshes packs, shows a short note |
| 409 | `swap_used` | Disables swap |
| 409 | `free_pick_used` | Shows the time of the next free pick |
| 429 | `rate_limited` | Waits and retries once |
| 502 | `fulfillment_failed` | "We couldn't issue your card. You weren't charged." (or "We refunded $X to your balance") |

`message` is shown to the user as is, so it should be plain and say what to do next.

---

## 4. Reloadly notes (to verify against their docs)

From memory of Reloadly's Gift Cards API, so check before relying on it:

- OAuth client-credentials token from `auth.reloadly.com`, with the audience set to the sandbox or live Gift Cards host.
- A products endpoint filtered by country (`US`) returns, per product: product ID, product and brand name, denomination type (fixed or range), min/max or fixed values, and logo image URLs. That maps to `/api/catalog`.
- An orders endpoint (product ID, unit price, quantity, a custom identifier) creates the purchase. A follow-up call returns the redeem code and PIN. That maps to `card.status` and `/api/wallet/{cardId}`.
- Things to confirm: which of our 72 restaurants Reloadly carries in the US, whether its image URLs can be shown in our app (and whether we must host copies), the sandbox's test-card behavior, fees and discounts per brand, and the brand-asset usage terms.

For network access in our Claude Code environment, these hosts need adding under Allowed domains so the frontend can be tested against the sandbox: Reloadly's auth host, its Gift Cards sandbox host, and whatever host serves its images.

---

## 5. What the frontend will and won't do

**Will:** sign-in screens; read the catalog and packs and render them (black card, plus the real logo and card art when URLs are present); call open, swap, free-pick and wallet; show loading, pending and error states; keep the current demo as an offline fallback labeled "Demo".

**Won't:** hold Reloadly or payment keys, compute odds or outcomes, store card codes anywhere but in memory while a card is on screen, or change this contract without Tyler.

---

## 6. Open questions for Tyler

1. Balance (top up, then open) or direct charge per pack? This affects `payment` and `/api/me`.
2. Which payment processor? Gift card sales are restricted with some processors, and chance-based bonuses may be too.
3. Do we buy the card at open time or a few seconds after, so swaps don't waste a card?
4. If Reloadly fails after we charge, do we auto-refund to the balance or to the card?
5. How do we keep our 72-brand list and Reloadly's catalog in sync: a daily job, or a manual brand table?
6. Where does `cuisine`, pack membership and tier config live (database tables or a config file)? Note that `data/tiers.json` is the old casino model and is out of date.
7. Legal review of the upgrade bonus before real money goes live.
