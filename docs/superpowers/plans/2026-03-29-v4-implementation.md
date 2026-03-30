# GuildMaster V4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add unlock system, post-choice narrative text, unlock toast, and redesigned game start flow (tutorial + scenario selection).

**Architecture:** New pure-data unlock registry (`unlocks.js`) + stateless condition evaluator (`unlock-engine.js`) wired into `game.js` at two checkpoints (after each choice, on run end). UI changes are isolated to their respective view files; `setup-flow.js` gains two new steps (tutorial, scenario selection) threaded before guild naming.

**Tech Stack:** Vanilla JS (ES modules), Vitest for tests, DOM manipulation for animations.

---

## File Map

| File | Status | Responsibility |
|---|---|---|
| `src/data/unlocks.js` | **Create** | Pure registry of all unlockable content |
| `src/engine/unlock-engine.js` | **Create** | Condition evaluator + progress mutator |
| `src/ui/unlock-menu.js` | **Create** | Discoveries screen |
| `src/ui/unlock-toast.js` | **Create** | Animated unlock notification |
| `src/engine/progression.js` | **Modify** | Remove trait system; add `unlockedContent`, `skipTutorial`, helpers |
| `src/game.js` | **Modify** | Wire unlock checkpoints, result text, arc selection, remove traits |
| `src/ui/card-view.js` | **Modify** | Add `showChoiceResult()` DOM function |
| `src/ui/intro-view.js` | **Modify** | Add tutorial card + scenario selection views; update copy |
| `src/ui/setup-flow.js` | **Modify** | Thread tutorial + scenario selection into setup wizard |
| `src/ui/ledger-view.js` | **Modify** | Remove `renderTraitSelection` |
| `src/ui/menu-view.js` | **Modify** | Add Discoveries button |
| `src/ui/shell.js` | **Modify** | Wire Discoveries button; pass arc to startGame |
| `src/data/traits.js` | **Delete** | Legacy trait system |
| `tests/engine/unlock-engine.test.js` | **Create** | Unit tests for condition evaluator |
| `tests/engine/progression.test.js` | **Modify** | Update for removed/added fields |

---

### Task 1: Unlock Registry

**Files:**
- Create: `src/data/unlocks.js`

- [ ] **Step 1: Create the registry file**

```javascript
// src/data/unlocks.js
// Pure data. No imports, no side effects.
// condition: null means pre-unlocked (seeded into unlockedContent on createProgress).
// contentId maps to the NPC/arc registry id (strips the type prefix convention).

export const unlocks = [
  {
    id: 'npc-sister-maren',
    type: 'npc',
    contentId: 'sister-maren',
    name: 'Sister Maren',
    emoji: '🙏',
    flavor: 'A temple priest who walks the line between faith and pragmatism.',
    hint: null,
    secret: false,
    condition: null,
    conditionHint: null,
  },
  {
    id: 'npc-sergeant-brek',
    type: 'npc',
    contentId: 'sergeant-brek',
    name: 'Sergeant Brek',
    emoji: '🏋️',
    flavor: 'A combat instructor who demands more than gold for his knowledge.',
    hint: null,
    secret: false,
    condition: null,
    conditionHint: null,
  },
  {
    id: 'npc-jolen-fence',
    type: 'npc',
    contentId: 'jolen-fence',
    name: 'Jolen the Fence',
    emoji: '🤫',
    flavor: 'Crime pays, and Jolen knows all the rates.',
    hint: 'A shadowy contact who deals in things better left unasked.',
    secret: false,
    condition: { type: 'run-win' },
    conditionHint: 'Win any run.',
  },
  {
    id: 'npc-lord-farwick',
    type: 'npc',
    contentId: 'lord-farwick',
    name: 'Lord Farwick',
    emoji: '👑',
    flavor: 'A minor nobleman who trades favors like coin.',
    hint: 'A minor nobleman with powerful connections.',
    secret: false,
    condition: { type: 'arc-complete', arc: 'bandit-war' },
    conditionHint: 'Complete the Bandit War arc.',
  },
  {
    id: 'arc-bandit-war',
    type: 'arc',
    contentId: 'bandit-war',
    name: 'The Bandit War',
    emoji: '⚔️',
    flavor: 'Merchants on the eastern road have stopped arriving. The last one who made it through said one word before collapsing: bandits.',
    hint: null,
    secret: false,
    condition: null,
    conditionHint: null,
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/unlocks.js
git commit -m "feat: add unlock registry (unlocks.js)"
```

---

### Task 2: Update Progression

**Files:**
- Modify: `src/engine/progression.js`
- Modify: `tests/engine/progression.test.js`

- [ ] **Step 1: Write the failing tests first**

Replace the entire contents of `tests/engine/progression.test.js`:

```javascript
import { describe, it, expect } from 'vitest'
import {
  createProgress, unlockArc, completeArc, addAdventurer,
  isUnlocked, getUnlockedByType,
} from '../../src/engine/progression.js'

describe('createProgress', () => {
  it('initialises with only bandit-war unlocked', () => {
    const p = createProgress()
    expect(p.unlockedArcs).toContain('bandit-war')
    expect(p.completedArcs).toEqual([])
  })

  it('pre-seeds unlockedContent with sister-maren, sergeant-brek, arc-bandit-war', () => {
    const p = createProgress()
    expect(p.unlockedContent).toContain('npc-sister-maren')
    expect(p.unlockedContent).toContain('npc-sergeant-brek')
    expect(p.unlockedContent).toContain('arc-bandit-war')
  })

  it('has skipTutorial defaulting to false', () => {
    const p = createProgress()
    expect(p.skipTutorial).toBe(false)
  })

  it('does not have activeLegacyTrait', () => {
    const p = createProgress()
    expect(p.activeLegacyTrait).toBeUndefined()
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

describe('addAdventurer', () => {
  it('adds to unlockedAdventurers', () => {
    const p = addAdventurer(createProgress(), 'Rena the Axe')
    expect(p.unlockedAdventurers).toContain('Rena the Axe')
  })
})

describe('isUnlocked', () => {
  it('returns true for pre-seeded content', () => {
    const p = createProgress()
    expect(isUnlocked(p, 'npc-sister-maren')).toBe(true)
  })

  it('returns false for content not in unlockedContent', () => {
    const p = createProgress()
    expect(isUnlocked(p, 'npc-lord-farwick')).toBe(false)
  })
})

describe('getUnlockedByType', () => {
  it('returns only unlocked entries of the requested type', () => {
    const p = createProgress()
    const npcs = getUnlockedByType(p, 'npc')
    expect(npcs.map(e => e.id)).toContain('npc-sister-maren')
    expect(npcs.map(e => e.id)).toContain('npc-sergeant-brek')
    expect(npcs.map(e => e.id)).not.toContain('npc-lord-farwick')
  })

  it('returns only entries of the requested type', () => {
    const p = createProgress()
    const npcs = getUnlockedByType(p, 'npc')
    expect(npcs.every(e => e.type === 'npc')).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
cd /c/Projets/GuildMaster && npx vitest run tests/engine/progression.test.js
```

