# GuildMaster V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add modifier system, NPC relationships, dynamic card pool, factions, guild naming, and auto-save to GuildMaster while preserving the simple, fast, choice-driven core.

**Architecture:** Layered Engine — each new system is an independent engine module (`src/engine/*.js`) with pure functions and its own state object. The game loop in `game.js` wires them sequentially. Existing modules (`state.js`, `queue.js`, `reputation.js`, `ledger.js`, `progression.js`) remain unchanged except for queue.js which gains NPC card type support.

**Tech Stack:** Vanilla JS (ES modules), Vitest 2.0 for tests, localStorage for persistence. No build tools. No frameworks.

**Spec:** `docs/superpowers/specs/2026-03-19-guildmaster-v2-design.md`

---

## File Structure

### New Engine Modules
- `src/engine/modifiers.js` — Modifier state management (add, tick, apply, cap enforcement)
- `src/engine/relationships.js` — NPC relationship tracking (level, flags, card resolution)
- `src/engine/pool.js` — Card pool management (draw, cycle tracking, inject/remove)
- `src/engine/factions.js` — Faction stance tracking (stance changes, card injection rules)
- `src/engine/save.js` — Run state serialization/deserialization for auto-save

### New Test Files
- `tests/engine/modifiers.test.js`
- `tests/engine/relationships.test.js`
- `tests/engine/pool.test.js`
- `tests/engine/factions.test.js`
- `tests/engine/save.test.js`

### Card Data Restructure
- `src/data/cards/merchants.js` — Merchant/trade cards (move existing + add new)
- `src/data/cards/political.js` — Political/noble cards (move existing + add new)
- `src/data/cards/criminal.js` — Criminal/underworld cards (move existing + add new)
- `src/data/cards/guild-life.js` — Guild management cards (move existing + add new)
- `src/data/cards/npcs/sister-maren.js` — 6 NPC cards (encounter × level variants)
- `src/data/cards/npcs/jolen-fence.js` — 6 NPC cards
- `src/data/cards/npcs/sergeant-brek.js` — 6 NPC cards
- `src/data/cards/npcs/lord-farwick.js` — 6 NPC cards
- `src/data/cards/npcs/index.js` — NPC registry (metadata for selection screen)
- `src/data/cards/factions/thieves-guild.js` — Faction-specific cards
- `src/data/cards/factions/temple.js` — Faction-specific cards
- `src/data/cards/registry.js` — Assembles full base pool from all category files
- `src/data/cards/standard.js` — **Deleted** (replaced by category files)
- `src/data/cards/third-choices.js` — Third-choice condition definitions for arc cards

### Modified Files
- `src/engine/queue.js` — Add `'npc'` card type to advanceQueue priority
- `src/ui/card-view.js` — Add attribution line, NPC tier badge, third-choice layout, modifier bar
- `src/ui/intro-view.js` — Add guild naming screen, NPC selection screen
- `src/ui/ledger-view.js` — Add enriched ledger sections
- `src/game.js` — Wire all new systems into game loop + auto-save
- `style.css` — New CSS for modifier bar, NPC badge, attribution, third-choice layout, guild name

---

## Task 1: Modifier Engine

**Files:**
- Create: `src/engine/modifiers.js`
- Create: `tests/engine/modifiers.test.js`

- [ ] **Step 1: Write tests for createModifierState and addModifier**

```js
// tests/engine/modifiers.test.js
import { describe, it, expect } from 'vitest'
import {
  createModifierState, addModifier, tickModifiers,
  applyModifiers, getActiveModifiers
} from '../../src/engine/modifiers.js'

describe('modifiers', () => {
  it('creates empty modifier state', () => {
    const state = createModifierState()
    expect(state.active).toEqual([])
  })

  it('adds a modifier', () => {
    let state = createModifierState()
    state = addModifier(state, {
      id: 'test', label: 'Test', effects: { gold: -10 }, duration: 3, source: 'card-1'
    })
    expect(state.active).toHaveLength(1)
    expect(state.active[0].id).toBe('test')
  })

  it('enforces soft cap of 5 by displacing oldest temporary', () => {
    let state = createModifierState()
    for (let i = 0; i < 5; i++) {
      state = addModifier(state, {
        id: `mod-${i}`, label: `Mod ${i}`, effects: { gold: -1 }, duration: 3, source: `card-${i}`
      })
    }
    state = addModifier(state, {
      id: 'mod-overflow', label: 'Overflow', effects: { gold: -1 }, duration: 3, source: 'card-x'
    })
    expect(state.active).toHaveLength(5)
    expect(state.active.find(m => m.id === 'mod-0')).toBeUndefined()
    expect(state.active.find(m => m.id === 'mod-overflow')).toBeDefined()
  })

  it('does not displace permanent modifiers when enforcing cap', () => {
    let state = createModifierState()
    state = addModifier(state, {
      id: 'perm', label: 'Permanent', effects: { gold: 5 }, duration: null, source: 'arc-1'
    })
    for (let i = 0; i < 4; i++) {
      state = addModifier(state, {
        id: `temp-${i}`, label: `Temp ${i}`, effects: { gold: -1 }, duration: 3, source: `card-${i}`
      })
    }
    // Now at 5 — add one more, should displace oldest TEMPORARY (temp-0), not permanent
    state = addModifier(state, {
      id: 'temp-overflow', label: 'Overflow', effects: { gold: -1 }, duration: 3, source: 'card-x'
    })
    expect(state.active).toHaveLength(5)
    expect(state.active.find(m => m.id === 'perm')).toBeDefined()
    expect(state.active.find(m => m.id === 'temp-0')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/engine/modifiers.test.js`
Expected: FAIL — module not found

- [ ] **Step 3: Implement createModifierState and addModifier**

```js
// src/engine/modifiers.js
const MAX_MODIFIERS = 5

export function createModifierState() {
  return { active: [] }
}

export function addModifier(state, modifier) {
  let active = [...state.active, modifier]
  if (active.length > MAX_MODIFIERS) {
    const tempIdx = active.findIndex(m => m.duration !== null)
    if (tempIdx !== -1) active.splice(tempIdx, 1)
  }
  return { ...state, active }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/engine/modifiers.test.js`
Expected: PASS

- [ ] **Step 5: Write tests for tickModifiers**

```js
// Add to tests/engine/modifiers.test.js
describe('tickModifiers', () => {
  it('decrements temporary durations by 1', () => {
    let state = createModifierState()
    state = addModifier(state, {
      id: 'test', label: 'Test', effects: { gold: -10 }, duration: 3, source: 'card-1'
    })
    state = tickModifiers(state)
    expect(state.active[0].duration).toBe(2)
  })

  it('removes modifiers at duration 0', () => {
    let state = createModifierState()
    state = addModifier(state, {
      id: 'expiring', label: 'Expiring', effects: { gold: -10 }, duration: 1, source: 'card-1'
    })
    state = tickModifiers(state)
    expect(state.active).toHaveLength(0)
  })

  it('does not tick permanent modifiers', () => {
    let state = createModifierState()
    state = addModifier(state, {
      id: 'perm', label: 'Permanent', effects: { gold: 5 }, duration: null, source: 'arc-1'
    })
    state = tickModifiers(state)
    expect(state.active).toHaveLength(1)
    expect(state.active[0].duration).toBeNull()
  })
})
```

- [ ] **Step 6: Implement tickModifiers**

```js
// Add to src/engine/modifiers.js
export function tickModifiers(state) {
  const active = state.active
    .map(m => m.duration === null ? m : { ...m, duration: m.duration - 1 })
    .filter(m => m.duration === null || m.duration > 0)
  return { ...state, active }
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run tests/engine/modifiers.test.js`
Expected: PASS

- [ ] **Step 8: Write tests for applyModifiers and getActiveModifiers**

