import { describe, it, expect } from 'vitest'
import {
  createModifierState,
  addModifier,
  tickModifiers,
  applyModifiers,
  getActiveModifiers,
} from '../../src/engine/modifiers.js'

// Helpers
function makeModifier(overrides = {}) {
  return {
    id: 'test-mod',
    label: 'Test Modifier',
    effects: { gold: -10 },
    duration: 4,
    source: 'test-source',
    ...overrides,
  }
}

describe('createModifierState', () => {
  it('creates empty modifier state', () => {
    const state = createModifierState()
    expect(state).toEqual({ active: [] })
  })
})

describe('addModifier', () => {
  it('adds a modifier', () => {
    const state = createModifierState()
    const mod = makeModifier()
    const next = addModifier(state, mod)
    expect(next.active).toHaveLength(1)
    expect(next.active[0]).toEqual(mod)
  })

  it('enforces soft cap of 5 by displacing oldest temporary', () => {
    let state = createModifierState()
    for (let i = 1; i <= 5; i++) {
      state = addModifier(state, makeModifier({ id: `mod-${i}`, duration: 3 }))
    }
    expect(state.active).toHaveLength(5)

    // Add a 6th — oldest temporary (mod-1) should be displaced
    const sixth = makeModifier({ id: 'mod-6', duration: 2 })
    const next = addModifier(state, sixth)
    expect(next.active).toHaveLength(5)
    expect(next.active.find(m => m.id === 'mod-1')).toBeUndefined()
    expect(next.active.find(m => m.id === 'mod-6')).toBeDefined()
  })

  it('does not displace permanent modifiers when enforcing cap', () => {
    let state = createModifierState()
    // Fill with 4 permanent + 1 temporary
    for (let i = 1; i <= 4; i++) {
      state = addModifier(state, makeModifier({ id: `perm-${i}`, duration: null }))
    }
    const tempMod = makeModifier({ id: 'temp-1', duration: 3 })
    state = addModifier(state, tempMod)
    expect(state.active).toHaveLength(5)

    // Add a 6th — only temp-1 is displaceable; permanents must survive
    const sixth = makeModifier({ id: 'temp-2', duration: 2 })
    const next = addModifier(state, sixth)
    expect(next.active).toHaveLength(5)
    expect(next.active.filter(m => m.duration === null)).toHaveLength(4)
    expect(next.active.find(m => m.id === 'temp-1')).toBeUndefined()
    expect(next.active.find(m => m.id === 'temp-2')).toBeDefined()
  })
})

describe('tickModifiers', () => {
  it('decrements temporary durations by 1', () => {
    let state = createModifierState()
    state = addModifier(state, makeModifier({ id: 'mod-a', duration: 3 }))
    const next = tickModifiers(state)
    expect(next.active[0].duration).toBe(2)
  })

  it('removes modifiers that reach duration 0', () => {
    let state = createModifierState()
    state = addModifier(state, makeModifier({ id: 'mod-expire', duration: 1 }))
    const next = tickModifiers(state)
    expect(next.active).toHaveLength(0)
  })

  it('does not tick permanent modifiers', () => {
    let state = createModifierState()
    state = addModifier(state, makeModifier({ id: 'perm', duration: null }))
    const next = tickModifiers(state)
    expect(next.active).toHaveLength(1)
    expect(next.active[0].duration).toBeNull()
  })
})

describe('applyModifiers', () => {
  it('applies percentage adjustments to deltas', () => {
    let state = createModifierState()
    state = addModifier(state, makeModifier({ id: 'tax', effects: { gold: -10 }, duration: 4 }))
    // gold: -20, modifier is -10% → -20 + (-20 * -0.10) = -20 + 2 = -18
    const result = applyModifiers({ gold: -20 }, state)
    expect(result.gold).toBe(-18)
  })

  it('stacks multiple modifiers on the same resource', () => {
    let state = createModifierState()
    state = addModifier(state, makeModifier({ id: 'mod-a', effects: { gold: -10 }, duration: 3 }))
    state = addModifier(state, makeModifier({ id: 'mod-b', effects: { gold: -20 }, duration: 3 }))
    // gold: -100, stacked -30% → -100 + (-100 * -0.30) = -100 + 30 = -70
    const result = applyModifiers({ gold: -100 }, state)
    expect(result.gold).toBe(-70)
  })

  it('returns original deltas when no modifiers active', () => {
    const state = createModifierState()
    const deltas = { gold: -20, adventurers: 10 }
    const result = applyModifiers(deltas, state)
    expect(result).toEqual(deltas)
  })
})

describe('getActiveModifiers', () => {
  it('returns the active list', () => {
    let state = createModifierState()
    const mod = makeModifier()
    state = addModifier(state, mod)
    expect(getActiveModifiers(state)).toBe(state.active)
  })
})
