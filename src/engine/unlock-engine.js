// src/engine/unlock-engine.js
import { unlocks } from '../data/unlocks.js'
import { saveProgress } from './progression.js'

let _onUnlock = null

/**
 * Must be called once at game start.
 * @param {function(entry): void} onUnlock  Called for each newly unlocked entry.
 */
export function initUnlockEngine(onUnlock) {
  _onUnlock = onUnlock ?? null
}

/**
 * Call after each player choice during a run.
 * Evaluates 'flag' and 'resource-threshold' conditions.
 * @param {object} progress   Current progress state (immutable input)
 * @param {object} gameState  Current game state ({ resources: {...} })
 * @param {Set}    flags      Named flags set during this run
 * @returns {{ progress: object, newlyUnlocked: Array }}
 */
export function checkAfterChoice(progress, gameState, flags) {
  return _evaluate(progress, gameState, flags, ['flag', 'resource-threshold'])
}

/**
 * Call when a run ends (win or loss).
 * Evaluates 'arc-complete', 'run-win', 'run-loss' conditions.
 * @param {object} progress  Current progress state (immutable input)
 * @param {{ result: 'win'|'loss', arc: string, finalResources: object }} outcome
 * @returns {{ progress: object, newlyUnlocked: Array }}
 */
export function checkOnRunEnd(progress, outcome) {
  return _evaluate(progress, outcome, null, ['arc-complete', 'run-win', 'run-loss'])
}

function _evaluate(progress, context, flags, allowedTypes) {
  let updated = progress
  const newlyUnlocked = []

  for (const entry of unlocks) {
    if (entry.condition === null) continue
    if (updated.unlockedContent.includes(entry.id)) continue
    if (!allowedTypes.includes(entry.condition.type)) continue
    if (_check(entry.condition, context, flags)) {
      updated = { ...updated, unlockedContent: [...updated.unlockedContent, entry.id] }
      newlyUnlocked.push(entry)
      if (_onUnlock) _onUnlock(entry)
    }
  }

  if (newlyUnlocked.length > 0) saveProgress(updated)
  return { progress: updated, newlyUnlocked }
}

function _check(condition, context, flags) {
  switch (condition.type) {
    case 'flag':
      return flags != null && flags.has(condition.flag)

    case 'resource-threshold': {
      const val = context.resources?.[condition.resource]
      return val != null && val >= condition.threshold
    }

    case 'run-win': {
      if (context.result !== 'win') return false
      if (condition.resource != null && condition.threshold != null) {
        return context.finalResources[condition.resource] >= condition.threshold
      }
      return true
    }

    case 'run-loss':
      return context.result === 'loss'

    case 'arc-complete':
      return context.result === 'win' && context.arc === condition.arc

    default:
      return false
  }
}
