// Crisis cards — one per resource per extreme (low / high)
export const crisisCards = {
  gold: {
    low: {
      id: 'crisis-gold-low',
      type: 'crisis',
      npc: { emoji: '💸', name: 'Master Creditor', role: 'Debt Collector' },
      situation: 'Your creditors are at the door. They will not wait another week. Settle now — or lose something more valuable than coin.',
      choices: [
        { label: 'Liquidate equipment', deltas: { gold: 20, equipment: -25 }, major: true, reputation: -5, chains: null, rumorText: null, resultText: "You strip the storeroom bare and dump it all on the market at a loss. The creditors leave. The shelves stay empty. This is what surviving looks like when there's nothing left to look good about." },
        { label: 'Cut adventurer pay', deltas: { gold: 15, adventurers: -15 }, major: true, reputation: -5, chains: null, rumorText: null, resultText: "The pay slips go out lighter. Nobody says anything directly — they don't have to. Three fighters are gone by end of week, and the ones who stayed know why." },
      ],
    },
    high: {
      id: 'crisis-gold-high',
      type: 'crisis',
      npc: { emoji: '🏦', name: 'Baron Crestholt', role: 'Wealthy Noble' },
      situation: 'Word of your wealth has spread. A noble demands an involuntary "loan." Refuse and face political pressure.',
      choices: [
        { label: 'Comply', deltas: { gold: -25, quests: 10 }, major: true, reputation: 0, chains: null, rumorText: null, resultText: "You sign the request with a steady hand and a face that gives nothing away. The baron's man collects and bows. Your ledger is considerably lighter. The next favor on that ledger is yours — or so they'll tell you." },
        { label: 'Refuse', deltas: { quests: -15 }, major: true, reputation: 5, chains: null, rumorText: null, resultText: "He takes it badly, as expected. The political pressure follows, also as expected. The coin stays in your treasury. What you didn't expect was how good it felt to say no." },
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
        { label: 'Hire mercenaries', deltas: { gold: -20, adventurers: 10 }, major: true, reputation: 0, chains: null, rumorText: null, resultText: "They cost twice what they're worth and half their stories are lies, but they show up — and that's what matters right now. The quest limps forward and the client stays quiet." },
        { label: 'Let the quest fail', deltas: { quests: -20 }, major: true, reputation: -5, chains: null, rumorText: null, resultText: "The client makes good on the threat and word spreads before nightfall. Twenty quests' worth of board confidence evaporates with it. Sometimes there's nothing to do but sit with it." },
      ],
    },
    high: {
      id: 'crisis-adventurers-high',
      type: 'crisis',
      npc: { emoji: '⚔️', name: 'Guild Sergeant', role: 'Internal Command' },
      situation: 'Your hall is overcrowded. A brawl broke out at dawn. The city watch is asking questions.',
      choices: [
        { label: 'Dispatch a large expedition', deltas: { adventurers: -20, quests: 10 }, major: true, reputation: 0, chains: null, rumorText: null, resultText: "By noon the hall is half-empty and blessedly quiet. The city watch sends no further questions. Twenty people gone is a steep price for peace — but it's the price that worked." },
        { label: 'Pay fines and manage tensions', deltas: { gold: -15, adventurers: -5 }, major: true, reputation: 0, chains: null, rumorText: null, resultText: "Coin changes hands at the city watch office. Rations get reduced. Five people leave anyway. You hold two tense conversations and avoid a third. The lid goes back on, for now." },
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
        { label: 'Run a charitable quest', deltas: { adventurers: -10, quests: 18 }, major: true, reputation: 10, chains: null, rumorText: null, resultText: "Ten of your people spend three days on a job that pays nothing. Your board fills back up within the week. The pamphlets find something else to mock by morning." },
        { label: 'Ignore the gossip', deltas: { quests: -8 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "You've heard worse said about better guilds. The pamphlets are unsigned, the ink is cheap — but the board gets eight quests thinner while the city watches and wonders." },
      ],
    },
    high: {
      id: 'crisis-quests-high',
      type: 'crisis',
      npc: { emoji: '📋', name: 'Overburdened Clerk', role: 'Guild Administrator' },
      situation: 'Your quest board is chaos. Clients are fighting each other for adventurers. Something must give.',
      choices: [
        { label: 'Turn away new clients', deltas: { quests: -20, gold: -10 }, major: true, reputation: 0, chains: null, rumorText: null, resultText: "The word goes out: board closed, temporarily. Twenty quests go elsewhere and so does the coin they'd have brought. Your people stop bleeding. That's what this costs." },
        { label: 'Hire temporary help', deltas: { gold: -20, adventurers: 12 }, major: true, reputation: 0, chains: null, rumorText: null, resultText: "The new hands arrive by afternoon — some better than expected, some exactly as bad as feared. The board clears. The ledger doesn't. You'll sort out which cost more later." },
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
        { label: 'Emergency procurement', deltas: { gold: -25, equipment: 20 }, major: true, reputation: 0, chains: null, rumorText: null, resultText: "The supplier knows they have you. The price reflects that. You pay considerably more than the gear is worth and hand it out before dawn. Your lead adventurer inspects it, nods, and says nothing. That's enough." },
        { label: 'Force the issue', deltas: { adventurers: -10, quests: -5 }, major: true, reputation: -5, chains: null, rumorText: null, resultText: "The quest goes out with the wrong gear. Two adventurers refuse and walk. Three come back bruised. You resolve to never let the stores run this low again." },
      ],
    },
    high: {
      id: 'crisis-equipment-high',
      type: 'crisis',
      npc: { emoji: '🌑', name: 'Black Market Broker', role: 'Fence' },
      situation: 'Your surplus gear has attracted a fence. They want to buy — or steal, if you decline.',
      choices: [
        { label: 'Sell to the fence', deltas: { gold: 20, equipment: -25 }, major: true, reputation: -5, chains: null, rumorText: null, resultText: "The goods move fast — faster than you'd like. The fence is gone before you finish counting the coin. Your storeroom is bare. You're lighter now, in multiple senses of the word." },
        { label: 'Hire night guards', deltas: { gold: -15, equipment: -5 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "A week of quiet nights and the threat seems to pass. The guards cost coin and the precautions cost five pieces of equipment lost to handling. You'll never know if the fence moved on or just waited." },
      ],
    },
  },
}
