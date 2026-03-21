# Card Impact Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the modifier system, boost weak deltas, add 12 world event cards (3/run), and rewrite 4 arc milestones so every card in the game feels consequential.

**Architecture:** Four independent passes. Modifier removal cleans the engine first. The audit script (`scripts/audit-balance.mjs`) is created next so every subsequent delta change can be verified against the zero-sum rule (sum ∈ [-5,+5]). World events reuse the existing `queuedChained` / `firesAtTurn` mechanism — no new queue infrastructure needed. Arc rewrite is purely authorial.

**Tech Stack:** Vanilla JS ES modules, Node.js for the audit script (ESM via `.mjs`), no build step.

**Spec:** `docs/superpowers/specs/2026-03-21-card-impact-redesign.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/engine/modifiers.js` | **Delete** | Entire modifier engine gone |
| `src/ui/card-view.js` | Modify | Remove `renderModifierBar` |
| `src/game.js` | Modify | Remove all modifier wiring; add event scheduling in `initRun()` |
| `style.css` | Modify | Remove `.modifier-bar` / `.mod-*` CSS |
| `src/data/cards/criminal.js` | Modify | Remove `modifiers` fields; boost pass |
| `src/data/cards/guild-life.js` | Modify | Remove `modifiers` fields; boost pass |
| `src/data/cards/merchants.js` | Modify | Remove `modifiers` fields; boost pass |
| `src/data/cards/political.js` | Modify | Remove `modifiers` fields; boost pass |
| `src/data/cards/standard.js` | Modify | Boost pass (chained cards) |
| `src/data/cards/factions/thieves-guild.js` | Modify | Boost pass |
| `src/data/cards/factions/temple.js` | Modify | Boost pass |
| `src/data/cards/events.js` | **Create** | 12 world event cards |
| `src/data/cards/registry.js` | Modify | Export `worldEventCards` |
| `src/data/arcs/bandit-war.js` | Modify | Rewrite 4 failing milestones |
| `scripts/audit-balance.mjs` | **Create** | Zero-sum audit script |

---

## Task 1: Remove modifier system from engine, UI, and card data

**Files:**
- Delete: `src/engine/modifiers.js`
- Modify: `src/ui/card-view.js`
- Modify: `src/game.js`
- Modify: `style.css`
- Modify: `src/data/cards/criminal.js`
- Modify: `src/data/cards/guild-life.js`
- Modify: `src/data/cards/merchants.js`
- Modify: `src/data/cards/political.js`

- [ ] **Step 1: Delete `src/engine/modifiers.js`**

```bash
git rm src/engine/modifiers.js
```

Note: use `git rm` (not plain `rm`) so the deletion is staged automatically. Do not include it in the `git add` at the end of this task.

- [ ] **Step 2: Remove `renderModifierBar` from `src/ui/card-view.js`**

Delete lines 49–73 (the entire `renderModifierBar` function). Also remove it from the export on line 10 of `game.js` (`renderModifierBar` in the import from `./ui/card-view.js`).

Before (card-view.js line 49):
```js
export function renderModifierBar(modifierState) {
  const mods = modifierState.active
  // ... entire function ...
  return `<div class="modifier-bar">...</div>`
}
```
After: function gone entirely.

- [ ] **Step 3: Remove all modifier wiring from `src/game.js`**

Make the following changes (listed by line number in the current file):

**Line 10** — remove `renderModifierBar` from card-view import:
```js
// Before
import { renderCard, renderCardResult, renderRumorCard, renderModifierBar } from './ui/card-view.js'
// After
import { renderCard, renderCardResult, renderRumorCard } from './ui/card-view.js'
```

**Line 20** — delete the entire modifiers import:
```js
// Delete this line:
import { createModifierState, addModifier, tickModifiers, applyModifiers, getActiveModifiers } from './engine/modifiers.js'
```

**Line 44** — delete:
```js
let modifierState = null
```

**Lines 84–90** — `buildHeader()`, remove modBar:
```js
// Before
function buildHeader() {
  const musicIcon = isMusicEnabled() ? '🎵' : '🔇'
  const guildLine = `<div class="guild-name">⚜️ ${guildName}<button id="music-toggle" class="music-btn" title="Toggle music">${musicIcon}</button></div>`
  const resBar = renderResourceBar(gameState.resources)
  const modBar = renderModifierBar(modifierState)
  return guildLine + resBar + modBar
}

// After
function buildHeader() {
  const musicIcon = isMusicEnabled() ? '🎵' : '🔇'
  const guildLine = `<div class="guild-name">⚜️ ${guildName}<button id="music-toggle" class="music-btn" title="Toggle music">${musicIcon}</button></div>`
  const resBar = renderResourceBar(gameState.resources)
  return guildLine + resBar
}
```

**Line 162** (in `initializeRun`) — delete:
```js
modifierState = createModifierState()
```

**Line 183** (first line of `nextTurn`) — delete:
```js
modifierState = tickModifiers(modifierState)
```

