import { describe, it, expect } from 'vitest'
import { serializeRunState, deserializeRunState } from '../../src/engine/save.js'

const SAMPLE_RUN_STATE = {
  gameState: { resources: { gold: 42 }, turnCount: 5 },
  queueState: { milestonesCompleted: 2 },
  modifierState: { active: [{ id: 'test', duration: 3 }] },
  relationshipState: { maren: { level: 1, flags: ['donated'] } },
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

describe('serializeRunState / deserializeRunState', () => {
  it('roundtrips all fields correctly', () => {
    const json = serializeRunState(SAMPLE_RUN_STATE)
    const restored = deserializeRunState(json)

    // Scalar top-level fields
    expect(restored.arcId).toBe('bandit-war')
    expect(restored.guildName).toBe('Silver Wolves')
    expect(restored.npcEncounterCount).toBe(2)
    expect(restored.selectedNpcs).toEqual(['sister-maren', 'jolen-fence'])

    // Nested state objects survive intact
    expect(restored.gameState).toEqual({ resources: { gold: 42 }, turnCount: 5 })
    expect(restored.queueState).toEqual({ milestonesCompleted: 2 })
    expect(restored.modifierState).toEqual({ active: [{ id: 'test', duration: 3 }] })
    expect(restored.relationshipState).toEqual({ maren: { level: 1, flags: ['donated'] } })
    expect(restored.factionState).toEqual({ 'thieves-guild': 'opposed' })
    expect(restored.ledger).toEqual({ events: ['test event'] })

    // poolState fields other than playedThisCycle
    expect(restored.poolState.baseCards).toEqual([{ id: 'a' }])
    expect(restored.poolState.injected).toEqual([])
    expect(restored.poolState.removed).toEqual([])

    // playedThisCycle must be a Set after deserialization
    expect(restored.poolState.playedThisCycle).toBeInstanceOf(Set)
    expect(restored.poolState.playedThisCycle.size).toBe(1)
    expect(restored.poolState.playedThisCycle.has('a')).toBe(true)
  })

  it('roundtrips an empty playedThisCycle Set', () => {
    const state = {
      ...SAMPLE_RUN_STATE,
      poolState: { ...SAMPLE_RUN_STATE.poolState, playedThisCycle: new Set() },
    }
    const restored = deserializeRunState(serializeRunState(state))
    expect(restored.poolState.playedThisCycle).toBeInstanceOf(Set)
    expect(restored.poolState.playedThisCycle.size).toBe(0)
  })

  it('roundtrips a playedThisCycle Set with multiple entries', () => {
    const state = {
      ...SAMPLE_RUN_STATE,
      poolState: { ...SAMPLE_RUN_STATE.poolState, playedThisCycle: new Set(['a', 'b', 'c']) },
    }
    const restored = deserializeRunState(serializeRunState(state))
    expect(restored.poolState.playedThisCycle).toBeInstanceOf(Set)
    expect(restored.poolState.playedThisCycle.size).toBe(3)
    expect(restored.poolState.playedThisCycle.has('b')).toBe(true)
  })

  it('returns null for invalid JSON', () => {
    expect(deserializeRunState('not valid json')).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(deserializeRunState('')).toBeNull()
  })

  it('serializes to a non-empty JSON string', () => {
    const json = serializeRunState(SAMPLE_RUN_STATE)
    expect(typeof json).toBe('string')
    expect(json.length).toBeGreaterThan(0)
  })
})