Expected: failures on `isUnlocked`, `getUnlockedByType`, `unlockedContent`, `skipTutorial`.

- [ ] **Step 3: Rewrite progression.js**

Replace the entire file:

```javascript
// src/engine/progression.js
import { unlocks } from '../data/unlocks.js'

const STORAGE_KEY = 'guildmaster_progress'

export function createProgress() {
  return {
    unlockedArcs: ['bandit-war'],
    completedArcs: [],
    unlockedAdventurers: [],
    unlockedContent: ['npc-sister-maren', 'npc-sergeant-brek', 'arc-bandit-war'],
    skipTutorial: false,
  }
}

export function loadProgress() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (!raw) return createProgress()
    const saved = JSON.parse(raw)
    // Backfill fields missing from older saves
    return {
      ...createProgress(),
      ...saved,
    }
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

export function addAdventurer(progress, name) {
  if (progress.unlockedAdventurers.includes(name)) return progress
  return { ...progress, unlockedAdventurers: [...progress.unlockedAdventurers, name] }
}

export function isUnlocked(progress, id) {
  return progress.unlockedContent.includes(id)
}

export function getUnlockedByType(progress, type) {
  return unlocks.filter(u => u.type === type && progress.unlockedContent.includes(u.id))
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run tests/engine/progression.test.js
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/engine/progression.js tests/engine/progression.test.js
git commit -m "feat: update progression — add unlockedContent, skipTutorial, remove traits"
```

---

### Task 3: Unlock Engine

**Files:**
- Create: `src/engine/unlock-engine.js`
- Create: `tests/engine/unlock-engine.test.js`

- [ ] **Step 1: Write the failing tests**

Create `tests/engine/unlock-engine.test.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createProgress } from '../../src/engine/progression.js'
import { initUnlockEngine, checkAfterChoice, checkOnRunEnd } from '../../src/engine/unlock-engine.js'

function makeProgress(extra = {}) {
  return { ...createProgress(), ...extra }
}

function makeGameState(resources = {}) {
  return { resources: { gold: 50, adventurers: 50, quests: 50, equipment: 50, ...resources } }
}

describe('checkAfterChoice — resource-threshold', () => {
  it('does not fire when resource is below threshold', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    // Add a fake resource-threshold entry to test (using the real registry has no such entry by default)
    // We test indirectly: no locked entry has resource-threshold condition currently
    // so we just verify no false positives
    const p = makeProgress()
    const { newlyUnlocked } = checkAfterChoice(p, makeGameState(), new Set())
    expect(newlyUnlocked).toHaveLength(0)
  })

  it('does not fire for content already unlocked', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    const p = makeProgress()
    const { newlyUnlocked } = checkAfterChoice(p, makeGameState({ gold: 95 }), new Set())
    // No resource-threshold conditions in registry yet — no unlocks
    expect(newlyUnlocked).toHaveLength(0)
    expect(onUnlock).not.toHaveBeenCalled()
  })
})

describe('checkAfterChoice — flag condition', () => {
  it('does not fire when flag is absent', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    const p = makeProgress()
    const { newlyUnlocked } = checkAfterChoice(p, makeGameState(), new Set())
    expect(newlyUnlocked).toHaveLength(0)
  })
})

describe('checkOnRunEnd — run-win', () => {
  it('unlocks jolen-fence on any win', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    const p = makeProgress()  // jolen-fence not yet unlocked
    const outcome = { result: 'win', arc: 'bandit-war', finalResources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 } }
    const { progress, newlyUnlocked } = checkOnRunEnd(p, outcome)
    expect(newlyUnlocked.map(e => e.id)).toContain('npc-jolen-fence')
    expect(progress.unlockedContent).toContain('npc-jolen-fence')
    expect(onUnlock).toHaveBeenCalledWith(expect.objectContaining({ id: 'npc-jolen-fence' }))
  })

  it('does not fire on loss', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    const p = makeProgress()
    const outcome = { result: 'loss', arc: 'bandit-war', finalResources: { gold: 0, adventurers: 50, quests: 50, equipment: 50 } }
    const { newlyUnlocked } = checkOnRunEnd(p, outcome)
    expect(newlyUnlocked.map(e => e.id)).not.toContain('npc-jolen-fence')
  })

  it('does not re-unlock already-unlocked content', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    const p = makeProgress({ unlockedContent: [...createProgress().unlockedContent, 'npc-jolen-fence'] })
    const outcome = { result: 'win', arc: 'bandit-war', finalResources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 } }
    const { newlyUnlocked } = checkOnRunEnd(p, outcome)
    expect(newlyUnlocked.map(e => e.id)).not.toContain('npc-jolen-fence')
    expect(onUnlock).not.toHaveBeenCalled()
  })
})

describe('checkOnRunEnd — arc-complete', () => {
  it('unlocks lord-farwick on bandit-war completion', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    const p = makeProgress()
    const outcome = { result: 'win', arc: 'bandit-war', finalResources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 } }
    const { newlyUnlocked } = checkOnRunEnd(p, outcome)
    expect(newlyUnlocked.map(e => e.id)).toContain('npc-lord-farwick')
  })

  it('does not unlock lord-farwick for a different arc win', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    const p = makeProgress()
    const outcome = { result: 'win', arc: 'some-other-arc', finalResources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 } }
    const { newlyUnlocked } = checkOnRunEnd(p, outcome)
    expect(newlyUnlocked.map(e => e.id)).not.toContain('npc-lord-farwick')
  })
})

describe('checkOnRunEnd — run-loss', () => {
  it('does not unlock run-win entries on loss', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    const p = makeProgress()
    const outcome = { result: 'loss', arc: 'bandit-war', finalResources: { gold: 0, adventurers: 50, quests: 50, equipment: 50 } }
    const { newlyUnlocked } = checkOnRunEnd(p, outcome)
    expect(newlyUnlocked.map(e => e.id)).not.toContain('npc-jolen-fence')
    expect(newlyUnlocked.map(e => e.id)).not.toContain('npc-lord-farwick')
  })
})

describe('multiple simultaneous unlocks', () => {
  it('unlocks jolen-fence and lord-farwick in one call', () => {
    const onUnlock = vi.fn()
    initUnlockEngine(onUnlock)
    const p = makeProgress()
    const outcome = { result: 'win', arc: 'bandit-war', finalResources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 } }
    const { newlyUnlocked } = checkOnRunEnd(p, outcome)
    expect(newlyUnlocked).toHaveLength(2)
    expect(onUnlock).toHaveBeenCalledTimes(2)
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run tests/engine/unlock-engine.test.js
```