```js
// Add to tests/engine/modifiers.test.js
describe('applyModifiers', () => {
  it('applies percentage adjustments to deltas', () => {
    let state = createModifierState()
    state = addModifier(state, {
      id: 'tax', label: 'Tax', effects: { gold: -10 }, duration: 3, source: 'card-1'
    })
    const deltas = { gold: -20, quests: 5 }
    const adjusted = applyModifiers(deltas, state)
    // gold: -20 adjusted by -10% → -20 + (-20 * -0.10) = -20 + 2 = -18
    expect(adjusted.gold).toBe(-18)
    expect(adjusted.quests).toBe(5)
  })

  it('stacks multiple modifiers on same resource', () => {
    let state = createModifierState()
    state = addModifier(state, {
      id: 'a', label: 'A', effects: { gold: -10 }, duration: 3, source: 'card-1'
    })
    state = addModifier(state, {
      id: 'b', label: 'B', effects: { gold: -20 }, duration: 2, source: 'card-2'
    })
    const deltas = { gold: -100 }
    const adjusted = applyModifiers(deltas, state)
    // gold: -100 adjusted by -30% → -100 + (-100 * -0.30) = -100 + 30 = -70
    expect(adjusted.gold).toBe(-70)
  })

  it('returns original deltas when no modifiers active', () => {
    const state = createModifierState()
    const deltas = { gold: -20, quests: 5 }
    const adjusted = applyModifiers(deltas, state)
    expect(adjusted).toEqual(deltas)
  })
})

describe('getActiveModifiers', () => {
  it('returns the active list', () => {
    let state = createModifierState()
    state = addModifier(state, {
      id: 'test', label: 'Test', effects: { gold: -10 }, duration: 3, source: 'card-1'
    })
    expect(getActiveModifiers(state)).toHaveLength(1)
  })
})
```

- [ ] **Step 9: Implement applyModifiers and getActiveModifiers**

```js
// Add to src/engine/modifiers.js
export function applyModifiers(deltas, state) {
  if (state.active.length === 0) return deltas

  // Sum percentage effects per resource
  const totalEffects = {}
  for (const mod of state.active) {
    for (const [res, pct] of Object.entries(mod.effects)) {
      totalEffects[res] = (totalEffects[res] ?? 0) + pct
    }
  }

  // Apply as percentage: delta + (delta * totalPct / 100)
  const adjusted = { ...deltas }
  for (const [res, pct] of Object.entries(totalEffects)) {
    if (adjusted[res] !== undefined && adjusted[res] !== 0) {
      adjusted[res] = Math.round(adjusted[res] + (adjusted[res] * pct / 100))
    }
  }
  return adjusted
}

export function getActiveModifiers(state) {
  return state.active
}
```

- [ ] **Step 10: Run all modifier tests**

Run: `npx vitest run tests/engine/modifiers.test.js`
Expected: all PASS

- [ ] **Step 11: Commit**

```bash
git add src/engine/modifiers.js tests/engine/modifiers.test.js
git commit -m "feat: add modifier engine (create, tick, apply, cap)"
```

---

## Task 2: Relationship Engine

**Files:**
- Create: `src/engine/relationships.js`
- Create: `tests/engine/relationships.test.js`

- [ ] **Step 1: Write tests for createRelationshipState and updateRelationship**

```js
// tests/engine/relationships.test.js
import { describe, it, expect } from 'vitest'
import {
  createRelationshipState, updateRelationship, getLevel,
  getFlags, resolveNpcCard, getNextNpc
} from '../../src/engine/relationships.js'

describe('relationships', () => {
  it('creates state for selected NPCs at level 0', () => {
    const state = createRelationshipState(['sister-maren', 'jolen-fence'])
    expect(state['sister-maren']).toEqual({ level: 0, flags: [] })
    expect(state['jolen-fence']).toEqual({ level: 0, flags: [] })
  })

  it('updates relationship level by shift', () => {
    let state = createRelationshipState(['sister-maren', 'jolen-fence'])
    state = updateRelationship(state, 'sister-maren', +1, 'donated')
    expect(getLevel(state, 'sister-maren')).toBe(1)
    expect(getFlags(state, 'sister-maren')).toContain('donated')
  })

  it('clamps level to [-2, +2]', () => {
    let state = createRelationshipState(['sister-maren', 'jolen-fence'])
    state = updateRelationship(state, 'sister-maren', +1, 'a')
    state = updateRelationship(state, 'sister-maren', +1, 'b')
    state = updateRelationship(state, 'sister-maren', +1, 'c')
    expect(getLevel(state, 'sister-maren')).toBe(2)
  })

  it('clamps negative levels to -2', () => {
    let state = createRelationshipState(['sister-maren', 'jolen-fence'])
    state = updateRelationship(state, 'sister-maren', -1, 'a')
    state = updateRelationship(state, 'sister-maren', -1, 'b')
    state = updateRelationship(state, 'sister-maren', -1, 'c')
    expect(getLevel(state, 'sister-maren')).toBe(-2)
  })

  it('accumulates flags', () => {
    let state = createRelationshipState(['sister-maren', 'jolen-fence'])
    state = updateRelationship(state, 'sister-maren', +1, 'donated')
    state = updateRelationship(state, 'sister-maren', +1, 'helped')
    expect(getFlags(state, 'sister-maren')).toEqual(['donated', 'helped'])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/engine/relationships.test.js`
Expected: FAIL

- [ ] **Step 3: Implement createRelationshipState, updateRelationship, getLevel, getFlags**

```js
// src/engine/relationships.js
export function createRelationshipState(selectedNpcs) {
  const state = {}
  for (const npc of selectedNpcs) {
    state[npc] = { level: 0, flags: [] }
  }
  return state
}

export function updateRelationship(state, npcId, shift, flag) {
  const npc = state[npcId]
  if (!npc) return state
  const level = Math.max(-2, Math.min(2, npc.level + shift))
  const flags = flag ? [...npc.flags, flag] : [...npc.flags]
  return { ...state, [npcId]: { level, flags } }
}

export function getLevel(state, npcId) {
  return state[npcId]?.level ?? 0
}

export function getFlags(state, npcId) {
  return state[npcId]?.flags ?? []
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/engine/relationships.test.js`
Expected: PASS

- [ ] **Step 5: Write tests for resolveNpcCard and getNextNpc**

```js
// Add to tests/engine/relationships.test.js
describe('resolveNpcCard', () => {
  const npcData = {
    encounter1: { level0: { id: 'e1-l0', situation: 'First meeting' } },
    encounter2: {
      levelNeg1: { id: 'e2-l-1', situation: 'Rival encounter 2' },
      levelPos1: { id: 'e2-l+1', situation: 'Friendly encounter 2' },
    },
    encounter3: {
      levelNeg2: { id: 'e3-l-2', situation: 'Hostile encounter 3' },
      level0: { id: 'e3-l0', situation: 'Neutral encounter 3' },
      levelPos2: { id: 'e3-l+2', situation: 'Ally encounter 3' },
    },
  }

  it('resolves encounter 1 at level 0', () => {
    const card = resolveNpcCard(npcData, 1, 0)
    expect(card.id).toBe('e1-l0')
  })

  it('resolves encounter 2 at level +1', () => {
    const card = resolveNpcCard(npcData, 2, 1)
    expect(card.id).toBe('e2-l+1')
  })

  it('resolves encounter 3 at level -2', () => {
    const card = resolveNpcCard(npcData, 3, -2)
    expect(card.id).toBe('e3-l-2')
  })
})

describe('getNextNpc', () => {
  it('alternates between two NPCs', () => {
    const npcs = ['sister-maren', 'jolen-fence']
    expect(getNextNpc(npcs, 0)).toBe('sister-maren')
    expect(getNextNpc(npcs, 1)).toBe('jolen-fence')
    expect(getNextNpc(npcs, 2)).toBe('sister-maren')
    expect(getNextNpc(npcs, 3)).toBe('jolen-fence')
  })
})
```

- [ ] **Step 6: Implement resolveNpcCard and getNextNpc**

```js
// Add to src/engine/relationships.js
const LEVEL_KEYS = {
  '-2': 'levelNeg2', '-1': 'levelNeg1',
  '0': 'level0',
  '1': 'levelPos1', '2': 'levelPos2',
}

export function resolveNpcCard(npcData, encounterNumber, level) {
  const encounterKey = `encounter${encounterNumber}`
  const levelKey = encounterNumber === 1 ? 'level0' : LEVEL_KEYS[String(level)]
  return npcData[encounterKey]?.[levelKey] ?? null
}

export function getNextNpc(selectedNpcs, encounterCount) {
  return selectedNpcs[encounterCount % selectedNpcs.length]
}
```

