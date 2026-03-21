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
    npc: { emoji: '👑', name: 'Lord Hestan', role: 'Minor Nobleman' },
    situation: 'A local lord wants to hire six of your best for a season — good pay, but your roster will be thin for weeks.',
    choices: [
      { label: 'Accept the contract', deltas: { gold: 25, adventurers: -15, quests: 8 }, major: true, reputation: 5, chains: null, rumorText: 'Lord Hestan\'s gold came with strings. You\'ll feel the absence of your people soon.' },
      { label: 'Decline', deltas: { quests: -5 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-donation',
    type: 'standard',
    npc: { emoji: '🙏', name: 'Brother Aldwyn', role: 'Temple Deacon' },
    situation: 'The local temple is rebuilding after a fire. A donation would be noticed — and remembered.',
    choices: [
      { label: 'Donate generously', deltas: { gold: -12 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Decline politely', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-festival-sponsor',
    type: 'standard',
    npc: { emoji: '🎪', name: 'Festival Organiser', role: 'City Event Planner' },
    situation: 'The city is holding its annual harvest festival. Sponsoring it costs coin but puts your guild banner front and centre.',
    choices: [
      { label: 'Sponsor the festival', deltas: { gold: -15, quests: 12 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Skip it', deltas: { quests: -5 }, major: false, reputation: 0, chains: null, rumorText: null },
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
  {
    id: 'std-election-backing',
    type: 'standard',
    npc: { emoji: '🗳️', name: 'Councillor Veth', role: 'City Council Candidate' },
    situation: 'City council elections are next month. Two candidates court your endorsement — one favors guild freedoms, the other promises tighter oversight but more city contracts.',
    choices: [
      { label: 'Back the guild-friendly candidate', deltas: { quests: 10, gold: -8 }, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'merchants': 'allied', 'city-guard': 'opposed' } },
      { label: 'Back the contracts candidate', deltas: { quests: 15, gold: -8 }, major: false, reputation: -5, chains: null, rumorText: 'Word spreads that your guild chose city gold over guild principle.', factions: { 'city-guard': 'allied', 'merchants': 'opposed' } },
    ],
  },
  {
    id: 'std-noble-feud',
    type: 'standard',
    npc: { emoji: '⚔️', name: 'Baron Osric', role: 'Feuding Nobleman' },
    situation: 'Two noble houses are in open dispute over a trade route. Both have approached your guild for support. Backing either side means enemies — but also powerful friends.',
    choices: [
      { label: 'Side with House Osric', deltas: { gold: 20, adventurers: -8 }, major: false, reputation: -5, chains: null, rumorText: 'House Vayne will not forget your choice.', factions: { 'noble-north': 'allied', 'noble-south': 'opposed' } },
      { label: 'Offer to mediate', deltas: { adventurers: -5, quests: 5 }, major: false, reputation: 10, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-diplomatic-envoy',
    type: 'standard',
    npc: { emoji: '🕊️', name: 'Ambassador Lira', role: 'Foreign Envoy' },
    situation: 'A diplomatic envoy from a neighbouring kingdom passes through. Hosting them is expensive but could open foreign contract routes. Ignoring them may close those doors for years.',
    choices: [
      { label: 'Host them lavishly', deltas: { gold: -20, quests: 15 }, major: false, reputation: 10, chains: null, rumorText: null, modifiers: [{ id: 'foreign-contacts', label: 'Foreign Contacts', effects: { quests: 8 }, duration: 3 }] },
      { label: 'Offer modest hospitality', deltas: { gold: -8, quests: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-tax-reform',
    type: 'standard',
    npc: { emoji: '📜', name: 'Treasurer Halvard', role: 'Royal Treasurer' },
    situation: 'A proposed tax reform would slash guild import levies but double property fees. The city council is split and wants to hear from influential guilds before the vote.',
    choices: [
      { label: 'Lobby for the reform', deltas: { gold: -10, quests: 8 }, major: false, reputation: 5, chains: 'chain-tax-reform-passed', rumorText: null, factions: { 'merchants': 'allied' } },
      { label: 'Lobby against it', deltas: { gold: -10, equipment: 5 }, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'city-guard': 'allied' } },
    ],
  },
  {
    id: 'std-public-works',
    type: 'standard',
    npc: { emoji: '🏗️', name: 'Overseer Duna', role: 'City Works Director' },
    situation: 'The city plans to pave the market road adjacent to your guild hall. Funding a portion buys you naming rights on the finished road — and goodwill from traders who use it daily.',
    choices: [
      { label: 'Fund a portion', deltas: { gold: -18, quests: 12 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Contribute a small sum', deltas: { gold: -6, quests: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-royal-ceremony',
    type: 'standard',
    npc: { emoji: '👸', name: 'Herald Casius', role: 'Royal Chamberlain' },
    situation: 'The crown is holding a grand ceremony to celebrate a military victory. Guilds that parade under the royal banner gain prestige — but the mandatory donation is steep.',
    choices: [
      { label: 'Participate fully', deltas: { gold: -22, quests: 14 }, major: false, reputation: 15, chains: null, rumorText: null },
      { label: 'Skip the ceremony', deltas: {}, major: false, reputation: -10, chains: null, rumorText: 'Your absence at the royal parade did not go unnoticed at court.' },
    ],
  },
  {
    id: 'std-diplomatic-incident',
    type: 'standard',
    npc: { emoji: '😤', name: 'Consul Brennan', role: 'Foreign Trade Consul' },
    situation: 'One of your adventurers caused a scene at a foreign consul\'s dinner — insults were exchanged and a vase was broken. The consul demands a formal apology and restitution.',
    choices: [
      { label: 'Apologise and pay restitution', deltas: { gold: -15 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Dismiss the complaint', deltas: { quests: -12 }, major: false, reputation: -10, chains: null, rumorText: 'The consul made certain everyone heard how your guild handles its messes.' },
    ],
  },
  {
    id: 'std-religious-dispute',
    type: 'standard',
    npc: { emoji: '⛪', name: 'High Cleric Seran', role: 'Temple High Cleric' },
    situation: 'The city\'s two major temples are in open dispute over a sacred site near your guild\'s territory. Both have asked for your support. The thieves\' guild quietly backs the smaller sect.',
    choices: [
      { label: 'Back the established temple', deltas: { gold: -10, quests: 10 }, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'temple': 'allied', 'thieves-guild': 'opposed' } },
      { label: 'Back the smaller sect', deltas: { quests: 8, adventurers: 5 }, major: false, reputation: -5, chains: null, rumorText: 'Your support of the minor sect raised eyebrows across the city.', factions: { 'thieves-guild': 'allied', 'temple': 'opposed' } },
    ],
  },
  {
    id: 'std-border-conflict',
    type: 'standard',
    npc: { emoji: '🛡️', name: 'Commander Tyrel', role: 'Border Legion Captain' },
    situation: 'Skirmishes along the eastern border are disrupting trade routes your guild relies on. The border legion requests guild support — mercenaries or supplies — to resolve things faster.',
    choices: [
      { label: 'Send adventurers to assist', deltas: { adventurers: -10, quests: 12 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Wait it out', deltas: { quests: -8 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-royal-decree',
    type: 'standard',
    npc: { emoji: '📋', name: 'Royal Envoy Mira', role: 'Crown Messenger' },
    situation: 'A new royal decree requires all guilds to register a secondary office in the capital within two months — or pay a hefty annual exemption fee. The capital is far and costly.',
    choices: [
      { label: 'Open the capital office', deltas: { gold: -25, adventurers: -8, quests: 15 }, major: true, reputation: 10, chains: null, rumorText: null, modifiers: [{ id: 'capital-presence', label: 'Capital Presence', effects: { quests: 12 }, duration: 5 }] },
      { label: 'Contest the decree legally', deltas: { gold: -10, quests: -8 }, major: false, reputation: 5, chains: 'chain-decree-contested', rumorText: 'Your guild\'s legal challenge to the crown drew attention — for better and worse.' },
    ],
  },
  {
    id: 'std-political-marriage',
    type: 'standard',
    npc: { emoji: '💍', name: 'Matchmaker Sessel', role: 'Noble House Broker' },
    situation: 'A minor noble family proposes a symbolic "guild alliance" to coincide with a high-profile marriage — your guild crest alongside theirs in public ceremony, in exchange for introductions to their merchant network.',
    choices: [
      { label: 'Accept the alliance', deltas: { gold: -10, quests: 14 }, major: false, reputation: 8, chains: null, rumorText: null, factions: { 'noble-south': 'allied' } },
      { label: 'Decline gracefully', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-public-trial',
    type: 'standard',
    npc: { emoji: '⚖️', name: 'Judge Orren', role: 'City Magistrate' },
    situation: 'A notorious merchant is on public trial for fraud. Several of your guild\'s past clients are entangled. The judge asks whether your guild will submit testimony — it could expose uncomfortable dealings.',
    choices: [
      { label: 'Testify fully and honestly', deltas: { quests: -10, gold: -5 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Decline to testify', deltas: { quests: 8 }, major: false, reputation: -10, chains: null, rumorText: 'Rumours swirl that your guild has something to hide from the trial.' },
    ],
  },
  {
    id: 'std-council-seat',
    type: 'standard',
    npc: { emoji: '🏛️', name: 'Alderman Pryce', role: 'City Council Chair' },
    situation: 'A seat on the city council has unexpectedly opened. Your guild is nominated as a candidate — an honour, but the role demands time, gold, and staff commitment for a full season.',
    choices: [
      { label: 'Accept the council seat', deltas: { gold: -20, adventurers: -10, quests: 18 }, major: true, reputation: 15, chains: null, rumorText: null, modifiers: [{ id: 'council-seat', label: 'Council Seat', effects: { quests: 10, gold: 5 }, duration: 4 }] },
      { label: 'Decline and recommend an ally', deltas: { quests: 5 }, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'merchants': 'allied' } },
    ],
  },
  {
    id: 'std-thieves-pardon',
    type: 'standard',
    npc: { emoji: '🗝️', name: 'Quartermaster Voss', role: 'Thieves\' Guild Liaison' },
    situation: 'The thieves\' guild requests a quiet favour: use your guild\'s political contacts to smooth over an arrest warrant for one of their members. In return, they promise reduced "interference" with your contracts.',
    choices: [
      { label: 'Pull the strings', deltas: { quests: 12 }, major: false, reputation: -8, chains: null, rumorText: 'Whispers suggest your guild has ties to the criminal underworld.', factions: { 'thieves-guild': 'allied', 'city-guard': 'opposed' } },
      { label: 'Refuse firmly', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'thieves-guild': 'opposed' } },
    ],
  },
  {
    id: 'std-census-compliance',
    type: 'standard',
    npc: { emoji: '📊', name: 'Registrar Nomi', role: 'Royal Census Official' },
    situation: 'The crown is conducting a kingdom-wide guild census. Full disclosure means taxes tied to your true size. Underreporting is common practice — but penalties if caught are severe.',
    choices: [
      { label: 'Report accurately', deltas: { gold: -15, quests: 8 }, major: false, reputation: 8, chains: null, rumorText: null },
      { label: 'Underreport slightly', deltas: { gold: -5 }, major: false, reputation: -5, chains: 'chain-census-fraud', rumorText: null },
    ],
  },
  {
    id: 'std-peace-delegation',
    type: 'standard',
    npc: { emoji: '🤝', name: 'Elder Farynn', role: 'Neighbouring Town Elder' },
    situation: 'A delegation from a rival town arrives seeking to negotiate shared trade rights. Their market competes with yours, but an agreement could end months of commercial friction.',
    choices: [
      { label: 'Negotiate a fair agreement', deltas: { quests: 12, gold: -8 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Drive a hard bargain', deltas: { gold: 15, quests: 5 }, major: false, reputation: -5, chains: null, rumorText: 'The rival town delegation left with a bitter taste — and long memories.' },
    ],
  },
]
