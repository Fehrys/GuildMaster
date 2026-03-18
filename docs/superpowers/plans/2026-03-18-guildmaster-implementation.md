# GuildMaster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based text game where the player manages an adventurer guild by making binary NPC card choices that shift four resources, progressing through story arcs with meta-progression between runs.

**Architecture:** Vanilla ES modules — no framework, no bundler. The engine (pure JS) is fully decoupled from the UI (DOM rendering). Game state is a plain object mutated by engine functions; the UI reads state and re-renders. Vitest handles unit tests for all engine logic.

**Tech Stack:** Vanilla JS (ES modules), HTML5, CSS3, Vitest for testing, localStorage for persistence.

---

## File Map

```
index.html                        # Entry point — mounts the game
style.css                         # All styles

src/
  data/
    arcs/
      bandit-war.js               # The Bandit War arc: intro, milestones, rumor text
    cards/
      standard.js                 # Standard NPC card pool
      crisis.js                   # Crisis card templates (one per resource × extreme)
    adventurers.js                # Base named adventurers (Aldra, Corvin, Mira)
    traits.js                     # Legacy trait pool (global, all runs)

  engine/
    state.js                      # createState(), applyChoice(), checkEndCondition()
    queue.js                      # buildQueue(), drawNext() — priority-ordered card draw
    reputation.js                 # getRepTier(), applyRepShift() — hidden score logic
    ledger.js                     # initLedger(), recordEvent(), buildLedgerText()
    progression.js                # loadProgress(), saveProgress() — localStorage wrapper

  ui/
    resource-bar.js               # renderResourceBar(state) — top bar
    card-view.js                  # renderCard(card, state), renderResult(card, chosen, state)
    intro-view.js                 # renderGuildIntro(), renderArcIntro(arc)
    ledger-view.js                # renderLedgerScreen(ledgerText, meta) — end-of-run screen

  game.js                         # Game loop: orchestrates state, queue, ui

tests/
  engine/
    state.test.js
    queue.test.js
    reputation.test.js
    ledger.test.js
    progression.test.js

package.json
vitest.config.js
.gitignore
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `vitest.config.js`
- Create: `.gitignore`
- Create: `index.html`
- Create: `style.css`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "guildmaster",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Create vitest.config.js**

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 4: Create .gitignore**

```
node_modules/
.superpowers/
```

- [ ] **Step 5: Create index.html skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GuildMaster</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="src/game.js"></script>
</body>
</html>
```

- [ ] **Step 6: Create style.css skeleton**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #1a1a1e;
  color: #f0f0f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  width: 100%;
  max-width: 480px;
  padding: 1rem;
}
```

- [ ] **Step 7: Write a smoke test**

Create `tests/engine/state.test.js`:
```js
import { describe, it, expect } from 'vitest'

describe('smoke test', () => {
  it('passes', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 8: Run tests**

Run: `npm test`
Expected: 1 test passing.

- [ ] **Step 9: Commit**

```bash
git add package.json vitest.config.js .gitignore index.html style.css tests/engine/state.test.js
git commit -m "feat: project setup — vitest, html skeleton, gitignore"
```

---

## Task 2: Game State & Resource System

**Files:**
- Create: `src/engine/state.js`
- Modify: `tests/engine/state.test.js`

State is a plain object. Engine functions take state and return a new state (no mutation). This keeps tests trivial.

- [ ] **Step 1: Write failing tests for createState()**

Replace `tests/engine/state.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { createState, applyChoice, checkEndCondition, isInTensionZone } from '../../src/engine/state.js'

describe('createState', () => {
  it('initialises all resources at 50', () => {
    const s = createState()
    expect(s.resources).toEqual({ gold: 50, adventurers: 50, quests: 50, equipment: 50 })
  })

  it('sets reputation to 50', () => {
    expect(createState().reputation).toBe(50)
  })

  it('sets turnCount to 0', () => {
    expect(createState().turnCount).toBe(0)
  })

  it('sets gameStatus to playing', () => {
    expect(createState().gameStatus).toBe('playing')
  })
})

describe('isInTensionZone', () => {
  it('returns true when value < 20', () => {
    expect(isInTensionZone(19)).toBe(true)
    expect(isInTensionZone(20)).toBe(false)
  })

  it('returns true when value > 80', () => {
    expect(isInTensionZone(81)).toBe(true)
    expect(isInTensionZone(80)).toBe(false)
  })
})

describe('applyChoice', () => {
  it('applies resource deltas', () => {
    const s = createState()
    const deltas = { gold: -10, adventurers: 5 }
    const next = applyChoice(s, deltas, {})
    expect(next.resources.gold).toBe(40)
    expect(next.resources.adventurers).toBe(55)
    expect(next.resources.quests).toBe(50)
  })

  it('clamps resources to 0', () => {
    const s = createState()
    const next = applyChoice(s, { gold: -100 }, {})
    expect(next.resources.gold).toBe(0)
  })

  it('clamps resources to 100', () => {
    const s = createState()
    const next = applyChoice(s, { gold: 100 }, {})
    expect(next.resources.gold).toBe(100)
  })

  it('increments turnCount', () => {
    const s = createState()
    const next = applyChoice(s, {}, {})
    expect(next.turnCount).toBe(1)
  })
})

describe('checkEndCondition', () => {
  it('returns null when all resources are in range', () => {
    expect(checkEndCondition(createState())).toBeNull()
  })

  it('returns collapse when gold reaches 0', () => {
    const s = { ...createState(), resources: { gold: 0, adventurers: 50, quests: 50, equipment: 50 } }
    expect(checkEndCondition(s)).toEqual({ resource: 'gold', type: 'collapse' })
  })

  it('returns overflow when adventurers reach 100', () => {
    const s = { ...createState(), resources: { gold: 50, adventurers: 100, quests: 50, equipment: 50 } }
    expect(checkEndCondition(s)).toEqual({ resource: 'adventurers', type: 'overflow' })
  })

  it('uses resource table order for tie-breaking (gold before adventurers)', () => {
    const s = { ...createState(), resources: { gold: 0, adventurers: 100, quests: 50, equipment: 50 } }
    expect(checkEndCondition(s).resource).toBe('gold')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npm test`
Expected: ImportError / all tests failing.

- [ ] **Step 3: Implement state.js**

Create `src/engine/state.js`:
```js
const RESOURCE_ORDER = ['gold', 'adventurers', 'quests', 'equipment']

export function createState() {
  return {
    resources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 },
    reputation: 50,
    turnCount: 0,
    gameStatus: 'playing',
    endCondition: null,
    arc: null,
    roster: [],
    queuedCrisisResources: new Set(),
    chainedEvents: [],
    pendingReplacement: null,
    ledgerEvents: [],
  }
}

export function isInTensionZone(value) {
  return value < 20 || value > 80
}

export function applyChoice(state, deltas, opts = {}) {
  const resources = { ...state.resources }
  for (const [key, delta] of Object.entries(deltas)) {
    resources[key] = Math.max(0, Math.min(100, resources[key] + delta))
  }
  return { ...state, resources, turnCount: state.turnCount + 1 }
}

export function checkEndCondition(state) {
  for (const resource of RESOURCE_ORDER) {
    const v = state.resources[resource]
    if (v <= 0) return { resource, type: 'collapse' }
    if (v >= 100) return { resource, type: 'overflow' }
  }
  return null
}
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npm test`
Expected: All tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/engine/state.js tests/engine/state.test.js
git commit -m "feat: game state — resources, tension zones, end condition"
```

---

## Task 3: Card Queue System

**Files:**
- Create: `src/engine/queue.js`
- Create: `tests/engine/queue.test.js`

The queue determines which card type fires next each turn. It is pure logic — no card content, just type/id selection.

- [ ] **Step 1: Write failing tests**

Create `tests/engine/queue.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { createQueueState, advanceQueue, recordStandardCardPlayed } from '../../src/engine/queue.js'

describe('createQueueState', () => {
  it('initialises with nextMilestoneThreshold between 4 and 7', () => {
    for (let i = 0; i < 20; i++) {
      const q = createQueueState()
      expect(q.nextMilestoneThreshold).toBeGreaterThanOrEqual(4)
      expect(q.nextMilestoneThreshold).toBeLessThanOrEqual(7)
    }
  })

  it('starts with standardCardCount at 0', () => {
    expect(createQueueState().standardCardsSinceLastMilestone).toBe(0)
  })
})

describe('advanceQueue', () => {
  it('returns arc when standard card count reaches threshold', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 4, standardCardsSinceLastMilestone: 4, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [], queuedRumor: false }
    expect(advanceQueue(q, 5).nextCardType).toBe('arc')
  })

  it('returns crisis before chained when both queued', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 0, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: ['gold'], queuedChained: [{ firesAtTurn: 1 }], queuedRumor: false }
    expect(advanceQueue(q, 1).nextCardType).toBe('crisis')
  })

  it('returns chained when due and no crisis queued', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 0, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [{ firesAtTurn: 3, cardId: 'foo' }], queuedRumor: false }
    expect(advanceQueue(q, 3).nextCardType).toBe('chained')
  })

  it('returns rumor when queued and nothing higher priority', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 0, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [], queuedRumor: true }
    expect(advanceQueue(q, 1).nextCardType).toBe('rumor')
  })

  it('returns standard when nothing else queued', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 0, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [], queuedRumor: false }
    expect(advanceQueue(q, 1).nextCardType).toBe('standard')
  })
})

