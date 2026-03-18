export function getRepTier(score) {
  if (score <= 33) return 'low'
  if (score <= 66) return 'medium'
  return 'high'
}

export function applyRepShift(score, shift) {
  return Math.max(0, Math.min(100, score + shift))
}