**Lines 308–310** (in `handleChoice`) — simplify:
```js
// Before
const adjustedDeltas = applyModifiers(choice.deltas, modifierState)
gameState = applyChoice(gameState, adjustedDeltas, {})

// After
gameState = applyChoice(gameState, choice.deltas, {})
```

**Lines 317–322** (in `handleChoice`) — delete entire block:
```js
// Delete this:
if (choice.modifiers) {
  for (const mod of choice.modifiers) {
    modifierState = addModifier(modifierState, { ...mod, source: card.id })
  }
}
```

**Line 404** (`autoSave` runState object) — remove `modifierState,`:
```js
// Before
const runState = {
  gameState, queueState, modifierState, relationshipState,
  ...
}

// After
const runState = {
  gameState, queueState, relationshipState,
  ...
}
```

**Line 437** (`handleWin` ledger) — remove `permanentModifiers` line:
```js
// Before
const arcLedger = Object.assign({}, ledger, {
  arcName: arc.title,
  arcOutcome: 'won',
  endCondition: null,
  turnCount: gameState.turnCount,
  guildName,
  relationships: relationshipState,
  factionStances: factionState,
  permanentModifiers: getActiveModifiers(modifierState).filter(m => m.duration === null),
})

// After
const arcLedger = Object.assign({}, ledger, {
  arcName: arc.title,
  arcOutcome: 'won',
  endCondition: null,
  turnCount: gameState.turnCount,
  guildName,
  relationships: relationshipState,
  factionStances: factionState,
})
```

**Line 449** (`handleLoss` ledger) — same removal:
```js
// Before
const arcLedger = Object.assign({}, ledger, {
  arcName: arc.title,
  arcOutcome: 'abandoned',
  endCondition: endCond,
  turnCount: gameState.turnCount,
  guildName,
  relationships: relationshipState,
  factionStances: factionState,
  permanentModifiers: getActiveModifiers(modifierState).filter(m => m.duration === null),
})

// After
const arcLedger = Object.assign({}, ledger, {
  arcName: arc.title,
  arcOutcome: 'abandoned',
  endCondition: endCond,
  turnCount: gameState.turnCount,
  guildName,
  relationships: relationshipState,
  factionStances: factionState,
})
```

**Boot block (~line 492)** — remove `modifierState = restored.modifierState`:
```js
// Before
modifierState = restored.modifierState

// After: delete this line
```

- [ ] **Step 4: Remove modifier CSS from `style.css`**

Delete the entire `/* ===== MODIFIER BAR ===== */` section (lines 153–173):
```css
/* Remove this block entirely: */
/* ===== MODIFIER BAR ===== */
.modifier-bar { ... }
.mod-label { ... }
.mod-pill { ... }
.mod-pill-negative { ... }
.mod-pill-positive { ... }
.mod-pill-permanent { ... }
.mod-negative { ... }
.mod-positive { ... }
.mod-duration { ... }
.mod-permanent { ... }
```

- [ ] **Step 5: Remove `modifiers` field from criminal.js**

Find and delete `modifiers: [...]` from these three cards:
- `std-corrupt-magistrate` (line ~102): `modifiers: [{ id: 'council-favor', label: 'Council Favor', effects: { quests: 8 }, duration: 3 }],`
- `std-blackmail-ledger` (line ~123): `modifiers: [{ id: 'noble-leverage', label: 'Noble Leverage', effects: { gold: 15 }, duration: 4 }],`
- `std-thieves-guild-pact` (line ~176): `modifiers: [{ id: 'street-cred', label: 'Street Credibility', effects: { quests: 10 }, duration: 3 }],`

- [ ] **Step 6: Remove `modifiers` field from guild-life.js**

Delete `modifiers: [...]` from:
- `std-inter-guild-tournament`
- `std-feast-day`
- `std-sparring-accident`
- `std-mentorship-program`
- `std-guild-morale-slump`

- [ ] **Step 7: Remove `modifiers` field from merchants.js**

Delete `modifiers: [...]` from:
- `std-rare-spice-shipment`
- `std-foreign-merchant-guild`
- `std-currency-debasement`

- [ ] **Step 8: Remove `modifiers` field from political.js and merchants.js (additional cards)**

In `political.js`, delete `modifiers: [...]` from:
- `std-royal-decree`
- `std-diplomatic-envoy`
- `std-council-seat`

In `merchants.js`, also delete from:
- `std-trade-district-investment` (not listed in the spec but present in the file)

- [ ] **Step 9: Open the game in a browser and verify**

Load `index.html`. Start a new run. Play several cards. Confirm:
- No modifier bar appears above the resource bar at any point
- No JS errors in console
- Game plays normally to a few turns

- [ ] **Step 10: Commit**