describe('recordStandardCardPlayed', () => {
  it('increments standardCardsSinceLastMilestone', () => {
    const q = { ...createQueueState(), standardCardsSinceLastMilestone: 2 }
    expect(recordStandardCardPlayed(q).standardCardsSinceLastMilestone).toBe(3)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npm test`
Expected: ImportError.

- [ ] **Step 3: Implement queue.js**

Create `src/engine/queue.js`:
```js
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function createQueueState() {
  return {
    nextMilestoneThreshold: randInt(4, 7),
    standardCardsSinceLastMilestone: 0,
    milestonesCompleted: 0,
    totalMilestones: 6,
    queuedCrisis: [],           // array of resource names
    queuedChained: [],          // array of { firesAtTurn, cardId }
    queuedRumor: false,
    pendingReplacement: null,   // { card, windowClosesTurn } — named adventurer replacement
    prevTensionZone: [],        // resource names that were in tension zone last turn
  }
}

// Schedule a named adventurer replacement card to appear within 3–5 standard draws
export function scheduleReplacement(q, card, currentTurn) {
  const window = randInt(3, 5)
  return { ...q, pendingReplacement: { card, windowClosesTurn: currentTurn + window } }
}

// Returns { nextCardType, updatedQueue }
export function advanceQueue(q, currentTurn) {
  // 1. Arc milestone
  if (q.standardCardsSinceLastMilestone >= q.nextMilestoneThreshold && q.milestonesCompleted < q.totalMilestones) {
    return { nextCardType: 'arc', updatedQueue: q }
  }
  // 2. Crisis
  if (q.queuedCrisis.length > 0) {
    return { nextCardType: 'crisis', updatedQueue: q }
  }
  // 3. Chained event due this turn
  const dueChained = q.queuedChained.find(e => e.firesAtTurn <= currentTurn)
  if (dueChained) {
    return { nextCardType: 'chained', updatedQueue: q, chainedCardId: dueChained.cardId }
  }
  // 4. Rumor
  if (q.queuedRumor) {
    return { nextCardType: 'rumor', updatedQueue: q }
  }
  // 5. Standard
  return { nextCardType: 'standard', updatedQueue: q }
}

export function recordStandardCardPlayed(q) {
  return { ...q, standardCardsSinceLastMilestone: q.standardCardsSinceLastMilestone + 1 }
}

export function resetMilestoneCounter(q) {
  return {
    ...q,
    standardCardsSinceLastMilestone: 0,
    milestonesCompleted: q.milestonesCompleted + 1,
    nextMilestoneThreshold: randInt(4, 7),
  }
}

export function queueCrisis(q, resource) {
  if (q.queuedCrisis.includes(resource)) return q
  return { ...q, queuedCrisis: [...q.queuedCrisis, resource] }
}

export function dequeueCrisis(q) {
  return { ...q, queuedCrisis: q.queuedCrisis.slice(1) }
}

export function queueChained(q, cardId, firesAtTurn) {
  return { ...q, queuedChained: [...q.queuedChained, { cardId, firesAtTurn }] }
}

export function dequeueChained(q, cardId) {
  return { ...q, queuedChained: q.queuedChained.filter(e => e.cardId !== cardId) }
}

export function pushChainedBack(q, cardId) {
  return {
    ...q,
    queuedChained: q.queuedChained.map(e =>
      e.cardId === cardId ? { ...e, firesAtTurn: e.firesAtTurn + 1 } : e
    ),
  }
}

export function queueRumor(q) {
  return { ...q, queuedRumor: true }
}

export function dequeueRumor(q) {
  return { ...q, queuedRumor: false }
}
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npm test`
Expected: All tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/engine/queue.js tests/engine/queue.test.js
git commit -m "feat: card queue — priority ordering, crisis/chained/rumor management"
```

---

## Task 4: Reputation Shadow

**Files:**
- Create: `src/engine/reputation.js`
- Create: `tests/engine/reputation.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/engine/reputation.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { getRepTier, applyRepShift } from '../../src/engine/reputation.js'

describe('getRepTier', () => {
  it('returns low for score 0–33', () => {
    expect(getRepTier(0)).toBe('low')
    expect(getRepTier(33)).toBe('low')
  })

  it('returns medium for score 34–66', () => {
    expect(getRepTier(34)).toBe('medium')
    expect(getRepTier(66)).toBe('medium')
  })

  it('returns high for score 67–100', () => {
    expect(getRepTier(67)).toBe('high')
    expect(getRepTier(100)).toBe('high')
  })
})

describe('applyRepShift', () => {
  it('applies positive shift', () => {
    expect(applyRepShift(50, 5)).toBe(55)
  })

  it('applies negative shift', () => {
    expect(applyRepShift(50, -5)).toBe(45)
  })

  it('clamps to 0', () => {
    expect(applyRepShift(3, -5)).toBe(0)
  })

  it('clamps to 100', () => {
    expect(applyRepShift(98, 5)).toBe(100)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npm test`
Expected: ImportError.

- [ ] **Step 3: Implement reputation.js**

Create `src/engine/reputation.js`:
```js
export function getRepTier(score) {
  if (score <= 33) return 'low'
  if (score <= 66) return 'medium'
  return 'high'
}

export function applyRepShift(score, shift) {
  return Math.max(0, Math.min(100, score + shift))
}
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npm test`
Expected: All tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/engine/reputation.js tests/engine/reputation.test.js
git commit -m "feat: reputation shadow — tier calculation, clamped shift"
```

---

## Task 5: Ledger Tracking

**Files:**
- Create: `src/engine/ledger.js`
- Create: `tests/engine/ledger.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/engine/ledger.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { createLedger, recordEvent, buildLedgerText } from '../../src/engine/ledger.js'

describe('createLedger', () => {
  it('initialises empty', () => {
    const l = createLedger()
    expect(l.events).toEqual([])
    expect(l.adventurerStatus).toEqual({})
  })
})

describe('recordEvent', () => {
  it('appends event text', () => {
    const l = createLedger()
    const next = recordEvent(l, 'You hired a knight.')
    expect(next.events).toHaveLength(1)
    expect(next.events[0]).toBe('You hired a knight.')
  })
})

describe('buildLedgerText', () => {
  it('mentions turn count', () => {
    const text = buildLedgerText({
      events: [],
      adventurerStatus: {},
      arcName: 'The Bandit War',
      arcOutcome: 'abandoned',
      endCondition: { resource: 'gold', type: 'collapse' },
      turnCount: 14,
    })
    expect(text).toContain('14')
  })

  it('mentions arc name', () => {
    const text = buildLedgerText({
      events: [],
      adventurerStatus: {},
      arcName: 'The Bandit War',
      arcOutcome: 'won',
      endCondition: null,
      turnCount: 30,
    })
    expect(text).toContain('The Bandit War')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npm test`
Expected: ImportError.

- [ ] **Step 3: Implement ledger.js**

Create `src/engine/ledger.js`:
```js
export function createLedger() {
  return {
    events: [],
    adventurerStatus: {},  // { name: 'alive' | 'lost' }
  }
}

export function recordEvent(ledger, text) {
  return { ...ledger, events: [...ledger.events, text] }
}

export function updateAdventurerStatus(ledger, name, status) {
  return { ...ledger, adventurerStatus: { ...ledger.adventurerStatus, [name]: status } }
}

export function buildLedgerText({ events, adventurerStatus, arcName, arcOutcome, endCondition, turnCount }) {
  const parts = []

  parts.push(`Your guild lasted ${turnCount} turn${turnCount !== 1 ? 's' : ''}.`)

  const survivors = Object.entries(adventurerStatus).filter(([, s]) => s === 'alive').map(([n]) => n)
  const fallen = Object.entries(adventurerStatus).filter(([, s]) => s === 'lost').map(([n]) => n)
  if (survivors.length) parts.push(`${survivors.join(', ')} survived.`)
  if (fallen.length) parts.push(`${fallen.join(', ')} did not make it back.`)

  if (arcOutcome === 'won') {
    parts.push(`${arcName} ended in victory.`)
  } else {
    parts.push(`${arcName} was left unfinished.`)
  }

  if (endCondition) {
    const reasons = {
      gold: { collapse: 'The coffers ran dry.', overflow: 'Wealth brought ruin.' },
      adventurers: { collapse: 'The halls emptied.', overflow: 'The guild tore itself apart.' },
      quests: { collapse: 'No one came calling.', overflow: 'The guild drowned in commitments.' },
      equipment: { collapse: 'The armory stood empty.', overflow: 'Stolen gear drew dangerous eyes.' },
    }
    parts.push(reasons[endCondition.resource]?.[endCondition.type] ?? 'The guild fell.')
  }

  if (events.length) {
    parts.push('')
    parts.push(...events)
  }

  return parts.join(' ')
}
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npm test`
Expected: All tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/engine/ledger.js tests/engine/ledger.test.js
git commit -m "feat: ledger — event recording, narrative text generation"
```

---

## Task 6: Meta-Progression Persistence

**Files:**
- Create: `src/engine/progression.js`
- Create: `tests/engine/progression.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/engine/progression.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest'
import { createProgress, unlockArc, completeArc, setLegacyTrait, addAdventurer } from '../../src/engine/progression.js'

describe('createProgress', () => {
  it('initialises with only bandit-war unlocked', () => {
    const p = createProgress()
    expect(p.unlockedArcs).toContain('bandit-war')
    expect(p.completedArcs).toEqual([])
  })
})

describe('unlockArc', () => {
  it('adds arc to unlockedArcs', () => {
    const p = unlockArc(createProgress(), 'nobles-debt')
    expect(p.unlockedArcs).toContain('nobles-debt')
  })

  it('does not duplicate', () => {
    const p = unlockArc(unlockArc(createProgress(), 'nobles-debt'), 'nobles-debt')
    expect(p.unlockedArcs.filter(a => a === 'nobles-debt')).toHaveLength(1)
  })
})

describe('completeArc', () => {
  it('adds to completedArcs', () => {
    const p = completeArc(createProgress(), 'bandit-war')
    expect(p.completedArcs).toContain('bandit-war')
  })
})

describe('setLegacyTrait', () => {
  it('replaces existing trait', () => {
    const p = setLegacyTrait(setLegacyTrait(createProgress(), 'war-veterans'), 'trade-connections')
    expect(p.activeLegacyTrait).toBe('trade-connections')
  })
})

describe('addAdventurer', () => {
  it('adds to unlockedAdventurers', () => {
    const p = addAdventurer(createProgress(), 'Rena the Axe')
    expect(p.unlockedAdventurers).toContain('Rena the Axe')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npm test`
Expected: ImportError.

- [ ] **Step 3: Implement progression.js**

Create `src/engine/progression.js`:
```js
const STORAGE_KEY = 'guildmaster_progress'

export function createProgress() {
  return {
    unlockedArcs: ['bandit-war'],
    completedArcs: [],
    activeLegacyTrait: null,
    unlockedAdventurers: [],
  }
}

export function loadProgress() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return raw ? JSON.parse(raw) : createProgress()
  } catch {
    return createProgress()
  }
}

export function saveProgress(progress) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    }
  } catch {
    // storage unavailable — silently ignore
  }
}

export function unlockArc(progress, arcId) {
  if (progress.unlockedArcs.includes(arcId)) return progress
  return { ...progress, unlockedArcs: [...progress.unlockedArcs, arcId] }
}

export function completeArc(progress, arcId) {
  if (progress.completedArcs.includes(arcId)) return progress
  return { ...progress, completedArcs: [...progress.completedArcs, arcId] }
}

export function setLegacyTrait(progress, traitId) {
  return { ...progress, activeLegacyTrait: traitId }
}

export function addAdventurer(progress, name) {
  if (progress.unlockedAdventurers.includes(name)) return progress
  return { ...progress, unlockedAdventurers: [...progress.unlockedAdventurers, name] }
}
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npm test`
Expected: All tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/engine/progression.js tests/engine/progression.test.js
git commit -m "feat: meta-progression — localStorage persistence, arc unlocks, legacy traits"
```

---

## Task 7: Card Data Model & Standard Card Pool

**Files:**
- Create: `src/data/cards/standard.js`
- Create: `src/data/cards/crisis.js`
- Create: `src/data/adventurers.js`
- Create: `src/data/traits.js`

Cards are plain JS objects — no classes. This task defines the schema and writes the initial pool.

**Card schema:**
```js
{
  id: 'card-id',
  type: 'standard' | 'arc' | 'crisis' | 'rumor' | 'chained',
  npc: { emoji: '🧙', name: 'Aldric the Scribe', role: 'Town Bureaucrat' },
  situation: 'Situation text...',
  choices: [
    {
      label: 'Choice A label',
      deltas: { gold: -12, quests: 5 },
      major: false,
      reputation: 0,        // +5, -5, or 0
      chains: null,         // null or 'chained-card-id'
      rumorText: null,      // null or string
    },
    { ... }   // choice B
  ],
}
```

Crisis and rumor cards use a simpler schema (see below).

- [ ] **Step 1: Create standard.js with 10 starter cards**

Create `src/data/cards/standard.js`:
```js
export const standardCards = [
  {
    id: 'std-tax-collector',
    type: 'standard',
    npc: { emoji: '🧙', name: 'Aldric the Scribe', role: 'Town Bureaucrat' },
    situation: 'The city registry requires all guilds to file a tax declaration by week\'s end. It costs a fee — but ignoring it has consequences.',
    choices: [
      { label: 'Pay the fee', deltas: { gold: -12, quests: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Ignore it', deltas: { quests: -18 }, major: false, reputation: -5, chains: 'chain-tax-ignored', rumorText: null },
    ],
  },
  {
    id: 'std-wounded-merc',
    type: 'standard',
    npc: { emoji: '🩹', name: 'A Wounded Mercenary', role: 'Wandering Sword' },
    situation: 'A battered mercenary collapses at your door. She asks only for a place to rest and heal. It will cost nothing but space.',
    choices: [
      { label: 'Take her in', deltas: { adventurers: 5 }, major: false, reputation: 5, chains: 'chain-merc-healed', rumorText: null },
      { label: 'Turn her away', deltas: {}, major: false, reputation: -5, chains: null, rumorText: 'Word spreads. The wounded remember those who turned them away.' },
    ],
  },
  {
    id: 'std-equipment-merchant',
    type: 'standard',
    npc: { emoji: '⚒️', name: 'Greta the Ironmonger', role: 'Equipment Merchant' },
    situation: 'A travelling merchant offers a bulk deal on arms and armour. Quality is good, price is fair — but it cleans out your stock budget.',
    choices: [
      { label: 'Buy the lot', deltas: { gold: -20, equipment: 18 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Pass', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-minor-lord',
    type: 'standard',
    npc: { emoji: '👑', name: 'Lord Farwick', role: 'Minor Nobleman' },
    situation: 'A local lord wants to hire six of your best for a season — good pay, but your roster will be thin for weeks.',
    choices: [
      { label: 'Accept the contract', deltas: { gold: 25, adventurers: -15, quests: 8 }, major: true, reputation: 5, chains: null, rumorText: 'Lord Farwick\'s gold came with strings. You\'ll feel the absence of your people soon.' },
      { label: 'Decline', deltas: { quests: -5 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-young-recruit',
    type: 'standard',
    npc: { emoji: '🌟', name: 'Tam', role: 'Would-Be Adventurer' },
    situation: 'A bright-eyed kid walks in off the street wanting to join your guild. No skills to speak of, but plenty of enthusiasm.',
    choices: [
      { label: 'Take a chance', deltas: { adventurers: 8, gold: -3 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Send them away', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-unhappy-client',
    type: 'standard',
    npc: { emoji: '😠', name: 'Merchant Peldan', role: 'Disgruntled Client' },
    situation: 'A merchant returns furious — the quest your guild completed left his cargo damaged. He demands compensation.',
    choices: [
      { label: 'Compensate him', deltas: { gold: -15, quests: 10 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Refuse', deltas: { quests: -15, reputation: -5 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-old-map',
    type: 'standard',
    npc: { emoji: '🗺️', name: 'An Old Cartographer', role: 'Retired Explorer' },
    situation: 'An old man sells maps of uncharted ruins — supposedly equipment-rich. It\'s a gamble: could be gold or a waste of lives.',
    choices: [
      { label: 'Fund the expedition', deltas: { gold: -18, adventurers: -8, equipment: 22 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Pass', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-rival-spy',
    type: 'standard',
    npc: { emoji: '🕵️', name: 'Unknown Figure', role: 'Suspicious Stranger' },
    situation: 'A stranger offers coin to "share" your client list. You suspect a rival guild is behind this.',
    choices: [
      { label: 'Take the coin', deltas: { gold: 20, quests: -20 }, major: true, reputation: -5, chains: null, rumorText: 'Some bridges burn slowly. This one is now smouldering.' },
      { label: 'Show them the door', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-donation',
    type: 'standard',
    npc: { emoji: '🙏', name: 'Sister Maren', role: 'Temple Priest' },
    situation: 'The local temple is rebuilding after a fire. A donation would be noticed — and remembered.',
    choices: [
      { label: 'Donate generously', deltas: { gold: -12 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Decline politely', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-overdue-quest',
    type: 'standard',
    npc: { emoji: '📋', name: 'Guild Accountant', role: 'Internal Staff' },
    situation: 'Three quests are running overdue. You can send extra people to resolve them fast, or let clients wait and risk reputation.',
    choices: [
      { label: 'Send reinforcements', deltas: { adventurers: -10, quests: 15 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Let them wait', deltas: { quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
]

// Chained cards — follow-up events triggered by choices above
export const chainedCards = [
  {
    id: 'chain-tax-ignored',
    type: 'chained',
    npc: { emoji: '⚖️', name: 'City Bailiff', role: 'Law Enforcement' },
    situation: 'The city sent officers. Your guild is fined double for the missed declaration. Resistance is not advised.',
    choices: [
      { label: 'Pay the fine', deltas: { gold: -25 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Argue the case', deltas: { gold: -10, quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'chain-merc-healed',
    type: 'chained',
    npc: { emoji: '🩹', name: 'Sera Ironfoot', role: 'Recovered Mercenary' },
    situation: 'The mercenary you sheltered has recovered. She offers to join your roster properly — for a modest equipment cost.',
    choices: [
      { label: 'Welcome her in', deltas: { adventurers: 10, equipment: -8 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Wish her luck', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]
```

- [ ] **Step 2: Create crisis.js**

Create `src/data/cards/crisis.js`:
```js
// Crisis cards — one per resource per extreme (low / high)
export const crisisCards = {
  gold: {
    low: {
      id: 'crisis-gold-low',
      type: 'crisis',
      npc: { emoji: '💸', name: 'Master Creditor', role: 'Debt Collector' },
      situation: 'Your creditors are at the door. They will not wait another week. Settle now — or lose something more valuable than coin.',
      choices: [
        { label: 'Liquidate equipment', deltas: { gold: 20, equipment: -25 }, major: true, reputation: -5, chains: null, rumorText: null },
        { label: 'Cut adventurer pay', deltas: { gold: 15, adventurers: -15 }, major: true, reputation: -5, chains: null, rumorText: null },
      ],
    },
    high: {
      id: 'crisis-gold-high',
      type: 'crisis',
      npc: { emoji: '🏦', name: 'Baron Crestholt', role: 'Wealthy Noble' },
      situation: 'Word of your wealth has spread. A noble demands an involuntary "loan." Refuse and face political pressure.',
      choices: [
        { label: 'Comply', deltas: { gold: -25, quests: 10 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Refuse', deltas: { quests: -15 }, major: true, reputation: 5, chains: null, rumorText: null },
      ],
    },
  },
  adventurers: {
    low: {
      id: 'crisis-adventurers-low',
      type: 'crisis',
      npc: { emoji: '⚠️', name: 'Desperate Client', role: 'Merchant in Distress' },
      situation: 'A critical quest is failing — you have no one to send. The client threatens to spread the word unless you act now.',
      choices: [
        { label: 'Hire mercenaries', deltas: { gold: -20, adventurers: 10 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Let the quest fail', deltas: { quests: -20 }, major: true, reputation: -5, chains: null, rumorText: null },
      ],
    },
    high: {
      id: 'crisis-adventurers-high',
      type: 'crisis',
      npc: { emoji: '⚔️', name: 'Guild Sergeant', role: 'Internal Command' },
      situation: 'Your hall is overcrowded. A brawl broke out at dawn. The city watch is asking questions.',
      choices: [
        { label: 'Dispatch a large expedition', deltas: { adventurers: -20, quests: 10 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Pay fines and manage tensions', deltas: { gold: -15, adventurers: -5 }, major: true, reputation: 0, chains: null, rumorText: null },
      ],
    },
  },
  quests: {
    low: {
      id: 'crisis-quests-low',
      type: 'crisis',
      npc: { emoji: '📢', name: 'Town Crier', role: 'Public Messenger' },
      situation: 'The guild is being called idle — pamphlets mock you in the market. A public display of capability is needed.',
      choices: [
        { label: 'Run a charitable quest', deltas: { adventurers: -10, quests: 18 }, major: true, reputation: 10, chains: null, rumorText: null },
        { label: 'Ignore the gossip', deltas: { quests: -8 }, major: false, reputation: -5, chains: null, rumorText: null },
      ],
    },
    high: {
      id: 'crisis-quests-high',
      type: 'crisis',
      npc: { emoji: '📋', name: 'Overburdened Clerk', role: 'Guild Administrator' },
      situation: 'Your quest board is chaos. Clients are fighting each other for adventurers. Something must give.',
      choices: [
        { label: 'Turn away new clients', deltas: { quests: -20, gold: -10 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Hire temporary help', deltas: { gold: -20, adventurers: 12 }, major: true, reputation: 0, chains: null, rumorText: null },
      ],
    },
  },
  equipment: {
    low: {
      id: 'crisis-equipment-low',
      type: 'crisis',
      npc: { emoji: '🛡️', name: 'Lead Adventurer', role: 'Roster Senior' },
      situation: 'Your best crew refuses to take the next quest without proper arms. They\'re not wrong.',
      choices: [
        { label: 'Emergency procurement', deltas: { gold: -25, equipment: 20 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Force the issue', deltas: { adventurers: -10, quests: -5 }, major: true, reputation: -5, chains: null, rumorText: null },
      ],
    },
    high: {
      id: 'crisis-equipment-high',
      type: 'crisis',
      npc: { emoji: '🌑', name: 'Black Market Broker', role: 'Fence' },
      situation: 'Your surplus gear has attracted a fence. They want to buy — or steal, if you decline.',
      choices: [
        { label: 'Sell to the fence', deltas: { gold: 20, equipment: -25 }, major: true, reputation: -5, chains: null, rumorText: null },
        { label: 'Hire night guards', deltas: { gold: -15, equipment: -5 }, major: false, reputation: 0, chains: null, rumorText: null },
      ],
    },
  },
}
```

- [ ] **Step 3: Create adventurers.js**

Create `src/data/adventurers.js`:
```js
// Base adventurers — always available from run 1
export const baseAdventurers = ['Aldra the Stout', 'Corvin', 'Mira Swift']
```

- [ ] **Step 4: Create traits.js**

Create `src/data/traits.js`:
```js
// Global legacy trait pool
export const traits = [
  { id: 'war-veterans', label: 'War Veterans', description: 'Adventurers start at 60.', effect: { adventurers: +10 } },
  { id: 'trade-connections', label: 'Trade Connections', description: 'Gold starts at 60.', effect: { gold: +10 } },
  { id: 'well-equipped', label: 'Well Equipped', description: 'Equipment starts at 60.', effect: { equipment: +10 } },
  { id: 'reputable', label: 'Reputable', description: 'Quest board starts at 60.', effect: { quests: +10 } },
  { id: 'frugal', label: 'Frugal', description: 'Gold starts at 65 but Adventurers start at 45.', effect: { gold: +15, adventurers: -5 } },
  { id: 'renowned', label: 'Renowned', description: 'Reputation starts at 65 instead of 50.', effect: { reputation: +15 } },
]
```

- [ ] **Step 5: Commit**

```bash
git add src/data/cards/standard.js src/data/cards/crisis.js src/data/adventurers.js src/data/traits.js
git commit -m "feat: card data — 10 standard cards, 8 crisis cards, chained cards, traits"
```

---

## Task 8: The Bandit War Arc Data

**Files:**
- Create: `src/data/arcs/bandit-war.js`

- [ ] **Step 1: Create bandit-war.js**

Create `src/data/arcs/bandit-war.js`:
```js
export const banditWar = {
  id: 'bandit-war',
  title: 'The Bandit War',
  totalMilestones: 6,
  intro: 'Merchants on the eastern road have stopped arriving. The last one who made it through said one word before collapsing: bandits.',
  unlocks: ['nobles-debt', 'rival-guild'],
  adventurerUnlocks: ['Rena the Axe'],

  milestones: [
    {
      id: 'bw-m1',
      type: 'arc',
      npc: { emoji: '🧑‍🌾', name: 'Farmer Osric', role: 'Frightened Villager' },
      situation: 'A farmer staggers in from the eastern road. His cart was taken, his family threatened. He begs you to investigate the bandit camps.',
      choices: [
        { label: 'Accept the job', deltas: { gold: 5, adventurers: -5 }, major: true, reputation: 5, chains: null, rumorText: 'The eastern road is quiet — but not empty. Something is watching.' },
        { label: 'Demand payment first', deltas: { gold: 15, adventurers: -5 }, major: true, reputation: -5, chains: null, rumorText: 'Coin changes hands. The eastern road waits.' },
      ],
    },
    {
      id: 'bw-m2',
      type: 'arc',
      npc: { emoji: '🗺️', name: 'Scout Leyla', role: 'Guild Scout' },
      situation: 'Your scouts return with maps of three bandit camps. Attacking all three costs lives and coin. But leaving any intact risks retaliation.',
      choices: [
        { label: 'Full assault — take all three', deltas: { adventurers: -15, equipment: -10, quests: 12 }, major: true, reputation: 5, chains: null, rumorText: 'Three camps taken. But the survivors scattered. Where do outlaws go?' },
        { label: 'Target the largest camp only', deltas: { adventurers: -8, equipment: -5, quests: 6 }, major: true, reputation: 0, chains: 'chain-bw-survivors', rumorText: 'The largest camp fell. Two smaller ones watched from the treeline.' },
      ],
    },
    {
      id: 'bw-m3',
      type: 'arc',
      npc: { emoji: '🕵️', name: 'The Informant', role: 'Shadowy Figure' },
      situation: 'A hooded figure arrives at night. They know who leads the bandits — a disgraced noble\'s bastard son. They\'ll sell you proof. What\'s that worth?',
      choices: [
        { label: 'Pay for the proof', deltas: { gold: -20 }, major: true, reputation: 0, chains: null, rumorText: 'The proof is damning. Lord Harwick will not be pleased when he finds out you know.' },
        { label: 'Threaten them instead', deltas: { adventurers: 5 }, major: true, reputation: -5, chains: null, rumorText: 'Fear has its uses. The information came cheap — but at a cost to your name.' },
      ],
    },
    {
      id: 'bw-m4',
      type: 'arc',
      npc: { emoji: '⚔️', name: 'Bandit Vanguard', role: 'Ambush Party' },
      situation: 'They knew you were coming. Your lead team is surrounded on the old road. Fight through or negotiate a retreat?',
      choices: [
        { label: 'Fight through', deltas: { adventurers: -12, equipment: -8 }, major: true, reputation: 5, chains: null, rumorText: null },
        { label: 'Negotiate a retreat', deltas: { gold: -15, adventurers: -3 }, major: true, reputation: -5, chains: null, rumorText: 'They let you go — for a price. Some of your crew saw that as weakness.' },
      ],
    },
    {
      id: 'bw-m5',
      type: 'arc',
      npc: { emoji: '🗡️', name: 'Darro Half-Blood', role: 'Bandit Lord' },
      situation: 'The bandit leader sends a messenger. He offers a deal: stop hunting his people, and he\'ll ensure the eastern road stays clear — for a cut of merchant tolls.',
      choices: [
        { label: 'Refuse — end this', deltas: { adventurers: -5 }, major: true, reputation: 5, chains: null, rumorText: null },
        { label: 'Take the deal', deltas: { gold: 10, quests: -15 }, major: true, reputation: -10, chains: null, rumorText: 'Some will call it pragmatism. Others will call it what it is.' },
      ],
    },
    {
      id: 'bw-m6-final',
      type: 'arc',
      npc: { emoji: '🏹', name: 'Darro Half-Blood', role: 'Bandit Lord — Final Stand' },
      situation: 'You\'ve cornered Darro at his stronghold. His last fighters stand between you and the end of this war. One last call: mercy or steel?',
      choices: [
        { label: 'Show mercy — exile him', deltas: { quests: 15, reputation: 5 }, major: true, reputation: 10, chains: null, rumorText: null },
        { label: 'No mercy', deltas: { adventurers: -8, quests: 20 }, major: true, reputation: 0, chains: null, rumorText: null },
      ],
      isFinal: true,
    },
  ],

  // Chained card for milestone 2 "target largest only" choice
  chainedCards: [
    {
      id: 'chain-bw-survivors',
      type: 'chained',
      npc: { emoji: '🔥', name: 'Frightened Innkeeper', role: 'Roadside Witness' },
      situation: 'The surviving bandit camps retaliated. A roadside inn was burned. The innkeeper blames your guild for acting half-heartedly.',
      choices: [
        { label: 'Fund the rebuilding', deltas: { gold: -18, quests: -5, reputation: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
        { label: 'Express regret, nothing more', deltas: { quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
      ],
    },
  ],

  rumorTexts: [
    'A merchant from the east swears the bandits have a benefactor in the city.',
    'Three scouts haven\'t reported back. The eastern road smells of smoke.',
    'Lord Harwick visited the city council this morning. His mood was reportedly foul.',
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/arcs/bandit-war.js
git commit -m "feat: The Bandit War arc — 6 milestones, chained events, rumor texts"
```

---

## Task 9: Resource Bar UI

**Files:**
- Create: `src/ui/resource-bar.js`
- Modify: `style.css`

UI functions take state and return HTML strings. The game.js mounts them via `innerHTML`. No virtual DOM needed.

- [ ] **Step 1: Create resource-bar.js**

Create `src/ui/resource-bar.js`:
```js
const RESOURCES = [
  { key: 'gold', icon: '💰', label: 'Gold' },
  { key: 'adventurers', icon: '⚔️', label: 'Adventurers' },
  { key: 'quests', icon: '📜', label: 'Quests' },
  { key: 'equipment', icon: '🛡️', label: 'Equipment' },
]

function dangerClass(value) {
  if (value < 20 || value > 80) return 'danger'
  if (value < 30 || value > 70) return 'warning'
  return ''
}

export function renderResourceBar(resources) {
  const items = RESOURCES.map(({ key, icon }) => {
    const value = resources[key]
    const cls = dangerClass(value)
    return `<div class="resource ${cls}">
      <span class="resource-icon">${icon}</span>
      <div class="resource-track">
        <div class="resource-fill" style="width:${value}%"></div>
      </div>
      <span class="resource-value">${value}</span>
    </div>`
  }).join('')
  return `<div class="resource-bar">${items}</div>`
}
```

- [ ] **Step 2: Add resource bar styles to style.css**

Append to `style.css`:
```css
/* ===== RESOURCE BAR ===== */
.resource-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #111114;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.resource {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  flex-direction: column;
}

.resource-icon { font-size: 1rem; }

.resource-track {
  width: 100%;
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
}

.resource-fill {
  height: 100%;
  background: #4a9eff;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.resource.warning .resource-fill { background: #f5a623; }
.resource.danger .resource-fill { background: #e74c3c; }

.resource-value {
  font-size: 0.7rem;
  color: #a0a0a0;
}
.resource.warning .resource-value { color: #f5a623; }
.resource.danger .resource-value { color: #e74c3c; }
```

- [ ] **Step 3: Commit**

```bash
git add src/ui/resource-bar.js style.css
git commit -m "feat: resource bar UI — colour-coded danger states"
```

---

## Task 10: Card View UI

**Files:**
- Create: `src/ui/card-view.js`
- Modify: `style.css`

Renders the NPC card before and after a choice. The "before" state shows fuzzy impact indicators; the "after" state shows exact deltas and the unchosen option's values.

- [ ] **Step 1: Create card-view.js**

Create `src/ui/card-view.js`:
```js
function fuzzyIndicator(delta) {
  if (delta === 0) return null
  const abs = Math.abs(delta)
  const sign = delta > 0 ? '+' : '-'
  if (abs <= 10) return sign
  if (abs <= 20) return sign + sign
  return sign + sign + sign
}

function renderDeltasBefore(deltas) {
  const parts = []
  for (const [key, val] of Object.entries(deltas)) {
    const ind = fuzzyIndicator(val)
    if (!ind) continue
    const icons = { gold: '💰', adventurers: '⚔️', quests: '📜', equipment: '🛡️' }
    const cls = val > 0 ? 'delta-pos' : 'delta-neg'
    parts.push(`<span class="delta">${icons[key]} <span class="${cls}">${ind}</span></span>`)
  }
  return parts.length ? `<div class="deltas">${parts.join('')}</div>` : ''
}

function renderDeltasAfter(deltas) {
  const parts = []
  for (const [key, val] of Object.entries(deltas)) {
    if (val === 0) continue
    const icons = { gold: '💰', adventurers: '⚔️', quests: '📜', equipment: '🛡️' }
    const cls = val > 0 ? 'delta-pos' : 'delta-neg'
    const sign = val > 0 ? '+' : ''
    parts.push(`<span class="delta">${icons[key]} <span class="${cls}">${sign}${val}</span></span>`)
  }
  return parts.length ? `<div class="deltas">${parts.join('')}</div>` : ''
}

export function renderCard(card, onChoose) {
  const choices = card.choices.map((choice, idx) => {
    const deltas = renderDeltasBefore(choice.deltas)
    const delayed = choice.chains ? '<div class="delayed">⚠️ delayed</div>' : ''
    return `<button class="choice-btn" data-idx="${idx}">
      <div class="choice-label">${choice.label}</div>
      ${deltas}
      ${delayed}
    </button>`
  }).join('')

  return `<div class="card" id="current-card">
    <div class="npc-portrait">${card.npc.emoji}</div>
    <div class="npc-name">${card.npc.name}</div>
    <div class="npc-role">${card.npc.role}</div>
    <div class="situation">${card.situation}</div>
    <div class="choices">${choices}</div>
  </div>`
}

export function renderCardResult(card, chosenIdx) {
  const chosen = card.choices[chosenIdx]
  const other = card.choices[1 - chosenIdx]

  const choiceButtons = card.choices.map((choice, idx) => {
    const isChosen = idx === chosenIdx
    const deltas = renderDeltasAfter(choice.deltas)
    const cls = isChosen ? 'choice-btn chosen' : 'choice-btn not-chosen'
    const check = isChosen ? '✓ ' : ''
    return `<div class="${cls}">
      <div class="choice-label">${check}${choice.label}</div>
      ${deltas}
    </div>`
  }).join('')

  return `<div class="card result" id="current-card">
    <div class="npc-portrait">${card.npc.emoji}</div>
    <div class="npc-name">${card.npc.name}</div>
    <div class="npc-role">${card.npc.role}</div>
    <div class="situation">${card.situation}</div>
    <div class="choices">${choiceButtons}</div>
    <button class="continue-btn" id="continue-btn">Continue →</button>
  </div>`
}

export function renderRumorCard(text, onContinue) {
  return `<div class="card rumor-card" id="current-card">
    <div class="npc-portrait">📜</div>
    <div class="npc-name">Rumour</div>
    <div class="situation">${text}</div>
    <button class="continue-btn" id="continue-btn">Continue →</button>
  </div>`
}
```

- [ ] **Step 2: Add card styles to style.css**

Append to `style.css`:
```css
/* ===== CARD ===== */
.card {
  background: #22222a;
  border: 1px solid #333;
  border-radius: 14px;
  padding: 1.5rem;
  text-align: center;
}

.card.arc-card { border-color: #a48fff; }
.card.rumor-card { border-color: #555; font-style: italic; }

.arc-badge {
  font-size: 0.7rem;
  color: #a48fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.npc-portrait { font-size: 3rem; margin-bottom: 0.5rem; }
.npc-name { font-size: 1rem; font-weight: 600; }
.npc-role { font-size: 0.75rem; color: #888; margin-bottom: 1rem; }
.situation { font-size: 0.9rem; line-height: 1.6; color: #ddd; margin-bottom: 1.25rem; }

.choices { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }

.choice-btn {
  background: #2a2a3a;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 0.75rem;
  color: #f0f0f0;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.15s;
  font-size: 0.85rem;
}
.choice-btn:hover { border-color: #4a9eff; }

.choice-btn.chosen { border-color: #4a4; background: #1a2a1a; }
.choice-btn.not-chosen { opacity: 0.4; cursor: default; }

.choice-label { font-weight: 600; margin-bottom: 0.4rem; }

.deltas { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; font-size: 0.8rem; }
.delta-pos { color: #4a4; }
.delta-neg { color: #e74c3c; }
.delayed { font-size: 0.75rem; color: #f5a623; margin-top: 0.3rem; }

.continue-btn {
  margin-top: 1rem;
  background: #4a9eff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}
.continue-btn:hover { background: #3a8eef; }
```

- [ ] **Step 3: Commit**

```bash
git add src/ui/card-view.js style.css
git commit -m "feat: card view UI — fuzzy indicators before, exact values after"
```

---

## Task 11: Intro & Ledger Views

**Files:**
- Create: `src/ui/intro-view.js`
- Create: `src/ui/ledger-view.js`
- Modify: `style.css`

- [ ] **Step 1: Create intro-view.js**

Create `src/ui/intro-view.js`:
```js
export function renderGuildIntro() {
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🏰</div>
    <div class="npc-name">Iron Hearth Guild</div>
    <div class="situation">
      Your hall smells of old leather and ambition.<br><br>
      Four things keep you in business:<br>
      <strong>💰 Gold · ⚔️ Adventurers · 📜 Quests · 🛡️ Equipment</strong><br><br>
      Let none reach ruin — or excess.
    </div>
    <button class="continue-btn" id="continue-btn">Begin →</button>
  </div>`
}

export function renderArcIntro(arc) {
  return `<div class="card intro-card arc-card" id="current-card">
    <div class="arc-badge">🗡️ ${arc.title}</div>
    <div class="npc-portrait">⚔️</div>
    <div class="npc-name">A New Threat</div>
    <div class="situation">${arc.intro}</div>
    <button class="continue-btn" id="continue-btn">Face it →</button>
  </div>`
}
```

- [ ] **Step 2: Create ledger-view.js**

Create `src/ui/ledger-view.js`:
```js
export function renderLedgerScreen(ledgerText, outcome) {
  const title = outcome === 'won' ? '🏆 Victory' : '💀 The Guild Falls'
  const titleClass = outcome === 'won' ? 'ledger-win' : 'ledger-loss'

  return `<div class="card ledger-card" id="ledger-screen">
    <div class="npc-portrait">${outcome === 'won' ? '🏆' : '💀'}</div>
    <div class="npc-name ${titleClass}">${title}</div>
    <div class="ledger-text">${ledgerText}</div>
    <div class="ledger-actions">
      <button class="continue-btn" id="play-again-btn">Play Again</button>
    </div>
  </div>`
}

export function renderTraitSelection(traitA, traitB) {
  return `<div class="card" id="trait-screen">
    <div class="npc-portrait">🏅</div>
    <div class="npc-name">Guild Legacy</div>
    <div class="situation">Choose a legacy that will shape your next guild:</div>
    <div class="choices">
      <button class="choice-btn" id="trait-a">
        <div class="choice-label">${traitA.label}</div>
        <div style="font-size:0.8rem;color:#aaa;margin-top:4px">${traitA.description}</div>
      </button>
      <button class="choice-btn" id="trait-b">
        <div class="choice-label">${traitB.label}</div>
        <div style="font-size:0.8rem;color:#aaa;margin-top:4px">${traitB.description}</div>
      </button>
    </div>
  </div>`
}
```

- [ ] **Step 3: Add ledger styles to style.css**

Append to `style.css`:
```css
/* ===== LEDGER / INTRO ===== */
.intro-card .situation { font-size: 0.95rem; }
.ledger-card .situation { display: none; }
.ledger-text { font-size: 0.9rem; line-height: 1.8; color: #ccc; margin: 1rem 0; font-style: italic; }
.ledger-win { color: #4a4; }
.ledger-loss { color: #e74c3c; }
.ledger-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
```

- [ ] **Step 4: Commit**

```bash
git add src/ui/intro-view.js src/ui/ledger-view.js style.css
git commit -m "feat: intro and ledger views"
```

---

## Task 12: Game Orchestrator

**Files:**
- Create: `src/game.js`

This wires state + queue + UI into the game loop. It owns all event listeners. Each turn: draw card → render → handle choice → update state → re-render resource bar → repeat.

- [ ] **Step 1: Create game.js**

Create `src/game.js`:
```js
import { createState, applyChoice, checkEndCondition, isInTensionZone } from './engine/state.js'
import { createQueueState, advanceQueue, recordStandardCardPlayed, resetMilestoneCounter,
         queueCrisis, dequeueCrisis, queueChained, dequeueChained, pushChainedBack,
         queueRumor, dequeueRumor, scheduleReplacement } from './engine/queue.js'
import { getRepTier, applyRepShift } from './engine/reputation.js'
import { createLedger, recordEvent, updateAdventurerStatus, buildLedgerText } from './engine/ledger.js'
import { loadProgress, saveProgress, unlockArc, completeArc, setLegacyTrait, addAdventurer } from './engine/progression.js'
import { renderResourceBar } from './ui/resource-bar.js'
import { renderCard, renderCardResult, renderRumorCard } from './ui/card-view.js'
import { renderGuildIntro, renderArcIntro } from './ui/intro-view.js'
import { renderLedgerScreen, renderTraitSelection } from './ui/ledger-view.js'
import { standardCards, chainedCards as standardChained } from './data/cards/standard.js'
import { crisisCards } from './data/cards/crisis.js'
import { banditWar } from './data/arcs/bandit-war.js'
import { baseAdventurers } from './data/adventurers.js'
import { traits } from './data/traits.js'

const ALL_ARCS = { 'bandit-war': banditWar }
const ALL_CHAINED = [...standardChained, ...Object.values(ALL_ARCS).flatMap(a => a.chainedCards ?? [])]

let gameState = null
let queueState = null
let ledger = null
let progress = null
let arc = null
let roster = []

const app = document.getElementById('app')

function mount(html) { app.innerHTML = html }

function renderBar() {
  const existing = document.querySelector('.resource-bar')
  if (existing) existing.outerHTML = renderResourceBar(gameState.resources)
  else app.insertAdjacentHTML('afterbegin', renderResourceBar(gameState.resources))
}

function pickArc() {
  const unlocked = progress.unlockedArcs.map(id => ALL_ARCS[id]).filter(Boolean)
  const weights = unlocked.map(a => progress.completedArcs.includes(a.id) ? 0.5 : 1.0)
  const total = weights.reduce((s, w) => s + w, 0)
  let r = Math.random() * total
  for (let i = 0; i < unlocked.length; i++) {
    r -= weights[i]
    if (r <= 0) return unlocked[i]
  }
  return unlocked[unlocked.length - 1]
}

function startRun() {
  progress = loadProgress()
  arc = pickArc()
  gameState = createState()

  // Apply legacy trait
  if (progress.activeLegacyTrait) {
    const trait = traits.find(t => t.id === progress.activeLegacyTrait)
    if (trait?.effect) {
      const deltas = { ...trait.effect }
      // reputation delta handled separately
      const repShift = deltas.reputation ?? 0
      delete deltas.reputation
      gameState = applyChoice(gameState, deltas, {})
      gameState = { ...gameState, turnCount: 0, reputation: applyRepShift(50, repShift) }
    }
  }

  // Build roster
  const pool = [...baseAdventurers, ...progress.unlockedAdventurers]
  const rosterSize = Math.min(Math.floor(Math.random() * 3) + 3, pool.length) // random 3–5
  roster = pool.sort(() => Math.random() - 0.5).slice(0, rosterSize)
  roster.forEach(name => { gameState.resources; }) // roster tracked separately

  ledger = createLedger()
  roster.forEach(name => { ledger = updateAdventurerStatus(ledger, name, 'alive') })

  queueState = { ...createQueueState(), totalMilestones: arc.totalMilestones }

  showGuildIntro()
}

function showGuildIntro() {
  mount(renderResourceBar(gameState.resources) + renderGuildIntro())
  document.getElementById('continue-btn').onclick = () => showArcIntro()
}

function showArcIntro() {
  mount(renderResourceBar(gameState.resources) + renderArcIntro(arc))
  document.getElementById('continue-btn').onclick = () => nextTurn()
}

function nextTurn() {
  // Detect tension zone transitions (only fire Crisis on crossing the boundary, not while staying in zone)
  const RESOURCES = ['gold', 'adventurers', 'quests', 'equipment']
  const prev = queueState.prevTensionZone ?? []
  for (const res of RESOURCES) {
    const inZoneNow = isInTensionZone(gameState.resources[res])
    const wasInZone = prev.includes(res)
    if (inZoneNow && !wasInZone && !queueState.queuedCrisis.includes(res)) {
      queueState = queueCrisis(queueState, res)
    }
  }
  queueState = { ...queueState, prevTensionZone: RESOURCES.filter(r => isInTensionZone(gameState.resources[r])) }

  const { nextCardType, chainedCardId } = advanceQueue(queueState, gameState.turnCount)

  if (nextCardType === 'arc') {
    const milestone = arc.milestones[queueState.milestonesCompleted]
    queueState = resetMilestoneCounter(queueState)
    // Push back any chained events due this turn (spec: arc fires first, chained pushed back 1 turn)
    queueState = {
      ...queueState,
      queuedChained: queueState.queuedChained.map(e =>
        e.firesAtTurn <= gameState.turnCount ? { ...e, firesAtTurn: gameState.turnCount + 1 } : e
      ),
    }
    showCard(milestone, true)
  } else if (nextCardType === 'crisis') {
    const res = queueState.queuedCrisis[0]
    const extreme = gameState.resources[res] < 20 ? 'low' : 'high'
    const card = crisisCards[res][extreme]
    queueState = dequeueCrisis(queueState)
    showCard(card, false)
  } else if (nextCardType === 'chained') {
    const card = ALL_CHAINED.find(c => c.id === chainedCardId)
    queueState = dequeueChained(queueState, chainedCardId)
    if (card) showCard(card, false)
    else nextTurn()
  } else if (nextCardType === 'rumor') {
    const rumorText = arc.rumorTexts[Math.floor(Math.random() * arc.rumorTexts.length)]
    queueState = dequeueRumor(queueState)
    showRumor(rumorText)
  } else {
    // Standard draw
    queueState = recordStandardCardPlayed(queueState)
    // Check replacement adventurer
    const card = drawStandardCard()
    showCard(card, false)
  }
}

function drawStandardCard() {
  // Check if a replacement adventurer card should fire
  if (queueState.pendingReplacement) {
    const rep = queueState.pendingReplacement
    const withinWindow = gameState.turnCount <= rep.windowClosesTurn
    if (withinWindow || true) { // fires even after window closes — never discarded
      const card = rep.card
      queueState = { ...queueState, pendingReplacement: null }
      return card
    }
  }
  // Simple random draw from standard pool
  // Note: full tension-zone and rep-tier weighting deferred to post-v1
  return standardCards[Math.floor(Math.random() * standardCards.length)]
}

function showCard(card, isArc) {
  const html = renderResourceBar(gameState.resources) + renderCard(card, null)
  mount(html)

  if (isArc) {
    const badge = document.createElement('div')
    badge.className = 'arc-badge'
    badge.textContent = `🗡️ ${arc.title} · Milestone ${queueState.milestonesCompleted} of ${arc.totalMilestones}`
    document.querySelector('.card').prepend(badge)
  }

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.onclick = () => handleChoice(card, parseInt(btn.dataset.idx), isArc)
  })
}

function showRumor(text) {
  mount(renderResourceBar(gameState.resources) + renderRumorCard(text))
  document.getElementById('continue-btn').onclick = () => nextTurn()
}

function handleChoice(card, chosenIdx, isArc) {
  const choice = card.choices[chosenIdx]

  // Apply resource deltas
  gameState = applyChoice(gameState, choice.deltas, {})

  // Apply reputation shift
  if (choice.reputation) {
    gameState = { ...gameState, reputation: applyRepShift(gameState.reputation, choice.reputation) }
  }

  // Queue chained event
  if (choice.chains) {
    const delay = Math.floor(Math.random() * 3) + 3 // 3–5 turns
    queueState = queueChained(queueState, choice.chains, gameState.turnCount + delay)
  }

  // Queue rumor
  if (choice.rumorText || (isArc && choice.major)) {
    queueState = queueRumor(queueState)
  }

  // Log major choices to ledger
  if (choice.major) {
    ledger = recordEvent(ledger, `${card.npc.name}: "${choice.label}"`)
  }

  // If a named adventurer was lost (card explicitly sets lostAdventurer), schedule replacement
  if (card.lostAdventurer) {
    ledger = updateAdventurerStatus(ledger, card.lostAdventurer, 'lost')
    const replacementCard = {
      id: `replacement-${card.lostAdventurer}`,
      type: 'standard',
      npc: { emoji: '🌟', name: 'A New Face', role: 'Recruit' },
      situation: `Word travels fast. A recruit arrived at your door the morning after ${card.lostAdventurer} didn't return. They look earnest. They look young.`,
      choices: [
        { label: 'Take them in', deltas: { adventurers: 5, equipment: -3 }, major: false, reputation: 0, chains: null, rumorText: null },
        { label: 'Not yet', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
      ],
    }
    queueState = scheduleReplacement(queueState, replacementCard, gameState.turnCount)
  }

  // Arc completion is checked BEFORE resource limits (spec: win overrides loss)
  if (isArc && card.isFinal) {
    handleWin(choice)
    return
  }

  // Show result then advance — but check arc completion first, then resource limits
  mount(renderResourceBar(gameState.resources) + renderCardResult(card, chosenIdx))
  document.getElementById('continue-btn').onclick = () => {
    // Arc completion check applies to all arc cards, not just isFinal
    if (isArc && queueState.milestonesCompleted >= arc.totalMilestones) {
      handleWin(choice)
      return
    }
    const endCond = checkEndCondition(gameState)
    if (endCond) {
      handleLoss(endCond)
    } else {
      nextTurn()
    }
  }
}

function handleWin(lastChoice) {
  progress = completeArc(progress, arc.id)

  // Unlock new arcs
  arc.unlocks?.forEach(id => { progress = unlockArc(progress, id) })

  // Unlock adventurers
  arc.adventurerUnlocks?.forEach(name => { progress = addAdventurer(progress, name) })

  saveProgress(progress)

  // Build ledger
  const arcLedger = Object.assign({}, ledger, {
    arcName: arc.title,
    arcOutcome: 'won',
    endCondition: null,
    turnCount: gameState.turnCount,
  })
  const ledgerText = buildLedgerText(arcLedger)

  mount(renderLedgerScreen(ledgerText, 'won'))

  // Trait selection before play again
  document.getElementById('play-again-btn').onclick = () => showTraitSelection()
}

function handleLoss(endCond) {
  const arcLedger = Object.assign({}, ledger, {
    arcName: arc.title,
    arcOutcome: 'abandoned',
    endCondition: endCond,
    turnCount: gameState.turnCount,
  })
  const ledgerText = buildLedgerText(arcLedger)

  saveProgress(progress)
  mount(renderLedgerScreen(ledgerText, 'lost'))
  document.getElementById('play-again-btn').onclick = () => startRun()
}

function showTraitSelection() {
  const available = traits.filter(t => t.id !== progress.activeLegacyTrait)
  const shuffled = available.sort(() => Math.random() - 0.5)
  const [traitA, traitB] = shuffled

  mount(renderTraitSelection(traitA, traitB))

  document.getElementById('trait-a').onclick = () => {
    progress = setLegacyTrait(progress, traitA.id)
    saveProgress(progress)
    startRun()
  }
  document.getElementById('trait-b').onclick = () => {
    progress = setLegacyTrait(progress, traitB.id)
    saveProgress(progress)
    startRun()
  }
}

// Boot
startRun()
```

- [ ] **Step 2: Commit**

```bash
git add src/game.js
git commit -m "feat: game orchestrator — full run loop, card queue, win/loss, trait selection"
```

---

## Task 13: Manual Smoke Test

No automated tests for the full game loop — verify by playing.

- [ ] **Step 1: Open in browser**

Open `index.html` directly in a browser (Chrome/Firefox support ES modules from `file://`), or run a local server:
```bash
npx serve .
```
Expected: Guild intro card appears with all four resource bars at 50.

- [ ] **Step 2: Play through the guild intro**

Click **Begin →**
Expected: Arc intro card for The Bandit War appears.

- [ ] **Step 3: Play through several turns**

Click through 5–10 cards. Verify:
- Resource bars update after each choice
- Fuzzy indicators (`+`, `--`, etc.) show before choosing
- Exact values reveal after choosing, with unchosen option also shown
- `⚠️ delayed` appears on choices with chains

- [ ] **Step 4: Trigger a crisis**

Open browser console and run:
```js
gameState.resources.gold = 10
```
Then advance a turn. Expected: Crisis card for gold appears.

- [ ] **Step 5: Play to a loss**

Drive one resource to 0. Expected: Ledger screen appears with narrative text and **Play Again** button.

- [ ] **Step 6: Play to a win**

Use browser console to fast-forward arc milestones:
```js
queueState.standardCardsSinceLastMilestone = 99
```
Advance through all 6 milestones. Expected: Win screen → Trait selection → new run starts.

- [ ] **Step 7: Verify meta-progression persists**

After winning, refresh the page. Expected: The completed arc is weighted lower; the unlocked arc appears in the pool; the selected legacy trait affects starting resources.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "test: manual smoke test complete — all core flows verified"
```

---

## Task 14: Final Polish Pass

**Files:**
- Modify: `style.css`
- Modify: `src/ui/card-view.js` (arc card badge positioning)

- [ ] **Step 1: Add CSS transition on resource fills**

Already included in Task 9 (`transition: width 0.3s ease`). Verify it animates smoothly in the browser.

- [ ] **Step 2: Add a simple fade-in on card mount**

Append to `style.css`:
```css
/* ===== TRANSITIONS ===== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card { animation: fadeIn 0.2s ease; }
```

- [ ] **Step 3: Verify on mobile viewport**

Resize browser to 375px width. Check that:
- Resource bar is readable
- Choices don't overflow
- Text is legible

Fix any overflow issues with `word-break: break-word` or smaller font sizes as needed.

- [ ] **Step 4: Run full test suite one final time**

Run: `npm test`
Expected: All engine tests passing (state, queue, reputation, ledger, progression).

- [ ] **Step 5: Final commit**

```bash
git add style.css
git commit -m "polish: card fade-in, mobile viewport check"
```
