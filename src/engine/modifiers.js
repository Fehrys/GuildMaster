// src/engine/modifiers.js

const CAP = 5

export function createModifierState() {
  return { active: [] }
}

export function addModifier(state, mod) {
  if (state.active.length < CAP) {
    return { ...state, active: [...state.active, mod] }
  }
  // Displace oldest temporary (duration !== null) to make room
  const firstTempIdx = state.active.findIndex(m => m.duration !== null)
  if (firstTempIdx === -1) {
    // All permanent — just append (exceed cap rather than displace permanents)
    return { ...state, active: [...state.active, mod] }
  }
  const next = [...state.active]
  next.splice(firstTempIdx, 1)
  next.push(mod)
  return { ...state, active: next }
}

export function tickModifiers(state) {
  const active = state.active
    .map(m => m.duration === null ? m : { ...m, duration: m.duration - 1 })
    .filter(m => m.duration === null || m.duration > 0)
  return { ...state, active }
}

export function applyModifiers(deltas, state) {
  if (state.active.length === 0) return deltas
  const result = { ...deltas }
  for (const resource of Object.keys(result)) {
    let totalPct = 0
    for (const mod of state.active) {
      if (mod.effects[resource] != null) totalPct += mod.effects[resource]
    }
    if (totalPct !== 0) {
      result[resource] = result[resource] + result[resource] * (totalPct / 100)
    }
  }
  return result
}

export function getActiveModifiers(state) {
  return state.active
}
