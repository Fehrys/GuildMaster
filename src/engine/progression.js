const STORAGE_KEY = 'guildmaster_progress'

export function createProgress() {
  return {
    unlockedArcs: ['bandit-war'],
    completedArcs: [],
    activeLegacyTrait: null,
    unlockedAdventurers: [],
  }
}

export function loadProgress() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return raw ? JSON.parse(raw) : createProgress()
  } catch {
    return createProgress()
  }
}

export function saveProgress(progress) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    }
  } catch {
    // storage unavailable — silently ignore
  }
}

export function unlockArc(progress, arcId) {
  if (progress.unlockedArcs.includes(arcId)) return progress
  return { ...progress, unlockedArcs: [...progress.unlockedArcs, arcId] }
}

export function completeArc(progress, arcId) {
  if (progress.completedArcs.includes(arcId)) return progress
  return { ...progress, completedArcs: [...progress.completedArcs, arcId] }
}

export function setLegacyTrait(progress, traitId) {
  return { ...progress, activeLegacyTrait: traitId }
}

export function addAdventurer(progress, name) {
  if (progress.unlockedAdventurers.includes(name)) return progress
  return { ...progress, unlockedAdventurers: [...progress.unlockedAdventurers, name] }
}