```bash
git add src/engine/modifiers.js src/ui/card-view.js src/game.js style.css \
  src/data/cards/criminal.js src/data/cards/guild-life.js \
  src/data/cards/merchants.js src/data/cards/political.js
git commit -m "feat: remove modifier system entirely (data, engine, UI)"
```

---

## Task 2: Create zero-sum audit script

**Files:**
- Create: `scripts/audit-balance.mjs`

The script loads all non-exempt card files, checks each choice's delta sum, and reports violations. Run it after every delta change in Task 3.

- [ ] **Step 1: Create `scripts/` directory and audit script**

```bash
mkdir -p scripts
```

Create `scripts/audit-balance.mjs`:

```js
// scripts/audit-balance.mjs
// Zero-sum audit: sum(gold + adventurers + quests + equipment) must be in [-5, +5]
// Exempt: crisis cards, NPC cards.
// Run: node scripts/audit-balance.mjs

import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../src')

// Dynamic imports for all non-exempt card files
const { criminalCards }        = await import(`${root}/data/cards/criminal.js`)
const { guildLifeCards }       = await import(`${root}/data/cards/guild-life.js`)
const { merchantCards }        = await import(`${root}/data/cards/merchants.js`)
const { politicalCards }       = await import(`${root}/data/cards/political.js`)
const { chainedCards }         = await import(`${root}/data/cards/standard.js`)
const { thievesGuildAllied, thievesGuildOpposed } = await import(`${root}/data/cards/factions/thieves-guild.js`)
const { templeAllied, templeOpposed } = await import(`${root}/data/cards/factions/temple.js`)
const { banditWar }            = await import(`${root}/data/arcs/bandit-war.js`)

// events.js may not exist yet — import defensively
let worldEventCards = []
try {
  const eventsModule = await import(`${root}/data/cards/events.js`)
  worldEventCards = eventsModule.worldEventCards ?? []
} catch { /* not created yet */ }

const FILES = [
  { name: 'criminal.js',        cards: criminalCards },
  { name: 'guild-life.js',      cards: guildLifeCards },
  { name: 'merchants.js',       cards: merchantCards },
  { name: 'political.js',       cards: politicalCards },
  { name: 'standard.js',        cards: chainedCards },
  { name: 'thieves-guild.js',   cards: [...thievesGuildAllied, ...thievesGuildOpposed] },
  { name: 'temple.js',          cards: [...templeAllied, ...templeOpposed] },
  { name: 'bandit-war.js',      cards: [...banditWar.milestones, ...(banditWar.chainedCards ?? [])] },
  { name: 'events.js',          cards: worldEventCards },
]

const RESOURCES = ['gold', 'adventurers', 'quests', 'equipment']

let totalViolations = 0

for (const { name, cards } of FILES) {
  const violations = []
  for (const card of cards) {
    for (let i = 0; i < card.choices.length; i++) {
      const deltas = card.choices[i].deltas ?? {}
      const sum = RESOURCES.reduce((acc, r) => acc + (deltas[r] ?? 0), 0)
      if (Math.abs(sum) > 5) {
        violations.push(`  ${card.id} choice[${i}] "${card.choices[i].label}": sum=${sum} (${
          RESOURCES.map(r => `${r}:${deltas[r] ?? 0}`).join(', ')
        })`)
      }
    }
  }
  if (violations.length > 0) {
    console.log(`\n❌ ${name} — ${violations.length} violation(s):`)
    violations.forEach(v => console.log(v))
    totalViolations += violations.length
  } else {
    console.log(`✅ ${name}`)
  }
}

console.log(`\n${ totalViolations === 0 ? '✅ All cards pass zero-sum check.' : `❌ ${totalViolations} total violation(s) found.` }`)
process.exit(totalViolations > 0 ? 1 : 0)
```

- [ ] **Step 2: Run the audit script to establish baseline**

```bash
node scripts/audit-balance.mjs
```

This will produce a list of current violations across all files. Save this output — it is the list of cards to fix in Task 3. Expected: many violations, since the zero-sum rule was not applied to existing cards.

- [ ] **Step 3: Commit the audit script**

```bash
git add scripts/audit-balance.mjs
git commit -m "feat: add zero-sum balance audit script"
```

---

## Task 3: Small delta boost pass

**Files:**
- Modify: `src/data/cards/criminal.js`
- Modify: `src/data/cards/guild-life.js`
- Modify: `src/data/cards/merchants.js`
- Modify: `src/data/cards/political.js`
- Modify: `src/data/cards/standard.js`
- Modify: `src/data/cards/factions/thieves-guild.js`
- Modify: `src/data/cards/factions/temple.js`

Two jobs in one pass:

**Job A (boost):** For any choice where ALL deltas have |value| ≤ 5, increase each delta by 3–5 points.

**Job B (zero-sum fix):** For every choice that fails the audit (sum outside [-5,+5]), adjust deltas until sum ∈ [-5,+5]. Add a compensating delta to another resource if needed.

Run `node scripts/audit-balance.mjs` after finishing each file to confirm it passes before moving on.

