# GuildMaster V2 — Design Spec

**Goal:** Expand depth without making the game complex or hard to read. Add persistent effects, evolving NPCs, dynamic card pools, and narrative continuity while preserving the core identity: simple, fast, choice-driven gameplay.

**Architecture approach:** Layered Engine — each new system is an independent engine module with its own state object, following the existing pattern (state.js, queue.js, reputation.js). The game loop in game.js wires them together sequentially.

---

## 1. Modifier System

### Data Model

```js
{
  id: 'thieves-guild-tax',
  label: 'Guild Tax',
  description: 'Thieves demand a cut',
  effects: { gold: -10 },          // percentage modifier applied to resource deltas
  duration: 4,                      // turns remaining; null = permanent
  source: 'std-protection-racket',  // card that created it
}
```

### Rules

- After each choice resolves, before resources are clamped, the engine iterates active modifiers and applies percentage adjustments to resource deltas.
- Temporary modifiers tick down by 1 each turn. Removed at duration 0.
- Permanent modifiers (duration: null) are rare — only attached to major narrative choices. They never tick down.
- Soft cap of ~5 active modifiers. If exceeded, the oldest temporary modifier is displaced. Permanent modifiers are never displaced.

### Card Integration

A card choice gains an optional `modifiers` array:

```js
{ label: 'Pay the fee',
  deltas: { gold: -10 },
  modifiers: [{ id: 'protection', label: 'Protection Racket', effects: { gold: -10 }, duration: 3 }]
}
```

### Engine Module

`src/engine/modifiers.js` — pure functions:
- `createModifierState()` → empty modifier list
- `addModifier(state, modifier)` → adds to list, enforces soft cap
- `tickModifiers(state)` → decrements durations, removes expired
- `applyModifiers(deltas, state)` → returns adjusted deltas
- `getActiveModifiers(state)` → returns current list for UI

### UI

