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
      major: true, reputation: 10, chains: null, rumorText: 'Names were named. Powerful people are not happy.', resultText: 'You spend coin to buy the moment it takes to say the name. The room goes quiet. By evening it\'s all over the city — and with it, new commissions from people who\'d been waiting for someone to say the unsayable out loud. Powerful people are quietly furious.',
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
      major: true, reputation: 15, chains: null, rumorText: 'An unusual alliance. The temple shelters those who lay down arms.', resultText: 'Ten of your fighters escort the bandits to the temple gate before dawn. Sister Maren meets them with blankets and bread. No speeches. Twenty new commissions open from an eastern road that is suddenly, improbably, peaceful. Nobody predicted an alliance like this. That\'s probably why it worked.',
    },
  },
]
