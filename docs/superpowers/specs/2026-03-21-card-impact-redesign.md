# GuildMaster — Card Impact Redesign Spec

**Date:** 2026-03-21
**Branch:** v2-implementation
**Status:** Pending user review

---

## Overview

The game currently feels too mild. About 35% of choices have negligible resource impact (delta ≤ 5), the modifier mechanic appears too rarely to matter, and most choices affect only 1–2 resources, making decisions feel isolated rather than consequential. This spec defines four changes to make every card feel meaningful.

---

## Section 1 — Full Modifier Removal

The modifier system (temporary per-turn resource buffs/debuffs lasting 2–5 turns) is removed entirely. It appears too infrequently across 182 cards to register with the player, and the payoff only materialises if the right resources are in flux at the right time.

**What gets removed:**
- `modifiers` field from all 11 affected card data objects
- Modifier bar UI (`.modifier-bar`, `.mod-pill`, `.mod-label`, `.mod-duration`, `.mod-negative`, `.mod-positive`, `.mod-permanent`, `.mod-duration` CSS classes)
- `applyModifiers()`, `tickModifiers()`, `addModifier()`, `createModifierState()`, `getActiveModifiers()` engine functions and all call sites in `game.js`
- Modifier serialization/deserialization in auto-save (`serializeRunState` / `deserializeRunState`)
- `renderModifierBar()` function and its export from `src/ui/card-view.js`

**Files affected:**
- `src/data/cards/criminal.js` — `std-corrupt-magistrate`, `std-blackmail-ledger`, `std-thieves-guild-pact`
- `src/data/cards/guild-life.js` — `std-inter-guild-tournament`, `std-feast-day`, `std-sparring-accident`, `std-mentorship-program`, `std-guild-morale-slump`
- `src/data/cards/merchants.js` — `std-rare-spice-shipment`, `std-foreign-merchant-guild`, `std-currency-debasement`
- `src/data/cards/political.js` — `std-royal-decree`
- `src/engine/modifiers.js` — delete this file entirely
- `src/ui/card-view.js` — remove `renderModifierBar` function and export
- `src/game.js` — remove import, all call sites of `applyModifiers`, `tickModifiers`, `addModifier`, `createModifierState`, `getActiveModifiers` (including the two usages in `handleWin()` and `handleLoss()` that build the `permanentModifiers` ledger field), and the `buildHeader()` modifier bar rendering call. Also remove the `permanentModifiers` field from the ledger object constructed in both functions.
- `style.css` — remove all `.modifier-bar`, `.mod-*` CSS rules

---

## Section 2 — Small Delta Boost Pass

Any choice where every delta has an absolute value ≤ 5 gets nudged up. The goal is that no choice should feel like "nothing happened."

**Rule:** Increase small deltas by ~3–5 points. A choice at ±3 becomes ±6–8. Deltas already above ±10 are not touched by this pass.

**Constraint:** All boosts must respect the zero-sum rule (Section 5). When a delta is nudged up on one resource, add or increase a compensating delta on another resource in the same choice.

**Scope:** Standard cards, chained cards, faction cards. Crisis cards and NPC cards are out of scope for this pass (crisis cards are intentionally punishing; NPC cards are exempt from zero-sum by design and do not need to be balanced).

---

## Section 3 — World Event Cards

A new card tier representing city-wide or regional events that force meaningful 4-resource trade-offs.

### Card structure

```js
{
  id: 'event-<name>',
  type: 'event',
  npc: { emoji: '...', name: '...', role: '...' },
  situation: '...',
  choices: [
    { label: '...', deltas: { gold: ±N, adventurers: ±N, quests: ±N, equipment: ±N }, major: true, rumorText: null, chains: null },
    { label: '...', deltas: { gold: ±N, adventurers: ±N, quests: ±N, equipment: ±N }, major: true, rumorText: null, chains: null },
  ]
}
```

All event cards are `major: true`. Each choice must affect all 4 resources. The zero-sum rule (Section 5) applies to all event cards.

### Occurrence mechanism

At run start, **3** world event cards are randomly selected from the full event pool (without replacement). These 3 cards are scheduled to appear at `turnCount` values **15, 30, and 45** using the same `firesAtTurn` mechanism as chained cards. The remaining cards are never seen that run.

**Priority rule:** Event cards share the same scheduling queue as chained cards. If a standard draw is requested and `turnCount >= firesAtTurn` for a scheduled event, the event fires first. Events do not interrupt arc milestones, NPC cards, or crisis cards — those take priority if they are also queued.

**Short run edge case:** If `turnCount` reaches end-of-run before a scheduled event fires, that event is silently skipped. No compensation needed.

**Implementation note:** Reuse `queuedChained` / `firesAtTurn` queue structure in `src/engine/queue.js`. World events are added to this queue during `initRun()`. The existing bump logic that defers a chained card's `firesAtTurn` by 1 when a higher-priority card fires applies equally to world events — no special handling needed.

### Card pool — 12 world events

Sums validated against the ±5 zero-sum rule (Section 5). Choice A is the "seize the opportunity" option; Choice B is the "weather it defensively" option.