- [ ] **Step 1: Fix `criminal.js` — boost pass and zero-sum**

For each card, check two things:
1. Are all deltas ≤ ±5? If yes, nudge them up by 3–5 and add a compensating offset.
2. Does the choice fail the audit? If yes, adjust to bring sum into [-5,+5].

Example — `std-prison-break` (both choices are `{ quests: -8 }`, sum = -8, fails zero-sum):
```js
// Before
{ label: 'Cooperate fully',  deltas: { quests: -8 }, ... }
{ label: 'Deny everything',  deltas: { quests: -8 }, ... }

// After — add small upside to bring sum into [-5,+5]
// Note: reputation is a top-level field, not in deltas, not counted in sum
{ label: 'Cooperate fully',  deltas: { quests: -8, gold: 3, adventurers: 2 }, ... }
// sum: -8+3+2 = -3 ✓
{ label: 'Deny everything',  deltas: { quests: -8, gold: 2, adventurers: 3 }, ... }
// sum: -8+2+3 = -3 ✓
```

**Boost rule reminder:** Any choice where ALL deltas are ≤ ±5 — including single-resource choices like `{ quests: -3 }` — automatically qualifies for the boost. Single-resource choices always qualify since having one resource is the minimum. Nudge the existing delta up and add at least one compensating resource to maintain zero-sum.

Work through every card. When done:
```bash
node scripts/audit-balance.mjs 2>&1 | grep criminal
# Expected: ✅ criminal.js
```

- [ ] **Step 2: Fix `guild-life.js` — boost pass and zero-sum**

Same approach. Pay attention to single-resource choices (the baseline scan found 6 in this file: `std-wounded-merc`, `std-alchemist-deal`, `std-sparring-accident`, `std-hazing-complaint`, `std-jolen-tip`, `std-lapsed-license`). Each needs a compensating resource added.

```bash
node scripts/audit-balance.mjs 2>&1 | grep guild-life
# Expected: ✅ guild-life.js
```

- [ ] **Step 3: Fix `merchants.js` — boost pass and zero-sum**

```bash
node scripts/audit-balance.mjs 2>&1 | grep merchants
# Expected: ✅ merchants.js
```

- [ ] **Step 4: Fix `political.js` — boost pass and zero-sum**

Single-resource cards in this file: `std-donation`, `std-diplomatic-incident`, `std-thieves-pardon`. Each needs a compensating resource.

```bash
node scripts/audit-balance.mjs 2>&1 | grep political
# Expected: ✅ political.js
```

- [ ] **Step 5: Fix `standard.js` (chained cards) — zero-sum**

Chained cards are often single-resource. Check and fix each.

```bash
node scripts/audit-balance.mjs 2>&1 | grep standard
# Expected: ✅ standard.js
```

- [ ] **Step 6: Fix faction files — zero-sum**

```bash
node scripts/audit-balance.mjs 2>&1 | grep -E "thieves|temple"
# Expected: ✅ thieves-guild.js  ✅ temple.js
```

- [ ] **Step 7: Run full audit to confirm all fixed files pass**

```bash
node scripts/audit-balance.mjs
# Expected: ✅ All cards pass zero-sum check.
```

- [ ] **Step 8: Commit**

```bash
git add src/data/cards/criminal.js src/data/cards/guild-life.js \
  src/data/cards/merchants.js src/data/cards/political.js \
  src/data/cards/standard.js \
  src/data/cards/factions/thieves-guild.js src/data/cards/factions/temple.js
git commit -m "feat: delta boost pass — raise small deltas and apply zero-sum rule"
```

---

## Task 4: World event cards

**Files:**
- Create: `src/data/cards/events.js`
- Modify: `src/data/cards/registry.js`
- Modify: `src/game.js`

- [ ] **Step 1: Create `src/data/cards/events.js`**

Use the exact delta values from the spec table. All choices are `major: true`, `rumorText: null`, `chains: null`. Each choice must affect all 4 resources.