- [ ] **Step 7: Run all relationship tests**

Run: `npx vitest run tests/engine/relationships.test.js`
Expected: all PASS

- [ ] **Step 8: Commit**

```bash
git add src/engine/relationships.js tests/engine/relationships.test.js
git commit -m "feat: add relationship engine (levels, flags, card resolution, NPC alternation)"
```

---

## Task 3: Card Pool Engine

**Files:**
- Create: `src/engine/pool.js`
- Create: `tests/engine/pool.test.js`

- [ ] **Step 1: Write tests for pool creation, draw, and cycle reset**

```js
// tests/engine/pool.test.js
import { describe, it, expect } from 'vitest'
import {
  createPoolState, drawCard, markPlayed,
  injectCards, removeCards, resetCycle, checkThirdChoice
} from '../../src/engine/pool.js'

const mockCards = [
  { id: 'a', type: 'standard' },
  { id: 'b', type: 'standard' },
  { id: 'c', type: 'standard' },
]

describe('pool', () => {
  it('creates pool state from base cards', () => {
    const state = createPoolState(mockCards)
    expect(state.baseCards).toHaveLength(3)
    expect(state.playedThisCycle.size).toBe(0)
    expect(state.injected).toEqual([])
    expect(state.removed).toEqual([])
  })

  it('draws a card from unplayed pool', () => {
    const state = createPoolState(mockCards)
    const { card, updatedState } = drawCard(state)
    expect(mockCards.map(c => c.id)).toContain(card.id)
    expect(updatedState.playedThisCycle.has(card.id)).toBe(true)
  })

  it('does not draw already-played cards', () => {
    let state = createPoolState(mockCards)
    state = markPlayed(state, 'a')
    state = markPlayed(state, 'b')
    const { card } = drawCard(state)
    expect(card.id).toBe('c')
  })

  it('resetCycle clears played set', () => {
    let state = createPoolState(mockCards)
    state = markPlayed(state, 'a')
    state = markPlayed(state, 'b')
    state = resetCycle(state)
    expect(state.playedThisCycle.size).toBe(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/engine/pool.test.js`
Expected: FAIL

- [ ] **Step 3: Implement createPoolState, drawCard, markPlayed, resetCycle**

```js
// src/engine/pool.js
export function createPoolState(baseCards) {
  return {
    baseCards: [...baseCards],
    playedThisCycle: new Set(),
    injected: [],
    removed: [],
  }
}

export function drawCard(state) {
  const available = getAvailableCards(state)
  if (available.length === 0) {
    // All cards played this cycle — reset and draw
    const reset = resetCycle(state)
    const pool = getAvailableCards(reset)
    const card = pool[Math.floor(Math.random() * pool.length)]
    return { card, updatedState: markPlayed(reset, card.id) }
  }
  const card = available[Math.floor(Math.random() * available.length)]
  return { card, updatedState: markPlayed(state, card.id) }
}

function getAvailableCards(state) {
  const removedSet = new Set(state.removed)
  return [...state.baseCards, ...state.injected]
    .filter(c => !state.playedThisCycle.has(c.id) && !removedSet.has(c.id))
}

export function markPlayed(state, cardId) {
  const played = new Set(state.playedThisCycle)
  played.add(cardId)
  return { ...state, playedThisCycle: played }
}

export function resetCycle(state) {
  return { ...state, playedThisCycle: new Set() }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/engine/pool.test.js`
Expected: PASS

- [ ] **Step 5: Write tests for injectCards, removeCards**

```js
// Add to tests/engine/pool.test.js
describe('dynamic pool', () => {
  it('injectCards adds cards to pool', () => {
    let state = createPoolState(mockCards)
    state = injectCards(state, [{ id: 'd', type: 'faction' }])
    expect(state.injected).toHaveLength(1)
    const { card } = drawCard(markPlayed(markPlayed(markPlayed(state, 'a'), 'b'), 'c'))
    expect(card.id).toBe('d')
  })

  it('removeCards excludes cards from draws', () => {
    let state = createPoolState(mockCards)
    state = removeCards(state, ['a', 'b'])
    const { card } = drawCard(state)
    expect(card.id).toBe('c')
  })
})
```

- [ ] **Step 6: Implement injectCards, removeCards**

```js
// Add to src/engine/pool.js
export function injectCards(state, cards) {
  return { ...state, injected: [...state.injected, ...cards] }
}

export function removeCards(state, cardIds) {
  return { ...state, removed: [...state.removed, ...cardIds] }
}
```

- [ ] **Step 7: Write test for checkThirdChoice**

```js
// Add to tests/engine/pool.test.js
describe('checkThirdChoice', () => {
  it('returns choice when all conditions met', () => {
    const conditions = {
      relationships: { 'jolen-fence': { maxLevel: -1 } },
      flags: { 'jolen-fence': ['refused-goods'] },
      resources: { gold: { min: 40 } },
      factions: { 'thieves-guild': 'opposed' },
    }
    const thirdChoice = { label: 'Raid her operation', deltas: { gold: -20 } }
    const relState = { 'jolen-fence': { level: -2, flags: ['refused-goods'] } }
    const gameState = { resources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 } }
    const factionState = { 'thieves-guild': 'opposed' }

    const result = checkThirdChoice(conditions, thirdChoice, relState, gameState, factionState)
    expect(result).toEqual(thirdChoice)
  })

  it('returns null when relationship condition not met', () => {
    const conditions = {
      relationships: { 'jolen-fence': { maxLevel: -1 } },
    }
    const thirdChoice = { label: 'Raid', deltas: {} }
    const relState = { 'jolen-fence': { level: 0, flags: [] } }
    const gameState = { resources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 } }
    const factionState = {}

    const result = checkThirdChoice(conditions, thirdChoice, relState, gameState, factionState)
    expect(result).toBeNull()
  })

  it('returns null when resource condition not met', () => {
    const conditions = {
      resources: { gold: { min: 40 } },
    }
    const thirdChoice = { label: 'Raid', deltas: {} }
    const relState = {}
    const gameState = { resources: { gold: 20, adventurers: 50, quests: 50, equipment: 50 } }
    const factionState = {}

    const result = checkThirdChoice(conditions, thirdChoice, relState, gameState, factionState)
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 8: Implement checkThirdChoice**

```js
// Add to src/engine/pool.js
export function checkThirdChoice(conditions, thirdChoice, relState, gameState, factionState) {
  // Check relationship levels
  if (conditions.relationships) {
    for (const [npc, req] of Object.entries(conditions.relationships)) {
      const level = relState[npc]?.level ?? 0
      if (req.minLevel !== undefined && level < req.minLevel) return null
      if (req.maxLevel !== undefined && level > req.maxLevel) return null
    }
  }

  // Check flags
  if (conditions.flags) {
    for (const [npc, requiredFlags] of Object.entries(conditions.flags)) {
      const flags = relState[npc]?.flags ?? []
      for (const f of requiredFlags) {
        if (!flags.includes(f)) return null
      }
    }
  }

  // Check resources
  if (conditions.resources) {
    for (const [res, req] of Object.entries(conditions.resources)) {
      const val = gameState.resources[res] ?? 0
      if (req.min !== undefined && val < req.min) return null
      if (req.max !== undefined && val > req.max) return null
    }
  }

  // Check factions
  if (conditions.factions) {
    for (const [factionId, requiredStance] of Object.entries(conditions.factions)) {
      if ((factionState[factionId] ?? 'neutral') !== requiredStance) return null
    }
  }

  return thirdChoice
}
```

- [ ] **Step 9: Run all pool tests**

Run: `npx vitest run tests/engine/pool.test.js`
Expected: all PASS

- [ ] **Step 10: Commit**

```bash
git add src/engine/pool.js tests/engine/pool.test.js
git commit -m "feat: add card pool engine (draw, cycle tracking, inject/remove, third-choice check)"
```

---

## Task 4: Faction Engine

**Files:**
- Create: `src/engine/factions.js`
- Create: `tests/engine/factions.test.js`

- [ ] **Step 1: Write tests**

```js
// tests/engine/factions.test.js
import { describe, it, expect } from 'vitest'
import {
  createFactionState, updateStance, getStance
} from '../../src/engine/factions.js'

