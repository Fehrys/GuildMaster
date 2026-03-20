const SOFT_CAP = 5

export function createModifierState() {
  return { active: [] }
}

export function addModifier(state, modifier) {
  if (state.active.length < SOFT_CAP) {
    return { ...state, active: [...state.active, modifier] }
  }

  // At cap — displace the oldest temporary modifier
  const oldestTempIndex = state.active.findIndex(m => m.duration !== null)
  if (oldestTempIndex === -1) {
    // All are permanent — cannot displace, just append (cap is soft)
    return { ...state, active: [...state.active, modifier] }
  }

  const next = [
    ...state.active.slice(0, oldestTempIndex),
    ...state.active.slice(oldestTempIndex + 1),
    modifier,
  ]
  return { ...state, active: next }
}

export function tickModifiers(state) {
  const active = state.active
    .map(m => (m.duration === null ? m : { ...m, duration: m.duration - 1 }))
    .filter(m => m.duration === null || m.duration > 0)
  return { ...state, active }
}

export function applyModifiers(deltas, state) {
  if (state.active.length === 0) return deltas

  // Sum percentage effects per resource across all active modifiers
  const totalPct = {}
  for (const mod of state.active) {
    for (const [resource, pct] of Object.entries(mod.effects)) {
      totalPct[resource] = (totalPct[resource] ?? 0) + pct
    }
  }

  const adjusted = { ...deltas }
  for (const [resource, delta] of Object.entries(adjusted)) {
    if (resource in totalPct) {
      adjusted[resource] = Math.round(delta + (delta * totalPct[resource] / 100))
    }
  }
  return adjusted
}

export function getActiveModifiers(state) {
  return state.active
}
