export const worldEventCards = [
  {
    id: 'event-dungeon-discovered',
    type: 'event',
    npc: { emoji: '🗺️', name: 'City Herald', role: 'Official Messenger' },
    situation: 'A dungeon complex has surfaced near the city, drawing adventurers and treasure hunters from across the region.',
    choices: [
      { label: 'Send a full expedition', deltas: { quests: 30, gold: -10, adventurers: -10, equipment: -12 }, major: true, rumorText: null, resultText: "By midday the news has spread to every tavern and market stall in the district. Whatever it cost your people, the city will remember which guild moved when nobody else would.", chains: null },
      { label: 'Monitor from a distance', deltas: { quests: 18, gold: -6, adventurers: -6, equipment: -10 }, major: true, rumorText: null, resultText: "Scouts return with maps and careful notes while other guilds send in their boldest — and lose them. The choice to hold back cost something, but preserved enough to matter later.", chains: null },
    ]
  },
  {
    id: 'event-plague-outbreak',
    type: 'event',
    npc: { emoji: '🏥', name: 'City Physician', role: 'Chief Healer' },
    situation: 'A plague sweeps through the city, straining healers and disrupting normal life.',
    choices: [
      { label: 'Profit from the chaos', deltas: { gold: 12, quests: 8, adventurers: -12, equipment: -10 }, major: true, rumorText: null, resultText: "Coin flows into the guild from every direction the city can no longer manage on its own. The district will heal eventually. Whether it forgets who charged for the privilege is another question entirely.", chains: null },
      { label: 'Fortify the guild hall', deltas: { gold: -8, quests: -5, adventurers: -5, equipment: 15 }, major: true, rumorText: null, resultText: "Barricades go up and supplies are rationed with grim discipline. Outside the bolted doors the city suffers — inside, the guild weathers the worst of it intact.", chains: null },
    ]
  },
  {
    id: 'event-noble-tournament',
    type: 'event',
    npc: { emoji: '🏆', name: 'Lord Castellan', role: 'Tournament Master' },
    situation: 'A great tournament arrives in the city, drawing noble houses and warriors from distant lands.',
    choices: [
      { label: 'Enter a guild team', deltas: { quests: 15, gold: -12, adventurers: 8, equipment: -12 }, major: true, rumorText: null, resultText: "A cheer goes up from the market quarter. Your guild's name is on everyone's lips by nightfall — not as rumor, but as fact. This is what it feels like to be on the right side of something.", chains: null },
      { label: 'Run the betting pools', deltas: { gold: 11, quests: -5, adventurers: 5, equipment: -10 }, major: true, rumorText: null, resultText: "Numbers move through the back room faster than the crowd moves through the arena gates. When the dust settles and the champions are crowned, your ledger is the quiet winner of the day.", chains: null },
    ]
  },
  {
    id: 'event-siege',
    type: 'event',
    npc: { emoji: '⚔️', name: 'City Commander', role: 'Military Strategist' },
    situation: 'Enemy forces besiege the city walls, cutting off supply lines and threatening the district.',
    choices: [
      { label: 'Join the city defense', deltas: { adventurers: -15, equipment: -15, gold: 15, quests: 18 }, major: true, rumorText: null, resultText: "The walls hold. They hold because your people were on them. When the gates finally open again, the Commander pays what was promised — and the city carves your guild's part in this into something more lasting than gratitude.", chains: null },
      { label: 'Evacuate non-essentials', deltas: { gold: -10, adventurers: -8, equipment: 10, quests: 7 }, major: true, rumorText: null, resultText: "Wagons move through the south gate before dawn, carrying records, valuables, and people the guild cannot afford to lose. It costs more than expected. The siege ends without your fighters on the wall — a fact no one says aloud, but none forget.", chains: null },
    ]
  },
  {
    id: 'event-trade-fair',
    type: 'event',
    npc: { emoji: '🛒', name: 'Merchant Prince', role: 'Trade Consortium Leader' },
    situation: 'A grand trade fair floods the city with merchants, exotic goods, and commercial opportunity.',
    choices: [
      { label: 'Go all-in on trading', deltas: { gold: 25, equipment: 8, adventurers: -12, quests: -22 }, major: true, rumorText: null, resultText: "Stalls overflow with goods and the guild's people are everywhere the money is. Contracts go unsigned, adventures go unbooked — but when the fair closes its banners, the coffers are the fullest they have been in months.", chains: null },
      { label: 'Buy selectively', deltas: { gold: 11, equipment: 6, adventurers: -7, quests: -11 }, major: true, rumorText: null, resultText: "Careful choices at the fair mean the guild walks away with exactly what it needed and nothing it didn't. The restraint goes unnoticed by the crowd, which is precisely the point.", chains: null },
    ]
  },
  {
    id: 'event-famine',
    type: 'event',
    npc: { emoji: '🌾', name: 'City Elder', role: 'Council Spokesperson' },
    situation: 'Crop failures cause city-wide food shortage, driving desperation and unrest.',
    choices: [
      { label: 'Take relief contracts', deltas: { gold: -8, adventurers: -10, quests: 20, equipment: -5 }, major: true, rumorText: null, resultText: "Relief wagons reach neighborhoods the Council had already written off. The coin is gone and so are some of your best people, stretched thin across every starving district — but the city survives, and it knows the guild's role in that.", chains: null },
      { label: 'Stockpile and weather it', deltas: { gold: -8, adventurers: -5, quests: 5, equipment: 5 }, major: true, rumorText: null, resultText: "Stores are quietly restocked and the doors locked against the worst of it. Outside, the city endures. Inside, the guild endures too — leaner than before, but still standing when the harvest finally comes.", chains: null },
    ]
  },
  {
    id: 'event-monster-migration',
    type: 'event',
    npc: { emoji: '🐉', name: 'Beast Warden', role: 'Monster Hunter' },
    situation: 'A monster migration passes near the city, offering both danger and opportunity for the bold.',
    choices: [
      { label: 'Hunt the migration', deltas: { adventurers: 20, equipment: -12, quests: 8, gold: -18 }, major: true, rumorText: null, resultText: "Three days of smoke and noise on the eastern road, and then silence. The veterans who return come back changed — harder, sharper, and carrying trophies the city hasn't seen in a generation. The guild paid dearly for every one of them.", chains: null },
      { label: 'Bar the gates', deltas: { adventurers: -6, equipment: -8, quests: 8, gold: 5 }, major: true, rumorText: null, resultText: "Shutters close across the district and the guild waits out the rumble and stink from behind barred doors. The migration passes. The opportunity passes with it. Some things you can only watch go by.", chains: null },
    ]
  },
  {
    id: 'event-royal-visit',
    type: 'event',
    npc: { emoji: '👑', name: 'Royal Herald', role: 'Crown Representative' },
    situation: 'Royalty arrives for an official visit, demanding tribute and spectacle from every guild.',
    choices: [
      { label: 'Host a grand display', deltas: { gold: -18, adventurers: -8, quests: 20, equipment: 5 }, major: true, rumorText: null, resultText: "Torches burn through the night and the guild's finest are on display for the whole city to see. The treasury takes a wound it will feel for weeks — but the Crown's representative leaves with the guild's name written somewhere influential.", chains: null },
      { label: 'Give a modest reception', deltas: { gold: -12, adventurers: -4, quests: 12, equipment: 6 }, major: true, rumorText: null, resultText: "Measured hospitality, respectfully delivered. The royal party seems unsurprised — great guilds rarely overreach at these things. What the guild loses in spectacle it recovers in composure.", chains: null },
    ]
  },
  {
    id: 'event-guild-conclave',
    type: 'event',
    npc: { emoji: '🏛️', name: 'Conclave Arbiter', role: 'Guild Council Leader' },
    situation: 'All guilds are summoned to a city conclave, requiring presence, politics, and positioning.',
    choices: [
      { label: 'Play for influence', deltas: { quests: 18, gold: -10, adventurers: -5, equipment: -5 }, major: true, rumorText: null, resultText: "The decision ripples outward faster than expected. By morning three factions are asking questions about your guild's position. You answer none of them — the work at the conclave already did.", chains: null },
      { label: 'Negotiate contracts', deltas: { quests: -12, gold: 12, adventurers: 5, equipment: -7 }, major: true, rumorText: null, resultText: "Politics is left to the guilds that can afford the bruises. Ink dries on agreements that will pay out long after the conclave's speeches are forgotten, and the guild walks out with more than it arrived with.", chains: null },
    ]
  },
  {
    id: 'event-earthquake',
    type: 'event',
    npc: { emoji: '🏚️', name: 'City Engineer', role: 'Infrastructure Overseer' },
    situation: 'A tremor damages buildings across the district, creating both crisis and reconstruction work.',
    choices: [
      { label: 'Lead the rebuilding effort', deltas: { equipment: -20, gold: -10, adventurers: 15, quests: 12 }, major: true, rumorText: null, resultText: "Dust still hangs in the air when the first crews arrive bearing the guild's colors. Timber and stone pour through the gates at ruinous cost — and the district rises faster than anyone expected. People remember who showed up with mortar and muscle, not just condolences.", chains: null },
      { label: 'Patch your own hall first', deltas: { equipment: -10, gold: -8, adventurers: 5, quests: 10 }, major: true, rumorText: null, resultText: "Cracks in the guild hall get sealed before anything else. It is not a popular decision, but it is a defensible one — a guild that falls apart in a crisis helps no one. By the time the neighborhood is asking for help, there is something left to offer.", chains: null },
    ]
  },
  {
    id: 'event-river-flood',
    type: 'event',
    npc: { emoji: '🌊', name: 'Harbor Master', role: 'Port Authority' },
    situation: 'The river floods the trade district, displacing merchants and creating urgent rescue work.',
    choices: [
      { label: 'Mount a rescue operation', deltas: { gold: -18, equipment: -10, adventurers: -5, quests: 30 }, major: true, rumorText: null, resultText: "Boats move through streets that were dry cobblestones yesterday. The coin leaves the treasury before the ink on the order is dry. By evening the streets are calmer — you bought the city time, and a name that echoes differently in the trade district from this day forward.", chains: null },
      { label: 'Secure the guild assets', deltas: { gold: -8, equipment: -5, adventurers: 5, quests: 6 }, major: true, rumorText: null, resultText: "Everything that matters to the guild is moved to high ground while the trade district drowns. Someone else handles the rescue eventually. The harbor master does not ask why your boats stayed docked — but the question hangs in the air all the same.", chains: null },
    ]
  },
  {
    id: 'event-heresy-panic',
    type: 'event',
    npc: { emoji: '⛪', name: 'High Inquisitor', role: 'Church Authority' },
    situation: 'Religious panic grips the city as the church hunts heretics, creating fear and opportunity.',
    choices: [
      { label: 'Profit from the panic', deltas: { quests: 20, adventurers: -10, gold: -8, equipment: -5 }, major: true, rumorText: null, resultText: "Fear is a current, and the guild learns to swim it. Contracts pour in from every family afraid of a knock at the door. The Inquisitor doesn't notice — he has bigger concerns. Your people come back hollow from some of it, but the work gets done.", chains: null },
      { label: 'Stay out of it', deltas: { quests: -15, adventurers: 10, gold: 8, equipment: -6 }, major: true, rumorText: null, resultText: "Doors stay closed and opinions stay unvoiced. The witch-hunt burns through the city like a fire that doesn't care where the wind came from. When the smoke clears, the guild is still standing — untouched, uncommitted, and quietly grateful for both.", chains: null },
    ]
  },
];

// Alias used by audit-balance.mjs
export const eventCards = worldEventCards;
