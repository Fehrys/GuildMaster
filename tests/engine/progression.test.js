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
