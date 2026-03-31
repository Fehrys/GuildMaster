export const politicalCards = [
  {
    id: 'std-tax-collector',
    type: 'standard',
    npc: { emoji: '🧙', name: 'Aldric the Scribe', role: 'Town Bureaucrat' },
    situation: 'The city registry requires all guilds to file a tax declaration by week\'s end. It costs a fee — but ignoring it has consequences.',
    choices: [
      { label: 'Pay the fee', deltas: { gold: -12, quests: 10 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'Aldric stamps your papers without a second glance and the registry moves on. Compliance is boring — which is exactly what you wanted it to be.' },
      { label: 'Ignore it', deltas: { quests: -18, gold: 13 }, major: false, reputation: -5, chains: 'chain-tax-ignored', rumorText: null, resultText: 'Three commission offers quietly vanish from your board over the next week. Word travels in bureaucratic circles, and Aldric\'s circles are wide.' },
    ],
  },
  {
    id: 'std-minor-lord',
    type: 'standard',
    npc: { emoji: '👑', name: 'Lord Hestan', role: 'Minor Nobleman' },
    situation: 'A local lord wants to hire six of your best for a season — good pay, but your roster will be thin for weeks.',
    choices: [
      { label: 'Accept the contract', deltas: { gold: 20, adventurers: -15, quests: -5 }, major: true, reputation: 5, chains: null, rumorText: 'Lord Hestan\'s gold came with strings. You\'ll feel the absence of your people soon.', resultText: 'The coin arrives promptly, stacked and sealed with his lordship\'s wax. The hall feels quieter than you\'d like for the next several weeks.' },
      { label: 'Decline', deltas: { quests: -8, adventurers: 5 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'Lord Hestan takes the refusal with stiff politeness. His name drifts off your referral list — and yours, you suspect, off his.' },
    ],
  },
  {
    id: 'std-donation',
    type: 'standard',
    npc: { emoji: '🙏', name: 'Brother Aldwyn', role: 'Temple Deacon' },
    situation: 'The local temple is rebuilding after a fire. A donation would be noticed — and remembered.',
    choices: [
      { label: 'Donate generously', deltas: { gold: -12, quests: 10 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'Your guild\'s name goes on the new cornerstone. The deacon\'s gratitude turns out to be quite well-connected.' },
      { label: 'Decline politely', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'Brother Aldwyn smiles and says he understands. The congregation remembers differently.' },
    ],
  },
  {
    id: 'std-festival-sponsor',
    type: 'standard',
    npc: { emoji: '🎪', name: 'Festival Organiser', role: 'City Event Planner' },
    situation: 'The city is holding its annual harvest festival. Sponsoring it costs coin but puts your guild banner front and centre.',
    choices: [
      { label: 'Sponsor the festival', deltas: { gold: -15, quests: 12 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'Your banner hangs between the mayor\'s and the bakers\' union for three days straight. Half the city walks under it and thinks well of whoever put it there.' },
      { label: 'Skip it', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: 'Staying absent costs nothing today. Next year, the organiser will remember who came through — and who saved their coin.' },
    ],
  },
  {
    id: 'std-noble-party',
    type: 'standard',
    npc: { emoji: '🥂', name: 'Lady Thessa', role: 'City Socialite' },
    situation: 'A noblewoman invites your guild master to a banquet. It\'s a social game — showing up costs time and a gift, but the connections are real.',
    choices: [
      { label: 'Attend with a gift', deltas: { gold: -8, quests: 10 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'The gift was quietly remarked upon. Two guests pressed cards into your hand before dessert, and Lady Thessa made a point of your name to the city treasurer.' },
      { label: 'Send apologies', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'An absence at Thessa\'s table is a social statement whether you meant it as one or not. The invitations that followed were noticeably fewer.' },
    ],
  },
  {
    id: 'std-drought-relief',
    type: 'standard',
    npc: { emoji: '☀️', name: 'Village Elder Ros', role: 'Rural Community Leader' },
    situation: 'A drought is crippling nearby farmlands. The villages can\'t pay much — but the whole city will hear about whoever helped.',
    choices: [
      { label: 'Send aid', deltas: { gold: -10, adventurers: -5, quests: 12 }, major: false, reputation: 15, chains: null, rumorText: null, resultText: 'Merchants who supply those villages quietly shifted their business your way. Good deeds have a ledger of their own in this city.' },
      { label: 'Not your concern', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'Elder Ros didn\'t argue. The farming villages found help elsewhere, and those helpers are remembered warmly now in places you once did business.' },
    ],
  },
  {
    id: 'std-siege-of-equipment',
    type: 'standard',
    npc: { emoji: '🏰', name: 'City Quartermaster', role: 'Military Supply Officer' },
    situation: 'The city guard needs to borrow equipment for a week-long exercise. They\'ll compensate — but you\'ll be short in the meantime.',
    choices: [
      { label: 'Lend the equipment', deltas: { gold: 15, equipment: -15 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'The quartermaster returns everything on time and pays promptly. A small favour noted in the guard\'s books — and guards with good memory are worth something.' },
      { label: 'Refuse', deltas: { quests: -8, gold: 6 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'Refusing the guard is your right. They remembered it during your next permit renewal, in the way only officials can — slowly and without saying so.' },
    ],
  },
  {
    id: 'std-inquisitor-visit',
    type: 'standard',
    npc: { emoji: '🔍', name: 'Inquisitor Fenn', role: 'City Inspector' },
    situation: 'A city inspector arrives to audit your guild\'s records. Everything is probably fine — but cooperating takes time, and a small "fee" might hurry things along.',
    choices: [
      { label: 'Full cooperation', deltas: { adventurers: -8, quests: -5, gold: 10 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'Fenn leaves satisfied, marking your file with a clean seal. Between the interviews and the cross-referencing, your people had no time for contracts — and the quest board shows it. At least the records are compliant.' },
      { label: 'Grease his palm', deltas: { gold: -12, quests: 10 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: 'The inspector pocketed the coins and the audit ended in under an hour. Clean, quick, and just uncomfortable enough to remember.' },
    ],
  },
  {
    id: 'std-election-backing',
    type: 'standard',
    npc: { emoji: '🗳️', name: 'Councillor Veth', role: 'City Council Candidate' },
    situation: 'City council elections are next month. Two candidates court your endorsement — one favors guild freedoms, the other promises tighter oversight but more city contracts.',
    choices: [
      { label: 'Back the guild-friendly candidate', deltas: { quests: 10, gold: -8 }, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'merchants': 'allied', 'city-guard': 'opposed' }, resultText: 'Your endorsement moves with the candidate\'s momentum. The merchants\' quarter celebrates; the guard barracks go noticeably cold.' },
      { label: 'Back the contracts candidate', deltas: { quests: 12, gold: -8 }, major: false, reputation: -5, chains: null, rumorText: 'Word spreads that your guild chose city gold over guild principle.', factions: { 'city-guard': 'allied', 'merchants': 'opposed' }, resultText: 'City contracts begin arriving within a fortnight. Other guild masters stop nodding to you in the market square.' },
    ],
  },
  {
    id: 'std-noble-feud',
    type: 'standard',
    npc: { emoji: '⚔️', name: 'Baron Osric', role: 'Feuding Nobleman' },
    situation: 'Two noble houses are in open dispute over a trade route. Both have approached your guild for support. Backing either side means enemies — but also powerful friends.',
    choices: [
      { label: 'Side with House Osric', deltas: { gold: 15, adventurers: -12 }, major: false, reputation: -5, chains: null, rumorText: 'House Vayne will not forget your choice.', factions: { 'noble-north': 'allied', 'noble-south': 'opposed' }, resultText: 'Osric\'s gold is real and arrives promptly. House Vayne\'s reply is slower — a sealed letter, no greeting, all business, declining further partnership.' },
      { label: 'Offer to mediate', deltas: { adventurers: -5, quests: 8 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'Neither house fully trusts you, which means both still need you. The mediation drags on — but so does the work it keeps generating.' },
    ],
  },
  {
    id: 'std-diplomatic-envoy',
    type: 'standard',
    npc: { emoji: '🕊️', name: 'Ambassador Lira', role: 'Foreign Envoy' },
    situation: 'A diplomatic envoy from a neighbouring kingdom passes through. Hosting them is expensive but could open foreign contract routes. Ignoring them may close those doors for years.',
    choices: [
      { label: 'Host them lavishly', deltas: { gold: -20, quests: 18 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'Ambassador Lira departs with visible warmth. Three foreign commission letters arrive by courier the following season — the expensive kind that pay accordingly.' },
      { label: 'Offer modest hospitality', deltas: { gold: -8, quests: 6 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'Adequate hospitality earned adequate goodwill. The envoy mentioned your guild to their contacts — politely, without enthusiasm.' },
    ],
  },
  {
    id: 'std-tax-reform',
    type: 'standard',
    npc: { emoji: '📜', name: 'Treasurer Halvard', role: 'Royal Treasurer' },
    situation: 'A proposed tax reform would slash guild import levies but double property fees. The city council is split and wants to hear from influential guilds before the vote.',
    choices: [
      { label: 'Lobby for the reform', deltas: { gold: -10, quests: 8 }, major: false, reputation: 5, chains: 'chain-tax-reform-passed', rumorText: null, factions: { 'merchants': 'allied' }, resultText: 'The merchant faction thanks you warmly, publicly, in a way that makes other factions take careful note of whose banner you\'re now standing under.' },
      { label: 'Lobby against it', deltas: { gold: -10, equipment: 8 }, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'city-guard': 'allied' }, resultText: 'The reform fails by two votes. The guard captain sends a brief note of thanks — and the city treasurer marks your name in a register you didn\'t know you were in.' },
    ],
  },
  {
    id: 'std-public-works',
    type: 'standard',
    npc: { emoji: '🏗️', name: 'Overseer Duna', role: 'City Works Director' },
    situation: 'The city plans to pave the market road adjacent to your guild hall. Funding a portion buys you naming rights on the finished road — and goodwill from traders who use it daily.',
    choices: [
      { label: 'Fund a portion', deltas: { gold: -18, quests: 15 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'The stone is laid and your name is carved into the cornerstone. Every trader who curses the old mud and praises the new road is, in some small way, praising you.' },
      { label: 'Contribute a small sum', deltas: { gold: -6, quests: 8 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'Modest contribution, modest recognition. Your name appears in the city ledger of donors — third from the bottom, ahead of the candlemakers\' union.' },
    ],
  },
  {
    id: 'std-royal-ceremony',
    type: 'standard',
    npc: { emoji: '👸', name: 'Herald Casius', role: 'Royal Chamberlain' },
    situation: 'The crown is holding a grand ceremony to celebrate a military victory. Guilds that parade under the royal banner gain prestige — but the mandatory donation is steep.',
    choices: [
      { label: 'Participate fully', deltas: { gold: -22, quests: 18 }, major: false, reputation: 15, chains: null, rumorText: null, resultText: 'Your guild marches in the third rank, banners sharp, and the crowd cheers without distinction. The herald notes your contribution in the official record.' },
      { label: 'Skip the ceremony', deltas: { quests: -10, gold: 8 }, major: false, reputation: -10, chains: null, rumorText: 'Your absence at the royal parade did not go unnoticed at court.', resultText: 'Saving the donation felt sensible until three contracts were quietly routed to guilds who showed up. Absence has its own price list.' },
    ],
  },
  {
    id: 'std-diplomatic-incident',
    type: 'standard',
    npc: { emoji: '😤', name: 'Consul Brennan', role: 'Foreign Trade Consul' },
    situation: 'One of your adventurers caused a scene at a foreign consul\'s dinner — insults were exchanged and a vase was broken. The consul demands a formal apology and restitution.',
    choices: [
      { label: 'Apologise and pay restitution', deltas: { gold: -15, quests: 12 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'The consul accepts with the practiced graciousness of someone who expected exactly this. Trade relations resume, and the adventurer is confined to domestic work indefinitely.' },
      { label: 'Dismiss the complaint', deltas: { quests: -12, gold: 10 }, major: false, reputation: -10, chains: null, rumorText: 'The consul made certain everyone heard how your guild handles its messes.', resultText: 'Brennan did not argue. He simply made himself available to every foreign merchant who asked about your guild and answered at length.' },
    ],
  },
  {
    id: 'std-religious-dispute',
    type: 'standard',
    npc: { emoji: '⛪', name: 'High Cleric Seran', role: 'Temple High Cleric' },
    situation: 'The city\'s two major temples are in open dispute over a sacred site near your guild\'s territory. Both have asked for your support. The thieves\' guild quietly backs the smaller sect.',
    choices: [
      { label: 'Back the established temple', deltas: { gold: -10, quests: 12 }, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'temple': 'allied', 'thieves-guild': 'opposed' }, resultText: 'High Cleric Seran blesses your hall formally, which impresses the devout and annoys the thieves\' quarter in equal measure.' },
      { label: 'Back the smaller sect', deltas: { quests: 8, adventurers: -5 }, major: false, reputation: -5, chains: null, rumorText: 'Your support of the minor sect raised eyebrows across the city.', factions: { 'thieves-guild': 'allied', 'temple': 'opposed' }, resultText: 'The smaller sect is grateful in the quiet, useful ways of people who have survived by staying invisible. The established temple will not forgive you quickly.' },
    ],
  },
  {
    id: 'std-border-conflict',
    type: 'standard',
    npc: { emoji: '🛡️', name: 'Commander Tyrel', role: 'Border Legion Captain' },
    situation: 'Skirmishes along the eastern border are disrupting trade routes your guild relies on. The border legion requests guild support — mercenaries or supplies — to resolve things faster.',
    choices: [
      { label: 'Send adventurers to assist', deltas: { adventurers: -10, quests: 12 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'Your people come back two weeks later, road-worn and quiet about what happened. The trade routes open within a month, and Commander Tyrel owes you one.' },
      { label: 'Wait it out', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'The skirmishes resolve eventually — through someone else\'s sacrifice. The legion remembers who showed up, and the list is shorter than it should be.' },
    ],
  },
  {
    id: 'std-royal-decree',
    type: 'standard',
    npc: { emoji: '📋', name: 'Royal Envoy Mira', role: 'Crown Messenger' },
    situation: 'A new royal decree requires all guilds to register a secondary office in the capital within two months — or pay a hefty annual exemption fee. The capital is far and costly.',
    choices: [
      { label: 'Open the capital office', deltas: { gold: -20, adventurers: -8, quests: 15, equipment: 15 }, major: true, reputation: 10, chains: null, rumorText: null, resultText: 'Eight of your people spend a month setting up a cramped room near the capital registrar\'s office. It\'s barely functional, but it\'s yours — and the crown\'s paperwork says so.' },
      { label: 'Contest the decree legally', deltas: { gold: -10, quests: -8, adventurers: 15 }, major: false, reputation: 5, chains: 'chain-decree-contested', rumorText: 'Your guild\'s legal challenge to the crown drew attention — for better and worse.', resultText: 'Lawyers are expensive and slow. The challenge winds through the courts while your guild quietly becomes known as the one brave or foolish enough to push back against a royal decree.' },
    ],
  },
  {
    id: 'std-political-marriage',
    type: 'standard',
    npc: { emoji: '💍', name: 'Matchmaker Sessel', role: 'Noble House Broker' },
    situation: 'A minor noble family proposes a symbolic "guild alliance" to coincide with a high-profile marriage — your guild crest alongside theirs in public ceremony, in exchange for introductions to their merchant network.',
    choices: [
      { label: 'Accept the alliance', deltas: { gold: -10, quests: 12 }, major: false, reputation: 8, chains: null, rumorText: null, factions: { 'noble-south': 'allied' }, resultText: 'Your crest hangs beside theirs at the ceremony. Polite introductions follow over the next weeks — some of them turn into actual business.' },
      { label: 'Decline gracefully', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'Sessel accepts the refusal smoothly. The noble family finds another guild willing to appear in their photographs — and that guild is now in their merchant network.' },
    ],
  },
  {
    id: 'std-public-trial',
    type: 'standard',
    npc: { emoji: '⚖️', name: 'Judge Orren', role: 'City Magistrate' },
    situation: 'A notorious merchant is on public trial for fraud. Several of your guild\'s past clients are entangled. The judge asks whether your guild will submit testimony — it could expose uncomfortable dealings.',
    choices: [
      { label: 'Testify fully and honestly', deltas: { quests: -10, gold: -5, equipment: 12 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'Uncomfortable truths, told plainly. The guild\'s name appears in the trial record as a cooperating party — which is not a comfortable position, but an honest one.' },
      { label: 'Decline to testify', deltas: { quests: 8, gold: -5 }, major: false, reputation: -10, chains: null, rumorText: 'Rumours swirl that your guild has something to hide from the trial.', resultText: 'Silence was interpreted loudly. Judge Orren moved on, but half the city\'s merchant houses quietly updated their notes on your guild\'s reliability.' },
    ],
  },
  {
    id: 'std-council-seat',
    type: 'standard',
    npc: { emoji: '🏛️', name: 'Alderman Pryce', role: 'City Council Chair' },
    situation: 'A seat on the city council has unexpectedly opened. Your guild is nominated as a candidate — an honour, but the role demands time, gold, and staff commitment for a full season.',
    choices: [
      { label: 'Accept the council seat', deltas: { gold: -20, adventurers: -10, quests: 18, equipment: 10 }, major: true, reputation: 15, chains: null, rumorText: null, resultText: 'The chamber is drafty and the debates run long. Still, the guild\'s name is now in the room where the city\'s decisions are actually made.' },
      { label: 'Decline and recommend an ally', deltas: { quests: 5, gold: -5 }, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'merchants': 'allied' }, resultText: 'Your ally takes the seat and does not forget who put them there. The goodwill is less visible than a council title — and more durable.' },
    ],
  },
  {
    id: 'std-thieves-pardon',
    type: 'standard',
    npc: { emoji: '🗝️', name: 'Quartermaster Voss', role: 'Thieves\' Guild Liaison' },
    situation: 'The thieves\' guild requests a quiet favour: use your guild\'s political contacts to smooth over an arrest warrant for one of their members. In return, they promise reduced "interference" with your contracts.',
    choices: [
      { label: 'Pull the strings', deltas: { quests: 12, gold: -8 }, major: false, reputation: -8, chains: null, rumorText: 'Whispers suggest your guild has ties to the criminal underworld.', factions: { 'thieves-guild': 'allied', 'city-guard': 'opposed' }, resultText: 'The warrant disappears from the record with no official explanation. Voss nods once and your contracts run smoothly for months — until someone asks questions you can\'t cleanly answer.' },
      { label: 'Refuse firmly', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: 5, chains: null, rumorText: null, factions: { 'thieves-guild': 'opposed' }, resultText: 'Voss takes the refusal without visible reaction, which is more unsettling than anger. Two minor contracts go sideways in the following weeks — nothing provable.' },
    ],
  },
  {
    id: 'std-census-compliance',
    type: 'standard',
    npc: { emoji: '📊', name: 'Registrar Nomi', role: 'Royal Census Official' },
    situation: 'The crown is conducting a kingdom-wide guild census. Full disclosure means taxes tied to your true size. Underreporting is common practice — but penalties if caught are severe.',
    choices: [
      { label: 'Report accurately', deltas: { gold: -15, quests: 12 }, major: false, reputation: 8, chains: null, rumorText: null, resultText: 'Registrar Nomi marks your file with a rare commendation for accuracy. Whether that helps you later or simply makes you stand out from every guild who lied is unclear.' },
      { label: 'Underreport slightly', deltas: { gold: -8, adventurers: 6 }, major: false, reputation: -5, chains: 'chain-census-fraud', rumorText: null, resultText: 'Everyone does it, which is exactly what everyone says before they\'re the one the crown makes an example of.' },
    ],
  },
  {
    id: 'std-peace-delegation',
    type: 'standard',
    npc: { emoji: '🤝', name: 'Elder Farynn', role: 'Neighbouring Town Elder' },
    situation: 'A delegation from a rival town arrives seeking to negotiate shared trade rights. Their market competes with yours, but an agreement could end months of commercial friction.',
    choices: [
      { label: 'Negotiate a fair agreement', deltas: { quests: 12, gold: -8 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'The agreement is signed over a modest shared meal. Commercial friction fades and both markets breathe a little easier — which turns out to be good for everyone.' },
      { label: 'Drive a hard bargain', deltas: { gold: 15, quests: -12 }, major: false, reputation: -5, chains: null, rumorText: 'The rival town delegation left with a bitter taste — and long memories.', resultText: 'You extracted favourable terms and every coin of it. Elder Farynn signed without expression, then went home and told everyone exactly what kind of partner you are.' },
    ],
  },
]
