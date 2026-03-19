export const standardCards = [
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
    id: 'std-wounded-merc',
    type: 'standard',
    npc: { emoji: '🩹', name: 'A Wounded Mercenary', role: 'Wandering Sword' },
    situation: 'A battered mercenary collapses at your door. She asks only for a place to rest and heal. It will cost nothing but space.',
    choices: [
      { label: 'Take her in', deltas: { adventurers: 5 }, major: false, reputation: 5, chains: 'chain-merc-healed', rumorText: null },
      { label: 'Turn her away', deltas: {}, major: false, reputation: -5, chains: null, rumorText: 'Word spreads. The wounded remember those who turned them away.' },
    ],
  },
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
    id: 'std-young-recruit',
    type: 'standard',
    npc: { emoji: '🌟', name: 'Tam', role: 'Would-Be Adventurer' },
    situation: 'A bright-eyed kid walks in off the street wanting to join your guild. No skills to speak of, but plenty of enthusiasm.',
    choices: [
      { label: 'Take a chance', deltas: { adventurers: 8, gold: -3 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Send them away', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
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
    id: 'std-old-map',
    type: 'standard',
    npc: { emoji: '🗺️', name: 'An Old Cartographer', role: 'Retired Explorer' },
    situation: 'An old man sells maps of uncharted ruins — supposedly equipment-rich. It\'s a gamble: could be gold or a waste of lives.',
    choices: [
      { label: 'Fund the expedition', deltas: { gold: -18, adventurers: -8, equipment: 22 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Pass', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-rival-spy',
    type: 'standard',
    npc: { emoji: '🕵️', name: 'Unknown Figure', role: 'Suspicious Stranger' },
    situation: 'A stranger offers coin to "share" your client list. You suspect a rival guild is behind this.',
    choices: [
      { label: 'Take the coin', deltas: { gold: 20, quests: -20 }, major: true, reputation: -5, chains: null, rumorText: 'Some bridges burn slowly. This one is now smouldering.' },
      { label: 'Show them the door', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null },
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
    id: 'std-overdue-quest',
    type: 'standard',
    npc: { emoji: '📋', name: 'Guild Accountant', role: 'Internal Staff' },
    situation: 'Three quests are running overdue. You can send extra people to resolve them fast, or let clients wait and risk reputation.',
    choices: [
      { label: 'Send reinforcements', deltas: { adventurers: -10, quests: 15 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Let them wait', deltas: { quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
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
    id: 'std-training-master',
    type: 'standard',
    npc: { emoji: '🏋️', name: 'Sergeant Brek', role: 'Combat Instructor' },
    situation: 'A retired soldier offers to train your roster for a month. It costs upfront but your people come out sharper.',
    choices: [
      { label: 'Hire him', deltas: { gold: -12, adventurers: 15 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Pass', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-monster-sighting',
    type: 'standard',
    npc: { emoji: '🐉', name: 'Terrified Shepherd', role: 'Local Villager' },
    situation: 'Reports of a large creature near the valley farms. Nobody else will go. Eliminating it would be a boon for your reputation — if your team returns.',
    choices: [
      { label: 'Take the job', deltas: { adventurers: -10, equipment: -8, quests: 18 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Decline the risk', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-protection-racket',
    type: 'standard',
    npc: { emoji: '😤', name: 'Thieves\' Guild Enforcer', role: 'Street Muscle' },
    situation: 'A city gang demands monthly "protection" fees. Pay them off, or refuse and deal with the harassment.',
    choices: [
      { label: 'Pay the fee', deltas: { gold: -10 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Refuse and hire guards', deltas: { gold: -8, adventurers: -3 }, major: false, reputation: 5, chains: null, rumorText: 'Word spreads that your guild doesn\'t bow to street thugs.' },
    ],
  },
  {
    id: 'std-alchemist-deal',
    type: 'standard',
    npc: { emoji: '⚗️', name: 'Maeva the Alchemist', role: 'City Alchemist' },
    situation: 'An alchemist wants to run experiments on some of your equipment — temporarily. In return: upgraded gear when done.',
    choices: [
      { label: 'Agree', deltas: { equipment: -10 }, major: false, reputation: 0, chains: 'chain-alchemist-done', rumorText: null },
      { label: 'Decline', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-escaped-prisoner',
    type: 'standard',
    npc: { emoji: '⛓️', name: 'Escaped Prisoner', role: 'Fugitive' },
    situation: 'A shackled prisoner begs for sanctuary. She claims she was falsely convicted. The city watch will come asking.',
    choices: [
      { label: 'Hide her', deltas: { adventurers: 8, gold: -5 }, major: false, reputation: -5, chains: null, rumorText: 'Rumour has it someone is sheltering a fugitive near the guild district.' },
      { label: 'Turn her over', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-scholar-request',
    type: 'standard',
    npc: { emoji: '📚', name: 'Scholar Davin', role: 'University Researcher' },
    situation: 'A scholar needs an escort to a remote ruin for research. The pay is modest, but he promises useful maps of the region.',
    choices: [
      { label: 'Take the contract', deltas: { gold: 8, adventurers: -5, quests: 8 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Too low-paying', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
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
    id: 'std-guild-expansion',
    type: 'standard',
    npc: { emoji: '🏗️', name: 'Master Builder Oren', role: 'Construction Foreman' },
    situation: 'A builder proposes renovating your hall to fit more adventurers. Expensive, but your current space is cramped.',
    choices: [
      { label: 'Expand the hall', deltas: { gold: -20, adventurers: 20 }, major: true, reputation: 0, chains: null, rumorText: 'The hammering from the guild hall renovation can be heard across the district.' },
      { label: 'Not yet', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
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
    id: 'std-rival-smear',
    type: 'standard',
    npc: { emoji: '📣', name: 'Rival Guild Herald', role: 'Enemy Mouthpiece' },
    situation: 'A rival guild has been spreading lies about your guild\'s reliability in the market square. You can ignore it or fight back.',
    choices: [
      { label: 'Launch a counter-campaign', deltas: { gold: -12, quests: 10 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Ignore the noise', deltas: { quests: -5 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-haunted-job',
    type: 'standard',
    npc: { emoji: '👻', name: 'Superstitious Client', role: 'Spooked Merchant' },
    situation: 'A merchant\'s warehouse is "haunted" — his workers refuse to enter. Probably rats. Your people investigate for a small fee.',
    choices: [
      { label: 'Take the job', deltas: { gold: 10, adventurers: -3, quests: 5 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Too small a job', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
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
    id: 'std-veteran-retires',
    type: 'standard',
    npc: { emoji: '🧓', name: 'Old Garrus', role: 'Veteran Adventurer' },
    situation: 'One of your oldest members wants to retire. You could give him a generous sendoff, or try to convince him to stay on as an instructor.',
    choices: [
      { label: 'Generous sendoff', deltas: { gold: -10, adventurers: -5 }, major: false, reputation: 5, chains: null, rumorText: 'Old Garrus was seen at the docks, laughing with a tankard in his hand. He earned it.' },
      { label: 'Keep him as instructor', deltas: { gold: -5, adventurers: 10 }, major: false, reputation: 0, chains: null, rumorText: null },
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
    id: 'std-prison-break',
    type: 'standard',
    npc: { emoji: '🚔', name: 'City Warden Crale', role: 'Prison Authority' },
    situation: 'The city prison had a break-in — someone helped a prisoner escape. The warden suspects your guild. Cooperate with the investigation or stonewall it.',
    choices: [
      { label: 'Cooperate fully', deltas: { quests: -8 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Deny everything', deltas: {}, major: false, reputation: -5, chains: null, rumorText: 'The warden has been asking questions. Someone is talking.' },
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
    id: 'std-rumored-treasure',
    type: 'standard',
    npc: { emoji: '🪙', name: 'Excited Prospector', role: 'Amateur Treasure Hunter' },
    situation: 'A prospector claims to have found signs of a buried hoard. He wants your muscle; you split the take. High risk, potential windfall.',
    choices: [
      { label: 'Fund the dig', deltas: { gold: -8, adventurers: -8, equipment: -5 }, major: true, reputation: 0, chains: 'chain-treasure-dig', rumorText: 'A team was spotted heading north with shovels and high hopes.' },
      { label: 'Pass', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
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

// Chained cards — follow-up events triggered by choices above
export const chainedCards = [
  {
    id: 'chain-alchemist-done',
    type: 'chained',
    npc: { emoji: '⚗️', name: 'Maeva the Alchemist', role: 'City Alchemist' },
    situation: 'Maeva returns your equipment — reinforced, sharpened, treated with alchemical compounds. She looks satisfied.',
    choices: [
      { label: 'Accept the return', deltas: { equipment: 18 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Sell the upgraded gear', deltas: { gold: 15, equipment: 5 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'chain-treasure-dig',
    type: 'chained',
    npc: { emoji: '🪙', name: 'Exhausted Prospector', role: 'Amateur Treasure Hunter' },
    situation: 'Your team returns from the dig. The hoard was real — but smaller than expected. Still, everyone gets a cut.',
    choices: [
      { label: 'Share the windfall', deltas: { gold: 25, adventurers: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Keep the lion\'s share', deltas: { gold: 35 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'chain-tax-ignored',
    type: 'chained',
    npc: { emoji: '⚖️', name: 'City Bailiff', role: 'Law Enforcement' },
    situation: 'The city sent officers. Your guild is fined double for the missed declaration. Resistance is not advised.',
    choices: [
      { label: 'Pay the fine', deltas: { gold: -25 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Argue the case', deltas: { gold: -10, quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'chain-merc-healed',
    type: 'chained',
    npc: { emoji: '🩹', name: 'Sera Ironfoot', role: 'Recovered Mercenary' },
    situation: 'The mercenary you sheltered has recovered. She offers to join your roster properly — for a modest equipment cost.',
    choices: [
      { label: 'Welcome her in', deltas: { adventurers: 10, equipment: -8 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Wish her luck', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]
