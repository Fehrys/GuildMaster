import { describe, it, expect } from 'vitest'
import { createLedger, recordEvent, buildLedgerText } from '../../src/engine/ledger.js'

describe('createLedger', () => {
  it('initialises empty', () => {
    const l = createLedger()
    expect(l.events).toEqual([])
    expect(l.adventurerStatus).toEqual({})
  })
})

describe('recordEvent', () => {
  it('appends event text', () => {
    const l = createLedger()
    const next = recordEvent(l, 'You hired a knight.')
    expect(next.events).toHaveLength(1)
    expect(next.events[0]).toBe('You hired a knight.')
  })
})

describe('buildLedgerText', () => {
  it('mentions turn count', () => {
    const text = buildLedgerText({
      events: [],
      adventurerStatus: {},
      arcName: 'The Bandit War',
      arcOutcome: 'abandoned',
      endCondition: { resource: 'gold', type: 'collapse' },
      turnCount: 14,
    })
    expect(text).toContain('14')
  })

  it('mentions arc name', () => {
    const text = buildLedgerText({
      events: [],
      adventurerStatus: {},
      arcName: 'The Bandit War',
      arcOutcome: 'won',
      endCondition: null,
      turnCount: 30,
    })
    expect(text).toContain('The Bandit War')
  })
})
