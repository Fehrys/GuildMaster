/**
 * Save Engine
 *
 * Serializes and deserializes the full run state for auto-save.
 * Handles the special case of poolState.playedThisCycle, which is a Set
 * and must be converted to/from an Array for JSON compatibility.
 */

/**
 * Converts a run state object to a JSON string safe for storage.
 * poolState.playedThisCycle (Set) is serialized as an Array.
 *
 * @param {object} runState
 * @returns {string}
 */
export function serializeRunState(runState) {
  const serializable = {
    ...runState,
    poolState: {
      ...runState.poolState,
      playedThisCycle: [...runState.poolState.playedThisCycle],
    },
  }
  return JSON.stringify(serializable)
}

/**
 * Parses a JSON string back into a run state object.
 * poolState.playedThisCycle (Array in JSON) is restored to a Set.
 * Returns null if the JSON is invalid.
 *
 * @param {string} json
 * @returns {object|null}
 */
export function deserializeRunState(json) {
  try {
    const parsed = JSON.parse(json)
    return {
      ...parsed,
      poolState: {
        ...parsed.poolState,
        playedThisCycle: new Set(parsed.poolState.playedThisCycle),
      },
    }
  } catch {
    return null
  }
}
