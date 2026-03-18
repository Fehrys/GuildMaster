const RESOURCE_ORDER = ['gold', 'adventurers', 'quests', 'equipment']
const VALID_RESOURCES = new Set(RESOURCE_ORDER)

export function createState() {
  return {
    resources: { gold: 50, adventurers: 50, quests: 50, equipment: 50 },
    reputation: 50,
    turnCount: 0,
    gameStatus: 'playing',
    endCondition: null,
    arc: null,
    roster: [],
    queuedCrisisResources: [],
    chainedEvents: [],
    pendingReplacement: null,
    ledgerEvents: [],
  }
}

export function isInTensionZone(value) {
  return value < 20 || value > 80
}

export function applyChoice(state, deltas, opts = {}) { // opts reserved for future use (repShift, eventId)
  const resources = { ...state.resources }
  for (const [key, delta] of Object.entries(deltas)) {
    if (!VALID_RESOURCES.has(key)) continue
    resources[key] = Math.max(0, Math.min(100, resources[key] + delta))
  }
  return { ...state, resources, turnCount: state.turnCount + 1 }
}

export function checkEndCondition(state) {
  for (const resource of RESOURCE_ORDER) {
    const v = state.resources[resource]
    if (v <= 0) return { resource, type: 'collapse' }
    if (v >= 100) return { resource, type: 'overflow' }
  }
  return null
}
