import { describe, it, expect } from 'vitest'
import {
  createPoolState,
  drawCard,
  markPlayed,
  injectCards,
  removeCards,
  resetCycle,
  checkThirdChoice,
} from '../../src/engine/pool.js'

const BASE_CARDS = [
  { id: 'card-a', title: 'Card A' },
  { id: 'card-b', title: 'Card B' },
  { id: 'card-c', title: 'Card C' },
]

describe('createPoolState', () => {
  it('creates pool state from base cards', () => {
    const state = createPoolState(BASE_CARDS)
    expect(state.baseCards).toEqual(BASE_CARDS)
    expect(state.playedThisCycle).toBeInstanceOf(Set)
    expect(state.playedThisCycle.size).toBe(0)
    expect(state.injected).toEqual([])
    expect(state.removed).toEqual([])
  })
})

describe('drawCard', () => {
  it('draws a card from the unplayed pool', () => {
    const state = createPoolState(BASE_CARDS)
    const { card, updatedState } = drawCard(state)
    expect(BASE_CARDS.map(c => c.id)).toContain(card.id)
    expect(updatedState.playedThisCycle.has(card.id)).toBe(true)
  })

  it('does not draw already-played cards', () => {
    let state = createPoolState(BASE_CARDS)
    const drawnIds = new Set()
    // Draw all 3 cards; none should repeat
    for (let i = 0; i < 3; i++) {
      const { card, updatedState } = drawCard(state)
      expect(drawnIds.has(card.id)).toBe(false)
      drawnIds.add(card.id)
      state = updatedState
    }
    expect(drawnIds.size).toBe(3)
  })

  it('auto-resets the cycle and draws when all cards have been played', () => {
    // Mark all cards as played
    let state = createPoolState(BASE_CARDS)
    state = markPlayed(state, 'card-a')
    state = markPlayed(state, 'card-b')
    state = markPlayed(state, 'card-c')
    // Pool is exhausted — drawCard should reset and return a card
    const { card, updatedState } = drawCard(state)
    expect(card).toBeDefined()
    expect(BASE_CARDS.map(c => c.id)).toContain(card.id)
    // After drawing, the new cycle has the drawn card marked
    expect(updatedState.playedThisCycle.has(card.id)).toBe(true)
    // The other cards are no longer marked as played (cycle was reset)
    const otherIds = BASE_CARDS.map(c => c.id).filter(id => id !== card.id)
    for (const id of otherIds) {
      expect(updatedState.playedThisCycle.has(id)).toBe(false)
    }
  })
})

describe('resetCycle', () => {
  it('clears the played set', () => {
    let state = createPoolState(BASE_CARDS)
    state = markPlayed(state, 'card-a')
    state = markPlayed(state, 'card-b')
    expect(state.playedThisCycle.size).toBe(2)
    const reset = resetCycle(state)
    expect(reset.playedThisCycle.size).toBe(0)
  })
})

describe('injectCards', () => {
  it('adds cards to the pool so they can be drawn', () => {
    const extraCard = { id: 'card-extra', title: 'Extra' }
    let state = createPoolState(BASE_CARDS)
    state = injectCards(state, [extraCard])
    expect(state.injected).toContainEqual(extraCard)
    // Mark all base cards as played — only the injected card remains
    state = markPlayed(state, 'card-a')
    state = markPlayed(state, 'card-b')
    state = markPlayed(state, 'card-c')
    const { card } = drawCard(state)
    expect(card.id).toBe('card-extra')
  })
})

describe('removeCards', () => {
  it('excludes removed cards from draws', () => {
    let state = createPoolState(BASE_CARDS)
    // Remove card-a and card-b; only card-c should ever be drawn
    state = removeCards(state, ['card-a', 'card-b'])
    for (let i = 0; i < 5; i++) {
      const { card, updatedState } = drawCard(state)
      expect(card.id).toBe('card-c')
      state = resetCycle(updatedState)
    }
  })
})

describe('checkThirdChoice', () => {
  const thirdChoice = { id: 'choice-3', text: 'Secret option' }

  it('returns the choice when all conditions are met', () => {
    const conditions = {
      relationships: { 'npc-merchant': { minLevel: 3 } },
      resources: { gold: { min: 40 } },
      factions: { 'thieves-guild': 'ally' },
      flags: { 'npc-merchant': ['has_talked'] },
    }
    const relState = {
      'npc-merchant': { level: 5, flags: ['has_talked', 'quest_done'] },
    }
    const gameState = { resources: { gold: 60, adventurers: 50 } }
    const factionState = { 'thieves-guild': 'ally' }

    const result = checkThirdChoice(conditions, thirdChoice, relState, gameState, factionState)
    expect(result).toEqual(thirdChoice)
  })

  it('returns null when a relationship condition is not met', () => {
    const conditions = {
      relationships: { 'npc-merchant': { minLevel: 10 } },
    }
    const relState = { 'npc-merchant': { level: 3, flags: [] } }
    const gameState = { resources: {} }
    const factionState = {}

    const result = checkThirdChoice(conditions, thirdChoice, relState, gameState, factionState)
    expect(result).toBeNull()
  })

  it('returns null when a resource condition is not met', () => {
    const conditions = {
      resources: { gold: { min: 80 } },
    }
    const relState = {}
    const gameState = { resources: { gold: 30 } }
    const factionState = {}

    const result = checkThirdChoice(conditions, thirdChoice, relState, gameState, factionState)
    expect(result).toBeNull()
  })
})
