import { describe, it, expect } from 'vitest'
import { createFactionState, updateStance, getStance } from '../../src/engine/factions.js'

describe('createFactionState', () => {
  it('creates neutral state for all factions', () => {
    const state = createFactionState(['thieves-guild', 'temple'])
    expect(state).toEqual({ 'thieves-guild': 'neutral', 'temple': 'neutral' })
  })
})

describe('updateStance', () => {
  it('updates stance for a faction', () => {
    const state = createFactionState(['thieves-guild', 'temple'])
    const next = updateStance(state, 'thieves-guild', 'allied')
    expect(next['thieves-guild']).toBe('allied')
    expect(next['temple']).toBe('neutral')
  })
})

describe('getStance', () => {
  it('returns neutral for unknown factions', () => {
    const state = createFactionState([])
    expect(getStance(state, 'unknown-faction')).toBe('neutral')
  })
})
