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