```js
export const worldEventCards = [
  {
    id: 'event-dungeon-discovered',
    type: 'event',
    npc: { emoji: '🗝️', name: 'City Herald', role: 'Public Announcement' },
    situation: 'A vast dungeon complex has been unearthed beneath the eastern quarry. Adventurers from across the region are already mobilising. The opportunity is enormous — but so is the drain on your resources.',
    choices: [
      { label: 'Send everything — claim first rights', deltas: { quests: 30, gold: -10, adventurers: -10, equipment: -12 }, major: true, reputation: 5, chains: null, rumorText: null },
      { label: 'Hold back — let others take the risk', deltas: { quests: 8, gold: -3, adventurers: -3, equipment: -5 }, major: true, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-plague-outbreak',
    type: 'event',
    npc: { emoji: '🤒', name: 'City Physician', role: 'Medical Authority' },
    situation: 'A virulent plague is spreading through the lower districts. Desperate families are paying any price for protection and medicine. Your guild can profit from the chaos — or invest in containment.',
    choices: [
      { label: 'Profit from the desperation — take the contracts', deltas: { gold: 12, quests: 8, adventurers: -12, equipment: -10 }, major: true, reputation: -5, chains: null, rumorText: null },
      { label: 'Invest in containment — protect your own', deltas: { gold: -8, quests: -5, adventurers: -5, equipment: 15 }, major: true, reputation: 8, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-noble-tournament',
    type: 'event',
    npc: { emoji: '🏆', name: 'Tournament Herald', role: 'Royal Emissary' },
    situation: 'A grand tournament has been announced — jousting, swordsmanship, and archery. Noble houses are sending their best. Your guild could compete for prestige and contracts, but training and entry fees add up.',
    choices: [
      { label: 'Enter the tournament — compete for glory', deltas: { quests: 15, gold: -12, adventurers: 8, equipment: -12 }, major: true, reputation: 8, chains: null, rumorText: null },
      { label: 'Skip competing — sell supplies to participants', deltas: { gold: 8, quests: -5, adventurers: 5, equipment: -10 }, major: true, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-siege',
    type: 'event',
    npc: { emoji: '🏰', name: 'City Commander', role: 'Military Authority' },
    situation: 'Enemy forces have surrounded the outer walls. The city is on lockdown. Trade is paralysed, but the city watch is paying well for guild muscle — and merchants are paying even more for secure deliveries.',
    choices: [
      { label: 'Take the city contracts — fight on the walls', deltas: { adventurers: -15, equipment: -15, gold: 15, quests: 12 }, major: true, reputation: 8, chains: null, rumorText: null },
      { label: 'Fortify the guild hall — wait it out', deltas: { gold: -10, adventurers: -8, equipment: 10, quests: 5 }, major: true, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-trade-fair',
    type: 'event',
    npc: { emoji: '🛒', name: 'Fair Master', role: 'Trade Organisation' },
    situation: 'The annual grand trade fair has arrived — merchants from three kingdoms, rare goods, and enormous crowds. It is the best time of year to move inventory and establish new client relationships. But your people are spread thin running stalls.',
    choices: [
      { label: 'Go all in — run a full guild booth', deltas: { gold: 25, equipment: 8, adventurers: -12, quests: -22 }, major: true, reputation: 5, chains: null, rumorText: null },
      { label: 'Send a small delegation — take modest contracts', deltas: { gold: 8, equipment: 5, adventurers: -3, quests: -12 }, major: true, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-famine',
    type: 'event',
    npc: { emoji: '🌾', name: 'City Steward', role: 'Emergency Coordinator' },
    situation: 'Three consecutive bad harvests have emptied the granaries. Riots are forming in the market district. Guilds that help now will be remembered — and the relief contracts are the only work in the city.',
    choices: [
      { label: 'Lead the relief effort — take the contracts', deltas: { gold: -8, adventurers: -10, quests: 20, equipment: -5 }, major: true, reputation: 12, chains: null, rumorText: null },
      { label: 'Protect your own stores — minimal involvement', deltas: { gold: -8, adventurers: -5, quests: 5, equipment: 5 }, major: true, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-monster-migration',
    type: 'event',
    npc: { emoji: '🐉', name: 'Ranger Captain', role: 'Wilderness Authority' },
    situation: 'A massive migration of creatures from the northern wilds is passing near the city. It is the opportunity of a century for hunters, monster-slayers, and alchemical ingredient suppliers — but the beasts are dangerous and unpredictable.',
    choices: [
      { label: 'Launch a full hunting expedition', deltas: { adventurers: 20, equipment: -12, quests: 8, gold: -18 }, major: true, reputation: 5, chains: null, rumorText: null },
      { label: 'Stay clear — reinforce the city gates instead', deltas: { adventurers: -5, equipment: -5, quests: 5, gold: 3 }, major: true, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-royal-visit',
    type: 'event',
    npc: { emoji: '👑', name: 'Royal Chamberlain', role: 'Crown Representative' },
    situation: 'The crown prince is visiting the city for a week of ceremonies. Every guild is expected to demonstrate loyalty. The contracts from the visit are excellent, but protocol demands your best people stand ceremony duty rather than working.',
    choices: [
      { label: 'Participate fully — assign your best people', deltas: { gold: -18, adventurers: -8, quests: 20, equipment: 5 }, major: true, reputation: 10, chains: null, rumorText: null },
      { label: 'Send a token presence — keep working', deltas: { gold: -8, adventurers: -3, quests: 8, equipment: 2 }, major: true, reputation: 3, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-guild-conclave',
    type: 'event',
    npc: { emoji: '🏛️', name: 'Conclave Scribe', role: 'Guild Authority' },
    situation: 'The city has summoned all registered guilds to a formal conclave to renegotiate operating charters and territory agreements. Sending a strong delegation costs resources — but absence signals weakness.',
    choices: [
      { label: 'Send a full delegation — negotiate aggressively', deltas: { quests: 18, gold: -10, adventurers: -5, equipment: -5 }, major: true, reputation: 8, chains: null, rumorText: null },
      { label: 'Send one representative — low-key presence', deltas: { quests: -8, gold: 8, adventurers: 3, equipment: -5 }, major: true, reputation: -3, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-earthquake',
    type: 'event',
    npc: { emoji: '🌍', name: 'City Engineer', role: 'Disaster Coordinator' },
    situation: 'A tremor has damaged buildings across the guild district. Your hall is intact, but your neighbours are in crisis. The reconstruction contracts are enormous — and so is the danger of collapsed structures.',
    choices: [
      { label: 'Take the reconstruction contracts — dangerous work', deltas: { equipment: -20, gold: -10, adventurers: 15, quests: 12 }, major: true, reputation: 5, chains: null, rumorText: null },
      { label: 'Focus on your own repairs first', deltas: { equipment: -10, gold: -8, adventurers: 5, quests: 10 }, major: true, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-river-flood',
    type: 'event',
    npc: { emoji: '🌊', name: 'Harbour Master', role: 'Port Authority' },
    situation: 'The river has burst its banks, flooding the trade district. The harbour is impassable. Desperate merchants need every available hand to salvage goods, reroute shipments, and rebuild docks. The opportunity is immense — if you can navigate the chaos.',
    choices: [
      { label: 'Mobilise everything — lead the salvage operation', deltas: { gold: -18, equipment: -10, adventurers: -5, quests: 30 }, major: true, reputation: 8, chains: null, rumorText: null },
      { label: 'Offer limited help — prioritise your own stability', deltas: { gold: -8, equipment: -5, adventurers: 5, quests: 6 }, major: true, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'event-heresy-panic',
    type: 'event',
    npc: { emoji: '⛪', name: 'High Inquisitor', role: 'Religious Authority' },
    situation: 'A wave of religious panic has gripped the city after a preacher declared the guild district cursed. Clients are cancelling contracts. The temple is offering indulgences — and investigators are asking questions about everyone.',
    choices: [
      { label: 'Openly back the temple — take the moral high ground', deltas: { quests: 20, adventurers: -10, gold: -8, equipment: -5 }, major: true, reputation: 10, chains: null, rumorText: null },
      { label: 'Stay secular — quietly weather the hysteria', deltas: { quests: -5, adventurers: 5, gold: 3, equipment: -6 }, major: true, reputation: -3, chains: null, rumorText: null },
    ],
  },
]
```

