# Chef Pack: playable first, simple at the finish

Design brief from Justin's October 21, 2026 discussion. This is a proposed experience, not a claim that redemption, resale, or real payments are implemented.

## The idea

Chef Pack should feel like opening a game, with a pack ready to interact with immediately. The landing experience should center on ripping a pack rather than browsing a website or completing a sign-in form.

The core loop is **arrive -> swipe to rip -> reveal -> redeem or sell back**. Keep the experience focused on the pack and the card. The current web stack can prototype this direction; a native rewrite is not a prerequisite. Evaluate performance on real phones before making a stack decision.

## Scene 1: land in the experience

Use one full-screen stage with a large pack, a quiet background, and minimal controls. Put a grip near the bottom right; invite a leftward swipe to peel the wrapper. Account access and pack selection stay secondary.

For a visitor who has not signed in or confirmed a purchase, the first opening is explicitly a free motion preview. It creates no order, gift card, wallet balance, or monetary reward. Do not conceal a charge behind the swipe.

```text
+------------------------------+
| CHEF PACK            [Sound] |
|                              |
|      Dinner starts here.     |
|                              |
|         +----------+         |
|         |   CHEF   |         |
|         |   PACK   |         |
|         +----------+         |
|                              |
|    FREE OPENING PREVIEW      |
|  No purchase. No gift card.  |
|                              |
|       <--- Swipe to rip [=]  |
|          [Tap to open]       |
|                              |
| [Choose pack]      [Account] |
+------------------------------+
```

## Scene 2: the wrapper follows the gesture

The peel should track the finger continuously rather than merely using the swipe as a button. Release before the threshold and it settles back; cross the threshold and the tear completes. Provide an equally usable tap and keyboard action. Sound is optional; haptics are an enhancement where supported, not a requirement.

## Scene 3: one continuous reveal

The wrapper tears, the card emerges, and the card flips into its readable result. Keep the card central and the camera/background stable. Give the interaction physical weight through responsive motion and restrained sound, without adding extra screens or explanatory copy.

Show Skip during the animation and respect reduced-motion preferences. For actual orders, animate only the authoritative server result; the browser must not invent the restaurant, value, rarity, or outcome. Show an honest loading or error state if the server result is unavailable.

## Scene 4: the result is the card and two choices

Justin's simplification: **Redeem card** or **Sell back**. Remove replay, promotional messages, additional browsing actions, and long explanations from an actual card's result screen.

```text
+------------------------------+
|                         [X]  |
|                              |
|       +--------------+       |
|       |  RESTAURANT  |       |
|       |              |       |
|       |  CARD VALUE  |       |
|       +--------------+       |
|                              |
|       [ Redeem card ]        |
|       [ Sell back  ]         |
|                              |
+------------------------------+
```

- **Redeem card:** opens the provider-backed redemption details for that card.
- **Sell back:** opens one confirmation showing the exact offer, any fee, and where the proceeds go. Confirm only after those terms are visible. No resale percentage or payout destination has been decided.
- **Close:** returns to the pack experience; an issued card remains in the account's wallet.

The free opening preview must have its own clearly labeled ending, with no usable Redeem or Sell back actions and no card added to the wallet. Current mock cards remain TEST MODE / NOT REDEEMABLE; do not imply that they have resale value.

## Timing to prototype

There is no established universal optimal suspense duration for Chef Pack. These are usability hypotheses, not validated psychological claims:

| Moment | Initial target |
| --- | --- |
| Touch or drag feedback | Immediate; aim below 100 ms |
| Peeling | Continuously follows the user's gesture |
| Release to readable card | Try 1.2-1.8 seconds |
| Result | Remains until the user acts |
| Repeat use / reduced motion | Allow skipping or a direct reveal |

Keep timing consistent across outcomes. Test comprehension, perceived control, responsiveness, and whether people can comfortably read the card. Do not extend waits merely to increase reward suspense.

Sources informing these targets:

- [Nielsen Norman Group: response-time limits](https://www.nngroup.com/articles/response-times-3-important-limits/) describes approximately 0.1 seconds for perceived immediate feedback and 1 second for uninterrupted flow. These are response-time guidelines, not an ideal pack-reveal duration.
- [Apple: motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion) recommends purposeful, brief feedback tied to gestures and allowing people to cancel motion.
- [W3C: animation from interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) explains supporting users who need nonessential interaction motion disabled.

## Implementation boundaries and open decisions

Preserve existing server authentication, authoritative catalog/results, order idempotency, and account-isolated wallet behavior. A future paid opening needs a clear price, terms, and deliberate confirmation before the reveal. The free preview must remain separate from ordering.

Redemption and sell-back need Tyler's approved backend contracts and provider support. The current backend supplies non-redeemable mock pulls; it does not implement either action. Open decisions include resale eligibility, offer calculation, fees, proceeds destination, confirmation behavior, and preventing a card from being redeemed and sold back twice.

This brief authorizes no backend, payment, fulfillment, dependency, or deployment changes. Next implementation work should focus on the playable landing stage, direct gesture feedback, and the simplified result layout, while clearly representing unsupported actions.
