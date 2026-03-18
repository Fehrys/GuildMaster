import { describe, it, expect } from 'vitest'
import { getRepTier, applyRepShift } from '../../src/engine/reputation.js'

describe('getRepTier', () => {
  it('returns low for score 0–33', () => {
    expect(getRepTier(0)).toBe('low')
    expect(getRepTier(33)).toBe('low')
  })

  it('returns medium for score 34–66', () => {
    expect(getRepTier(34)).toBe('medium')
    expect(getRepTier(66)).toBe('medium')
  })

  it('returns high for score 67–100', () => {
    expect(getRepTier(67)).toBe('high')
    expect(getRepTier(100)).toBe('high')
  })
})

describe('applyRepShift', () => {
  it('applies positive shift', () => {
    expect(applyRepShift(50, 5)).toBe(55)
  })

  it('applies negative shift', () => {
    expect(applyRepShift(50, -5)).toBe(45)
  })

  it('clamps to 0', () => {
    expect(applyRepShift(3, -5)).toBe(0)
  })

  it('clamps to 100', () => {
    expect(applyRepShift(98, 5)).toBe(100)
  })
})
