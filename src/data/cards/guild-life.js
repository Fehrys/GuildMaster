export const guildLifeCards = [
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
    id: 'std-overdue-quest',
    type: 'standard',
    npc: { emoji: '📋', name: 'Guild Accountant', role: 'Internal Staff' },
    situation: 'Three quests are running overdue. You can send extra people to resolve them fast, or let clients wait and risk reputation.',
    choices: [
      { label: 'Send reinforcements', deltas: { adventurers: -10, quests: 15 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Let them wait', deltas: { quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-training-master',
    type: 'standard',
    npc: { emoji: '🏋️', name: 'Sergeant Brek', role: 'Combat Instructor' },
    situation: 'A retired soldier offers to train your roster for a month. It costs upfront but your people come out sharper.',
    choices: [
      { label: 'Hire him', deltas: { gold: -12, adventurers: 15 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Pass', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-monster-sighting',
    type: 'standard',
    npc: { emoji: '🐉', name: 'Terrified Shepherd', role: 'Local Villager' },
    situation: 'Reports of a large creature near the valley farms. Nobody else will go. Eliminating it would be a boon for your reputation — if your team returns.',
    choices: [
      { label: 'Take the job', deltas: { adventurers: -10, equipment: -8, quests: 18 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Decline the risk', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-alchemist-deal',
    type: 'standard',
    npc: { emoji: '⚗️', name: 'Maeva the Alchemist', role: 'City Alchemist' },
    situation: 'An alchemist wants to run experiments on some of your equipment — temporarily. In return: upgraded gear when done.',
    choices: [
      { label: 'Agree', deltas: { equipment: -10 }, major: false, reputation: 0, chains: 'chain-alchemist-done', rumorText: null },
      { label: 'Decline', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-scholar-request',
    type: 'standard',
    npc: { emoji: '📚', name: 'Scholar Davin', role: 'University Researcher' },
    situation: 'A scholar needs an escort to a remote ruin for research. The pay is modest, but he promises useful maps of the region.',
    choices: [
      { label: 'Take the contract', deltas: { gold: 8, adventurers: -5, quests: 8 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Too low-paying', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-guild-expansion',
    type: 'standard',
    npc: { emoji: '🏗️', name: 'Master Builder Oren', role: 'Construction Foreman' },
    situation: 'A builder proposes renovating your hall to fit more adventurers. Expensive, but your current space is cramped.',
    choices: [
      { label: 'Expand the hall', deltas: { gold: -20, adventurers: 20 }, major: true, reputation: 0, chains: null, rumorText: 'The hammering from the guild hall renovation can be heard across the district.' },
      { label: 'Not yet', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-veteran-retires',
    type: 'standard',
    npc: { emoji: '🧓', name: 'Old Garrus', role: 'Veteran Adventurer' },
    situation: 'One of your oldest members wants to retire. You could give him a generous sendoff, or try to convince him to stay on as an instructor.',
    choices: [
      { label: 'Generous sendoff', deltas: { gold: -10, adventurers: -5 }, major: false, reputation: 5, chains: null, rumorText: 'Old Garrus was seen at the docks, laughing with a tankard in his hand. He earned it.' },
      { label: 'Keep him as instructor', deltas: { gold: -5, adventurers: 10 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]
