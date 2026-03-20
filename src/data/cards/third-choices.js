export const banditWarThirdChoices = [
  {
    cardId: 'bw-m3',
    conditions: {
      relationships: { 'jolen-fence': { maxLevel: -1 } },
      flags: { 'jolen-fence': ['refused-goods'] },
      resources: { gold: { min: 40 } },
    },
    choice: {
      label: 'Expose the informant\'s employer',
      deltas: { gold: -15, quests: 15 },
      major: true, reputation: 10, chains: null, rumorText: 'Names were named. Powerful people are not happy.',
    },
  },
  {
    cardId: 'bw-m5',
    conditions: {
      relationships: { 'sister-maren': { minLevel: 2 } },
      factions: { 'temple': 'allied' },
      resources: { adventurers: { min: 30 } },
    },
    choice: {
      label: 'Offer sanctuary through the temple',
      deltas: { adventurers: -10, quests: 20 },
      major: true, reputation: 15, chains: null, rumorText: 'An unusual alliance. The temple shelters those who lay down arms.',
    },
  },
]
