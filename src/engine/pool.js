/**
 * Card Pool Engine
 *
 * Manages which cards are available for drawing within a milestone cycle.
 * No card repeats within a cycle; supports dynamic injection/removal of cards.
 * Pure functions, immutable state.
 */

/**
 * Creates the initial pool state.
 * @param {Array<{id: string}>} baseCards
 * @returns {{ baseCards: Array, playedThisCycle: Set, injected: Array, removed: Array }}
 */
export function createPoolState(baseCards) {
  return {
    baseCards: [...baseCards],
    playedThisCycle: new Set(),
    injected: [],
    removed: [],
  }
}

/**
 * Returns the cards currently eligible to be drawn.
 * @param {{ baseCards: Array, playedThisCycle: Set, injected: Array, removed: Array }} state
 * @returns {Array}
 */
function availableCards(state) {
  const removedSet = new Set(state.removed)
  return [...state.baseCards, ...state.injected].filter(
    c => !state.playedThisCycle.has(c.id) && !removedSet.has(c.id)
  )
}

/**
 * Draws a random card from the available pool (not played this cycle, not removed).
 * If the pool is exhausted, auto-resets the cycle first, then draws.
 * @param {{ baseCards: Array, playedThisCycle: Set, injected: Array, removed: Array }} state
 * @returns {{ card: object, updatedState: object }}
 */
export function drawCard(state) {
  let workingState = state
  let pool = availableCards(workingState)

  if (pool.length === 0) {
    workingState = resetCycle(workingState)
    pool = availableCards(workingState)
  }

  const index = Math.floor(Math.random() * pool.length)
  const card = pool[index]
  const updatedState = markPlayed(workingState, card.id)
  return { card, updatedState }
}

/**
 * Marks a card as played in the current cycle.
 * @param {object} state
 * @param {string} cardId
 * @returns {object}
 */
export function markPlayed(state, cardId) {
  const playedThisCycle = new Set(state.playedThisCycle)
  playedThisCycle.add(cardId)
  return { ...state, playedThisCycle }
}

/**
 * Adds cards to the injected array (faction cards, arc cards, etc.).
 * @param {object} state
 * @param {Array<object>} cards
 * @returns {object}
 */
export function injectCards(state, cards) {
  return { ...state, injected: [...state.injected, ...cards] }
}

/**
 * Adds card IDs to the removed list so they are excluded from future draws.
 * @param {object} state
 * @param {Array<string>} cardIds
 * @returns {object}
 */
export function removeCards(state, cardIds) {
  return { ...state, removed: [...state.removed, ...cardIds] }
}

/**
 * Clears the playedThisCycle set, starting a new cycle.
 * @param {object} state
 * @returns {object}
 */
export function resetCycle(state) {
  return { ...state, playedThisCycle: new Set() }
}

/**
 * Checks multi-factor conditions for whether a hidden third choice should appear.
 *
 * Condition types (all optional):
 *   relationships: { 'npc-id': { minLevel?: N, maxLevel?: N } }
 *   flags:         { 'npc-id': ['flag1', 'flag2'] }
 *   resources:     { 'resource': { min?: N, max?: N } }
 *   factions:      { 'faction-id': 'stance' }
 *
 * @param {object} conditions
 * @param {object} thirdChoice
 * @param {object} relState    — { [npcId]: { level: number, flags: string[] } }
 * @param {object} gameState   — { resources: { [name]: number } }
 * @param {object} factionState — { [factionId]: string }
 * @returns {object|null} thirdChoice if ALL conditions pass, null otherwise
 */
export function checkThirdChoice(conditions, thirdChoice, relState, gameState, factionState) {
  // --- relationships ---
  if (conditions.relationships) {
    for (const [npcId, req] of Object.entries(conditions.relationships)) {
      const npc = relState[npcId]
      if (!npc) return null
      if (req.minLevel !== undefined && npc.level < req.minLevel) return null
      if (req.maxLevel !== undefined && npc.level > req.maxLevel) return null
    }
  }

  // --- flags ---
  if (conditions.flags) {
    for (const [npcId, requiredFlags] of Object.entries(conditions.flags)) {
      const npc = relState[npcId]
      if (!npc) return null
      const npcFlags = new Set(npc.flags)
      for (const flag of requiredFlags) {
        if (!npcFlags.has(flag)) return null
      }
    }
  }

  // --- resources ---
  if (conditions.resources) {
    for (const [resource, req] of Object.entries(conditions.resources)) {
      const value = gameState.resources[resource]
      if (value === undefined) return null
      if (req.min !== undefined && value < req.min) return null
      if (req.max !== undefined && value > req.max) return null
    }
  }

  // --- factions ---
  if (conditions.factions) {
    for (const [factionId, requiredStance] of Object.entries(conditions.factions)) {
      if (factionState[factionId] !== requiredStance) return null
    }
  }

  return thirdChoice
}
