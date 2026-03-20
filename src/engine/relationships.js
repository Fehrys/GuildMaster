const LEVEL_KEY_MAP = {
  '-2': 'levelNeg2',
  '-1': 'levelNeg1',
  '0': 'level0',
  '1': 'levelPos1',
  '2': 'levelPos2',
}

export function createRelationshipState(selectedNpcs) {
  const state = {}
  for (const npcId of selectedNpcs) {
    state[npcId] = { level: 0, flags: [] }
  }
  return state
}

export function updateRelationship(state, npcId, shift, flag) {
  if (!(npcId in state)) return state

  const npc = state[npcId]
  const newLevel = Math.max(-2, Math.min(2, npc.level + shift))
  const newFlags = flag !== undefined ? [...npc.flags, flag] : [...npc.flags]

  return {
    ...state,
    [npcId]: { level: newLevel, flags: newFlags },
  }
}

export function getLevel(state, npcId) {
  return state[npcId]?.level ?? 0
}

export function getFlags(state, npcId) {
  return state[npcId]?.flags ?? []
}

export function resolveNpcCard(npcData, encounterNumber, level) {
  const encounterKey = `encounter${encounterNumber}`
  const encounterCards = npcData[encounterKey]

  const levelKey = encounterNumber === 1 ? 'level0' : LEVEL_KEY_MAP[String(level)]

  return encounterCards[levelKey]
}

export function getNextNpc(selectedNpcs, encounterCount) {
  return selectedNpcs[encounterCount % selectedNpcs.length]
}
