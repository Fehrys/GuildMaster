export const merchantCards = [
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
    id: 'std-caravan-escort',
    type: 'standard',
    npc: { emoji: '🐪', name: 'Merchant Consortium', role: 'Trade Guild' },
    situation: 'A wealthy trade consortium needs a full escort across dangerous roads. High pay, high cost in manpower.',
    choices: [
      { label: 'Take the contract', deltas: { gold: 30, adventurers: -18 }, major: true, reputation: 5, chains: null, rumorText: null },
      { label: 'Decline', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-bad-batch',
    type: 'standard',
    npc: { emoji: '⚙️', name: 'Outfitter Hess', role: 'Equipment Supplier' },
    situation: 'Your regular supplier admits the last batch of gear was defective. He\'ll replace half — but you\'re owed an apology and a refund.',
    choices: [
      { label: 'Accept partial replacement', deltas: { equipment: 10 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Demand full refund', deltas: { gold: 10, equipment: -10 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-abandoned-supplies',
    type: 'standard',
    npc: { emoji: '📦', name: 'Scavenger Crew', role: 'Freelance Salvagers' },
    situation: 'Scavengers found a cache of arms abandoned in the forest — origin unknown. They\'ll sell cheap. Might be stolen, might be cursed, might be a windfall.',
    choices: [
      { label: 'Buy the cache', deltas: { gold: -10, equipment: 22 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Leave it', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-debt-collection',
    type: 'standard',
    npc: { emoji: '💼', name: 'Moneylender Vas', role: 'City Creditor' },
    situation: 'A moneylender wants you to collect a debt from a struggling family — not violent, just persuasive. The pay is good but the work is grim.',
    choices: [
      { label: 'Take the job', deltas: { gold: 18, quests: 5 }, major: false, reputation: -5, chains: null, rumorText: null },
      { label: 'Refuse', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-fence',
    type: 'standard',
    npc: { emoji: '🤫', name: 'Jolen the Fence', role: 'Black Market Contact' },
    situation: 'A shady contact offers discounted arms — clearly stolen, but functional. Cheap equipment, high risk.',
    choices: [
      { label: 'Buy anyway', deltas: { gold: -8, equipment: 20 }, major: false, reputation: -5, chains: null, rumorText: 'Some of your new equipment has unfamiliar maker\'s marks on it.' },
      { label: 'Refuse', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-rumored-treasure',
    type: 'standard',
    npc: { emoji: '🪙', name: 'Excited Prospector', role: 'Amateur Treasure Hunter' },
    situation: 'A prospector claims to have found signs of a buried hoard. He wants your muscle; you split the take. High risk, potential windfall.',
    choices: [
      { label: 'Fund the dig', deltas: { gold: -8, adventurers: -8, equipment: -5 }, major: true, reputation: 0, chains: 'chain-treasure-dig', rumorText: 'A team was spotted heading north with shovels and high hopes.' },
      { label: 'Pass', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]
