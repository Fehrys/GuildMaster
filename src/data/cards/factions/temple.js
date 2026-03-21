export const templeAllied = [
  {
    id: 'faction-temple-allied-1',
    type: 'standard',
    npc: { emoji: '🙏', name: 'Brother Edrin', role: 'Temple Deacon' },
    situation: 'The temple is expanding its charity ward and needs a reliable guild to escort donations — grain and medicine — through a rough stretch of the outer city. They\'ll bless your adventurers in return, improving morale. But it ties up your best people for three days.',
    choices: [
      { label: 'Provide the escort', deltas: { adventurers: -5, equipment: 8 }, major: false, reputation: 10, chains: null, rumorText: 'The guild was seen escorting temple charity carts. People are talking warmly.' },
      { label: 'Recommend another group instead', deltas: { gold: 8, quests: -5 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-temple-allied-2',
    type: 'standard',
    npc: { emoji: '⚕️', name: 'Healer Yuna', role: 'Temple Physician' },
    situation: 'The temple\'s chief healer offers a standing deal: your adventurers get priority treatment at the temple infirmary. All you need to do is send a crew each month to help with the temple\'s heavier labor — hauling, repairs, crowd control during festivals.',
    choices: [
      { label: 'Agree to the labor exchange', deltas: { adventurers: -3, quests: -5, equipment: 10 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Negotiate a gold payment instead', deltas: { gold: -10, equipment: 8 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-temple-allied-3',
    type: 'standard',
    npc: { emoji: '📜', name: 'High Cleric Davan', role: 'Temple Authority' },
    situation: 'The High Cleric asks your guild to enforce a public morality edict in the guild district — no gambling dens, no unlicensed medicine sellers. It would improve your standing with the temple considerably. But it will make you unpopular with half your neighbors and cut off some cheap sources.',
    choices: [
      { label: 'Enforce the edict', deltas: { quests: -8, adventurers: 5 }, major: true, reputation: 15, chains: null, rumorText: 'The guild has been acting as the temple\'s street arm. Not everyone is grateful.' },
      { label: 'Politely decline the enforcement role', deltas: { quests: -8, gold: 6 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-temple-allied-4',
    type: 'standard',
    npc: { emoji: '🕯️', name: 'Acolyte Pell', role: 'Temple Errand-Runner' },
    situation: 'A young acolyte arrives bearing a sealed request from the temple: a holy relic has gone missing and the temple suspects a local thief ring. They want your guild to recover it quietly, without involving the city watch. Reward is access to the temple vault for equipment repairs.',
    choices: [
      { label: 'Take on the recovery quietly', deltas: { adventurers: -5, equipment: 15, gold: -8 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Suggest they go through proper channels', deltas: { equipment: -8, gold: 6 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-temple-allied-5',
    type: 'standard',
    npc: { emoji: '🌿', name: 'Sister Fauna', role: 'Temple Herbalist' },
    situation: 'The temple herbalist has developed a new salve that dramatically speeds recovery for wounded adventurers. She\'ll provide a stock — free — if your guild publicly credits the temple in your next announcement and sends recruits to hear a sermon.',
    choices: [
      { label: 'Accept the salves with the conditions', deltas: { equipment: 12, quests: -8 }, major: false, reputation: 10, chains: null, rumorText: 'The guild master has been speaking warmly of the temple in public.' },
      { label: 'Buy the salves outright — no sermons', deltas: { gold: -15, equipment: 12 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]

export const templeOpposed = [
  {
    id: 'faction-temple-opposed-1',
    type: 'standard',
    npc: { emoji: '😤', name: 'Warden Tobis', role: 'Temple Warden' },
    situation: 'Temple wardens have begun actively discouraging citizens from hiring your guild, citing "moral irregularities." Two clients cancelled contracts this week. You could ignore it, or make a public statement defending your guild — which the temple will call heretical.',
    choices: [
      { label: 'Issue a public defense of the guild', deltas: { quests: 10, gold: -8 }, major: true, reputation: -10, chains: null, rumorText: 'The guild master spoke openly against the temple\'s interference. A crowd gathered.' },
      { label: 'Let it pass — clients will decide for themselves', deltas: { quests: -8, gold: 6 }, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-temple-opposed-2',
    type: 'standard',
    npc: { emoji: '🏥', name: 'Temple Gate Keeper', role: 'Infirmary Guard' },
    situation: 'Two of your adventurers were badly injured on a job and need proper healing. The temple infirmary is the only option — but given your standing, they\'ll demand a public apology and a donation to be admitted. Otherwise, you improvise with street herbalists.',
    choices: [
      { label: 'Pay and apologize to gain admission', deltas: { gold: -15, adventurers: 12 }, major: false, reputation: -10, chains: null, rumorText: 'The guild master was seen humbling themselves at the temple gate.' },
      { label: 'Use street healers — slower but independent', deltas: { gold: -8, adventurers: 6 }, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-temple-opposed-3',
    type: 'standard',
    npc: { emoji: '📣', name: 'Street Preacher', role: 'Temple Agitator' },
    situation: 'A temple street preacher has set up outside your guild hall and delivers daily sermons questioning your morality. It\'s theatre — but it\'s working. Foot traffic is down. You can pay him to relocate, engage with him publicly, or wait it out.',
    choices: [
      { label: 'Pay him to find a different corner', deltas: { gold: -12, quests: 10 }, major: false, reputation: -5, chains: null, rumorText: 'The guild reportedly paid to silence a street preacher.' },
      { label: 'Wait it out — he\'ll move on eventually', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-temple-opposed-4',
    type: 'standard',
    npc: { emoji: '🧙', name: 'Hedge Witch Corra', role: 'Independent Healer' },
    situation: 'With the temple refusing your guild services, an independent healer offers to fill the gap — cheaper rates, no sermons, no moral conditions. The temple considers her a fraud and a heretic. Hiring her openly would deepen the temple\'s hostility but solve your immediate problem.',
    choices: [
      { label: 'Hire Corra as a guild healer', deltas: { gold: -6, adventurers: 8 }, major: false, reputation: -5, chains: null, rumorText: 'The guild has engaged a healer the temple calls unorthodox.' },
      { label: 'Find a compromise through temple intermediaries', deltas: { gold: -15, adventurers: 12 }, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'faction-temple-opposed-5',
    type: 'standard',
    npc: { emoji: '📖', name: 'Scholar Renald', role: 'City Archivist' },
    situation: 'A city archivist approaches you with an offer: the temple has been illegally collecting civic taxes in the outer district, and he has documentation. He\'d give you the evidence to make a formal complaint — but only if you fund his research access. It would humiliate the temple publicly.',
    choices: [
      { label: 'Fund the archivist and file the complaint', deltas: { gold: -12, quests: 15 }, major: true, reputation: 0, chains: null, rumorText: 'A formal complaint against the temple has been filed with the city council.' },
      { label: 'Leave temple politics to the city', deltas: { gold: 8, quests: -5 }, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
]
