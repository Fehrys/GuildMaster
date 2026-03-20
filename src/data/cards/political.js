export const politicalCards = [
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
    id: 'std-festival-sponsor',
    type: 'standard',
    npc: { emoji: '🎪', name: 'Festival Organiser', role: 'City Event Planner' },
    situation: 'The city is holding its annual harvest festival. Sponsoring it costs coin but puts your guild banner front and centre.',
    choices: [
      { label: 'Sponsor the festival', deltas: { gold: -15, quests: 12 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Skip it', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-noble-party',
    type: 'standard',
    npc: { emoji: '🥂', name: 'Lady Thessa', role: 'City Socialite' },
    situation: 'A noblewoman invites your guild master to a banquet. It\'s a social game — showing up costs time and a gift, but the connections are real.',
    choices: [
      { label: 'Attend with a gift', deltas: { gold: -8, quests: 10 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Send apologies', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-drought-relief',
    type: 'standard',
    npc: { emoji: '☀️', name: 'Village Elder Ros', role: 'Rural Community Leader' },
    situation: 'A drought is crippling nearby farmlands. The villages can\'t pay much — but the whole city will hear about whoever helped.',
    choices: [
      { label: 'Send aid', deltas: { gold: -10, adventurers: -5, quests: 8 }, major: false, reputation: 15, chains: null, rumorText: null },
      { label: 'Not your concern', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-siege-of-equipment',
    type: 'standard',
    npc: { emoji: '🏰', name: 'City Quartermaster', role: 'Military Supply Officer' },
    situation: 'The city guard needs to borrow equipment for a week-long exercise. They\'ll compensate — but you\'ll be short in the meantime.',
    choices: [
      { label: 'Lend the equipment', deltas: { gold: 15, equipment: -15 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Refuse', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-inquisitor-visit',
    type: 'standard',
    npc: { emoji: '🔍', name: 'Inquisitor Fenn', role: 'City Inspector' },
    situation: 'A city inspector arrives to audit your guild\'s records. Everything is probably fine — but cooperating takes time, and a small "fee" might hurry things along.',
    choices: [
      { label: 'Full cooperation', deltas: { adventurers: -5, quests: -5 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Grease his palm', deltas: { gold: -12 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]
