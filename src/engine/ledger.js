export function createLedger() {
  return {
    events: [],
    adventurerStatus: {},  // { name: 'alive' | 'lost' }
  }
}

export function recordEvent(ledger, text) {
  return { ...ledger, events: [...ledger.events, text] }
}

export function updateAdventurerStatus(ledger, name, status) {
  return { ...ledger, adventurerStatus: { ...ledger.adventurerStatus, [name]: status } }
}

export function buildLedgerText({ events, adventurerStatus, arcName, arcOutcome, endCondition, turnCount }) {
  const parts = []

  parts.push(`Your guild lasted ${turnCount} turn${turnCount !== 1 ? 's' : ''}.`)

  const survivors = Object.entries(adventurerStatus).filter(([, s]) => s === 'alive').map(([n]) => n)
  const fallen = Object.entries(adventurerStatus).filter(([, s]) => s === 'lost').map(([n]) => n)
  if (survivors.length) parts.push(`${survivors.join(', ')} survived.`)
  if (fallen.length) parts.push(`${fallen.join(', ')} did not make it back.`)

  if (arcOutcome === 'won') {
    parts.push(`${arcName} ended in victory.`)
  } else {
    parts.push(`${arcName} was left unfinished.`)
  }

  if (endCondition) {
    const reasons = {
      gold: { collapse: 'The coffers ran dry.', overflow: 'Wealth brought ruin.' },
      adventurers: { collapse: 'The halls emptied.', overflow: 'The guild tore itself apart.' },
      quests: { collapse: 'No one came calling.', overflow: 'The guild drowned in commitments.' },
      equipment: { collapse: 'The armory stood empty.', overflow: 'Stolen gear drew dangerous eyes.' },
    }
    parts.push(reasons[endCondition.resource]?.[endCondition.type] ?? 'The guild fell.')
  }

  if (events.length) {
    parts.push('')
    parts.push(...events)
  }

  return parts.join(' ')
}
