import { describe, it, expect } from 'vitest'
import { createQueueState, advanceQueue, recordStandardCardPlayed } from '../../src/engine/queue.js'

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
})

describe('recordStandardCardPlayed', () => {
  it('increments standardCardsSinceLastMilestone', () => {
    const q = { ...createQueueState(), standardCardsSinceLastMilestone: 2 }
    expect(recordStandardCardPlayed(q).standardCardsSinceLastMilestone).toBe(3)
  })
})