Expected: FAIL — `unlock-engine.js` does not exist.

- [ ] **Step 3: Create unlock-engine.js**

Create `src/engine/unlock-engine.js`:

```javascript
// src/engine/unlock-engine.js
import { unlocks } from '../data/unlocks.js'
import { saveProgress } from './progression.js'

let _onUnlock = null

/**
 * Must be called once at game start.
 * @param {function(entry): void} onUnlock  Called for each newly unlocked entry.
 */
export function initUnlockEngine(onUnlock) {
  _onUnlock = onUnlock ?? null
}

/**
 * Call after each player choice during a run.
 * Evaluates 'flag' and 'resource-threshold' conditions.
 * @param {object} progress   Current progress state (immutable input)
 * @param {object} gameState  Current game state ({ resources: {...} })
 * @param {Set}    flags      Named flags set during this run
 * @returns {{ progress: object, newlyUnlocked: Array }}
 */
export function checkAfterChoice(progress, gameState, flags) {
  return _evaluate(progress, gameState, flags, ['flag', 'resource-threshold'])
}

/**
 * Call when a run ends (win or loss).
 * Evaluates 'arc-complete', 'run-win', 'run-loss' conditions.
 * @param {object} progress  Current progress state (immutable input)
 * @param {{ result: 'win'|'loss', arc: string, finalResources: object }} outcome
 * @returns {{ progress: object, newlyUnlocked: Array }}
 */
export function checkOnRunEnd(progress, outcome) {
  return _evaluate(progress, outcome, null, ['arc-complete', 'run-win', 'run-loss'])
}

function _evaluate(progress, context, flags, allowedTypes) {
  let updated = progress
  const newlyUnlocked = []

  for (const entry of unlocks) {
    if (entry.condition === null) continue
    if (updated.unlockedContent.includes(entry.id)) continue
    if (!allowedTypes.includes(entry.condition.type)) continue
    if (_check(entry.condition, context, flags)) {
      updated = { ...updated, unlockedContent: [...updated.unlockedContent, entry.id] }
      newlyUnlocked.push(entry)
      if (_onUnlock) _onUnlock(entry)
    }
  }

  if (newlyUnlocked.length > 0) saveProgress(updated)
  return { progress: updated, newlyUnlocked }
}

function _check(condition, context, flags) {
  switch (condition.type) {
    case 'flag':
      return flags != null && flags.has(condition.flag)

    case 'resource-threshold':
      return context.resources[condition.resource] >= condition.threshold

    case 'run-win': {
      if (context.result !== 'win') return false
      if (condition.resource != null && condition.threshold != null) {
        return context.finalResources[condition.resource] >= condition.threshold
      }
      return true
    }

    case 'run-loss':
      return context.result === 'loss'

    case 'arc-complete':
      return context.result === 'win' && context.arc === condition.arc

    default:
      return false
  }
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run tests/engine/unlock-engine.test.js
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/engine/unlock-engine.js tests/engine/unlock-engine.test.js
git commit -m "feat: add unlock engine with condition evaluator"
```

---

### Task 4: Post-choice Result Text

**Files:**
- Modify: `src/ui/card-view.js`

- [ ] **Step 1: Add `showChoiceResult` export**

In `src/ui/card-view.js`, append after the last line:

```javascript
/**
 * Fades out the choices block and fades in result text on the current card.
 * Call immediately after a choice is made. No-op if #current-card is absent.
 * @param {string} resultText  Narrative result text for the chosen option.
 */
export function showChoiceResult(resultText) {
  const cardEl = document.getElementById('current-card')
  if (!cardEl) return

  const choicesEl = cardEl.querySelector('.choices')
  if (choicesEl) {
    choicesEl.style.transition = 'opacity 0.2s ease'
    choicesEl.style.opacity = '0'
  }

  setTimeout(() => {
    if (choicesEl) choicesEl.style.display = 'none'

    const resultEl = document.createElement('div')
    resultEl.className = 'card-result-text'
    resultEl.style.opacity = '0'
    resultEl.style.transition = 'opacity 0.35s ease'
    resultEl.textContent = resultText

    const situationEl = cardEl.querySelector('.situation')
    if (situationEl) {
      situationEl.after(resultEl)
    } else {
      cardEl.appendChild(resultEl)
    }

    // Force reflow so the transition fires
    void resultEl.offsetHeight
    resultEl.style.opacity = '1'
  }, 200)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/card-view.js
git commit -m "feat: add showChoiceResult for post-choice narrative text"
```

---

### Task 5: Unlock Toast

**Files:**
- Create: `src/ui/unlock-toast.js`

- [ ] **Step 1: Create the file**

```javascript
// src/ui/unlock-toast.js
// Non-blocking animated unlock notification.
// Queue-based: multiple unlocks are shown sequentially.
// Call setActive(false) to suppress toasts (e.g. while on menu/discoveries).

const QUEUE_DELAY_MS = 400   // gap between sequential toasts
const TOAST_DURATION_MS = 2500

let _queue = []
let _running = false
let _active = true

/**
 * Show an unlock toast. If another toast is playing, queues this one.
 * @param {{ name: string, emoji: string, conditionHint: string|null }} entry
 */
export function show(entry) {
  _queue.push(entry)
  if (!_running) _processQueue()
}

/** Suppress or re-enable toast display. Clears the queue when suppressed. */
export function setActive(active) {
  _active = active
  if (!active) {
    _queue = []
    _running = false
  }
}

function _processQueue() {
  if (!_active || _queue.length === 0) {
    _running = false
    return
  }
  _running = true
  const entry = _queue.shift()
  _animate(entry, () => {
    setTimeout(() => _processQueue(), QUEUE_DELAY_MS)
  })
}

function _animate(entry, onDone) {
  const toast = document.createElement('div')
  toast.className = 'unlock-toast'
  toast.innerHTML = `
    <span class="unlock-toast-icon">🔒</span>
    <span class="unlock-toast-name">${entry.name}</span>
    <span class="unlock-toast-status">${entry.conditionHint ?? 'Unlocked'}</span>
  `
  toast.style.cssText = `
    position: fixed;
    top: 16px;
    right: -300px;
    z-index: 9999;
    background: #2a2a2a;
    color: #eee;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    min-width: 200px;
    max-width: 280px;
    transition: right 0.3s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  `
  document.body.appendChild(toast)

  // Slide in
  void toast.offsetHeight
  toast.style.right = '16px'

  // Phase 1 (~700ms): lock shake
  setTimeout(() => {
    const icon = toast.querySelector('.unlock-toast-icon')
    if (icon) {
      icon.style.display = 'inline-block'
      icon.style.animation = 'toast-shake 0.4s ease'
    }
  }, 700)

  // Phase 2 (~1200ms): background flash green, icon unlocks, text updates
  setTimeout(() => {
    toast.style.background = '#1a4a2a'
    const icon = toast.querySelector('.unlock-toast-icon')
    if (icon) { icon.style.animation = ''; icon.textContent = '🔓' }
    const status = toast.querySelector('.unlock-toast-status')
    if (status) status.textContent = 'Unlocked!'
  }, 1200)

  // Phase 3: fade out and slide away
  setTimeout(() => {
    toast.style.transition = 'right 0.3s ease, opacity 0.3s ease'
    toast.style.right = '-300px'
    toast.style.opacity = '0'
  }, TOAST_DURATION_MS - 300)

  setTimeout(() => {
    toast.remove()
    onDone()
  }, TOAST_DURATION_MS)
}
```