| ID | Situation | Choice A | Net | Choice B | Net |
|----|-----------|----------|-----|----------|-----|
| `event-dungeon-discovered` | A dungeon complex surfaces near the city | `quests +30, gold -10, adv -10, equip -12` | **-2** | `quests +8, gold -3, adv -3, equip -5` | **-3** |
| `event-plague-outbreak` | A plague sweeps through the city | `gold +12, quests +8, adv -12, equip -10` | **-2** | `gold -8, quests -5, adv -5, equip +15` | **-3** |
| `event-noble-tournament` | A great tournament arrives in the city | `quests +15, gold -12, adv +8, equip -12` | **-1** | `gold +8, quests -5, adv +5, equip -10` | **-2** |
| `event-siege` | Enemy forces besiege the city walls | `adv -15, equip -15, gold +15, quests +12` | **-3** | `gold -10, adv -8, equip +10, quests +5` | **-3** |
| `event-trade-fair` | A grand trade fair floods the city | `gold +25, equip +8, adv -12, quests -22` | **-1** | `gold +8, equip +5, adv -3, quests -12` | **-2** |
| `event-famine` | Crop failures cause city-wide food shortage | `gold -8, adv -10, quests +20, equip -5` | **-3** | `gold -8, adv -5, quests +5, equip +5` | **-3** |
| `event-monster-migration` | A monster migration passes near the city | `adv +20, equip -12, quests +8, gold -18` | **-2** | `adv -5, equip -5, quests +5, gold +3` | **-2** |
| `event-royal-visit` | Royalty arrives for an official visit | `gold -18, adv -8, quests +20, equip +5` | **-1** | `gold -8, adv -3, quests +8, equip +2` | **-1** |
| `event-guild-conclave` | All guilds are summoned to a city conclave | `quests +18, gold -10, adv -5, equip -5` | **-2** | `quests -8, gold +8, adv +3, equip -5` | **-2** |
| `event-earthquake` | A tremor damages buildings across the district | `equip -20, gold -10, adv +15, quests +12` | **-3** | `equip -10, gold -8, adv +5, quests +10` | **-3** |
| `event-river-flood` | The river floods the trade district | `gold -18, equip -10, adv -5, quests +30` | **-3** | `gold -8, equip -5, adv +5, quests +6` | **-2** |
| `event-heresy-panic` | Religious panic grips the city | `quests +20, adv -10, gold -8, equip -5` | **-3** | `quests -5, adv +5, gold +3, equip -6` | **-3** |

### File location

`src/data/cards/events.js` — registered via `src/data/cards/registry.js` (added to `getAllCards()` export, but managed separately from the standard pool — never enters the standard shuffle, only via the event scheduling queue). Event scheduling logic added to `initRun()` in `src/game.js`.

---

## Section 4 — Arc Card Impact Review

Arc cards must be the highest-impact cards in the game. Every arc milestone choice must meet:

- **At least 3 resources affected**
- **At least one delta ≥ ±20**
- **Both choices consequential** — no safe or trivial option on an arc card
- **Zero-sum rule applies** — arc cards are NOT exempt

### Pre-implementation audit of bandit-war arc

The following milestones are known to fail the bar and must be rewritten:

| Milestone | Failing choice | Issue |
|-----------|---------------|-------|
| `bw-m1` | Both choices | Only 2 resources affected, max delta ±5 — far below bar |
| `bw-m3` | Both choices | Single resource only (`gold -20` / `adventurers -5`) |
| `bw-m4` | Choice A | Only 2 resources affected |
| `bw-m5` | Choice A | Single resource only |

Milestones `bw-m2` and `bw-m6` currently meet or approach the bar and need review but not full rewrites.

**Implementation approach:** Read `src/data/arcs/bandit-war.js`, rewrite the 4 failing milestones so each choice hits the bar. Exact delta values are the implementer's authorial decision during the review pass, constrained by the bar above and the zero-sum rule.

**Example target profile:**
```js
// bw-m1 Choice A — before (fails)
{ gold: +5, adventurers: -5 }  // only 2 resources, max ±5

// bw-m1 Choice A — after (target)
{ gold: +15, adventurers: -10, quests: +20, equipment: -22 }  // net: +3 ✓ (3 resources, one delta ≥ ±20)
```

---

## Section 5 — Zero-Sum Rule

**Core principle:** On any non-exempt card, the sum of all resource deltas on a single choice must be within ±5 of zero. Gains must be offset by losses; losses must come with some upside.

```
sum(gold + adventurers + quests + equipment) ∈ [-5, +5]
```

**Exempt:**
- **Crisis cards** — intentionally net-negative; the player pays more than they gain
- **NPC cards** — outcomes reflect relationship quality; a trusted ally may offer pure gains, a hostile NPC may deal only harm

**Not counted in sum:** reputation (secondary axis, not a tracked resource bar)

**Applies to:** standard cards, chained cards, world event cards, arc cards, faction cards

### Enforcement

This rule is verified manually during the delta boost pass (Section 2), world event card authoring (Section 3), and arc card review (Section 4).

An audit script must be created at `scripts/audit-balance.mjs` as part of this implementation. It should:
1. Load all card files (standard, event, arc, faction, chained)
2. For each non-exempt choice, compute `sum(gold + adventurers + quests + equipment)`
3. Flag any choice where the sum falls outside `[-5, +5]`
4. Print a report grouping violations by file

The final implementation step is running this script and resolving all violations before the work is considered complete.

---

## Implementation Order

1. Remove modifier system (data + engine + UI) — no dependencies
2. Create `scripts/audit-balance.mjs` — must exist before any delta changes so violations can be caught immediately
3. Small delta boost pass on standard, chained, and faction cards — run audit script after each file to verify zero-sum
4. Add world events file (`src/data/cards/events.js`) + registration in `registry.js` + occurrence scheduling in `initRun()` in `game.js`
5. Arc card impact review and rewrite of 4 failing milestones
6. Final audit script run — resolve any remaining violations

---

## Out of Scope

- Adding new NPC cards
- New arc storylines
- Changes to crisis card design or delta values
- UI changes beyond modifier bar removal
- Balance changes to NPC cards
