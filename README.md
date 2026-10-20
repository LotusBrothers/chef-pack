# Rip-a-Plate (working title)

**Test your fate. Rip a pack. Eat like it.**

Rip-a-Plate takes the pack-rip model from apps like PackDraw and Courtyard, where you rip a digital pack and might pull a PSA 10, and applies it to food. Every pack holds a real restaurant gift card. You pick a tier, rip it open, and find out whether you got a $5 Taco Bell card or a $2,000 steakhouse grail.

## The core loop

1. **Pick a tier.** Each tier is a "set" of restaurants at a price point.
2. **Rip the pack.** A tear animation and reveal, with color-coded rarity like trading cards.
3. **Keep or sell back.** Redeem the gift card, or sell it back right away for site credit (85% of face value) and rip again.

## Tiers (draft)

| Tier | Price | Restaurants | Floor pull | Grail pull |
|---|---|---|---|---|
| Drive-Thru | $10 | McDonald's, Chick-fil-A, Chipotle, Raising Cane's… | $5 | $200 |
| Sit-Down | $35 | Olive Garden, Outback, Texas Roadhouse, Cheesecake Factory… | $15 | $500 |
| White Tablecloth | $150 | Ruth's Chris, Capital Grille, Morton's, Nobu… | $50 | $2,000 |

The full odds table is in [`data/tiers.json`](data/tiers.json). The math and business model are in [`docs/CONCEPT.md`](docs/CONCEPT.md).

## Try the prototype

Open `prototype/index.html` in a browser. It's a single file with no build step and runs on play money only. It covers tier selection, the pack rip, the rarity reveal, buyback, and pull history.

## Repo layout

```
data/tiers.json        Tier, prize, and odds config (the source of truth)
docs/CONCEPT.md        Product concept, economics, fulfillment, legal open questions
prototype/index.html   Clickable pack-rip demo (play money)
```

## Status

This is the concept stage. The name isn't final, and nothing here takes real money yet.