describe('factions', () => {
  it('creates neutral state for all factions', () => {
    const state = createFactionState(['thieves-guild', 'temple'])
    expect(getStance(state, 'thieves-guild')).toBe('neutral')
    expect(getStance(state, 'temple')).toBe('neutral')
  })

  it('updates stance', () => {
    let state = createFactionState(['thieves-guild', 'temple'])
    state = updateStance(state, 'thieves-guild', 'opposed')
    expect(getStance(state, 'thieves-guild')).toBe('opposed')
    expect(getStance(state, 'temple')).toBe('neutral')
  })

  it('returns neutral for unknown factions', () => {
    const state = createFactionState(['thieves-guild'])
    expect(getStance(state, 'unknown')).toBe('neutral')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/engine/factions.test.js`
Expected: FAIL

- [ ] **Step 3: Implement factions engine**

```js
// src/engine/factions.js
export function createFactionState(factionIds) {
  const state = {}
  for (const id of factionIds) {
    state[id] = 'neutral'
  }
  return state
}

export function updateStance(state, factionId, stance) {
  return { ...state, [factionId]: stance }
}

export function getStance(state, factionId) {
  return state[factionId] ?? 'neutral'
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/engine/factions.test.js`
Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add src/engine/factions.js tests/engine/factions.test.js
git commit -m "feat: add faction engine (stance tracking)"
```

---

## Task 5: Save Engine

**Files:**
- Create: `src/engine/save.js`
- Create: `tests/engine/save.test.js`

- [ ] **Step 1: Write tests for serialization/deserialization**

```js
// tests/engine/save.test.js
import { describe, it, expect } from 'vitest'
import { serializeRunState, deserializeRunState } from '../../src/engine/save.js'

describe('save', () => {
  it('serializes and deserializes run state roundtrip', () => {
    const runState = {
      gameState: { resources: { gold: 42 }, turnCount: 5 },
      queueState: { milestonesCompleted: 2 },
      modifierState: { active: [{ id: 'test', duration: 3 }] },
      relationshipState: { 'maren': { level: 1, flags: ['donated'] } },
      poolState: {
        baseCards: [{ id: 'a' }],
        playedThisCycle: new Set(['a']),
        injected: [],
        removed: [],
      },
      factionState: { 'thieves-guild': 'opposed' },
      ledger: { events: ['test event'] },
      arcId: 'bandit-war',
      guildName: 'Silver Wolves',
      selectedNpcs: ['sister-maren', 'jolen-fence'],
      npcEncounterCount: 2,
    }

    const json = serializeRunState(runState)
    expect(typeof json).toBe('string')

    const restored = deserializeRunState(json)
    expect(restored.gameState.resources.gold).toBe(42)
    expect(restored.poolState.playedThisCycle).toBeInstanceOf(Set)
    expect(restored.poolState.playedThisCycle.has('a')).toBe(true)
    expect(restored.factionState['thieves-guild']).toBe('opposed')
    expect(restored.guildName).toBe('Silver Wolves')
  })

  it('returns null for invalid JSON', () => {
    expect(deserializeRunState('not-json')).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/engine/save.test.js`
Expected: FAIL

- [ ] **Step 3: Implement save engine**

```js
// src/engine/save.js
export function serializeRunState(runState) {
  const serializable = {
    ...runState,
    poolState: {
      ...runState.poolState,
      playedThisCycle: [...runState.poolState.playedThisCycle],
    },
  }
  return JSON.stringify(serializable)
}

export function deserializeRunState(json) {
  try {
    const parsed = JSON.parse(json)
    parsed.poolState.playedThisCycle = new Set(parsed.poolState.playedThisCycle)
    return parsed
  } catch {
    return null
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/engine/save.test.js`
Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add src/engine/save.js tests/engine/save.test.js
git commit -m "feat: add save engine (serialize/deserialize run state with Set support)"
```

---

## Task 6: Update Queue System for NPC Cards

**Files:**
- Modify: `src/engine/queue.js`
- Modify: `tests/engine/queue.test.js`

- [ ] **Step 1: Write test for NPC card type in advanceQueue**

```js
// Add to tests/engine/queue.test.js
describe('npc card scheduling', () => {
  it('returns npc card type when npc is scheduled and standard counter > 0', () => {
    let q = createQueueState()
    q = { ...q, totalMilestones: 6, npcScheduledThisCycle: true }
    q = recordStandardCardPlayed(q)
    const result = advanceQueue(q, 1)
    // NPC fires after at least 1 standard card when scheduled
    // Priority: arc > crisis > chained > npc > rumor > standard
    expect(result.nextCardType).toBe('npc')
  })

  it('does not return npc when not scheduled', () => {
    let q = createQueueState()
    q = { ...q, totalMilestones: 6, npcScheduledThisCycle: false }
    q = recordStandardCardPlayed(q)
    const result = advanceQueue(q, 1)
    expect(result.nextCardType).not.toBe('npc')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/engine/queue.test.js`
Expected: FAIL — npcScheduledThisCycle not recognized

- [ ] **Step 3: Add NPC support to queue.js**

Add `npcScheduledThisCycle: false` to `createQueueState()` return value.

In `advanceQueue()`, add NPC check after chained check and before rumor check:

```js
// After chained check, before rumor check in advanceQueue:
if (q.npcScheduledThisCycle && q.standardCardsSinceLastMilestone >= 1) {
  return { nextCardType: 'npc', chainedCardId: null }
}
```

Add helper functions:

```js
export function scheduleNpc(q) {
  return { ...q, npcScheduledThisCycle: true }
}

export function clearNpcSchedule(q) {
  return { ...q, npcScheduledThisCycle: false }
}
```

- [ ] **Step 4: Run all queue tests**

Run: `npx vitest run tests/engine/queue.test.js`
Expected: all PASS (existing + new)

- [ ] **Step 5: Commit**

```bash
git add src/engine/queue.js tests/engine/queue.test.js
git commit -m "feat: add NPC card type to queue priority (arc > crisis > chained > npc > rumor > standard)"
```

---

## Task 7: Card Data Restructure

**Files:**
- Create: `src/data/cards/merchants.js`
- Create: `src/data/cards/political.js`
- Create: `src/data/cards/criminal.js`
- Create: `src/data/cards/guild-life.js`
- Create: `src/data/cards/registry.js`
- Modify: `src/data/cards/standard.js` → delete after migration
- Modify: `src/game.js` — update import to use registry

This task reorganizes the existing 32 standard cards into themed categories and adds the registry. No new cards yet — just restructure.

- [ ] **Step 1: Create merchants.js — move trade/merchant-themed cards**

Move these card IDs from `standard.js` into `src/data/cards/merchants.js`:
- `std-equipment-merchant` (Greta the Ironmonger)
- `std-unhappy-client` (Merchant Peldan)
- `std-caravan-escort` (Merchant Consortium)
- `std-bad-batch` (Outfitter Hess)
- `std-abandoned-supplies` (Scavenger Crew)
- `std-debt-collection` (Moneylender Vas)
- `std-fence` (Jolen the Fence)
- `std-rumored-treasure` (Excited Prospector)

Export as `export const merchantCards = [...]`

- [ ] **Step 2: Create political.js — move political/social-themed cards**

Move these card IDs into `src/data/cards/political.js`:
- `std-tax-collector` (Aldric the Scribe)
- `std-minor-lord` (Lord Farwick)
- `std-donation` (Sister Maren)
- `std-festival-sponsor` (Festival Organiser)
- `std-noble-party` (Lady Thessa)
- `std-drought-relief` (Village Elder Ros)
- `std-siege-of-equipment` (City Quartermaster)
- `std-inquisitor-visit` (Inquisitor Fenn)

Export as `export const politicalCards = [...]`

- [ ] **Step 3: Create criminal.js — move underworld-themed cards**

Move these card IDs into `src/data/cards/criminal.js`:
- `std-rival-spy` (Unknown Figure)
- `std-protection-racket` (Thieves' Guild Enforcer)
- `std-escaped-prisoner` (Escaped Prisoner)
- `std-prison-break` (City Warden Crale)
- `std-rival-smear` (Rival Guild Herald)
- `std-haunted-job` (Superstitious Client)

Export as `export const criminalCards = [...]`

- [ ] **Step 4: Create guild-life.js — move guild management cards**

Move these card IDs into `src/data/cards/guild-life.js`:
- `std-wounded-merc` (A Wounded Mercenary)
- `std-young-recruit` (Tam)
- `std-old-map` (An Old Cartographer)
- `std-overdue-quest` (Guild Accountant)
- `std-training-master` (Sergeant Brek)
- `std-monster-sighting` (Terrified Shepherd)
- `std-alchemist-deal` (Maeva the Alchemist)
- `std-scholar-request` (Scholar Davin)
- `std-guild-expansion` (Master Builder Oren)
- `std-veteran-retires` (Old Garrus)

Export as `export const guildLifeCards = [...]`

- [ ] **Step 5: Create registry.js**

After migration, `standard.js` retains only the chained cards export. The standard cards are moved to category files.

```js
// src/data/cards/standard.js — after migration, only chained cards remain
export const chainedCards = [
  // ... keep all existing chained cards (chain-alchemist-done, chain-treasure-dig,
  //     chain-tax-ignored, chain-merc-healed)
]
```

```js
// src/data/cards/registry.js
import { merchantCards } from './merchants.js'
import { politicalCards } from './political.js'
import { criminalCards } from './criminal.js'
import { guildLifeCards } from './guild-life.js'

export function buildBasePool() {
  return [
    ...merchantCards,
    ...politicalCards,
    ...criminalCards,
    ...guildLifeCards,
  ]
}
```

- [ ] **Step 6: Update game.js imports**

Replace:
```js
import { standardCards, chainedCards as standardChained } from './data/cards/standard.js'
```

With:
```js
import { buildBasePool } from './data/cards/registry.js'
import { chainedCards as standardChained } from './data/cards/standard.js'
```

In `startRun()`, build the pool:
```js
const baseCards = buildBasePool()
```

Replace direct `standardCards` references in `drawStandardCard()` — this will be fully replaced in Task 12 (game loop integration) when the pool engine is wired in.

- [ ] **Step 7: Run existing tests to verify nothing broke**

Run: `npx vitest run`
Expected: all existing tests PASS

- [ ] **Step 8: Commit**

```bash
git add src/data/cards/merchants.js src/data/cards/political.js src/data/cards/criminal.js src/data/cards/guild-life.js src/data/cards/registry.js src/data/cards/standard.js src/game.js
git commit -m "refactor: split standard cards into themed category files with registry"
```

---

## Task 8: NPC Card Data

**Files:**
- Create: `src/data/cards/npcs/sister-maren.js`
- Create: `src/data/cards/npcs/jolen-fence.js`
- Create: `src/data/cards/npcs/sergeant-brek.js`
- Create: `src/data/cards/npcs/lord-farwick.js`
- Create: `src/data/cards/npcs/index.js`

Each NPC file exports 6 card variants using the encounter/level structure from Task 2.

- [ ] **Step 1: Create NPC index with metadata for selection screen**

```js
// src/data/cards/npcs/index.js
import { sisterMarenCards } from './sister-maren.js'
import { jolenFenceCards } from './jolen-fence.js'
import { sergeantBrekCards } from './sergeant-brek.js'
import { lordFarwickCards } from './lord-farwick.js'

export const npcRegistry = {
  'sister-maren': {
    id: 'sister-maren',
    emoji: '🙏',
    name: 'Sister Maren',
    role: 'Temple Priest',
    flavor: 'Faith, healing, moral dilemmas',
    cards: sisterMarenCards,
  },
  'jolen-fence': {
    id: 'jolen-fence',
    emoji: '🤫',
    name: 'Jolen the Fence',
    role: 'Black Market Contact',
    flavor: 'Crime, deals, moral grey areas',
    cards: jolenFenceCards,
  },
  'sergeant-brek': {
    id: 'sergeant-brek',
    emoji: '🏋️',
    name: 'Sergeant Brek',
    role: 'Combat Instructor',
    flavor: 'Training, discipline, warfare',
    cards: sergeantBrekCards,
  },
  'lord-farwick': {
    id: 'lord-farwick',
    emoji: '👑',
    name: 'Lord Farwick',
    role: 'Minor Nobleman',
    flavor: 'Politics, contracts, power plays',
    cards: lordFarwickCards,
  },
}

export const allNpcIds = Object.keys(npcRegistry)
```

- [ ] **Step 2: Create sister-maren.js with 6 encounter variants**

Write 6 cards following the encounter×level structure. Each choice includes a `relationships` field to shift the level. Follow the design rule: no tier is objectively better. Include `attribution` text on encounter 2 and 3 variants.

The file exports: `export const sisterMarenCards = { encounter1: { level0: {...} }, encounter2: { levelNeg1: {...}, levelPos1: {...} }, encounter3: { levelNeg2: {...}, level0: {...}, levelPos2: {...} } }`

Content guidelines:
- Encounter 1: Introduction — neutral situation, choices set initial direction
- Encounter 2: Relationship develops — different situations based on +1 or -1
- Encounter 3: Culmination — most divergent, each level has distinct trade-offs
- Ally doesn't mean "better deals" — it means different opportunities with different strings
- Hostile doesn't mean "punishment" — it means different paths open up

- [ ] **Step 3: Create jolen-fence.js with 6 encounter variants**

Same structure. Jolen's theme: underground economy, stolen goods, risk/reward. Follow the same content guidelines.

- [ ] **Step 4: Create sergeant-brek.js with 6 encounter variants**

Same structure. Brek's theme: military training, discipline, hard choices about personnel.

- [ ] **Step 5: Create lord-farwick.js with 6 encounter variants**

Same structure. Farwick's theme: political alliances, noble favors, court intrigue.

- [ ] **Step 6: Commit**

```bash
git add src/data/cards/npcs/
git commit -m "feat: add 4 NPCs with 6 encounter variant cards each (24 NPC cards total)"
```

---

## Task 9: Faction Card Data & Third-Choice Definitions

**Files:**
- Create: `src/data/cards/factions/thieves-guild.js`
- Create: `src/data/cards/factions/temple.js`
- Create: `src/data/cards/third-choices.js`

- [ ] **Step 1: Create thieves-guild.js faction cards**

```js
// src/data/cards/factions/thieves-guild.js
// Cards injected when player takes a stance (allied or opposed)
export const thievesGuildAllied = [
  // ~5 cards available when allied with thieves
  // Theme: underground favors, cheap goods, dirty jobs, risk of exposure
]

export const thievesGuildOpposed = [
  // ~5 cards available when opposed to thieves
  // Theme: retaliation, sabotage, but also law enforcement cooperation
]
```

Write ~5 cards per stance. Each card follows the standard card format with `id`, `type: 'standard'`, `npc`, `situation`, `choices`.

- [ ] **Step 2: Create temple.js faction cards**

Same structure: `templeAllied` (~5 cards) and `templeOpposed` (~5 cards).

- [ ] **Step 3: Create third-choices.js**

```js
// src/data/cards/third-choices.js
// Third-choice conditions for arc cards in bandit-war
export const banditWarThirdChoices = [
  {
    cardId: 'bw-m3',
    conditions: {
      relationships: { 'jolen-fence': { maxLevel: -1 } },
      flags: { 'jolen-fence': ['refused-goods'] },
      resources: { gold: { min: 40 } },
    },
    choice: {
      label: 'Expose the informant\'s employer',
      deltas: { gold: -15, quests: 15 },
      major: true, reputation: 10, chains: null, rumorText: 'Names were named. Powerful people are not happy.',
    },
  },
  {
    cardId: 'bw-m5',
    conditions: {
      relationships: { 'sister-maren': { minLevel: 2 } },
      factions: { 'temple': 'allied' },
      resources: { adventurers: { min: 30 } },
    },
    choice: {
      label: 'Offer sanctuary through the temple',
      deltas: { adventurers: -10, quests: 20 },
      major: true, reputation: 15, chains: null, rumorText: 'An unusual alliance. The temple shelters those who lay down arms.',
    },
  },
]
```

- [ ] **Step 4: Commit**

```bash
git add src/data/cards/factions/ src/data/cards/third-choices.js
git commit -m "feat: add faction cards (thieves-guild, temple) and third-choice definitions"
```

---

## Task 10: UI Updates — Card View

**Files:**
- Modify: `src/ui/card-view.js`
- Modify: `style.css`

- [ ] **Step 1: Add modifier bar render function**

```js
// Add to src/ui/card-view.js
export function renderModifierBar(modifierState) {
  const mods = modifierState.active
  if (mods.length === 0) return ''

  const pills = mods.map(mod => {
    const entries = Object.entries(mod.effects)
    const parts = entries.map(([res, pct]) => {
      const icon = RESOURCE_ICONS[res] || res
      const sign = pct > 0 ? '+' : ''
      const cls = pct > 0 ? 'mod-positive' : 'mod-negative'
      return `<span class="${cls}">${icon} ${sign}${pct}%</span>`
    }).join(' ')

    const durationText = mod.duration === null
      ? '<span class="mod-duration mod-permanent">∞</span>'
      : `<span class="mod-duration">${mod.duration} ⏱</span>`

    const cls = mod.duration === null ? 'mod-pill mod-pill-permanent' :
      Object.values(mod.effects).some(v => v > 0) ? 'mod-pill mod-pill-positive' : 'mod-pill mod-pill-negative'

    return `<div class="${cls}">${parts} ${durationText}</div>`
  }).join('')

  return `<div class="modifier-bar"><span class="mod-label">Effects</span>${pills}</div>`
}
```

- [ ] **Step 2: Add attribution line and NPC tier badge to renderCard**

Update `renderCard()` in card-view.js:
- After the NPC role line, if `card.attribution` exists, render: `<div class="attribution">${card.attribution}</div>`
- After the NPC name, if `card.npcTier` exists and is not 0, render a tier badge: `<span class="npc-tier npc-tier-${tierClass}">${tierLabel}</span>`

Add helper:
```js
const TIER_LABELS = { '-2': 'Hostile', '-1': 'Rival', '1': 'Friendly', '2': 'Ally' }
const TIER_CLASSES = { '-2': 'hostile', '-1': 'rival', '1': 'friendly', '2': 'ally' }
```

- [ ] **Step 3: Update renderCard for third-choice layout**

When `card.choices.length === 3`, change the choices HTML:
```js
const choicesHtml = card.choices.length === 3
  ? `<div class="choices choices-three">
      <div class="choices-row">${card.choices.slice(0, 2).map(renderChoiceBtn).join('')}</div>
      <div class="choices-third">${renderChoiceBtn(card.choices[2], 2)}</div>
    </div>`
  : `<div class="choices">${card.choices.map(renderChoiceBtn).join('')}</div>`
```

Extract choice rendering into a helper function `renderChoiceBtn(choice, idx)`.

- [ ] **Step 4: Add CSS for new UI elements**

Add to `style.css`:

```css
/* ===== MODIFIER BAR ===== */
.modifier-bar {
  display: flex; gap: 0.4rem; padding: 0.5rem 0.75rem;
  background: #16161b; border-radius: 8px;
  align-items: center; flex-wrap: wrap; margin-bottom: 1rem;
}
.mod-label {
  font-size: 0.7rem; color: #555; text-transform: uppercase;
  letter-spacing: 0.05em; margin-right: 0.25rem;
}
.mod-pill {
  display: inline-flex; align-items: center; gap: 0.3rem;
  border-radius: 6px; padding: 0.3rem 0.55rem; font-size: 0.85rem;
}
.mod-pill-negative { background: #2a1a1a; border: 1px solid #552222; }
.mod-pill-positive { background: #1a2a1a; border: 1px solid #225522; }
.mod-pill-permanent { background: #1a1a2a; border: 1px solid #333388; }
.mod-negative { color: #e74c3c; }
.mod-positive { color: #5b5; }
.mod-duration { color: #e7a04c; font-size: 0.8rem; font-weight: 600; border-left: 1px solid #444; padding-left: 0.35rem; }
.mod-permanent { color: #8888ff; }

/* ===== NPC TIER BADGE ===== */
.npc-tier {
  font-size: 0.8rem; font-weight: 400; margin-left: 0.3rem;
  border-radius: 4px; padding: 0.1rem 0.4rem;
}
.npc-tier-friendly, .npc-tier-ally { color: #5b5; border: 1px solid #3a5a3a; }
.npc-tier-rival, .npc-tier-hostile { color: #e7a04c; border: 1px solid #5a4a2a; }

/* ===== ATTRIBUTION ===== */
.attribution { font-size: 0.85rem; color: #7a7a9a; font-style: italic; margin-bottom: 1rem; }

/* ===== THIRD CHOICE ===== */
.choices-three .choices-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }
.choices-third .choice-btn { width: 100%; }

/* ===== GUILD NAME ===== */
.guild-name { text-align: center; font-size: 0.8rem; color: #555; margin-bottom: 0.4rem; letter-spacing: 0.05em; }
```

- [ ] **Step 5: Commit**

```bash
git add src/ui/card-view.js style.css
git commit -m "feat: add modifier bar, NPC tier badge, attribution line, third-choice layout UI"
```

---

## Task 11: UI Updates — Guild Naming & NPC Selection Screens

**Files:**
- Modify: `src/ui/intro-view.js`

- [ ] **Step 1: Add guild naming screen**

```js
// Add to src/ui/intro-view.js
export function renderGuildNaming(previousName) {
  const defaultName = previousName || 'Iron Hearth Guild'
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🏰</div>
    <div class="npc-name">Name Your Guild</div>
    <div class="situation">Every guild begins with a name. Choose one that will be remembered.</div>
    <input type="text" id="guild-name-input" class="guild-input" value="${defaultName}" maxlength="30" />
    <button class="continue-btn" id="continue-btn">Continue →</button>
  </div>`
}
```

- [ ] **Step 2: Add NPC selection screen**

```js
// Add to src/ui/intro-view.js
export function renderNpcSelection(npcList) {
  const cards = npcList.map(npc => `
    <div class="npc-select-card" data-npc-id="${npc.id}">
      <div class="npc-select-portrait">${npc.emoji}</div>
      <div class="npc-select-name">${npc.name}</div>
      <div class="npc-select-role">${npc.role}</div>
      <div class="npc-select-flavor">${npc.flavor}</div>
    </div>
  `).join('')

  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🤝</div>
    <div class="npc-name">Choose Your Contacts</div>
    <div class="situation">Pick 2 NPCs who will appear throughout your run.</div>
    <div class="npc-select-grid">${cards}</div>
    <button class="continue-btn" id="npc-confirm-btn" disabled>Select 2 to continue →</button>
  </div>`
}
```

- [ ] **Step 3: Add CSS for naming input and NPC selection**

Add to `style.css`:

```css
/* ===== GUILD NAMING ===== */
.guild-input {
  width: 100%; padding: 0.8rem; font-size: 1.1rem; text-align: center;
  background: #2a2a3a; border: 1px solid #444; border-radius: 10px;
  color: #f0f0f0; margin-bottom: 0.5rem; outline: none;
}
.guild-input:focus { border-color: #4a9eff; }

/* ===== NPC SELECTION ===== */
.npc-select-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 1rem; }
.npc-select-card {
  background: #2a2a3a; border: 1px solid #444; border-radius: 10px;
  padding: 1rem; text-align: center; cursor: pointer; transition: border-color 0.15s;
}
.npc-select-card:hover { border-color: #4a9eff; }
.npc-select-card.selected { border: 2px solid #5b5; }
.npc-select-portrait { font-size: 2rem; margin-bottom: 0.3rem; }
.npc-select-name { font-weight: 600; font-size: 0.95rem; }
.npc-select-role { font-size: 0.75rem; color: #888; }
.npc-select-flavor { font-size: 0.75rem; color: #aaa; margin-top: 0.4rem; font-style: italic; }
```

- [ ] **Step 4: Commit**

```bash
git add src/ui/intro-view.js style.css
git commit -m "feat: add guild naming and NPC selection screens"
```

---

## Task 12: UI Updates — Ledger Enrichment

**Files:**
- Modify: `src/ui/ledger-view.js`
- Modify: `src/engine/ledger.js`

- [ ] **Step 1: Update buildLedgerText to accept V2 data**

Add parameters to `buildLedgerText` for V2 enrichment. The function signature becomes:

```js
export function buildLedgerText({ events, adventurerStatus, arcName, arcOutcome,
  endCondition, turnCount, guildName, relationships, factionStances, permanentModifiers })
```

Add sections:
- Guild name in header: `"The ${guildName} lasted ${turnCount} turn(s)."`
- NPC outcomes: `"Sister Maren (Ally) — stood by you to the end."`
- Faction stances: `"Opposed the Thieves' Guild."`
- Permanent modifiers: `"Legacy: Guild Tax (gold -10%)"`

Maintain backward compatibility — new params are optional and default to empty.

- [ ] **Step 2: Update renderLedgerScreen for richer display**

No structural changes needed — the function already renders `ledgerText`. The enriched text from step 1 flows through automatically.

- [ ] **Step 3: Run existing ledger tests to check backward compatibility**

Run: `npx vitest run tests/engine/ledger.test.js`
Expected: all PASS

- [ ] **Step 4: Commit**

```bash
git add src/engine/ledger.js src/ui/ledger-view.js
git commit -m "feat: enrich ledger with guild name, NPC relationships, faction stances"
```

---

## Task 13: Game Loop Integration

**Files:**
- Modify: `src/game.js`

This is the largest integration task. It wires all new engine modules into the game loop.

- [ ] **Step 1: Add imports for all new modules**

```js
import { createModifierState, addModifier, tickModifiers, applyModifiers, getActiveModifiers } from './engine/modifiers.js'
import { createRelationshipState, updateRelationship, getLevel, getFlags, resolveNpcCard, getNextNpc } from './engine/relationships.js'
import { createPoolState, drawCard, markPlayed, injectCards, removeCards, resetCycle, checkThirdChoice } from './engine/pool.js'
import { createFactionState, updateStance, getStance } from './engine/factions.js'
import { serializeRunState, deserializeRunState } from './engine/save.js'
import { buildBasePool } from './data/cards/registry.js'
import { npcRegistry, allNpcIds } from './data/cards/npcs/index.js'
import { banditWarThirdChoices } from './data/cards/third-choices.js'
import { renderModifierBar } from './ui/card-view.js'
import { renderGuildNaming, renderNpcSelection } from './ui/intro-view.js'
import { thievesGuildAllied, thievesGuildOpposed } from './data/cards/factions/thieves-guild.js'
import { templeAllied, templeOpposed } from './data/cards/factions/temple.js'

const FACTION_CARDS = {
  'thieves-guild': { allied: thievesGuildAllied, opposed: thievesGuildOpposed },
  'temple': { allied: templeAllied, opposed: templeOpposed },
}
```

- [ ] **Step 2: Add new state variables**

```js
let modifierState = null
let relationshipState = null
let poolState = null
let factionState = null
let guildName = 'Iron Hearth Guild'
let selectedNpcs = []
let npcEncounterCount = 0
```

- [ ] **Step 3: Update startRun to include new flow**

Replace the existing `startRun()` with a sequence:
1. `loadProgress()` → `pickArc()`
2. Show guild naming screen → on continue:
3. Show NPC selection screen → on confirm:
4. Initialize all state objects (gameState, queueState, modifierState, relationshipState, poolState, factionState)
5. Build pool from registry
6. Show guild intro → arc intro → `nextTurn()`

- [ ] **Step 4: Update startRun — guild naming**

```js
function startRun() {
  progress = loadProgress()
  arc = pickArc()
  showGuildNaming()
}

function showGuildNaming() {
  const prev = progress.lastGuildName || 'Iron Hearth Guild'
  mount(renderGuildNaming(prev))
  document.getElementById('continue-btn').onclick = () => {
    guildName = document.getElementById('guild-name-input').value.trim() || prev
    progress = { ...progress, lastGuildName: guildName }
    saveProgress(progress)
    showNpcSelection()
  }
}
```

- [ ] **Step 5: Update startRun — NPC selection**

```js
function showNpcSelection() {
  const npcList = allNpcIds.map(id => npcRegistry[id])
  mount(renderNpcSelection(npcList))

  let selected = []
  document.querySelectorAll('.npc-select-card').forEach(card => {
    card.onclick = () => {
      const npcId = card.dataset.npcId
      if (selected.includes(npcId)) {
        selected = selected.filter(id => id !== npcId)
        card.classList.remove('selected')
      } else if (selected.length < 2) {
        selected.push(npcId)
        card.classList.add('selected')
      }
      const btn = document.getElementById('npc-confirm-btn')
      btn.disabled = selected.length !== 2
      btn.textContent = selected.length === 2 ? 'Begin →' : 'Select 2 to continue →'
    }
  })

  document.getElementById('npc-confirm-btn').onclick = () => {
    selectedNpcs = selected
    initializeRun()
  }
}
```

- [ ] **Step 6: Initialize all V2 state**

```js
function initializeRun() {
  gameState = createState()

  // Apply legacy trait (existing logic)
  if (progress.activeLegacyTrait) {
    const trait = traits.find(t => t.id === progress.activeLegacyTrait)
    if (trait?.effect) {
      const deltas = { ...trait.effect }
      const repShift = deltas.reputation ?? 0
      delete deltas.reputation
      gameState = applyChoice(gameState, deltas, {})
      gameState = { ...gameState, turnCount: 0, reputation: applyRepShift(50, repShift) }
    }
  }

  // Build roster (existing logic)
  const pool = [...baseAdventurers, ...progress.unlockedAdventurers]
  const rosterSize = Math.min(Math.floor(Math.random() * 3) + 3, pool.length)
  roster = pool.sort(() => Math.random() - 0.5).slice(0, rosterSize)

  ledger = createLedger()
  roster.forEach(name => { ledger = updateAdventurerStatus(ledger, name, 'alive') })

  queueState = { ...createQueueState(), totalMilestones: arc.totalMilestones }

  // V2 state
  modifierState = createModifierState()
  relationshipState = createRelationshipState(selectedNpcs)
  poolState = createPoolState(buildBasePool())
  factionState = createFactionState(['thieves-guild', 'temple'])
  npcEncounterCount = 0

  showGuildIntro()
}
```

- [ ] **Step 7: Update mount calls to include guild name and modifier bar**

Update `showCard()` and other mount points to prepend guild name and modifier bar:

```js
function buildHeader() {
  const guildLine = `<div class="guild-name">⚜️ ${guildName}</div>`
  const resBar = renderResourceBar(gameState.resources)
  const modBar = renderModifierBar(modifierState)
  return guildLine + resBar + modBar
}
```

Replace all `renderResourceBar(gameState.resources)` calls with `buildHeader()`.

- [ ] **Step 8: Update nextTurn for V2 card types**

```js
function nextTurn() {
  // Tick modifiers
  modifierState = tickModifiers(modifierState)

  // Detect tension zone crossings (existing logic)
  // ...existing tension zone code...

  const { nextCardType, chainedCardId } = advanceQueue(queueState, gameState.turnCount)

  if (nextCardType === 'arc') {
    // existing arc logic + resetCycle
    const milestone = arc.milestones[queueState.milestonesCompleted]
    queueState = resetMilestoneCounter(queueState)
    poolState = resetCycle(poolState)

    // Check for third choice on this arc card
    const thirdChoiceDefs = banditWarThirdChoices.filter(tc => tc.cardId === milestone.id)
    let cardWithThird = { ...milestone, choices: [...milestone.choices] }
    for (const tc of thirdChoiceDefs) {
      const extra = checkThirdChoice(tc.conditions, tc.choice, relationshipState, gameState, factionState)
      if (extra) cardWithThird.choices.push(extra)
    }

    // Schedule NPC for this new cycle
    queueState = scheduleNpc(queueState)

    showCard(cardWithThird, true)

  } else if (nextCardType === 'npc') {
    // Resolve NPC card
    const npcId = getNextNpc(selectedNpcs, npcEncounterCount)
    const npcData = npcRegistry[npcId]
    const encounterNum = Math.floor(npcEncounterCount / 2) + 1 // each NPC's encounter number
    const level = getLevel(relationshipState, npcId)
    const card = resolveNpcCard(npcData.cards, encounterNum, level)

    // Inject NPC display data
    card.npcTier = level
    if (card.attribution) card.attribution = card.attribution

    npcEncounterCount++
    queueState = clearNpcSchedule(queueState)
    showCard(card, false)

  } else if (nextCardType === 'crisis') {
    // existing crisis logic
  } else if (nextCardType === 'chained') {
    // existing chained logic
  } else if (nextCardType === 'rumor') {
    // existing rumor logic
  } else {
    // Standard draw from pool
    queueState = recordStandardCardPlayed(queueState)
    const { card, updatedState } = drawCard(poolState)
    poolState = updatedState
    showCard(card, false)
  }
}
```

- [ ] **Step 9: Update handleChoice for V2 processing**

```js
function handleChoice(card, chosenIdx, isArc) {
  const choice = card.choices[chosenIdx]

  // Apply modifiers to deltas before applying
  const adjustedDeltas = applyModifiers(choice.deltas, modifierState)
  gameState = applyChoice(gameState, adjustedDeltas, {})

  // Apply reputation shift (existing)
  if (choice.reputation) {
    gameState = { ...gameState, reputation: applyRepShift(gameState.reputation, choice.reputation) }
  }

  // V2: Process new modifier effects
  if (choice.modifiers) {
    for (const mod of choice.modifiers) {
      modifierState = addModifier(modifierState, { ...mod, source: card.id })
    }
  }

  // V2: Process relationship shifts
  if (choice.relationships) {
    for (const rel of choice.relationships) {
      relationshipState = updateRelationship(relationshipState, rel.npc, rel.shift, rel.flag)
    }
  }

  // V2: Process faction stance changes
  if (choice.factions) {
    for (const fac of choice.factions) {
      const oldStance = getStance(factionState, fac.id)
      factionState = updateStance(factionState, fac.id, fac.stance)
      // Inject faction cards on stance change from neutral
      if (oldStance === 'neutral' && fac.stance !== 'neutral') {
        const factionCards = FACTION_CARDS[fac.id]?.[fac.stance]
        if (factionCards) poolState = injectCards(poolState, factionCards)
      }
    }
  }

  // Queue chained event (existing)
  if (choice.chains) {
    const delay = Math.floor(Math.random() * 3) + 3
    queueState = queueChained(queueState, choice.chains, gameState.turnCount + delay)
  }

  // Queue rumor (existing)
  if (choice.rumorText || (isArc && choice.major)) {
    queueState = queueRumor(queueState)
  }

  // Log to ledger (existing)
  if (choice.major) {
    ledger = recordEvent(ledger, `${card.npc.name}: "${choice.label}"`)
  }

  // Auto-save
  autoSave()

  // Rest of existing choice handling (result screen, win/loss checks)...
}
```

- [ ] **Step 10: Add auto-save function**

```js
function autoSave() {
  const runState = {
    gameState, queueState, modifierState, relationshipState,
    poolState, factionState, ledger,
    arcId: arc.id, guildName, selectedNpcs, npcEncounterCount,
  }
  localStorage.setItem('guildmaster_run', serializeRunState(runState))
}

function clearRunSave() {
  localStorage.removeItem('guildmaster_run')
}
```

- [ ] **Step 11: Add resume-on-load logic**

Update the boot section at the bottom of game.js:

```js
// Boot
const savedRun = localStorage.getItem('guildmaster_run')
if (savedRun) {
  const restored = deserializeRunState(savedRun)
  if (restored) {
    // Restore all state
    gameState = restored.gameState
    queueState = restored.queueState
    modifierState = restored.modifierState
    relationshipState = restored.relationshipState
    poolState = restored.poolState
    factionState = restored.factionState
    ledger = restored.ledger
    guildName = restored.guildName
    selectedNpcs = restored.selectedNpcs
    npcEncounterCount = restored.npcEncounterCount
    arc = ALL_ARCS[restored.arcId]
    progress = loadProgress()

    // Resume at next turn
    nextTurn()
  } else {
    startRun()
  }
} else {
  startRun()
}
```

- [ ] **Step 12: Update handleWin and handleLoss to clear save and enrich ledger**

In `handleWin()` and `handleLoss()`, add `clearRunSave()` and pass V2 data to the ledger:

```js
const arcLedger = Object.assign({}, ledger, {
  arcName: arc.title,
  arcOutcome: 'won',
  endCondition: null,
  turnCount: gameState.turnCount,
  guildName,
  relationships: Object.fromEntries(
    selectedNpcs.map(id => [npcRegistry[id].name, getLevel(relationshipState, id)])
  ),
  factionStances: { ...factionState },
  permanentModifiers: getActiveModifiers(modifierState).filter(m => m.duration === null),
})
```

- [ ] **Step 13: Run all tests**

Run: `npx vitest run`
Expected: all PASS

- [ ] **Step 14: Commit**

```bash
git add src/game.js
git commit -m "feat: wire V2 systems into game loop (modifiers, relationships, pool, factions, auto-save)"
```

---

## Task 14: Content Expansion — Standard Cards to ~100

**Files:**
- Modify: `src/data/cards/merchants.js` — add ~17 more cards (8→25)
- Modify: `src/data/cards/political.js` — add ~17 more cards (8→25)
- Modify: `src/data/cards/criminal.js` — add ~14 more cards (6→20)
- Modify: `src/data/cards/guild-life.js` — add ~20 more cards (10→30)

This task expands the standard pool from ~32 to ~100 cards. Each card follows the established format. Some cards should include the new V2 fields (`modifiers`, `relationships`, `factions`) where it makes narrative sense.

- [ ] **Step 1: Expand merchants.js**

Add ~17 new merchant/trade cards. Themes: traveling caravans, trade disputes, rare goods, supply chain issues, foreign traders, market crashes, investment opportunities. Some cards should have `modifiers` (e.g., a trade deal that gives a temporary gold bonus for 3 turns).

- [ ] **Step 2: Expand political.js**

Add ~17 new political cards. Themes: elections, noble feuds, city council meetings, diplomatic envoys, tax reforms, law changes, public works. Some cards should have `factions` fields (e.g., a card where siding with the temple vs. the thieves' guild sets a faction stance).

- [ ] **Step 3: Expand criminal.js**

Add ~14 new criminal/underworld cards. Themes: smuggling operations, witness protection, gang wars, corruption, jail breaks, underground fighting, blackmail, counterfeiting.

- [ ] **Step 4: Expand guild-life.js**

Add ~20 new guild management cards. Themes: training exercises, internal disputes, morale events, equipment maintenance, building repairs, recruit hazing, holiday celebrations, staff turnover, competitive challenges. Some cards should have `relationships` fields to shift NPC levels.

- [ ] **Step 5: Run the game manually and verify card variety**

Open `index.html` in a browser. Play through several cycles. Verify:
- No card repeats within a milestone cycle
- NPC cards appear at the right times
- Modifier bar shows/hides correctly
- Third choices appear when conditions are met (may need to engineer a specific game state)

- [ ] **Step 6: Commit**

```bash
git add src/data/cards/
git commit -m "feat: expand standard card pool from 32 to ~100 cards across 4 categories"
```

---

## Task 15: Final Integration Test & Polish

**Files:**
- All modified files

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: all PASS

- [ ] **Step 2: Manual playtest — full run**

Play a complete run from start to finish. Verify:
1. Guild naming screen appears and saves name
2. NPC selection works (select 2, deselect, confirm)
3. Guild name shows above resource bar
4. NPCs alternate correctly between milestones
5. NPC tier badges update after relationship shifts
6. Attribution text appears on relevant cards
7. Modifier bar shows active effects with correct durations
8. Modifiers tick down and expire correctly
9. Auto-save works (reload page mid-run, should resume)
10. Third choice appears on arc card when conditions met
11. Ledger shows guild name, NPC outcomes, faction stances
12. Win/loss clears run save correctly

- [ ] **Step 3: Fix any issues found**

Address any bugs discovered during playtesting.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "polish: V2 integration fixes and final adjustments"
```