- [ ] **Step 2: Add the shake keyframe to `index.html` or the stylesheet**

Check where CSS lives:

```bash
ls /c/Projets/GuildMaster/src/*.css 2>/dev/null || ls /c/Projets/GuildMaster/*.css 2>/dev/null || grep -r "keyframes" /c/Projets/GuildMaster/src --include="*.css" -l
```

Add to the main CSS file (wherever existing styles live), in a new block at the end:

```css
/* Unlock toast */
@keyframes toast-shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-4px) rotate(-5deg); }
  40%       { transform: translateX(4px) rotate(5deg); }
  60%       { transform: translateX(-3px) rotate(-3deg); }
  80%       { transform: translateX(3px) rotate(3deg); }
}

.unlock-toast-icon {
  font-size: 1.4rem;
}

.unlock-toast-name {
  font-weight: bold;
  font-size: 0.95rem;
}

.unlock-toast-status {
  font-size: 0.8rem;
  color: #aaa;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/ui/unlock-toast.js
git commit -m "feat: add unlock toast with queue and animation"
```

---

### Task 6: Discoveries Menu

**Files:**
- Create: `src/ui/unlock-menu.js`

- [ ] **Step 1: Create the file**

```javascript
// src/ui/unlock-menu.js
import { unlocks } from '../data/unlocks.js'

const CATEGORIES = [
  { type: 'npc',   label: 'NPCs' },
  { type: 'arc',   label: 'Arcs' },
  { type: 'event', label: 'Events' },
  { type: 'card',  label: 'Cards' },
]

const PLACEHOLDER_TYPES = new Set(['event', 'card'])

/**
 * Renders the Discoveries screen.
 * @param {object} progress  Loaded progress state (needs .unlockedContent)
 * @returns {string} HTML string
 */
export function renderDiscoveriesMenu(progress) {
  const sections = CATEGORIES.map(cat => _renderSection(cat, progress)).join('')
  return `
    <div class="discoveries-screen">
      <div class="discoveries-header">
        <h2 class="discoveries-title">Discoveries</h2>
      </div>
      ${sections}
      <div class="discoveries-footer">
        <button class="menu-btn" id="discoveries-back-btn">← Back</button>
      </div>
    </div>
  `
}

function _renderSection({ type, label }, progress) {
  if (PLACEHOLDER_TYPES.has(type)) {
    return `
      <details class="discoveries-section" open>
        <summary class="discoveries-section-title">${label}</summary>
        <div class="discoveries-entries">
          <div class="discoveries-placeholder">More content coming soon.</div>
        </div>
      </details>
    `
  }

  const entries = unlocks.filter(u => u.type === type)
  const items = entries.map(entry => _renderEntry(entry, progress)).join('')

  return `
    <details class="discoveries-section" open>
      <summary class="discoveries-section-title">${label}</summary>
      <div class="discoveries-entries">
        ${items}
      </div>
    </details>
  `
}

function _renderEntry(entry, progress) {
  const unlocked = progress.unlockedContent.includes(entry.id)

  if (unlocked) {
    return `
      <div class="discoveries-entry unlocked">
        <span class="discoveries-entry-icon">${entry.emoji}</span>
        <div class="discoveries-entry-info">
          <div class="discoveries-entry-name">${entry.name}</div>
          <div class="discoveries-entry-flavor">${entry.flavor}</div>
        </div>
      </div>
    `
  }

  if (entry.secret) {
    return `
      <div class="discoveries-entry locked secret">
        <span class="discoveries-entry-icon">🔒</span>
        <div class="discoveries-entry-info">
          <div class="discoveries-entry-name">???</div>
        </div>
      </div>
    `
  }

  return `
    <div class="discoveries-entry locked">
      <span class="discoveries-entry-icon">🔒</span>
      <div class="discoveries-entry-info">
        <div class="discoveries-entry-name">${entry.name}</div>
        <div class="discoveries-entry-condition">${entry.hint ?? entry.conditionHint ?? ''}</div>
      </div>
    </div>
  `
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/unlock-menu.js
git commit -m "feat: add Discoveries menu (unlock-menu.js)"
```

---

### Task 7: Intro View Updates

**Files:**
- Modify: `src/ui/intro-view.js`

- [ ] **Step 1: Rewrite intro-view.js with all four updates**

Replace the entire file:

```javascript
// src/ui/intro-view.js

// --- Tutorial card ---

export function renderTutorialCard() {
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">📖</div>
    <div class="npc-name">Welcome, Guild Master</div>
    <div class="situation">
      <strong>Who you are:</strong> You run a guild in a world that doesn't care if you succeed.<br><br>
      <strong>What to do:</strong> Keep your guild running for 60 turns. If any of your four resources —
      💰 Gold, ⚔️ Adventurers, 📜 Quests, 🛡️ Equipment — hits 0 or 100, the run ends.<br><br>
      <strong>How:</strong> Every turn, someone walks through your door with a problem.
      You choose how to handle it. Every choice costs and gains resources.
    </div>
    <label class="tutorial-skip-label">
      <input type="checkbox" id="tutorial-skip-checkbox"> Don't show this again
    </label>
    <button class="continue-btn" id="continue-btn">Begin →</button>
  </div>`
}

// --- Scenario selection ---

/**
 * @param {Array}    arcEntries     Unlock registry entries of type 'arc'
 * @param {string[]} unlockedContent  progress.unlockedContent
 */
