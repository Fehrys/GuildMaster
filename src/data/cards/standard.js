export const standardCards = [
  {
    id: 'std-tax-collector',
    type: 'standard',
    npc: { emoji: '🧙', name: 'Aldric the Scribe', role: 'Town Bureaucrat' },
    situation: 'The city registry requires all guilds to file a tax declaration by week\'s end. It costs a fee — but ignoring it has consequences.',
    choices: [
      { label: 'Pay the fee', deltas: { gold: -12, quests: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Ignore it', deltas: { quests: -18 }, major: false, reputation: -5, chains: 'chain-tax-ignored', rumorText: null },
    ],
  },
  {
    id: 'std-wounded-merc',
    type: 'standard',
    npc: { emoji: '🩹', name: 'A Wounded Mercenary', role: 'Wandering Sword' },
    situation: 'A battered mercenary collapses at your door. She asks only for a place to rest and heal. It will cost nothing but space.',
    choices: [
      { label: 'Take her in', deltas: { adventurers: 5 }, major: false, reputation: 5, chains: 'chain-merc-healed', rumorText: null },
      { label: 'Turn her away', deltas: {}, major: false, reputation: -5, chains: null, rumorText: 'Word spreads. The wounded remember those who turned them away.' },
    ],
  },
  {
    id: 'std-equipment-merchant',
    type: 'standard',
    npc: { emoji: '⚒️', name: 'Greta the Ironmonger', role: 'Equipment Merchant' },
    situation: 'A travelling merchant offers a bulk deal on arms and armour. Quality is good, price is fair — but it cleans out your stock budget.',
    choices: [
      { label: 'Buy the lot', deltas: { gold: -20, equipment: 18 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Pass', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-minor-lord',
    type: 'standard',
    npc: { emoji: '👑', name: 'Lord Farwick', role: 'Minor Nobleman' },
    situation: 'A local lord wants to hire six of your best for a season — good pay, but your roster will be thin for weeks.',
    choices: [
      { label: 'Accept the contract', deltas: { gold: 25, adventurers: -15, quests: 8 }, major: true, reputation: 5, chains: null, rumorText: 'Lord Farwick\'s gold came with strings. You\'ll feel the absence of your people soon.' },
      { label: 'Decline', deltas: { quests: -5 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-young-recruit',
    type: 'standard',
    npc: { emoji: '🌟', name: 'Tam', role: 'Would-Be Adventurer' },
    situation: 'A bright-eyed kid walks in off the street wanting to join your guild. No skills to speak of, but plenty of enthusiasm.',
    choices: [
      { label: 'Take a chance', deltas: { adventurers: 8, gold: -3 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Send them away', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-unhappy-client',
    type: 'standard',
    npc: { emoji: '😠', name: 'Merchant Peldan', role: 'Disgruntled Client' },
    situation: 'A merchant returns furious — the quest your guild completed left his cargo damaged. He demands compensation.',
    choices: [
      { label: 'Compensate him', deltas: { gold: -15, quests: 10 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Refuse', deltas: { quests: -15, reputation: -5 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-old-map',
    type: 'standard',
    npc: { emoji: '🗺️', name: 'An Old Cartographer', role: 'Retired Explorer' },
    situation: 'An old man sells maps of uncharted ruins — supposedly equipment-rich. It\'s a gamble: could be gold or a waste of lives.',
    choices: [
      { label: 'Fund the expedition', deltas: { gold: -18, adventurers: -8, equipment: 22 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Pass', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-rival-spy',
    type: 'standard',
    npc: { emoji: '🕵️', name: 'Unknown Figure', role: 'Suspicious Stranger' },
    situation: 'A stranger offers coin to "share" your client list. You suspect a rival guild is behind this.',
    choices: [
      { label: 'Take the coin', deltas: { gold: 20, quests: -20 }, major: true, reputation: -5, chains: null, rumorText: 'Some bridges burn slowly. This one is now smouldering.' },
      { label: 'Show them the door', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-donation',
    type: 'standard',
    npc: { emoji: '🙏', name: 'Sister Maren', role: 'Temple Priest' },
    situation: 'The local temple is rebuilding after a fire. A donation would be noticed — and remembered.',
    choices: [
      { label: 'Donate generously', deltas: { gold: -12 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Decline politely', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-overdue-quest',
    type: 'standard',
    npc: { emoji: '📋', name: 'Guild Accountant', role: 'Internal Staff' },
    situation: 'Three quests are running overdue. You can send extra people to resolve them fast, or let clients wait and risk reputation.',
    choices: [
      { label: 'Send reinforcements', deltas: { adventurers: -10, quests: 15 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Let them wait', deltas: { quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
]

// Chained cards — follow-up events triggered by choices above
export const chainedCards = [
  {
    id: 'chain-tax-ignored',
    type: 'chained',
    npc: { emoji: '⚖️', name: 'City Bailiff', role: 'Law Enforcement' },
    situation: 'The city sent officers. Your guild is fined double for the missed declaration. Resistance is not advised.',
    choices: [
      { label: 'Pay the fine', deltas: { gold: -25 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Argue the case', deltas: { gold: -10, quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'chain-merc-healed',
    type: 'chained',
    npc: { emoji: '🩹', name: 'Sera Ironfoot', role: 'Recovered Mercenary' },
    situation: 'The mercenary you sheltered has recovered. She offers to join your roster properly — for a modest equipment cost.',
    choices: [
      { label: 'Welcome her in', deltas: { adventurers: 10, equipment: -8 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Wish her luck', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]
