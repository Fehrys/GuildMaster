// Chained cards — follow-up events triggered by choices above
export const chainedCards = [
  {
    id: 'chain-alchemist-done',
    type: 'chained',
    npc: { emoji: '⚗️', name: 'Maeva the Alchemist', role: 'City Alchemist' },
    situation: 'Maeva returns your equipment — reinforced, sharpened, treated with alchemical compounds. She looks satisfied.',
    choices: [
      { label: 'Accept the return', deltas: { equipment: 18, gold: -15 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Sell the upgraded gear', deltas: { gold: 15, equipment: -12 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'chain-treasure-dig',
    type: 'chained',
    npc: { emoji: '🪙', name: 'Exhausted Prospector', role: 'Amateur Treasure Hunter' },
    situation: 'Your team returns from the dig. The hoard was real — but smaller than expected. Still, everyone gets a cut.',
    choices: [
      { label: 'Share the windfall', deltas: { gold: 20, adventurers: -12, quests: -5 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Keep the lion\'s share', deltas: { gold: 25, adventurers: -20 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'chain-tax-ignored',
    type: 'chained',
    npc: { emoji: '⚖️', name: 'City Bailiff', role: 'Law Enforcement' },
    situation: 'The city sent officers. Your guild is fined double for the missed declaration. Resistance is not advised.',
    choices: [
      { label: 'Pay the fine', deltas: { gold: -20, quests: 15 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Argue the case', deltas: { gold: -10, quests: -10, adventurers: 15 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'chain-merc-healed',
    type: 'chained',
    npc: { emoji: '🩹', name: 'Sera Ironfoot', role: 'Recovered Mercenary' },
    situation: 'The mercenary you sheltered has recovered. She offers to join your roster properly — for a modest equipment cost.',
    choices: [
      { label: 'Welcome her in', deltas: { adventurers: 10, equipment: -8 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Wish her luck', deltas: { gold: 6, quests: -8 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]
