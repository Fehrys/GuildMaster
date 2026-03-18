// Crisis cards — one per resource per extreme (low / high)
export const crisisCards = {
  gold: {
    low: {
      id: 'crisis-gold-low',
      type: 'crisis',
      npc: { emoji: '💸', name: 'Master Creditor', role: 'Debt Collector' },
      situation: 'Your creditors are at the door. They will not wait another week. Settle now — or lose something more valuable than coin.',
      choices: [
        { label: 'Liquidate equipment', deltas: { gold: 20, equipment: -25 }, major: true, reputation: -5, chains: null, rumorText: null },
        { label: 'Cut adventurer pay', deltas: { gold: 15, adventurers: -15 }, major: true, reputation: -5, chains: null, rumorText: null },
      ],
    },
    high: {
      id: 'crisis-gold-high',
      type: 'crisis',
      npc: { emoji: '🏦', name: 'Baron Crestholt', role: 'Wealthy Noble' },
      situation: 'Word of your wealth has spread. A noble demands an involuntary "loan." Refuse and face political pressure.',
      choices: [
        { label: 'Comply', deltas: { gold: -25, quests: 10 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Refuse', deltas: { quests: -15 }, major: true, reputation: 5, chains: null, rumorText: null },
      ],
    },
  },
  adventurers: {
    low: {
      id: 'crisis-adventurers-low',
      type: 'crisis',
      npc: { emoji: '⚠️', name: 'Desperate Client', role: 'Merchant in Distress' },
      situation: 'A critical quest is failing — you have no one to send. The client threatens to spread the word unless you act now.',
      choices: [
        { label: 'Hire mercenaries', deltas: { gold: -20, adventurers: 10 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Let the quest fail', deltas: { quests: -20 }, major: true, reputation: -5, chains: null, rumorText: null },
      ],
    },
    high: {
      id: 'crisis-adventurers-high',
      type: 'crisis',
      npc: { emoji: '⚔️', name: 'Guild Sergeant', role: 'Internal Command' },
      situation: 'Your hall is overcrowded. A brawl broke out at dawn. The city watch is asking questions.',
      choices: [
        { label: 'Dispatch a large expedition', deltas: { adventurers: -20, quests: 10 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Pay fines and manage tensions', deltas: { gold: -15, adventurers: -5 }, major: true, reputation: 0, chains: null, rumorText: null },
      ],
    },
  },
  quests: {
    low: {
      id: 'crisis-quests-low',
      type: 'crisis',
      npc: { emoji: '📢', name: 'Town Crier', role: 'Public Messenger' },
      situation: 'The guild is being called idle — pamphlets mock you in the market. A public display of capability is needed.',
      choices: [
        { label: 'Run a charitable quest', deltas: { adventurers: -10, quests: 18 }, major: true, reputation: 10, chains: null, rumorText: null },
        { label: 'Ignore the gossip', deltas: { quests: -8 }, major: false, reputation: -5, chains: null, rumorText: null },
      ],
    },
    high: {
      id: 'crisis-quests-high',
      type: 'crisis',
      npc: { emoji: '📋', name: 'Overburdened Clerk', role: 'Guild Administrator' },
      situation: 'Your quest board is chaos. Clients are fighting each other for adventurers. Something must give.',
      choices: [
        { label: 'Turn away new clients', deltas: { quests: -20, gold: -10 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Hire temporary help', deltas: { gold: -20, adventurers: 12 }, major: true, reputation: 0, chains: null, rumorText: null },
      ],
    },
  },
  equipment: {
    low: {
      id: 'crisis-equipment-low',
      type: 'crisis',
      npc: { emoji: '🛡️', name: 'Lead Adventurer', role: 'Roster Senior' },
      situation: 'Your best crew refuses to take the next quest without proper arms. They\'re not wrong.',
      choices: [
        { label: 'Emergency procurement', deltas: { gold: -25, equipment: 20 }, major: true, reputation: 0, chains: null, rumorText: null },
        { label: 'Force the issue', deltas: { adventurers: -10, quests: -5 }, major: true, reputation: -5, chains: null, rumorText: null },
      ],
    },
    high: {
      id: 'crisis-equipment-high',
      type: 'crisis',
      npc: { emoji: '🌑', name: 'Black Market Broker', role: 'Fence' },
      situation: 'Your surplus gear has attracted a fence. They want to buy — or steal, if you decline.',
      choices: [
        { label: 'Sell to the fence', deltas: { gold: 20, equipment: -25 }, major: true, reputation: -5, chains: null, rumorText: null },
        { label: 'Hire night guards', deltas: { gold: -15, equipment: -5 }, major: false, reputation: 0, chains: null, rumorText: null },
      ],
    },
  },
}
