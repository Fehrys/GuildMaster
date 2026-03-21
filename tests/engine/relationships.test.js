import { describe, it, expect } from 'vitest'
import {
  createRelationshipState,
  updateRelationship,
  getLevel,
  getFlags,
  resolveNpcCard,
  getNextNpc,
} from '../../src/engine/relationships.js'

describe('createRelationshipState', () => {
  it('creates state for selected NPCs at level 0', () => {
    const state = createRelationshipState(['sister-maren', 'jolen-fence'])
    expect(state).toEqual({
      'sister-maren': { level: 0, flags: [] },
      'jolen-fence': { level: 0, flags: [] },
    })
  })
})

describe('updateRelationship', () => {
  it('updates relationship level by shift', () => {
    const state = createRelationshipState(['sister-maren'])
    const next = updateRelationship(state, 'sister-maren', 1)
    expect(getLevel(next, 'sister-maren')).toBe(1)
  })

  it('clamps level to +2', () => {
    const state = createRelationshipState(['sister-maren'])
    const next = updateRelationship(state, 'sister-maren', 5)
    expect(getLevel(next, 'sister-maren')).toBe(2)
  })

  it('clamps level to -2', () => {
    const state = createRelationshipState(['sister-maren'])
    const next = updateRelationship(state, 'sister-maren', -5)
    expect(getLevel(next, 'sister-maren')).toBe(-2)
  })

  it('accumulates flags', () => {
    const state = createRelationshipState(['sister-maren'])
    const s1 = updateRelationship(state, 'sister-maren', 1, 'helped-village')
    const s2 = updateRelationship(s1, 'sister-maren', 0, 'shared-secret')
    expect(getFlags(s2, 'sister-maren')).toEqual(['helped-village', 'shared-secret'])
  })

  it('does not mutate input state', () => {
    const state = createRelationshipState(['sister-maren'])
    updateRelationship(state, 'sister-maren', 2, 'some-flag')
    expect(state['sister-maren'].level).toBe(0)
    expect(state['sister-maren'].flags).toEqual([])
  })

  it('returns state unchanged when npcId is not found', () => {
    const state = createRelationshipState(['sister-maren'])
    const next = updateRelationship(state, 'unknown-npc', 1, 'flag')
    expect(next).toBe(state)
  })
})

describe('getLevel', () => {
  it('returns current level', () => {
    const state = createRelationshipState(['jolen-fence'])
    const next = updateRelationship(state, 'jolen-fence', -1)
    expect(getLevel(next, 'jolen-fence')).toBe(-1)
  })

  it('returns 0 as default when npcId not found', () => {
    const state = createRelationshipState([])
    expect(getLevel(state, 'missing-npc')).toBe(0)
  })
})

describe('getFlags', () => {
  it('returns flags array', () => {
    const state = createRelationshipState(['jolen-fence'])
    const next = updateRelationship(state, 'jolen-fence', 0, 'betrayed-guild')
    expect(getFlags(next, 'jolen-fence')).toEqual(['betrayed-guild'])
  })

  it('returns empty array as default when npcId not found', () => {
    const state = createRelationshipState([])
    expect(getFlags(state, 'missing-npc')).toEqual([])
  })
})

describe('resolveNpcCard', () => {
  const npcData = {
    encounter1: {
      level0: { id: 'card-e1-l0', situation: 'A neutral first meeting' },
    },
    encounter2: {
      levelNeg1: { id: 'card-e2-lneg1', situation: 'She seems wary' },
      levelPos1: { id: 'card-e2-lpos1', situation: 'She smiles warmly' },
    },
    encounter3: {
      levelNeg2: { id: 'card-e3-lneg2', situation: 'She turns away' },
      level0: { id: 'card-e3-l0', situation: 'A tense conversation' },
      levelPos2: { id: 'card-e3-lpos2', situation: 'She embraces you' },
    },
  }

  it('resolves encounter 1 at level 0', () => {
    const card = resolveNpcCard(npcData, 1, 0)
    expect(card).toEqual({ id: 'card-e1-l0', situation: 'A neutral first meeting' })
  })

  it('resolves encounter 1 using level0 regardless of actual level', () => {
    const card = resolveNpcCard(npcData, 1, 2)
    expect(card).toEqual({ id: 'card-e1-l0', situation: 'A neutral first meeting' })
  })

  it('resolves encounter 2 at level +1', () => {
    const card = resolveNpcCard(npcData, 2, 1)
    expect(card).toEqual({ id: 'card-e2-lpos1', situation: 'She smiles warmly' })
  })

  it('resolves encounter 3 at level -2', () => {
    const card = resolveNpcCard(npcData, 3, -2)
    expect(card).toEqual({ id: 'card-e3-lneg2', situation: 'She turns away' })
  })
})

describe('getNextNpc', () => {
  it('alternates between two NPCs', () => {
    const npcs = ['sister-maren', 'jolen-fence']
    expect(getNextNpc(npcs, 0)).toBe('sister-maren')
    expect(getNextNpc(npcs, 1)).toBe('jolen-fence')
    expect(getNextNpc(npcs, 2)).toBe('sister-maren')
    expect(getNextNpc(npcs, 3)).toBe('jolen-fence')
  })

  it('works with a single NPC', () => {
    const npcs = ['sister-maren']
    expect(getNextNpc(npcs, 0)).toBe('sister-maren')
    expect(getNextNpc(npcs, 1)).toBe('sister-maren')
  })
})
