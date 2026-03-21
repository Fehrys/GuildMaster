import { describe, it, expect } from 'vitest'
import {
  createQueueState, advanceQueue, recordStandardCardPlayed,
  resetMilestoneCounter, queueCrisis, dequeueCrisis,
  queueChained, pushChainedBack, scheduleNpc, clearNpcSchedule
} from '../../src/engine/queue.js'

describe('createQueueState', () => {
  it('initialises with nextMilestoneThreshold between 4 and 7', () => {
    for (let i = 0; i < 20; i++) {
      const q = createQueueState()
      expect(q.nextMilestoneThreshold).toBeGreaterThanOrEqual(4)
      expect(q.nextMilestoneThreshold).toBeLessThanOrEqual(7)
    }
  })

  it('starts with standardCardCount at 0', () => {
    expect(createQueueState().standardCardsSinceLastMilestone).toBe(0)
  })
})

describe('advanceQueue', () => {
  it('returns arc when standard card count reaches threshold', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 4, standardCardsSinceLastMilestone: 4, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [], queuedRumor: false }
    expect(advanceQueue(q, 5).nextCardType).toBe('arc')
  })

  it('returns crisis before chained when both queued', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 0, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: ['gold'], queuedChained: [{ firesAtTurn: 1 }], queuedRumor: false }
    expect(advanceQueue(q, 1).nextCardType).toBe('crisis')
  })

  it('returns chained when due and no crisis queued', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 0, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [{ firesAtTurn: 3, cardId: 'foo' }], queuedRumor: false }
    expect(advanceQueue(q, 3).nextCardType).toBe('chained')
  })

  it('returns rumor when queued and nothing higher priority', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 0, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [], queuedRumor: true }
    expect(advanceQueue(q, 1).nextCardType).toBe('rumor')
  })

  it('returns standard when nothing else queued', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 0, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [], queuedRumor: false }
    expect(advanceQueue(q, 1).nextCardType).toBe('standard')
  })

  it('returns npc when npcScheduledThisCycle is true and at least 1 standard card played', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 1, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [], queuedRumor: false, npcScheduledThisCycle: true }
    expect(advanceQueue(q, 1).nextCardType).toBe('npc')
  })

  it('does not return npc when npcScheduledThisCycle is false', () => {
    const q = { ...createQueueState(), nextMilestoneThreshold: 10, standardCardsSinceLastMilestone: 1, milestonesCompleted: 0, totalMilestones: 6, queuedCrisis: [], queuedChained: [], queuedRumor: false, npcScheduledThisCycle: false }
    expect(advanceQueue(q, 1).nextCardType).not.toBe('npc')
  })
})

describe('recordStandardCardPlayed', () => {
  it('increments standardCardsSinceLastMilestone', () => {
    const q = { ...createQueueState(), standardCardsSinceLastMilestone: 2 }
    expect(recordStandardCardPlayed(q).standardCardsSinceLastMilestone).toBe(3)
  })
})

describe('resetMilestoneCounter', () => {
  it('resets standardCardsSinceLastMilestone to 0', () => {
    const q = { ...createQueueState(), standardCardsSinceLastMilestone: 5 }
    expect(resetMilestoneCounter(q).standardCardsSinceLastMilestone).toBe(0)
  })

  it('increments milestonesCompleted', () => {
    const q = { ...createQueueState(), milestonesCompleted: 2 }
    expect(resetMilestoneCounter(q).milestonesCompleted).toBe(3)
  })

  it('picks a new threshold between 4 and 7', () => {
    for (let i = 0; i < 20; i++) {
      const q = resetMilestoneCounter(createQueueState())
      expect(q.nextMilestoneThreshold).toBeGreaterThanOrEqual(4)
      expect(q.nextMilestoneThreshold).toBeLessThanOrEqual(7)
    }
  })
})

describe('queueCrisis / dequeueCrisis', () => {
  it('adds a resource to queuedCrisis', () => {
    const q = queueCrisis(createQueueState(), 'gold')
    expect(q.queuedCrisis).toContain('gold')
  })

  it('does not add duplicate resource', () => {
    const q = queueCrisis(queueCrisis(createQueueState(), 'gold'), 'gold')
    expect(q.queuedCrisis.filter(r => r === 'gold')).toHaveLength(1)
  })

  it('removes the first queued crisis', () => {
    const q = dequeueCrisis(queueCrisis(createQueueState(), 'gold'))
    expect(q.queuedCrisis).toHaveLength(0)
  })
})

describe('pushChainedBack', () => {
  it('increments firesAtTurn by 1 for matching cardId', () => {
    const q = queueChained(createQueueState(), 'chain-foo', 5)
    const pushed = pushChainedBack(q, 'chain-foo')
    expect(pushed.queuedChained[0].firesAtTurn).toBe(6)
  })

  it('does not affect other chained events', () => {
    let q = queueChained(createQueueState(), 'chain-a', 5)
    q = queueChained(q, 'chain-b', 8)
    const pushed = pushChainedBack(q, 'chain-a')
    expect(pushed.queuedChained.find(e => e.cardId === 'chain-b').firesAtTurn).toBe(8)
  })
})

describe('scheduleNpc / clearNpcSchedule', () => {
  it('sets npcScheduledThisCycle to true', () => {
    const q = scheduleNpc(createQueueState())
    expect(q.npcScheduledThisCycle).toBe(true)
  })

  it('sets npcScheduledThisCycle to false', () => {
    const q = clearNpcSchedule({ ...createQueueState(), npcScheduledThisCycle: true })
    expect(q.npcScheduledThisCycle).toBe(false)
  })
})