- [ ] **Step 2: Run audit on the new file**

```bash
node scripts/audit-balance.mjs 2>&1 | grep events
# Expected: ✅ events.js
```

- [ ] **Step 3: Export event cards from `registry.js`**

```js
// Before
import { merchantCards } from './merchants.js'
import { politicalCards } from './political.js'
import { criminalCards } from './criminal.js'
import { guildLifeCards } from './guild-life.js'

export function buildBasePool() {
  return [...merchantCards, ...politicalCards, ...criminalCards, ...guildLifeCards]
}

// After — add import and re-export
import { merchantCards } from './merchants.js'
import { politicalCards } from './political.js'
import { criminalCards } from './criminal.js'
import { guildLifeCards } from './guild-life.js'
import { worldEventCards } from './events.js'

export { worldEventCards }

export function buildBasePool() {
  return [...merchantCards, ...politicalCards, ...criminalCards, ...guildLifeCards]
}
```

Note: events never enter `buildBasePool()` — they are scheduled via the chained queue mechanism only.

- [ ] **Step 4: Wire event scheduling into `src/game.js`**

**Add import** at top of file (near other card imports):
```js
import { worldEventCards } from './data/cards/registry.js'
```

**Add events to `ALL_CHAINED`** so `dequeueChained` can find them by ID:
```js
// Before
const ALL_CHAINED = [...standardChained, ...Object.values(ALL_ARCS).flatMap(a => a.chainedCards ?? [])]

// After
const ALL_CHAINED = [
  ...standardChained,
  ...Object.values(ALL_ARCS).flatMap(a => a.chainedCards ?? []),
  ...worldEventCards,
]
```

**Add event scheduling to `initializeRun()`** after `queueState` is created (line ~159), before `showGuildIntro()`:
```js
// After: queueState = { ...createQueueState(), totalMilestones: arc.totalMilestones }
// Add:

// Schedule 3 random world events at turns 15, 30, 45
const shuffledEvents = [...worldEventCards].sort(() => Math.random() - 0.5).slice(0, 3)
const EVENT_TURNS = [15, 30, 45]
shuffledEvents.forEach((event, i) => {
  queueState = queueChained(queueState, event.id, EVENT_TURNS[i])
})
```

- [ ] **Step 5: Open the game and verify world events fire**

