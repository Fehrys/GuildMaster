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

const TIER_LABELS = { '-2': 'Hostile', '-1': 'Rival', '0': 'Neutral', '1': 'Friendly', '2': 'Ally' }

export function buildLedgerText({ events, adventurerStatus, arcName, arcOutcome, endCondition, turnCount,
  guildName, relationships, factionStances, permanentModifiers }) {
  const parts = []

  const namePrefix = guildName ? `The ${guildName}` : 'Your guild'
  parts.push(`${namePrefix} lasted ${turnCount} turn${turnCount !== 1 ? 's' : ''}.`)

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

  if (relationships) {
    for (const [npcId, { level }] of Object.entries(relationships)) {
      const label = TIER_LABELS[String(level)] ?? 'Neutral'
      const name = npcId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
      parts.push(`${name} (${label}).`)
    }
  }

  if (factionStances) {
    for (const [factionId, stance] of Object.entries(factionStances)) {
      if (stance === 'neutral') continue
      const name = factionId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
      const verb = stance === 'allied' ? 'Allied with' : 'Opposed'
      parts.push(`${verb} the ${name}.`)
    }
  }

  if (permanentModifiers && permanentModifiers.length) {
    const modTexts = permanentModifiers.map(m => m.label)
    parts.push(`Legacy: ${modTexts.join(', ')}.`)
  }

  if (events.length) {
    parts.push('')
    parts.push(...events)
  }

  return parts.join(' ')
}