A small bar between the resource bar and the card, showing active modifiers as compact pills:
- Negative temporary: red background, resource icon, percentage, amber duration counter (e.g., `💰 -10% 3⏱`)
- Positive temporary: green background, same layout
- Permanent: blue/purple background, `∞` instead of counter
- Duration text uses warm amber (#e7a04c), bold weight, 0.8rem — designed for readability on dark backgrounds

---

## 2. Relationship System

### Data Model

```js
// Run-level relationship state
{
  'sister-maren': { level: 0, flags: [] },
  'jolen-fence':  { level: 0, flags: [] },
}
```

### Relationship Scale

5-point scale centered at 0:

```
-2  Hostile
-1  Rival
 0  Stranger (default)
+1  Friendly
+2  Ally
```

Each NPC encounter can shift the level by +1 or -1 based on the player's choice. With 3 encounters per NPC per run, the maximum reachable is +2 or -2 (requires committing the same direction at least 2 out of 3 times).

### NPC Selection at Run Start

- At the beginning of each run, the player selects **2 NPCs** from the available pool (~4-6 NPCs total)
- Selection screen shows each NPC's emoji, name, role, and a short flavor line describing their theme (e.g., "Faith, healing, moral dilemmas")
- The 2 selected NPCs **alternate** appearances between arc milestones: NPC-A appears in cycle 1, NPC-B in cycle 2, NPC-A in cycle 3, etc.
- Each NPC appears **3 times** per run (6 arc milestones / 2 NPCs)
- Non-selected NPCs do not appear during the run

### NPC Card Structure

Each NPC has **6 unique cards** — one per encounter, with content varying by current relationship level:

- **Encounter 1** (always at level 0): 1 card
- **Encounter 2** (level is -1 or +1): 2 card variants
- **Encounter 3** (level is -2, 0, or +2): 3 card variants

Total: **6 cards per NPC**.

The engine resolves which variant to show based on encounter number + current level.

### Card Choice Integration

A choice gains an optional `relationships` field:

```js
{ label: 'Donate generously',
  deltas: { gold: -12 },
  relationships: [{ npc: 'sister-maren', shift: +1, flag: 'donated' }]
}
```

- `shift`: moves the level by this amount (clamped to [-2, +2])
- `flag`: records a specific decision for variant selection and third-choice conditions

### Content Design Principle

**No tier is objectively better.** Each relationship level creates different opportunities and different risks:
- An ally might offer good deals that come with strings attached
- A hostile NPC's botched sabotage might accidentally reveal useful information
- Tiers change the *shape* of trade-offs, not the overall power level

### NPC Tier Display

The NPC's current relationship level appears next to their name on their card:
- `Sister Maren (Ally)` — green badge
- `Jolen the Fence (Rival)` — orange badge
- No badge shown for Stranger (level 0)

### Flags

Simple string flags recorded per NPC (e.g., `donated`, `refused-goods`, `reported-to-guard`). Used for:
- Selecting specific card text variants within a tier
- Third-choice condition checks
- Attribution text generation

### Engine Module

`src/engine/relationships.js` — pure functions:
- `createRelationshipState(selectedNpcs)` → initial state for 2 NPCs at level 0
- `updateRelationship(state, npcId, shift, flag)` → adjusts level, records flag
- `getLevel(state, npcId)` → returns current level
- `getFlags(state, npcId)` → returns flag array
- `resolveNpcCard(npcData, encounterNumber, level)` → returns the correct card variant
- `getNextNpc(state, encounterCount)` → returns which NPC appears this cycle (alternating)

---

## 3. Card Pool & Cycle System

### Cycle-Based Repeat Prevention

- A `playedThisCycle` Set tracks every standard card ID drawn since the last arc milestone
- When an arc milestone fires, the Set is cleared — all cards become available again
- Crisis, chained, NPC, and rumor cards are exempt (they're queue-driven or scheduled, not pool-drawn)

### Pool Assembly

At run start, the base pool is assembled from category files:

```
src/data/cards/
├── merchants.js      (~25 cards)
├── political.js      (~25 cards)
├── criminal.js       (~20 cards)
├── guild-life.js     (~25 cards)
├── npcs/
│   ├── sister-maren.js  (6 cards)
│   ├── jolen-fence.js   (6 cards)
│   ├── sergeant-brek.js (6 cards)
│   └── lord-farwick.js  (6 cards)
├── factions/
│   ├── thieves-guild.js (injected when stance taken)
│   └── temple.js        (injected when allied/opposed)
└── registry.js       (assembles full base pool)
```

**Target: ~100-200 standard cards** in the base pool, ensuring high variety across runs.

### NPC Card Scheduling

NPC cards are **not drawn randomly from the pool**. They are scheduled events:
- The queue system inserts an NPC card between each arc milestone
- NPCs alternate: NPC-A in cycle 1, NPC-B in cycle 2, etc.
- NPC cards take priority over standard draws when scheduled

### Dynamic Pool Modifications

Mid-run, faction stance choices can inject or remove cards:
- `injectCards(poolState, cards)` — adds faction-specific cards to the draw pool
- `removeCards(poolState, cardIds)` — removes cards from the draw pool
- A faction stance change also triggers a one-time narrative card announcing the consequence

### Third Choice System

Hidden third choices can appear on **arc cards** (not NPC cards). Conditions are defined per card:

```js
{
  cardId: 'bw-m5',
  conditions: {
    relationships: { 'jolen-fence': { maxLevel: -1 } },
    flags: { 'jolen-fence': ['refused-goods'] },
    resources: { gold: { min: 40 }, adventurers: { min: 30 } },
    factions: { 'thieves-guild': 'opposed' },
  },
  choice: { label: 'Raid her operation', deltas: { ... }, ... }
}
```

At draw time, the engine checks all conditions. If met, the third choice is **silently injected** into the card's choices array. No UI indication of why — it just appears. The player connects the dots themselves.

### UI for Third Choice

When 3 choices exist, the layout adapts:
- The first 2 choices remain in a 2-column grid
- The third choice appears as a full-width button below
- No special tag, no "Unlocked" label — it's presented naturally
- The structural difference (3 instead of 2) is the signal

### Engine Module

`src/engine/pool.js` — pure functions:
- `createPoolState(baseCards)` → pool with played-tracking Set
- `drawCard(poolState)` → random draw from unplayed cards
- `markPlayed(poolState, cardId)` → adds to played Set
- `injectCards(poolState, cards)` → adds to active pool
- `removeCards(poolState, cardIds)` → removes from active pool
- `resetCycle(poolState)` → clears played Set (called on arc milestone)
- `checkThirdChoice(card, conditions, relationshipState, gameState, factionState)` → returns choice or null

---

## 4. Faction System

### Data Model

```js
// Run-level faction state
factions: {
  'thieves-guild': 'neutral',  // 'neutral' | 'allied' | 'opposed'
  'temple': 'neutral',
}
```

### Stance Changes

Faction stances are set by major choices on specific cards. A choice gains an optional `factions` field:

```js
{ label: 'Report them to the guard',
  deltas: { ... },
  factions: [{ id: 'thieves-guild', stance: 'opposed' }]
}
```

When a stance changes from neutral:
1. Faction-specific cards are injected into (or removed from) the pool
2. A one-time narrative card fires announcing the consequence
3. A modifier may be applied (e.g., opposing thieves → temporary gold penalty)

### Scope

Start with 2 factions for the bandit-war arc. Factions are arc-scoped — different arcs can introduce different factions.

---

## 5. Narrative Continuity

### Attribution

Cards that reference past events use an `attribution` field:

```js
{
  situation: 'Sister Maren arrives with a quiet request...',
  attribution: 'Maren remembers your generosity at the temple.',
  choices: [...]
}
```

Displayed below the NPC role line, in italic, slightly dimmer color (#7a7a9a). Only on cards that are direct consequences of past choices. Never on third choices (those are mysterious).

### Ledger Enrichment

The end-of-run ledger gains:
- **Guild name** in the header: "The [guild name] lasted X turns"
- **NPC relationship outcomes**: "Sister Maren (Ally) — stood by you to the end"
- **Faction stances**: "Opposed the Thieves' Guild. Allied with the Temple."
- **Active permanent modifiers** listed as "Legacies of this run"

---

## 6. Guild Naming & Auto-Save

### Guild Naming

- At run start, before the intro screen, a text input: "Name your guild"
- Pre-filled with the last used name (stored in `guildmaster_progress`)
- The guild name appears:
  - Intro screen header (replaces hardcoded "Iron Hearth Guild")
  - Small text above the resource bar during gameplay (e.g., "⚜️ The Silver Wolves")
  - End-of-run ledger header

### Auto-Save

- Full run state serialized to localStorage after every choice resolution
- Key: `guildmaster_run` (mid-run state), existing `guildmaster_progress` (meta-progression)
- On page load: if `guildmaster_run` exists, resume directly at next card
- On run end (win/loss): clear `guildmaster_run`, persist only progression
- Single save slot — no slot management

### Export/Import (Low Priority)

- Small buttons on the intro screen: "Export Save" / "Import Save"
- Exports full localStorage state as base64-encoded JSON string
- Player copies/pastes — no file picker

---

## 7. UI Adjustments

### Modifier Bar

New UI element between resource bar and card. Shows active modifier pills. Hides when no modifiers are active.

### NPC Tier Badge

Inline badge next to NPC name: `Sister Maren (Ally)`. Color-coded:
- Green for positive tiers (Friendly, Ally)
- Orange for negative tiers (Rival, Hostile)
- Hidden for Stranger

### Attribution Line

Below NPC role, italic, #7a7a9a color. Only shown when the card has an `attribution` field.

### Third Choice Layout

When 3 choices exist:
- 2-column grid for first two choices
- Full-width button below for the third
- No special decoration — the layout shift is the signal

### Guild Name

Small, unobtrusive text above the resource bar: `⚜️ The Silver Wolves` in muted color (#555).

---

## 8. Game Loop Changes

The updated turn sequence in game.js:

```
nextTurn()
  1. tickModifiers() — decrement durations, remove expired
  2. Detect tension zone crossings → queueCrisis()
  3. Check if NPC card is scheduled this cycle
  4. advanceQueue() → get next card type
  5. Route to card type:
     'arc'      → show arc milestone, resetCycle()
     'npc'      → resolveNpcCard(), show NPC encounter
     'crisis'   → dequeueCrisis(), show crisis card
     'chained'  → dequeueChained(), show followup
     'rumor'    → dequeueRumor(), show flavor text
     'standard' → drawCard() from pool, show choice card
  6. showCard() → render with modifiers bar, NPC tier, attribution
```

Choice resolution gains:
```
handleChoice()
  1. applyModifiers(deltas, modifierState) → adjusted deltas
  2. applyChoice(gameState, adjustedDeltas)
  3. Apply reputation shift
  4. Process choice.modifiers → addModifier() for each
  5. Process choice.relationships → updateRelationship() for each
  6. Process choice.factions → update stance, inject/remove pool cards
  7. Check third-choice conditions for upcoming arc cards
  8. Queue chained/rumor events
  9. Auto-save full state to localStorage
  10. Check win/loss conditions
```

---

## 9. New Engine Modules Summary

| Module | State Object | Pure Functions |
|--------|-------------|----------------|
| `engine/modifiers.js` | `modifierState` | createModifierState, addModifier, tickModifiers, applyModifiers, getActiveModifiers |
| `engine/relationships.js` | `relationshipState` | createRelationshipState, updateRelationship, getLevel, getFlags, resolveNpcCard, getNextNpc |
| `engine/pool.js` | `poolState` | createPoolState, drawCard, markPlayed, injectCards, removeCards, resetCycle, checkThirdChoice |
| `engine/factions.js` | `factionState` | createFactionState, updateStance, getStance, getInjectedCards |

All modules follow the existing pattern: pure functions, no side effects, state passed in and returned.

---

## 10. Content Requirements

### Cards
- **Standard cards**: expand from ~32 to ~100-200, organized by category
- **NPC cards**: 6 per NPC, 4 NPCs minimum = 24 NPC cards
- **Faction cards**: ~5-10 per faction, 2 factions = 10-20 faction cards
- **Third-choice conditions**: 2-3 per arc, defined as condition objects

### Content Design Rules
1. No relationship tier is objectively better — each creates different opportunities and risks
2. Third choices are hidden discoveries — no UI hints, multi-factor conditions
3. Modifiers should feel like natural consequences, not arbitrary penalties
4. Attribution text is short and evocative — one line, present tense
5. Faction stances should create meaningful pool changes, not just a label
