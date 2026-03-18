function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function createQueueState() {
  return {
    nextMilestoneThreshold: randInt(4, 7),
    standardCardsSinceLastMilestone: 0,
    milestonesCompleted: 0,
    totalMilestones: 6,
    queuedCrisis: [],           // array of resource names
    queuedChained: [],          // array of { firesAtTurn, cardId }
    queuedRumor: false,
    pendingReplacement: null,   // { card, windowClosesTurn } — named adventurer replacement
    prevTensionZone: [],        // updated by game.js to detect zone transitions (not managed here)
  }
}

// Schedule a named adventurer replacement card to appear within 3–5 standard draws
export function scheduleReplacement(q, card, currentTurn) {
  const window = randInt(3, 5)
  return { ...q, pendingReplacement: { card, windowClosesTurn: currentTurn + window } } // inclusive
}

/**
 * Returns { nextCardType, updatedQueue, chainedCardId? } for the next card to show.
 *
 * NOTE: This function signals what to play but does NOT consume queue state.
 * The caller must call the appropriate dequeue/consume function after:
 *   - 'arc'     → resetMilestoneCounter(q)
 *   - 'crisis'  → dequeueCrisis(q)
 *   - 'chained' → dequeueChained(q, chainedCardId)
 *   - 'rumor'   → dequeueRumor(q)
 *   - 'standard'→ recordStandardCardPlayed(q)
 */
export function advanceQueue(q, currentTurn) {
  // 1. Arc milestone
  if (q.standardCardsSinceLastMilestone >= q.nextMilestoneThreshold && q.milestonesCompleted < q.totalMilestones) {
    return { nextCardType: 'arc', updatedQueue: q }
  }
  // 2. Crisis
  if (q.queuedCrisis.length > 0) {
    return { nextCardType: 'crisis', updatedQueue: q }
  }
  // 3. Chained event due this turn
  const dueChained = q.queuedChained.find(e => e.firesAtTurn <= currentTurn)
  if (dueChained) {
    return { nextCardType: 'chained', updatedQueue: q, chainedCardId: dueChained.cardId }
  }
  // 4. Rumor
  if (q.queuedRumor) {
    return { nextCardType: 'rumor', updatedQueue: q }
  }
  // 5. Standard
  return { nextCardType: 'standard', updatedQueue: q }
}

export function recordStandardCardPlayed(q) {
  return { ...q, standardCardsSinceLastMilestone: q.standardCardsSinceLastMilestone + 1 }
}

export function resetMilestoneCounter(q) {
  return {
    ...q,
    standardCardsSinceLastMilestone: 0,
    milestonesCompleted: q.milestonesCompleted + 1,
    nextMilestoneThreshold: randInt(4, 7),
  }
}

export function queueCrisis(q, resource) {
  if (q.queuedCrisis.includes(resource)) return q
  return { ...q, queuedCrisis: [...q.queuedCrisis, resource] }
}

export function dequeueCrisis(q) {
  return { ...q, queuedCrisis: q.queuedCrisis.slice(1) }
}

export function queueChained(q, cardId, firesAtTurn) {
  return { ...q, queuedChained: [...q.queuedChained, { cardId, firesAtTurn }] }
}

export function dequeueChained(q, cardId) {
  return { ...q, queuedChained: q.queuedChained.filter(e => e.cardId !== cardId) }
}

export function pushChainedBack(q, cardId) {
  return {
    ...q,
    queuedChained: q.queuedChained.map(e =>
      e.cardId === cardId ? { ...e, firesAtTurn: e.firesAtTurn + 1 } : e
    ),
  }
}

export function queueRumor(q) {
  return { ...q, queuedRumor: true }
}

export function dequeueRumor(q) {
  return { ...q, queuedRumor: false }
}
