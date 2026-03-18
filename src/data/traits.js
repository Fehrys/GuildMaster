// Global legacy trait pool
export const traits = [
  { id: 'war-veterans', label: 'War Veterans', description: 'Adventurers start at 60.', effect: { adventurers: +10 } },
  { id: 'trade-connections', label: 'Trade Connections', description: 'Gold starts at 60.', effect: { gold: +10 } },
  { id: 'well-equipped', label: 'Well Equipped', description: 'Equipment starts at 60.', effect: { equipment: +10 } },
  { id: 'reputable', label: 'Reputable', description: 'Quest board starts at 60.', effect: { quests: +10 } },
  { id: 'frugal', label: 'Frugal', description: 'Gold starts at 65 but Adventurers start at 45.', effect: { gold: +15, adventurers: -5 } },
  { id: 'renowned', label: 'Renowned', description: 'Reputation starts at 65 instead of 50.', effect: { reputation: +15 } },
]