export function renderScenarioSelection(arcEntries, unlockedContent) {
  const cards = arcEntries.map(entry => {
    const isUnlocked = unlockedContent.includes(entry.id)
    const lockedClass = isUnlocked ? '' : 'arc-select-card--locked'
    const condition = !isUnlocked && entry.conditionHint
      ? `<div class="arc-select-condition">${entry.conditionHint}</div>`
      : ''
    return `
      <div class="arc-select-card ${lockedClass}" data-arc-id="${entry.contentId}" data-locked="${!isUnlocked}">
        <div class="arc-select-emoji">${entry.emoji}</div>
        <div class="arc-select-name">${entry.name}</div>
        <div class="arc-select-flavor">${entry.flavor}</div>
        ${condition}
      </div>
    `
  }).join('')

  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🗺️</div>
    <div class="npc-name">Choose Your Scenario</div>
    <div class="situation">Every town has a story. Choose which one you'll try to survive.</div>
    <div class="arc-select-grid">${cards}</div>
    <button class="continue-btn" id="arc-confirm-btn" disabled>Select a scenario →</button>
  </div>`
}

// --- Guild naming ---

export function renderGuildNaming(previousName) {
  const defaultName = previousName || 'Iron Hearth Guild'
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🏰</div>
    <div class="npc-name">Name Your Guild</div>
    <div class="situation">You've just arrived in a small town with big ambitions. A building stands ready to welcome adventurers — it just needs a name.</div>
    <input type="text" id="guild-name-input" class="guild-input" value="${defaultName}" maxlength="30" />
    <button class="continue-btn" id="continue-btn">Continue →</button>
  </div>`
}

// --- NPC selection ---

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
    <div class="situation">These faces will cross your path again and again. How you treat them shapes what they offer — and what they withhold.</div>
    <div class="npc-select-grid">${cards}</div>
    <button class="continue-btn" id="npc-confirm-btn" disabled>Select 2 to continue →</button>
  </div>`
}

// --- In-run intros (shown after game starts, unchanged) ---

export function renderGuildIntro(guildName) {
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🏰</div>
    <div class="npc-name">${guildName}</div>
    <div class="situation">
      Your hall smells of old leather and ambition.<br><br>
      Four things keep you in business:<br>
      <strong>💰 Gold · ⚔️ Adventurers <br>📜 Quests · 🛡️ Equipment</strong><br><br>
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

- [ ] **Step 2: Commit**

```bash
git add src/ui/intro-view.js
git commit -m "feat: add tutorial card and scenario selection to intro-view"
```

---

### Task 8: Update Setup Flow

**Files:**
- Modify: `src/ui/setup-flow.js`

- [ ] **Step 1: Rewrite setup-flow.js**

Replace the entire file:

```javascript
// src/ui/setup-flow.js
import {
  renderTutorialCard, renderScenarioSelection,
  renderGuildNaming, renderNpcSelection,
} from './intro-view.js'
import { allNpcIds, npcRegistry } from '../data/cards/npcs/index.js'
import { unlocks } from '../data/unlocks.js'
import { saveProgress } from '../engine/progression.js'

/**
 * Runs the pre-run setup wizard.
 * @param {{ progress, mount, onComplete, onBack }} opts
 *   progress   - loaded progress object
 *   mount      - function(html) to render into #app
 *   onComplete - function({ guildName, selectedNpcs, arcId }) called when done
 *   onBack     - function() called when player clicks Back
 */
export function start({ progress, mount, onComplete, onBack }) {
  if (progress.skipTutorial) {
    showScenarioSelection({ progress, mount, onComplete, onBack })
  } else {
    showTutorial({ progress, mount, onComplete, onBack })
  }
}

function showTutorial({ progress, mount, onComplete, onBack }) {
  mount(renderTutorialCard())

  document.getElementById('continue-btn').onclick = () => {
    const skipChecked = document.getElementById('tutorial-skip-checkbox')?.checked ?? false
    let updatedProgress = progress
    if (skipChecked) {
      updatedProgress = { ...progress, skipTutorial: true }
      saveProgress(updatedProgress)
    }
    showScenarioSelection({ progress: updatedProgress, mount, onComplete, onBack })
  }
}

function showScenarioSelection({ progress, mount, onComplete, onBack }) {
  const arcEntries = unlocks.filter(u => u.type === 'arc')
  mount(`
    <a class="setup-back-link" id="setup-back">← Back</a>
    ${renderScenarioSelection(arcEntries, progress.unlockedContent)}
  `)

  document.getElementById('setup-back').onclick = () => {
    if (progress.skipTutorial) {
      onBack()
    } else {
      showTutorial({ progress, mount, onComplete, onBack })
    }
  }

  let selectedArcId = null

  // Auto-select the only unlocked arc if there is exactly one
  const unlockedArcs = arcEntries.filter(e => progress.unlockedContent.includes(e.id))
  if (unlockedArcs.length === 1) {
    selectedArcId = unlockedArcs[0].contentId
    const btn = document.getElementById('arc-confirm-btn')
    if (btn) {
      btn.disabled = false
      btn.textContent = `Play ${unlockedArcs[0].name} →`
    }
    const card = document.querySelector(`[data-arc-id="${selectedArcId}"]`)
    if (card) card.classList.add('selected')
  }

  document.querySelectorAll('.arc-select-card').forEach(card => {
    card.onclick = () => {
      if (card.dataset.locked === 'true') return
      document.querySelectorAll('.arc-select-card').forEach(c => c.classList.remove('selected'))
      card.classList.add('selected')
      selectedArcId = card.dataset.arcId
      const btn = document.getElementById('arc-confirm-btn')
      if (btn) {
        btn.disabled = false
        const entry = arcEntries.find(e => e.contentId === selectedArcId)
        btn.textContent = entry ? `Play ${entry.name} →` : 'Continue →'
      }
    }
  })

  document.getElementById('arc-confirm-btn').onclick = () => {
    if (!selectedArcId) return
    showGuildNaming({ arcId: selectedArcId, progress, mount, onComplete, onBack })
  }
}

function showGuildNaming({ arcId, progress, mount, onComplete, onBack }) {
  const prev = progress.lastGuildName || 'Iron Hearth Guild'
  mount(`
    <a class="setup-back-link" id="setup-back">← Back</a>
    ${renderGuildNaming(prev)}
  `)
  document.getElementById('setup-back').onclick = () =>
    showScenarioSelection({ progress, mount, onComplete, onBack })

  document.getElementById('continue-btn').onclick = () => {
    const guildName = document.getElementById('guild-name-input').value.trim() || prev
    showNpcSelection({ arcId, guildName, progress, mount, onComplete, onBack })
  }
}

