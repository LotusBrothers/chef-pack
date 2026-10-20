# Chef Pack: Product Plan (MVP)

## The pitch
**Can't decide on dinner? Rip a pack.**

Every couple, group chat and pair of roommates has the same fight: "I don't care, you pick." Chef Pack settles it. You pick a vibe and pay, the app picks the restaurant, and you get a gift card for it that's **always worth at least what you paid**. Sometimes it's upgraded.

## What changed from the first idea
| Pack-rip casino (v0 idea) | Dinner decider (MVP) |
|---|---|
| Most packs worth less than you paid | Every pack worth at least its price |
| Sell-back loop to keep ripping | You eat the card tonight |
| Gambling law in most states | Much lower legal risk (the upgrade bonus still needs review) |
| Payment processors and app stores push back | Restaurants pay to be in packs |

The rip, the reveal and the rarity colors stay, because that's the fun part. The meal is the product.

## MVP: four screens
1. **Tonight** – Three packs: Quick Bite $15, Sit-Down $40 and Treat Yourself $100. There's also a free "just pick a place for me" spin, which brings people in.
2. **Pack** – Shows the guaranteed card value, the upgrade odds, and one Pay & rip button (Apple Pay or a card).
3. **Reveal** – The rip, then the restaurant, distance, hours and card value. Directions are one tap away, and you get one swap per pack ($2) if you're not feeling it.
4. **Wallet** – Your gift cards, each with a barcode to show at the register.

**Not in v1:** sell-back, pack battles, live pull feeds, leaderboards, and local independent restaurants. Each one waits until people are buying packs again.

## Upgrade odds (all packs)
| Result | Odds |
|---|---|
| Base card (pack price) | 88% |
| Small upgrade (+25% or so) | 10% |
| Big upgrade (about 2.5x) | 1.8% |
| Jackpot (about 5–7x) | 0.2% |

## Unit economics: one Sit-Down pack (assumptions to verify)
| Line | Amount |
|---|---|
| Customer pays ($40 pack + $1.99 service fee) | $41.99 |
| Base $40 gift card (about 5% off through a gift card API) | −$38.00 |
| Average upgrade cost | −$2.50 |
| Card processing (about 3%) | −$1.26 |
| **Margin before restaurant deals** | **$0.23** |
| Restaurant promo fee per new guest | +$4.00 |
| **Margin with a restaurant deal** | **$4.23** |

**What this shows:** the real business is sending new customers to restaurants. They already give DoorDash, Groupon and Restaurant.com 15–30% for that. v1 only has to prove people will buy packs. Restaurant deals are what make it profitable.

## Who it's for
Couples on date night, roommates, friend groups, people buying gifts, and office lunch.

## How people hear about it
- **TikTok and Reels:** rip-reaction videos ("We let a pack pick our date night")
- **Gifting:** send a pack to someone and they rip it on their phone
- **Friday Pack:** a weekly subscription with one pack every Friday at 5pm

## Build (simple stack)
- **App:** Expo / React Native, one codebase for iOS and Android
- **Backend:** Supabase (auth, database)
- **Payments:** Stripe with Apple Pay. Confirm gift card sales are allowed on the account.
- **Gift cards:** Tremendous or Tango Card API, starting with national chains only
- **Restaurants near you:** Google Places API

## Prove it in 6 weeks
| Weeks | Goal |
|---|---|
| 1–2 | Landing page, short videos and a waitlist. 500 signups in one city. |
| 3–6 | Test build for 50 people, national chains only, gift cards delivered by hand or through an API. |

**What to watch:** how many free spins turn into paid packs, how many people buy a second pack within 30 days, and how many cards actually get redeemed.

## Open questions
- [ ] Promotions attorney review of the upgrade bonus (chance-based, even with no loss)
- [ ] App Store rules: disclose the odds, and check payments for real-world goods redeemed outside the app
- [ ] Which gift card provider has the best restaurant catalog and discounts
- [ ] First city to launch in