Start a new run. Play 15 turns. Confirm:
- A world event card appears around turn 15 with the correct format (all 4 resources shown on both choices)
- The card renders correctly (no crashes)
- After choosing, the game continues normally to turn 30 where the second event fires

- [ ] **Step 6: Commit**

```bash
git add src/data/cards/events.js src/data/cards/registry.js src/game.js
git commit -m "feat: add world event cards (12 cards, 3 per run at turns 15/30/45)"
```

---

## Task 5: Arc card impact review

**Files:**
- Modify: `src/data/arcs/bandit-war.js`

Rewrite the 4 failing milestones. Requirements per choice:
- At least 3 resources affected
- At least one delta ≥ ±20
- Zero-sum: sum ∈ [-5,+5]
- Both choices consequential — no trivially safe option

- [ ] **Step 1: Rewrite `bw-m1` — currently only 2 resources, max ±5**

The situation: a farmer asks you to investigate bandits. Currently Choice A is `{ gold: 5, adventurers: -5 }` — trivially small.

```js
// Before
choices: [
  { label: 'Accept the job', deltas: { gold: 5, adventurers: -5 }, major: true, reputation: 5, ... },
  { label: 'Demand payment first', deltas: { gold: 15, adventurers: -5 }, major: true, reputation: -5, ... },
],

// After — both choices hit the bar (3+ resources, one ≥ ±20, zero-sum)
choices: [
  {
    label: 'Accept the job',
    deltas: { gold: -5, adventurers: -10, quests: 20, equipment: -8 },
    // sum: -5-10+20-8 = -3 ✓ | 3 resources | quests ≥ ±20 ✓
    major: true, reputation: 5, chains: null,
    rumorText: 'The eastern road is quiet — but not empty. Something is watching.'
  },
  {
    label: 'Demand payment first',
    deltas: { gold: 20, adventurers: -8, quests: 5, equipment: -20 },
    // sum: 20-8+5-20 = -3 ✓ | 4 resources | gold ≥ ±20 ✓
    major: true, reputation: -5, chains: null,
    rumorText: 'Coin changes hands. The eastern road waits.'
  },
],
```

- [ ] **Step 2: Rewrite `bw-m3` — currently single-resource choices**

The situation: an informant offers proof of who leads the bandits.

```js
// Before
choices: [
  { label: 'Pay for the proof', deltas: { gold: -20 }, major: true, ... },
  { label: 'Threaten them instead', deltas: { adventurers: 5 }, major: true, ... },
],

// After
choices: [
  {
    label: 'Pay for the proof',
    deltas: { gold: -20, quests: 12, adventurers: -3, equipment: 8 },
    // sum: -20+12-3+8 = -3 ✓ | 4 resources | gold ≥ ±20 ✓
    major: true, reputation: 0, chains: null,
    rumorText: 'The proof is damning. Lord Harwick will not be pleased when he finds out you know.'
  },
  {
    label: 'Threaten them instead',
    deltas: { adventurers: -8, quests: 20, gold: -8, equipment: -8 },
    // sum: -8+20-8-8 = -4 ✓ | 4 resources | quests ≥ ±20 ✓
    major: true, reputation: -5, chains: null,
    rumorText: 'Fear has its uses. The information came cheap — but at a cost to your name.'
  },
],
```

- [ ] **Step 3: Rewrite `bw-m4` Choice A — currently 2 resources**

The situation: ambush on the road.

```js
// Before
choices: [
  { label: 'Fight through', deltas: { adventurers: -12, equipment: -8 }, major: true, reputation: 5, ... },
  { label: 'Negotiate a retreat', deltas: { gold: -15, adventurers: -3 }, major: true, reputation: -5, ... },
],

// After
choices: [
  {
    label: 'Fight through',
    deltas: { adventurers: -20, equipment: -8, quests: 15, gold: 10 },
    // sum: -20-8+15+10 = -3 ✓ | 4 resources | adventurers ≥ ±20 ✓
    major: true, reputation: 5, chains: null, rumorText: null
  },
  {
    label: 'Negotiate a retreat',
    deltas: { gold: -20, adventurers: -3, quests: 12, equipment: 8 },
    // sum: -20-3+12+8 = -3 ✓ | 4 resources | gold ≥ ±20 ✓
    major: true, reputation: -5, chains: null,
    rumorText: 'They let you go — for a price. Some of your crew saw that as weakness.'
  },
],
```

- [ ] **Step 4: Rewrite `bw-m5` Choice A — currently single resource**

The situation: bandit lord offers a deal.

