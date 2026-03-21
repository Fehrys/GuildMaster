export const worldEventCards = [
  {
    id: 'event-dungeon-discovered',
    type: 'event',
    npc: { emoji: '🗺️', name: 'City Herald', role: 'Official Messenger' },
    situation: 'A dungeon complex has surfaced near the city, drawing adventurers and treasure hunters from across the region.',
    choices: [
      { label: 'Send a full expedition', deltas: { quests: 30, gold: -10, adventurers: -10, equipment: -12 }, major: true, rumorText: null, chains: null },
      { label: 'Monitor from a distance', deltas: { quests: 8, gold: -3, adventurers: -3, equipment: -5 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-plague-outbreak',
    type: 'event',
    npc: { emoji: '🏥', name: 'City Physician', role: 'Chief Healer' },
    situation: 'A plague sweeps through the city, straining healers and disrupting normal life.',
    choices: [
      { label: 'Profit from the chaos', deltas: { gold: 12, quests: 8, adventurers: -12, equipment: -10 }, major: true, rumorText: null, chains: null },
      { label: 'Fortify the guild hall', deltas: { gold: -8, quests: -5, adventurers: -5, equipment: 15 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-noble-tournament',
    type: 'event',
    npc: { emoji: '🏆', name: 'Lord Castellan', role: 'Tournament Master' },
    situation: 'A great tournament arrives in the city, drawing noble houses and warriors from distant lands.',
    choices: [
      { label: 'Enter a guild team', deltas: { quests: 15, gold: -12, adventurers: 8, equipment: -12 }, major: true, rumorText: null, chains: null },
      { label: 'Run the betting pools', deltas: { gold: 8, quests: -5, adventurers: 5, equipment: -10 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-siege',
    type: 'event',
    npc: { emoji: '⚔️', name: 'City Commander', role: 'Military Strategist' },
    situation: 'Enemy forces besiege the city walls, cutting off supply lines and threatening the district.',
    choices: [
      { label: 'Join the city defense', deltas: { adventurers: -15, equipment: -15, gold: 15, quests: 12 }, major: true, rumorText: null, chains: null },
      { label: 'Evacuate non-essentials', deltas: { gold: -10, adventurers: -8, equipment: 10, quests: 5 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-trade-fair',
    type: 'event',
    npc: { emoji: '🛒', name: 'Merchant Prince', role: 'Trade Consortium Leader' },
    situation: 'A grand trade fair floods the city with merchants, exotic goods, and commercial opportunity.',
    choices: [
      { label: 'Go all-in on trading', deltas: { gold: 25, equipment: 8, adventurers: -12, quests: -22 }, major: true, rumorText: null, chains: null },
      { label: 'Buy selectively', deltas: { gold: 8, equipment: 5, adventurers: -3, quests: -12 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-famine',
    type: 'event',
    npc: { emoji: '🌾', name: 'City Elder', role: 'Council Spokesperson' },
    situation: 'Crop failures cause city-wide food shortage, driving desperation and unrest.',
    choices: [
      { label: 'Take relief contracts', deltas: { gold: -8, adventurers: -10, quests: 20, equipment: -5 }, major: true, rumorText: null, chains: null },
      { label: 'Stockpile and weather it', deltas: { gold: -8, adventurers: -5, quests: 5, equipment: 5 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-monster-migration',
    type: 'event',
    npc: { emoji: '🐉', name: 'Beast Warden', role: 'Monster Hunter' },
    situation: 'A monster migration passes near the city, offering both danger and opportunity for the bold.',
    choices: [
      { label: 'Hunt the migration', deltas: { adventurers: 20, equipment: -12, quests: 8, gold: -18 }, major: true, rumorText: null, chains: null },
      { label: 'Bar the gates', deltas: { adventurers: -5, equipment: -5, quests: 5, gold: 3 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-royal-visit',
    type: 'event',
    npc: { emoji: '👑', name: 'Royal Herald', role: 'Crown Representative' },
    situation: 'Royalty arrives for an official visit, demanding tribute and spectacle from every guild.',
    choices: [
      { label: 'Host a grand display', deltas: { gold: -18, adventurers: -8, quests: 20, equipment: 5 }, major: true, rumorText: null, chains: null },
      { label: 'Give a modest reception', deltas: { gold: -8, adventurers: -3, quests: 8, equipment: 2 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-guild-conclave',
    type: 'event',
    npc: { emoji: '🏛️', name: 'Conclave Arbiter', role: 'Guild Council Leader' },
    situation: 'All guilds are summoned to a city conclave, requiring presence, politics, and positioning.',
    choices: [
      { label: 'Play for influence', deltas: { quests: 18, gold: -10, adventurers: -5, equipment: -5 }, major: true, rumorText: null, chains: null },
      { label: 'Negotiate contracts', deltas: { quests: -8, gold: 8, adventurers: 3, equipment: -5 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-earthquake',
    type: 'event',
    npc: { emoji: '🏚️', name: 'City Engineer', role: 'Infrastructure Overseer' },
    situation: 'A tremor damages buildings across the district, creating both crisis and reconstruction work.',
    choices: [
      { label: 'Lead the rebuilding effort', deltas: { equipment: -20, gold: -10, adventurers: 15, quests: 12 }, major: true, rumorText: null, chains: null },
      { label: 'Patch your own hall first', deltas: { equipment: -10, gold: -8, adventurers: 5, quests: 10 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-river-flood',
    type: 'event',
    npc: { emoji: '🌊', name: 'Harbor Master', role: 'Port Authority' },
    situation: 'The river floods the trade district, displacing merchants and creating urgent rescue work.',
    choices: [
      { label: 'Mount a rescue operation', deltas: { gold: -18, equipment: -10, adventurers: -5, quests: 30 }, major: true, rumorText: null, chains: null },
      { label: 'Secure the guild assets', deltas: { gold: -8, equipment: -5, adventurers: 5, quests: 6 }, major: true, rumorText: null, chains: null },
    ]
  },
  {
    id: 'event-heresy-panic',
    type: 'event',
    npc: { emoji: '⛪', name: 'High Inquisitor', role: 'Church Authority' },
    situation: 'Religious panic grips the city as the church hunts heretics, creating fear and opportunity.',
    choices: [
      { label: 'Profit from the panic', deltas: { quests: 20, adventurers: -10, gold: -8, equipment: -5 }, major: true, rumorText: null, chains: null },
      { label: 'Stay out of it', deltas: { quests: -5, adventurers: 5, gold: 3, equipment: -6 }, major: true, rumorText: null, chains: null },
    ]
  },
];

// Alias used by audit-balance.mjs
export const eventCards = worldEventCards;
