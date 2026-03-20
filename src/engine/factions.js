export function createFactionState(factionIds) {
  return Object.fromEntries(factionIds.map(id => [id, 'neutral']))
}

export function updateStance(state, factionId, stance) {
  return { ...state, [factionId]: stance }
}

export function getStance(state, factionId) {
  return state[factionId] ?? 'neutral'
}