```js
// Before
choices: [
  { label: 'Refuse — end this', deltas: { adventurers: -5 }, major: true, reputation: 5, ... },
  { label: 'Take the deal', deltas: { gold: 10, quests: -15 }, major: true, reputation: -10, ... },
],

// After
choices: [
  {
    label: 'Refuse — end this',
    deltas: { adventurers: -20, equipment: -8, quests: 20, gold: 5 },
    // sum: -20-8+20+5 = -3 ✓ | 4 resources | two deltas ≥ ±20 ✓
    major: true, reputation: 5, chains: null, rumorText: null
  },
  {
    label: 'Take the deal',
    deltas: { gold: 20, quests: -20, adventurers: -3, equipment: 0 },
    // sum: 20-20-3+0 = -3 ✓ | 3 resources | two deltas ≥ ±20 ✓
    major: true, reputation: -10, chains: null,
    rumorText: 'Some will call it pragmatism. Others will call it what it is.'
  },
],
```

- [ ] **Step 5: Review `bw-m2` and `bw-m6-final`**

`bw-m2` Choice A: `{ adventurers: -15, equipment: -10, quests: 12 }` — sum: -13. Violates zero-sum. Fix:
```js
// Before
{ label: 'Full assault — take all three', deltas: { adventurers: -15, equipment: -10, quests: 12 }, ... }

// After (add gold upside to balance; keep 3+ resources, one ≥ ±20 not met — adventurers -15 closest):
{ label: 'Full assault — take all three', deltas: { adventurers: -20, equipment: -10, quests: 20, gold: 8 }, ... }
// sum: -20-10+20+8 = -2 ✓ | 4 resources | two deltas ≥ ±20 ✓
```

`bw-m2` Choice B: `{ adventurers: -8, equipment: -5, quests: 6 }` — sum: -7, marginally out. Fix:
```js
{ label: 'Target the largest camp only', deltas: { adventurers: -8, equipment: -5, quests: 8, gold: 3 }, ... }
// sum: -8-5+8+3 = -2 ✓
```

`bw-m6-final` Choice A: `{ quests: 15, reputation: 5 }` — `reputation` is a top-level field, not in deltas. Actual deltas: `{ quests: 15 }` — sum: 15, fails. Fix to 3+ resources:
```js
{ label: 'Show mercy — exile him', deltas: { quests: 20, adventurers: -8, gold: -8, equipment: -5 }, ... }
// sum: 20-8-8-5 = -1 ✓ | 4 resources | quests ≥ ±20 ✓
```

`bw-m6-final` Choice B: `{ adventurers: -8, quests: 20 }` — sum: 12, fails. Fix:
```js
{ label: 'No mercy', deltas: { adventurers: -15, quests: 20, equipment: -8 }, ... }
// sum: -15+20-8 = -3 ✓ | 3 resources | quests ≥ ±20 ✓
```

- [ ] **Step 6: Fix `chain-bw-survivors` (chained card in `banditWar.chainedCards`)**

This chained card fires after the "Target the largest camp only" choice in bw-m2. Currently both choices fail zero-sum, and Choice A has `reputation` incorrectly placed inside `deltas` instead of as a top-level field.

```js
// Before (in bandit-war.js chainedCards array)
choices: [
  { label: 'Fund the rebuilding', deltas: { gold: -18, quests: -5, reputation: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
  { label: 'Express regret, nothing more', deltas: { quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
],

// After — move reputation out of deltas (it is already a top-level field), fix zero-sum
choices: [
  {
    label: 'Fund the rebuilding',
    deltas: { gold: -18, quests: -5, adventurers: 8, equipment: 12 },
    // sum: -18-5+8+12 = -3 ✓ | 4 resources | no ≥±20 needed (chained card, not arc)
    major: false, reputation: 5, chains: null, rumorText: null
  },
  {
    label: 'Express regret, nothing more',
    deltas: { quests: -10, gold: 5, adventurers: 3 },
    // sum: -10+5+3 = -2 ✓ | 3 resources
    major: false, reputation: -5, chains: null, rumorText: null
  },
],
```

- [ ] **Step 7: Run audit on arc file**

```bash
node scripts/audit-balance.mjs 2>&1 | grep bandit
# Expected: ✅ bandit-war.js
```

- [ ] **Step 7: Commit**

```bash
git add src/data/arcs/bandit-war.js
git commit -m "feat: rewrite arc milestones to meet high-impact bar (3+ resources, ≥±20)"
```

---

## Task 6: Final audit and verification

- [ ] **Step 1: Run the full audit**

```bash
node scripts/audit-balance.mjs
```

Expected output:
```
✅ criminal.js
✅ guild-life.js
✅ merchants.js
✅ political.js
✅ standard.js
✅ thieves-guild.js
✅ temple.js
✅ bandit-war.js
✅ events.js

✅ All cards pass zero-sum check.
```

- [ ] **Step 2: Fix any remaining violations**

If any violations appear, fix them one by one (same approach as Task 3), re-running the audit after each fix until clean.

- [ ] **Step 3: Play through the full game**

Load the game in a browser. Start a new run. Play to completion (win or loss). Verify:
- No modifier bar ever appears
- World events fire around turns 15, 30, 45
- Arc milestones feel significantly more dramatic than standard cards
- No JS console errors throughout

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: card impact redesign complete — modifiers removed, deltas boosted, events added, arc rewritten"
```
