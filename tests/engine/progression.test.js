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
