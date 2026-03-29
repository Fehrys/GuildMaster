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
    const outcome = { result: 'win', arc: 'some-other-arc', finalResources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 } }
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
