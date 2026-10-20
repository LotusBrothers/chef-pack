# Concept & Business Model

## Pitch
You don't know what you're eating tonight. Let fate decide. Every pack is guaranteed to contain a real restaurant gift card, and the rare pulls are what make people come back.

## Rarity ladder
The same five rarities are used in every tier, so users learn the colors once:

| Rarity | Color | Feel |
|---|---|---|
| Common | Gray | "Below pack price, but still dinner" |
| Uncommon | Green | "About what I paid" |
| Rare | Blue | "Nice, I won" |
| Epic | Purple | "Screenshot this" |
| Grail | Gold | The PSA 10 moment. Full-screen celebration, shareable clip |

## Economics (draft numbers, see `data/tiers.json`)

| Tier | Price | Expected value (EV) of the prize | EV as % of price | Chance of at least breaking even |
|---|---|---|---|---|
| Drive-Thru | $10 | $9.05 | 90.5% | 35% |
| Sit-Down | $35 | $30.05 | 85.9% | 19% |
| White Tablecloth | $150 | $132.00 | 88.0% | 22% |

**Where the margin comes from**
- **House edge:** prize EV is 86–90% of the pack price.
- **Wholesale gift card discount:** cards bought in bulk through a distributor usually cost 3–15% below face value.
- **Buyback spread:** a sell-back pays 85% of face value as *site credit*, not cash. That credit mostly turns into more rips, and the card goes back into inventory.
- **Breakage:** some gift cards are never fully redeemed.

**Engagement levers** (borrowed from pack-rip apps)
- Live "recent pulls" feed and leaderboard
- Limited-run "drops", e.g. a Valentine's date-night pack or a Super Bowl wings pack
- Streaks and pity timers (guaranteed Rare or better within N rips)
- Battles: two users rip the same pack and the higher pull takes both

## Fulfillment
Digital gift cards are delivered through a rewards API such as Tango Card, Tremendous, or Blackhawk/InComm. The card is bought at the moment the user chooses **Keep**, so we never hold inventory for pulls that get sold back. Confirm each brand's gift card terms allow this kind of distribution.

## Fairness
Use a **provably fair** RNG. Publish a hash of the server seed before the rip, combine it with a client seed and a counter, and reveal the server seed afterward so anyone can check the result. Publish the full odds for every pack.

## Legal: must answer before launch
Charging money for a chance at a prize of varying value is regulated as gambling in many places. Pack-rip apps usually rely on some combination of these:
- **Guaranteed prize:** every pack contains something of real value (our "floor" card)
- **Sweepstakes structure:** a free alternate method of entry
- **Age gating (18+/21+) and geo-blocking** of restricted states and countries

Get a gaming/sweepstakes attorney involved early. That review will shape the model (cash vs. credit buyback, prize floor, where we can launch). Don't use restaurant logos or imply partnership without permission until brand deals are in place.

## Open questions
- [ ] Name and brand
- [ ] Restaurant partnerships (co-marketing, discounted cards) vs. buying cards at retail
- [ ] Platform: mobile-first web app or native app (app store rules on paid chance mechanics)
- [ ] Buyback: credit only or a cash option?
- [ ] Location-aware packs ("restaurants near you")
