// src/engine/progression.js
import { unlocks } from '../data/unlocks.js'

const STORAGE_KEY = 'guildmaster_progress'

export function createProgress() {
  return {
    unlockedArcs: ['bandit-war'],
    completedArcs: [],
    unlockedAdventurers: [],
    unlockedContent: ['npc-sister-maren', 'npc-sergeant-brek', 'arc-bandit-war'],
    skipTutorial: false,
  }
}

export function loadProgress() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (!raw) return createProgress()
    const saved = JSON.parse(raw)
    // Backfill fields missing from older saves
    return {
      ...createProgress(),
      ...saved,
    }
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

export function addAdventurer(progress, name) {
  if (progress.unlockedAdventurers.includes(name)) return progress
  return { ...progress, unlockedAdventurers: [...progress.unlockedAdventurers, name] }
}

export function isUnlocked(progress, id) {
  return progress.unlockedContent.includes(id)
}

export function getUnlockedByType(progress, type) {
  return unlocks.filter(u => u.type === type && progress.unlockedContent.includes(u.id))
}
