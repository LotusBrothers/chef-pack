# Chef Pack

**Can't decide on dinner? Rip a pack.**

Chef Pack is a pack-opening game for restaurant gift cards. You pick a pack, spin the reel, and flip a gift card that tells you where you're eating tonight. Every card is worth **at least the pack price**, and some packs upgrade to a Foil, Holo or Black Label card worth more.

## Try the demo

Open `prototype/index.html` in a browser. It's one file with no build step and uses play money only.

- **Home:** a floating-food hero, live drops, and 12 packs with filters, search and sorting
- **Pack page:** open 1 to 4 packs at once on stacked reels, try a free demo spin, see the odds and the restaurant list
- **Reveal:** the card flips over, you earn XP, and you can swap restaurants once
- **Wallet:** your gift cards with a barcode for each one
- **Demo city:** Rogers, AR. The local restaurants are examples, so check them before showing this to anyone.

## Repo layout

```
prototype/index.html           The website demo (current)
prototype/casino-concept.html  The first pack-rip casino concept (kept for reference)
docs/PRODUCT.md                MVP plan: pitch, screens, unit economics, 6-week test
docs/CONCEPT.md                Original concept notes (casino version)
data/tiers.json                Original casino odds (superseded by the guaranteed-value model)
```

## Business model in one line

Customers pay the pack price plus a $1.99 fee. Restaurants pay to be in packs because each pack sends them a new customer. See `docs/PRODUCT.md`.

## Before launch

- Real gift card images and fulfillment through a gift card provider such as Tremendous or Tango Card
- Real nearby restaurants from the phone's location and the Google Places API
- A promotions attorney's review of the upgrade bonus
- Credits: 3D food art is Microsoft Fluent Emoji (MIT)