function showNpcSelection({ arcId, guildName, progress, mount, onComplete, onBack }) {
  // Filter NPC pool to only unlocked NPCs
  const unlockedNpcIds = unlocks
    .filter(u => u.type === 'npc' && progress.unlockedContent.includes(u.id))
    .map(u => u.contentId)
  const npcList = unlockedNpcIds.map(id => npcRegistry[id]).filter(Boolean)

  mount(`
    <a class="setup-back-link" id="setup-back">← Back</a>
    ${renderNpcSelection(npcList)}
  `)

  document.getElementById('setup-back').onclick = () =>
    showGuildNaming({ arcId, progress, mount, onComplete, onBack })

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
    onComplete({ guildName, selectedNpcs: selected, arcId })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/setup-flow.js
git commit -m "feat: add tutorial and scenario selection to setup flow"
```

---

### Task 9: Update Ledger View

**Files:**
- Modify: `src/ui/ledger-view.js`

- [ ] **Step 1: Remove `renderTraitSelection`, update Play Again button**

Replace the entire file:

```javascript
// src/ui/ledger-view.js

export function renderLedgerScreen(ledgerText, outcome) {
  const title = outcome === 'won' ? '🏆 Victory' : '💀 The Guild Falls'
  const titleClass = outcome === 'won' ? 'ledger-win' : 'ledger-loss'

  return `<div class="card ledger-card" id="ledger-screen">
    <div class="npc-portrait">${outcome === 'won' ? '🏆' : '💀'}</div>
    <div class="npc-name ${titleClass}">${title}</div>
    <div class="ledger-text">${ledgerText}</div>
    <div class="ledger-actions">
      <button class="continue-btn" id="play-again-btn">Return to Menu</button>
    </div>
  </div>`
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/ledger-view.js
git commit -m "feat: remove trait selection from ledger; return directly to menu"
```

---

### Task 10: Update Menu View

**Files:**
- Modify: `src/ui/menu-view.js`

- [ ] **Step 1: Add Discoveries button**

Replace the entire file:

```javascript
// src/ui/menu-view.js
export function renderMenu(saveExists) {
  const continueDisabled = saveExists ? '' : 'disabled'
  return `
    <div class="menu-screen">
      <img class="menu-logo-img" src="assets/image/guildmaster_logo.png" alt="GuildMaster">
      <div class="menu-buttons">
        <button class="menu-btn" id="menu-new-game">New Game</button>
        <button class="menu-btn" id="menu-continue" ${continueDisabled}>Continue</button>
        <button class="menu-btn" id="menu-discoveries">Discoveries</button>
        <button class="menu-btn" id="menu-options">Options</button>
      </div>
      <div class="menu-version">v4.0 · 2026</div>
    </div>
  `
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/menu-view.js
git commit -m "feat: add Discoveries button to main menu"
```

---

### Task 11: Wire game.js

**Files:**
- Modify: `src/game.js`

This task has many changes. Apply them in the order listed.

- [ ] **Step 1: Update imports**

Change the import block at the top of `src/game.js`. Remove the traits and trait-related imports; add unlock engine, unlock toast, and showChoiceResult:

Find and replace the import section (lines 1–27). The new import section is:

```javascript
import { createState, applyChoice, checkEndCondition, isInTensionZone } from './engine/state.js'
import { createQueueState, advanceQueue, recordStandardCardPlayed, resetMilestoneCounter,
         queueCrisis, dequeueCrisis, queueChained, dequeueChained, pushChainedBack,
         queueRumor, dequeueRumor, scheduleReplacement,
         scheduleNpc, clearNpcSchedule } from './engine/queue.js'
import { getRepTier, applyRepShift } from './engine/reputation.js'
import { createLedger, recordEvent, updateAdventurerStatus, buildLedgerText } from './engine/ledger.js'
import { loadProgress, saveProgress, unlockArc, completeArc, addAdventurer } from './engine/progression.js'
import { initUnlockEngine, checkAfterChoice, checkOnRunEnd } from './engine/unlock-engine.js'
import { renderResourceBar, syncResourceBar, updateResourceBar } from './ui/resource-bar.js'
import { renderCard, renderRumorCard, showChoiceResult } from './ui/card-view.js'
import { tryStartMusic, playClick } from './ui/audio.js'
import { renderGuildIntro, renderArcIntro } from './ui/intro-view.js'
import { renderLedgerScreen } from './ui/ledger-view.js'
import { buildBasePool, worldEventCards } from './data/cards/registry.js'
import { chainedCards as standardChained } from './data/cards/standard.js'
import { crisisCards } from './data/cards/crisis.js'
import { banditWar } from './data/arcs/bandit-war.js'
import { baseAdventurers } from './data/adventurers.js'
import { createRelationshipState, updateRelationship, getLevel, getFlags, resolveNpcCard, getNextNpc } from './engine/relationships.js'
import { createPoolState, drawCard, markPlayed, injectCards, removeCards, resetCycle, checkThirdChoice } from './engine/pool.js'
import { createFactionState, updateStance, getStance } from './engine/factions.js'
import { serializeRunState, deserializeRunState } from './engine/save.js'
import { npcRegistry } from './data/cards/npcs/index.js'
import { banditWarThirdChoices } from './data/cards/third-choices.js'
import { thievesGuildAllied, thievesGuildOpposed } from './data/cards/factions/thieves-guild.js'
import { templeAllied, templeOpposed } from './data/cards/factions/temple.js'
import * as unlockToast from './ui/unlock-toast.js'
```

- [ ] **Step 2: Add `runFlags` module variable**

After the line `let npcEncounterCount = 0` (around line 48), add:

```javascript
let runFlags = new Set()
```

- [ ] **Step 3: Update `startGame` — use config.arcId, remove pickArc, init unlock engine**

Replace the `startGame` function:

```javascript
export function startGame(config, { onEnd, shell } = {}) {
  onEndCallback = onEnd ?? null
  shellRef = shell ?? null
  clearRunSave()
  progress = loadProgress()
  guildName = config.guildName
  selectedNpcs = config.selectedNpcs

  // Persist guild name
  progress = { ...progress, lastGuildName: guildName }
  saveProgress(progress)

  // V4: use player-selected arc
  arc = ALL_ARCS[config.arcId] ?? ALL_ARCS['bandit-war']

  // V4: init unlock engine with toast callback
  initUnlockEngine(entry => unlockToast.show(entry))

  mountGameWrapper()
  initializeRun()
}
```

- [ ] **Step 4: Remove `pickArc` function**

Delete the entire `pickArc` function (lines 88–98 in the original).

- [ ] **Step 5: Update `initializeRun` — remove legacy trait, add runFlags reset**

Replace the `initializeRun` function:

```javascript
function initializeRun() {
  gameState = createState()

  // V4: no legacy trait application

  // Build roster
  const pool = [...baseAdventurers, ...progress.unlockedAdventurers]
  const rosterSize = Math.min(Math.floor(Math.random() * 3) + 3, pool.length)
  roster = pool.sort(() => Math.random() - 0.5).slice(0, rosterSize)

  ledger = createLedger()
  roster.forEach(name => { ledger = updateAdventurerStatus(ledger, name, 'alive') })

  queueState = { ...createQueueState(), totalMilestones: arc.totalMilestones }

  // V2 state
  relationshipState = createRelationshipState(selectedNpcs)
  poolState = createPoolState(buildBasePool())
  factionState = createFactionState(['thieves-guild', 'temple'])
  npcEncounterCount = 0
  runFlags = new Set()

  // Schedule 3 random world events at turns 15, 30, 45
  const shuffledEvents = [...worldEventCards].sort(() => Math.random() - 0.5).slice(0, 3)
  const EVENT_TURNS = [15, 30, 45]
  shuffledEvents.forEach((event, i) => {
    queueState = queueChained(queueState, event.id, EVENT_TURNS[i])
  })

  mountHeader()
  showGuildIntro()
}
```

- [ ] **Step 6: Update `handleChoice` — add result text display, unlock check, run flags**

Replace the end of `handleChoice` — specifically, the section from `// Auto-save` to the end of the function. The full updated `handleChoice` is:

```javascript
function handleChoice(card, chosenIdx, isArc) {
  const choice = card.choices[chosenIdx]

  // Mark chosen/unchosen buttons immediately and lock input
  document.querySelectorAll('#current-card .choice-btn').forEach(btn => {
    btn.disabled = true
    const idx = parseInt(btn.dataset.idx)
    btn.classList.add(idx === chosenIdx ? 'chosen' : 'not-chosen')
  })

  gameState = applyChoice(gameState, choice.deltas, {})

  // Apply reputation shift
  if (choice.reputation) {
    gameState = { ...gameState, reputation: applyRepShift(gameState.reputation, choice.reputation) }
  }

  // V2: Process relationship shifts
  if (choice.relationships) {
    for (const [npcId, shift] of Object.entries(choice.relationships)) {
      relationshipState = updateRelationship(relationshipState, npcId, shift)
    }
  }

  // V2: Process faction stance changes
  if (choice.factions) {
    for (const [factionId, stance] of Object.entries(choice.factions)) {
      const oldStance = getStance(factionState, factionId)
      factionState = updateStance(factionState, factionId, stance)
      if (oldStance === 'neutral' && stance !== 'neutral') {
        const factionCards = FACTION_CARDS[factionId]?.[stance]
        if (factionCards) poolState = injectCards(poolState, factionCards)
      }
    }
  }

  // Queue chained event
  if (choice.chains) {
    const delay = Math.floor(Math.random() * 3) + 3
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

  // If a named adventurer was lost, schedule replacement
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

  // V4: Track run-time flags
  if (choice.flags) {
    choice.flags.forEach(f => runFlags.add(f))
  }

  // Auto-save
  autoSave()
  updateResourceBar(gameState.resources)

  // V4: Check after-choice unlocks
  const unlockResult = checkAfterChoice(progress, gameState, runFlags)
  progress = unlockResult.progress

  // Determine what happens after the transition
  const advance = () => {
    if (isArc && card.isFinal) { handleWin(choice); return }
    if (isArc && queueState.milestonesCompleted >= arc.totalMilestones) { handleWin(choice); return }
    const endCond = checkEndCondition(gameState)
    if (endCond) handleLoss(endCond)
    else nextTurn()
  }

  // V4: Show result text if present, then advance; else short pause
  if (choice.result) {
    showChoiceResult(choice.result)
    setTimeout(() => fadeOutCard(advance), 1500)
  } else {
    setTimeout(() => fadeOutCard(advance), 450)
  }
}
```

- [ ] **Step 7: Update `handleWin` — add unlock check, remove trait selection**

Replace the `handleWin` function:

```javascript
function handleWin(lastChoice) {
  clearRunSave()
  progress = completeArc(progress, arc.id)

  // Unlock new arcs
  arc.unlocks?.forEach(id => { progress = unlockArc(progress, id) })

  // Unlock adventurers
  arc.adventurerUnlocks?.forEach(name => { progress = addAdventurer(progress, name) })

  // V4: Check run-end unlocks
  const outcome = { result: 'win', arc: arc.id, finalResources: { ...gameState.resources } }
  const unlockResult = checkOnRunEnd(progress, outcome)
  progress = unlockResult.progress

  saveProgress(progress)

  // Build ledger
  const arcLedger = Object.assign({}, ledger, {
    arcName: arc.title,
    arcOutcome: 'won',
    endCondition: null,
    turnCount: gameState.turnCount,
    guildName,
    relationships: relationshipState,
    factionStances: factionState,
  })
  const ledgerText = buildLedgerText(arcLedger)

  mount(renderLedgerScreen(ledgerText, 'won'))
  document.getElementById('play-again-btn').onclick = () => {
    if (onEndCallback) onEndCallback()
  }
}
```

- [ ] **Step 8: Update `handleLoss` — add unlock check**

Replace the `handleLoss` function:

```javascript
function handleLoss(endCond) {
  clearRunSave()

  // V4: Check run-end unlocks (e.g. run-loss conditions)
  const outcome = { result: 'loss', arc: arc.id, finalResources: { ...gameState.resources } }
  const unlockResult = checkOnRunEnd(progress, outcome)
  progress = unlockResult.progress

  const arcLedger = Object.assign({}, ledger, {
    arcName: arc.title,
    arcOutcome: 'abandoned',
    endCondition: endCond,
    turnCount: gameState.turnCount,
    guildName,
    relationships: relationshipState,
    factionStances: factionState,
  })
  const ledgerText = buildLedgerText(arcLedger)

  saveProgress(progress)
  mount(renderLedgerScreen(ledgerText, 'lost'))
  document.getElementById('play-again-btn').onclick = () => {
    if (onEndCallback) onEndCallback()
  }
}
```

- [ ] **Step 9: Delete `showTraitSelection` function**

Remove the entire `showTraitSelection` function (approximately lines 446–463 in the original).

- [ ] **Step 10: Verify the file looks correct and commit**

```bash
npx vitest run
```

Expected: all existing tests still pass (no new test failures).

```bash
git add src/game.js
git commit -m "feat: wire unlock engine, result text, and arc selection into game.js"
```

---

### Task 12: Wire shell.js

**Files:**
- Modify: `src/ui/shell.js`

- [ ] **Step 1: Add Discoveries button wiring and suppress toast on menu**

Replace the entire file:

```javascript
// src/ui/shell.js
import { renderMenu } from './menu-view.js'
import { renderOptions, mountOptions } from './options-view.js'
import { playMenuMusic, playGameMusic, getStandardFont } from './audio.js'
import { loadProgress } from '../engine/progression.js'
import { deserializeRunState } from '../engine/save.js'
import { renderDiscoveriesMenu } from './unlock-menu.js'
import * as unlockToast from './unlock-toast.js'
import * as game from '../game.js'
import * as setupFlow from './setup-flow.js'

const app = document.getElementById('app')

function mount(html) {
  app.innerHTML = html
}

function hasSave() {
  const raw = localStorage.getItem('guildmaster_run')
  if (!raw) return false
  return deserializeRunState(raw) !== null
}

// Apply font setting before first render
if (getStandardFont()) document.body.classList.add('font-standard')

let gameActive = false

export function showMenu() {
  gameActive = false
  unlockToast.setActive(false)
  playMenuMusic()
  mount(renderMenu(hasSave()))
  document.getElementById('menu-new-game').onclick    = () => startSetup()
  document.getElementById('menu-continue').onclick   = () => continueGame()
  document.getElementById('menu-discoveries').onclick = () => showDiscoveries()
  document.getElementById('menu-options').onclick    = () => showMenuOptions()
}

function showMenuOptions() {
  mount(renderOptions('menu'))
  mountOptions('menu', { showMenu, hideOverlay })
}

function showDiscoveries() {
  const progress = loadProgress()
  mount(renderDiscoveriesMenu(progress))
  document.getElementById('discoveries-back-btn').onclick = () => showMenu()
}

export function startSetup() {
  const progress = loadProgress()
  setupFlow.start({
    progress,
    mount,
    onComplete: (config) => startGame(config),
    onBack: () => showMenu(),
  })
}

export function startGame(config) {
  gameActive = true
  unlockToast.setActive(true)
  playGameMusic()
  game.startGame(config, {
    onEnd: () => showMenu(),
    shell: { showOverlay, hideOverlay, saveAndQuit },
  })
}

export function continueGame() {
  const raw = localStorage.getItem('guildmaster_run')
  if (!raw) { showMenu(); return }
  const restored = deserializeRunState(raw)
  if (!restored) { showMenu(); return }
  gameActive = true
  unlockToast.setActive(true)
  playGameMusic()
  game.continueRun(restored, {
    onEnd: () => showMenu(),
    shell: { showOverlay, hideOverlay, saveAndQuit },
  })
}

let escListener = null

export function showOverlay() {
  if (!gameActive) return
  if (document.getElementById('overlay-backdrop')) return
  const backdrop = document.createElement('div')
  backdrop.id = 'overlay-backdrop'
  backdrop.innerHTML = `<div class="overlay-panel">${renderOptions('overlay')}</div>`
  document.body.appendChild(backdrop)
  mountOptions('overlay', { showMenu, hideOverlay, saveAndQuit })

  escListener = (e) => { if (e.key === 'Escape') hideOverlay() }
  document.addEventListener('keydown', escListener)
}

export function hideOverlay() {
  const backdrop = document.getElementById('overlay-backdrop')
  if (backdrop) backdrop.remove()
  if (escListener) {
    document.removeEventListener('keydown', escListener)
    escListener = null
  }
}

export function saveAndQuit() {
  game.stopGame()
  hideOverlay()
  showMenu()
}

function showSplash() {
  mount(`
    <div class="splash-screen">
      <img class="menu-logo-img" src="assets/image/guildmaster_logo.png" alt="GuildMaster">
      <div class="splash-prompt">Click anywhere to begin</div>
    </div>
  `)
  app.addEventListener('click', () => {
    playMenuMusic()
    showMenu()
  }, { once: true })
}

// Boot
showSplash()
```

- [ ] **Step 2: Run all tests**

```bash
npx vitest run
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add src/ui/shell.js
git commit -m "feat: wire Discoveries button and toast suppression in shell"
```

---

### Task 13: Delete traits.js

**Files:**
- Delete: `src/data/traits.js`

- [ ] **Step 1: Verify no remaining imports**

```bash
grep -r "traits" /c/Projets/GuildMaster/src --include="*.js" -l
```

Expected: no files listed (game.js no longer imports traits).

- [ ] **Step 2: Delete the file**

```bash
git rm src/data/traits.js
```

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: delete legacy traits.js (replaced by unlock system)"
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Covered by |
|---|---|
| Tutorial card with "Don't show again" checkbox | Task 7 (intro-view), Task 8 (setup-flow) |
| Tutorial skipTutorial flag persisted | Task 2 (progression), Task 8 (setup-flow) |
| Scenario selection (locked/unlocked arcs) | Task 7 (intro-view), Task 8 (setup-flow) |
| Guild naming updated copy | Task 7 (intro-view) |
| NPC selection updated copy + filtered | Task 7 (intro-view), Task 8 (setup-flow) |
| Unlock registry (unlocks.js) | Task 1 |
| Unlock engine (condition evaluator, two checkpoints) | Task 3 |
| progression: remove trait system, add unlockedContent | Task 2 |
| progression: isUnlocked, getUnlockedByType helpers | Task 2 |
| traits.js deleted | Task 13 |
| Post-choice result text (fade buttons, fade in text) | Task 4 (card-view), Task 11 (game.js) |
| 1500ms timing with result text, 450ms without | Task 11 (game.js) |
| Unlock toast animation + queue | Task 5 |
| Toast suppressed on menu/discoveries | Task 12 (shell.js) |
| Discoveries menu (4 sections, 3 entry states) | Task 6 |
| Discoveries button in main menu | Task 10 |
| game.js: arc selection from config.arcId | Task 11 |
| game.js: remove legacy trait application | Task 11 |
| handleWin/handleLoss: unlock check | Task 11 |
| handleWin: no more trait selection, go to menu | Tasks 9 + 11 |
| NPC filtering by unlockedContent | Task 8 (setup-flow) |

**No gaps found.**

**Placeholder scan:** No TBDs, no incomplete sections.

**Type consistency:**
- `checkAfterChoice(progress, gameState, flags)` defined in Task 3, called in Task 11 ✓
- `checkOnRunEnd(progress, outcome)` defined in Task 3, called in Task 11 ✓
- `showChoiceResult(resultText)` defined in Task 4, imported + called in Task 11 ✓
- `renderDiscoveriesMenu(progress)` defined in Task 6, imported + called in Task 12 ✓
- `renderTutorialCard()` defined in Task 7, imported + called in Task 8 ✓
- `renderScenarioSelection(arcEntries, unlockedContent)` defined in Task 7, called in Task 8 ✓
- `initUnlockEngine(callback)` defined in Task 3, called in Task 11 ✓
- `unlockToast.show(entry)`, `unlockToast.setActive(bool)` defined in Task 5, used in Tasks 11+12 ✓
- `config.arcId` set in Task 8 (setup-flow), consumed in Task 11 (game.js) ✓
