export const thievesGuildAllied = [
  {
    id: 'faction-tg-allied-1',
    type: 'standard',
    npc: { emoji: '🤫', name: 'Dax the Handler', role: 'Thieves\' Guild Liaison' },
    situation: 'Dax slides a manifest across your desk — stolen military-grade supplies, freshly liberated from a noble\'s convoy. He\'s offering them at a fraction of market price. Your name won\'t appear anywhere. But if the noble traces it back, the guild gets implicated too.',
    choices: [
      { label: 'Buy the stolen supplies', deltas: { gold: -8, equipment: 15 }, major: false, reputation: -5, chains: null, rumorText: 'Someone has been acquiring suspiciously cheap equipment lately.' },
      { label: 'Pass — too close to the original theft', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-tg-allied-2',
    type: 'standard',
    npc: { emoji: '🕵️', name: 'Vessa the Shade', role: 'Guild Infiltrator' },
    situation: 'Vessa has embedded herself in a rival guild\'s operation and is ready to hand you their client roster — names, contracts, everything. All she asks is that you quietly shelter three of her people for two weeks while things cool down.',
    choices: [
      { label: 'Take the roster and hide her people', deltas: { quests: 15, adventurers: -5 }, major: true, reputation: -5, chains: null, rumorText: 'Strangers have been seen coming and going from the guild hall after dark.' },
      { label: 'Too much heat — decline', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-tg-allied-3',
    type: 'standard',
    npc: { emoji: '🪙', name: 'Ren the Smuggler', role: 'Underground Merchant' },
    situation: 'Ren needs legitimate transport papers for a shipment — nothing you need to know about, he insists. He\'ll pay well and split the profits. But city customs officers have been cracking down, and a search could expose more than just the shipment.',
    choices: [
      { label: 'Lend your guild seal for the papers', deltas: { gold: 18, quests: -8 }, major: false, reputation: -10, chains: null, rumorText: 'A suspicious shipment cleared customs under a guild name.' },
      { label: 'Refuse — your seal isn\'t for sale', deltas: { quests: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-tg-allied-4',
    type: 'standard',
    npc: { emoji: '👁️', name: 'Mira of the Watch', role: 'Corrupt City Guard' },
    situation: 'A city guard on the Thieves\' Guild payroll tips you off: a competitor\'s warehouse will be raided tomorrow. She\'s offering you first pick of anything your adventurers can claim before the official seizure. The window is tonight.',
    choices: [
      { label: 'Send a crew in tonight', deltas: { gold: 12, equipment: 10, adventurers: -3 }, major: true, reputation: -10, chains: null, rumorText: 'A guild crew was spotted near the warehouse district before last night\'s raid.' },
      { label: 'Stay out of it entirely', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-tg-allied-5',
    type: 'standard',
    npc: { emoji: '🗝️', name: 'The Locksmith', role: 'Guild Artisan' },
    situation: 'The guild\'s master locksmith offers to train your adventurers in bypass techniques — locks, traps, restricted entry. Genuinely useful skills. But training with a known guild operative ties your people to their network whether they like it or not.',
    choices: [
      { label: 'Accept the training', deltas: { adventurers: 7, gold: -5 }, major: false, reputation: -5, chains: null, rumorText: 'Some guild members have been seen at unusual locations during off hours.' },
      { label: 'Train your people the legitimate way', deltas: { gold: -10, adventurers: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
]

export const thievesGuildOpposed = [
  {
    id: 'faction-tg-opposed-1',
    type: 'standard',
    npc: { emoji: '🔪', name: 'Cutter', role: 'Guild Enforcer' },
    situation: 'A Thieves\' Guild enforcer delivers a message: your refusal to cooperate has been noted. He doesn\'t threaten directly — he doesn\'t need to. Your supply cart was ransacked last week. Your night courier hasn\'t been seen since. "Things can get worse," he says, and leaves.',
    choices: [
      { label: 'Hire extra security', deltas: { gold: -12, adventurers: 5 }, major: false, reputation: 5, chains: null, rumorText: 'The guild has been beefing up its street presence.' },
      { label: 'Let it slide — don\'t escalate', deltas: { equipment: -8 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-tg-opposed-2',
    type: 'standard',
    npc: { emoji: '⚖️', name: 'Provost Aldric', role: 'City Magistrate' },
    situation: 'The city magistrate approaches you quietly. He\'s building a case against the Thieves\' Guild and wants testimony from a guild master who\'s had direct dealings — or refusals. You\'d be protected. But the guild will know who talked.',
    choices: [
      { label: 'Testify against the guild', deltas: { quests: 15, adventurers: -5 }, major: true, reputation: 10, chains: null, rumorText: 'A guild master testified before the city magistrate. The streets are tense.' },
      { label: 'Stay out of the magistrate\'s war', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-tg-opposed-3',
    type: 'standard',
    npc: { emoji: '🐀', name: 'Sparrow', role: 'Defector' },
    situation: 'A low-level guild runner wants out and comes to you for protection. In exchange, she\'ll give you the guild\'s current safe house locations. She\'s genuine — you can tell — but sheltering her is an act of war against the guild.',
    choices: [
      { label: 'Protect her and take the information', deltas: { adventurers: 8, gold: -10, quests: 10 }, major: true, reputation: 5, chains: null, rumorText: 'Someone is sheltering a guild defector. The guild is not pleased.' },
      { label: 'Send her away — it\'s not your fight', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-tg-opposed-4',
    type: 'standard',
    npc: { emoji: '🔥', name: 'Mira of the Watch', role: 'City Guard Captain' },
    situation: 'The city guard captain offers you a contract: help her flush guild operatives out of the dock district using your adventurers as plainclothes support. The pay is decent. If the operation succeeds, the guild loses a major node. If it fails, your people are exposed.',
    choices: [
      { label: 'Take the contract', deltas: { gold: 15, adventurers: -7, quests: 10 }, major: true, reputation: 10, chains: null, rumorText: 'A guild company was working alongside city guards in the docks.' },
      { label: 'Decline — too dangerous for your people', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-tg-opposed-5',
    type: 'standard',
    npc: { emoji: '📦', name: 'Borvin the Merchant', role: 'Legitimate Supplier' },
    situation: 'A merchant who\'s been muscled out of his trade route by guild extortion asks for your help reclaiming it. He\'ll pay in a share of future profits and priority access to his goods. The guild will notice — and react.',
    choices: [
      { label: 'Help him reclaim the route', deltas: { gold: 10, equipment: 8, adventurers: -5 }, major: false, reputation: 10, chains: null, rumorText: 'A guild company took on a job that put them directly against guild interests.' },
      { label: 'Stay out of trade disputes', deltas: { gold: 5 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]
