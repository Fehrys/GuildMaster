export const merchantCards = [
  {
    id: 'std-equipment-merchant',
    type: 'standard',
    npc: { emoji: '⚒️', name: 'Greta the Ironmonger', role: 'Equipment Merchant' },
    situation: 'A travelling merchant offers a bulk deal on arms and armour. Quality is good, price is fair — but it cleans out your stock budget.',
    choices: [
      { label: 'Buy the lot', deltas: { gold: -20, equipment: 18 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Greta's wagon is empty by midday and your armoury is considerably fuller. The ledger takes a hit you'll feel for a while, but your people won't be going out under-equipped." },
      { label: 'Pass', deltas: { quests: -6, gold: 8 }, major: false, reputation: 0, chains: null, rumorText: 'The merchant sold to your rival guild instead.', resultText: "Coin stays in the treasury, but so does the gap in your stores. Word reaches you by week's end that the rival guild snapped up the lot without blinking." },
    ],
  },
  {
    id: 'std-unhappy-client',
    type: 'standard',
    npc: { emoji: '😠', name: 'Merchant Peldan', role: 'Disgruntled Client' },
    situation: 'A merchant returns furious — the quest your guild completed left his cargo damaged. He demands compensation.',
    choices: [
      { label: 'Compensate him', deltas: { gold: -15, quests: 12 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Peldan leaves with a purse you'd rather have kept. He also leaves with a better opinion of you — and a fresh batch of contracts that quietly makes up the difference." },
      { label: 'Refuse', deltas: { quests: -15, adventurers: 10 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "He storms out and doesn't come back. Several jobs he had lined up go with him, and your people spend an idle few weeks hearing about it from everyone except you." },
    ],
  },
  {
    id: 'std-caravan-escort',
    type: 'standard',
    npc: { emoji: '🐪', name: 'Merchant Consortium', role: 'Trade Guild' },
    situation: 'A wealthy trade consortium needs a full escort across dangerous roads. High pay, high cost in manpower.',
    choices: [
      { label: 'Take the contract', deltas: { gold: 25, adventurers: -18, equipment: -5 }, major: true, reputation: 5, chains: null, rumorText: null, resultText: "Most of your roster rides out heavy and comes back lighter — gear worn, tempers frayed, purses full. The consortium pays exactly what was agreed, which is more than most clients manage." },
      { label: 'Decline', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: 'The consortium hired another guild. Word gets around who turns down high-profile work.', resultText: "Your people stay rested, and the work goes to someone else. The consortium's name comes up twice in the next month — both times attached to a guild that isn't yours." },
    ],
  },
  {
    id: 'std-bad-batch',
    type: 'standard',
    npc: { emoji: '⚙️', name: 'Outfitter Hess', role: 'Equipment Supplier' },
    situation: 'Your regular supplier admits the last batch of gear was defective. He\'ll replace half — but you\'re owed an apology and a refund.',
    choices: [
      { label: 'Accept partial replacement', deltas: { equipment: 10, quests: -8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Hess sends over replacement stock without argument, which is the most you were going to get. Half a resolution is what it is — your quartermaster logs it and moves on." },
      { label: 'Demand full refund', deltas: { gold: 10, equipment: -10 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "After two letters and a terse meeting, the coin arrives. Your stores are thinner for it, but at least the books balance where they're supposed to." },
    ],
  },
  {
    id: 'std-abandoned-supplies',
    type: 'standard',
    npc: { emoji: '📦', name: 'Scavenger Crew', role: 'Freelance Salvagers' },
    situation: 'Scavengers found a cache of arms abandoned in the forest — origin unknown. They\'ll sell cheap. Might be stolen, might be cursed, might be a windfall.',
    choices: [
      { label: 'Buy the cache', deltas: { gold: -10, equipment: 15 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Nobody asks too many questions when the cargo arrives clean and in decent condition. Whatever history the arms carry, they work fine — your armoury is the better for it." },
      { label: 'Leave it', deltas: { quests: -6, gold: 8 }, major: false, reputation: 0, chains: null, rumorText: 'The scavengers sold the cache to another buyer by morning.', resultText: "Prudent, probably. The coin you'd have spent stays where it is, and you hear by nightfall that someone else took the risk instead." },
    ],
  },
  {
    id: 'std-debt-collection',
    type: 'standard',
    npc: { emoji: '💼', name: 'Moneylender Vas', role: 'City Creditor' },
    situation: 'A moneylender wants you to collect a debt from a struggling family — not violent, just persuasive. The pay is good but the work is grim.',
    choices: [
      { label: 'Take the job', deltas: { gold: 15, quests: -12 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "The work is exactly as unpleasant as advertised. Your people do it without incident, collect the fee, and say very little about what was said at the door." },
      { label: 'Refuse', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Vas takes his business elsewhere. The word that spreads isn't bad — some debts, apparently, are beneath you." },
    ],
  },
  {
    id: 'std-fence',
    type: 'standard',
    npc: { emoji: '🕶️', name: 'Aldis Greyhand', role: 'Black Market Dealer' },
    situation: 'A shady contact offers discounted arms — clearly stolen, but functional. Cheap equipment, high risk.',
    choices: [
      { label: 'Buy anyway', deltas: { gold: -8, equipment: 12 }, major: false, reputation: -5, chains: null, rumorText: 'Some of your new equipment has unfamiliar maker\'s marks on it.', resultText: "Functional gear at a price that raises no questions — until someone notices the maker's marks don't match any forge in the city. You tell them not to look too closely." },
      { label: 'Refuse', deltas: { equipment: -6, gold: 8 }, major: false, reputation: 3, chains: null, rumorText: null, resultText: "Greyhand shrugs and moves on. You pass up the deal and a small, clean reputation follows — at least among the people who were watching." },
    ],
  },
  {
    id: 'std-rumored-treasure',
    type: 'standard',
    npc: { emoji: '🪙', name: 'Excited Prospector', role: 'Amateur Treasure Hunter' },
    situation: 'A prospector claims to have found signs of a buried hoard. He wants your muscle; you split the take. High risk, potential windfall.',
    choices: [
      { label: 'Fund the dig', deltas: { gold: -8, adventurers: -8, equipment: 12 }, major: true, reputation: 0, chains: 'chain-treasure-dig', rumorText: 'A team was spotted heading north with shovels and high hopes.', resultText: "A team goes north with shovels, coin, and the prospector's hopeful maps. What comes back fills the armoury better than expected — though nobody's quite sure what the original hoard was." },
      { label: 'Pass', deltas: { quests: -6, gold: 8 }, major: false, reputation: 0, chains: null, rumorText: 'Word spread you turned down the dig. Some think you know something.', resultText: "You keep the coin and let someone else chase the rumour. Fewer contracts come your way in the days that follow — apparently the prospector had more pull than he looked." },
    ],
  },
  {
    id: 'std-caravan-ambush-warning',
    type: 'standard',
    npc: { emoji: '🛤️', name: 'Darro Whitepath', role: 'Caravan Master' },
    situation: 'A caravan master warns you that his next route passes through bandit territory. He asks your guild to send scouts ahead — modest pay, but he\'ll remember the favour.',
    choices: [
      { label: 'Send scouts', deltas: { gold: 8, adventurers: -5 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: "A small team rides ahead, clears the intelligence, and Whitepath's caravan rolls through without incident. He remembers the favour in exactly the way you hoped he would." },
      { label: 'Offer a full armed escort instead', deltas: { gold: 18, adventurers: -15 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "More people out than the job strictly required, but the pay reflects it. The caravan arrives intact and Whitepath tips generously — he's the kind of man who knows what muscle costs." },
    ],
  },
  {
    id: 'std-rare-spice-shipment',
    type: 'standard',
    npc: { emoji: '🌶️', name: 'Serafine Duskhollow', role: 'Exotic Goods Importer' },
    situation: 'A trader from the southern ports has docked with rare spices — the kind nobles pay fortunes for. She\'ll sell your guild a resale stake at a steep upfront cost.',
    choices: [
      { label: 'Buy a resale stake', deltas: { gold: -20, quests: 18 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "The upfront cost stings, but Serafine's contacts open doors your guild hasn't reached before. Noble clients follow the spice, and the contracts arrive with them." },
      { label: 'Negotiate a smaller cut', deltas: { gold: -8, quests: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Less committed, less exposed — the deal earns modestly and Serafine moves on without ceremony. You got what you paid for, which is more or less what you expected." },
    ],
  },
  {
    id: 'std-trade-dispute',
    type: 'standard',
    npc: { emoji: '⚖️', name: 'Arbiter Holken', role: 'Trade Court Mediator' },
    situation: 'Two merchant houses are locked in a bitter dispute over a warehouse fire. Both want your guild to arbitrate — whoever you side with will owe you a debt, and the other will hold a grudge.',
    choices: [
      { label: 'Side with the larger house', deltas: { gold: 12, quests: -8 }, major: false, reputation: -5, chains: null, rumorText: 'Word is the guild chose coin over principle.', resultText: "The ruling goes the way the bigger ledger wanted. Payment arrives promptly, as powerful clients tend to ensure. The smaller house stops sending work your way, which is not a coincidence." },
      { label: 'Side with the smaller house', deltas: { gold: -5, quests: 8 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: "You rule against the money and for the principle. The smaller house can barely afford to thank you, but they do — enthusiastically, and with every job they have." },
    ],
  },
  {
    id: 'std-supply-shortage',
    type: 'standard',
    npc: { emoji: '📉', name: 'Outfitter Brenn', role: 'Supply Broker' },
    situation: 'A road collapse has cut off your primary equipment supplier for two weeks. Brenn can source replacements from a rival supplier — at a 30% markup.',
    choices: [
      { label: 'Pay the markup', deltas: { gold: -18, equipment: 15 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Brenn's alternative supplier charges every coin of his thirty percent and acts like he's doing you a favour. The supplies arrive on time, which is the only good thing to say about the transaction." },
      { label: 'Send adventurers to clear the road', deltas: { adventurers: -6, equipment: 8 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Your people clear the blockage in two days and the original supplier resumes deliveries within the week. Roundabout way to get your own shipment, but cheaper — and your name is now attached to the fix." },
    ],
  },
  {
    id: 'std-foreign-merchant-guild',
    type: 'standard',
    npc: { emoji: '🌍', name: 'Envoy Rashida Khalvon', role: 'Foreign Trade Delegate' },
    situation: 'A delegate from a distant merchant confederation proposes a formal trade agreement — they\'ll supply discounted exotic equipment, but expect your guild to guarantee safe passage for their caravans.',
    choices: [
      { label: 'Sign the agreement', deltas: { equipment: 15, adventurers: -12 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Regular escorts keep your people on the road and the exotic equipment flowing in. Khalvon's confederation proves reliable — their gear is unusual, well-made, and draws comments at the armoury." },
      { label: 'Counter-offer: equipment only, no commitment', deltas: { equipment: 8, gold: -5 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "Khalvon accepts the counter with visible disappointment and less enthusiasm than you'd like. You pay more than the original rate for less supply — the leverage was hers to begin with." },
    ],
  },
  {
    id: 'std-market-crash',
    type: 'standard',
    npc: { emoji: '📊', name: 'Investor Torvan', role: 'Market Speculator' },
    situation: 'The city\'s grain futures have collapsed overnight. Torvan says some guilds saw it coming and shorted the market — he hints your guild could profit from the chaos if you act fast.',
    choices: [
      { label: 'Speculate on the crash', deltas: { gold: 25, quests: -22 }, major: false, reputation: -10, chains: null, rumorText: 'Rumours fly that some guilds profited suspiciously from the grain crash.', resultText: "The trades close fast and the returns are significant. Your treasurer notes the figures without expression. Outside, the grain stalls are empty and people are asking questions nobody wants to answer." },
      { label: 'Donate surplus gold to food relief', deltas: { gold: -12, quests: 10 }, major: false, reputation: 15, chains: null, rumorText: null, resultText: "Torvan looks baffled; half the city looks grateful. Contracts follow from quarters you'd never have reached otherwise — it turns out a visible act of decency is worth more than a short position in grain." },
    ],
  },
  {
    id: 'std-smuggling-offer',
    type: 'standard',
    npc: { emoji: '🚢', name: 'Captain Lirenne Voss', role: 'Ship Captain' },
    situation: 'A ship captain asks your guild to warehouse "unregistered cargo" for three nights — no questions asked. The fee is generous, but the city watch has been patrolling the docks.',
    choices: [
      { label: 'Take the deal', deltas: { gold: 20, quests: -18 }, major: false, reputation: -10, chains: null, rumorText: 'Strange crates were seen being moved into the guild hall after dark.', resultText: "Three nights of careful movement and held breath, then Voss collects her cargo before dawn. The fee is generous. Your people stop talking about those nights, which is the right instinct." },
      { label: 'Report it to the watch', deltas: { quests: 8, gold: -5 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: "Voss is gone before the watch arrives, but the tip is noted and the guild's name goes down as cooperative. Work from the port authority follows quietly — not glamorous, but steady." },
    ],
  },
  {
    id: 'std-bidding-war',
    type: 'standard',
    npc: { emoji: '🏷️', name: 'Auctioneer Melas', role: 'Guild Auction House' },
    situation: 'A rare lot of masterwork weapons has come to auction. Two rival guilds are bidding against each other — and against you. Winning means excellent equipment; losing means watching your rivals gear up.',
    choices: [
      { label: 'Bid aggressively', deltas: { gold: -22, equipment: 18 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "You outbid them both and walk out with the lot. The masterwork pieces are everything the auctioneer claimed, and the look on your rivals' faces is a secondary dividend." },
      { label: 'Place a modest bid', deltas: { gold: -10, equipment: 8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "You don't win the lot, but you don't leave empty-handed either — a few pieces fall your way when the main bidding drives the price past your ceiling. Serviceable outcome." },
    ],
  },
  {
    id: 'std-trade-route-disruption',
    type: 'standard',
    npc: { emoji: '🗺️', name: 'Merchant Syndara', role: 'Overland Trader' },
    situation: 'Monster activity has closed the eastern trade road for a week. Syndara needs an alternate route scouted and, if possible, cleared. The pay is tied to how fast your people can do it.',
    choices: [
      { label: 'Scout a new route (fast)', deltas: { gold: 15, adventurers: -12 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Your scouts find a workable path within two days and Syndara's caravan moves. She pays by speed, as promised, and the new route gets used by three other merchants before the week is out." },
      { label: 'Clear the original road instead', deltas: { gold: 15, adventurers: -14, equipment: -5 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: "Harder work, more gear spent, but the eastern road is open again — and everyone who uses it knows who cleared it. Syndara pays the same rate and the goodwill is worth considerably more." },
    ],
  },
  {
    id: 'std-currency-debasement',
    type: 'standard',
    npc: { emoji: '💰', name: 'Banker Orveth', role: 'Royal Mint Agent' },
    situation: 'The crown has quietly debased its coinage — your guild\'s treasury is worth less than it was yesterday. Orveth offers a scheme to convert your gold into foreign currency before the news becomes public.',
    choices: [
      { label: 'Convert gold now', deltas: { gold: -15, equipment: 12 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Orveth moves fast and the conversion goes through before the announcement reaches the markets. What you lose in liquidity comes back in foreign goods — your treasurer calls it even. Barely." },
      { label: 'Report the insider tip to the magistrate', deltas: { gold: -8, quests: 6 }, major: false, reputation: 12, chains: null, rumorText: 'The guild refused to profit from royal financial manipulation.', resultText: "You take the treasury hit that everyone else takes and hand Orveth's tip to the magistrate. Word gets out that you could have profited and didn't — a rare fact, and one people remember." },
    ],
  },
  {
    id: 'std-warehouse-fire',
    type: 'standard',
    npc: { emoji: '🔥', name: 'Factor Gennick', role: 'Warehouse Manager' },
    situation: 'A fire has gutted a key city warehouse — your guild\'s stored equipment took losses. Gennick suspects arson and points to a rival trading house. You can investigate or cut your losses.',
    choices: [
      { label: 'Investigate the arson', deltas: { adventurers: -5, quests: 8 }, major: false, reputation: 8, chains: 'chain-arson-investigation', rumorText: null, resultText: "Your people dig into the fire's origins and find enough to push the inquiry forward. The rival trading house starts receiving visitors from the magistrate's office. This isn't over." },
      { label: 'Accept the loss and move on', deltas: { equipment: -12, gold: 8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Insurance pays out a fraction of the loss and you write the rest off the ledger. Gennick looks relieved that you're not making it worse. Whether someone got away with arson remains an open question." },
    ],
  },
  {
    id: 'std-investment-opportunity',
    type: 'standard',
    npc: { emoji: '🏗️', name: 'Developer Yssara', role: 'Real Estate Investor' },
    situation: 'A developer is building a new trade district and pitches your guild as an early investor. Returns will take months, but the location is prime. It\'s a long game.',
    choices: [
      { label: 'Invest heavily', deltas: { gold: -20, quests: 15 }, major: true, reputation: 5, chains: null, rumorText: null, resultText: "A significant sum goes into the ground before the foundations are laid. Yssara sends quarterly reports that are relentlessly optimistic — and so far, the contracts filtering through the new district are proving her right." },
      { label: 'Invest modestly', deltas: { gold: -10, quests: 8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Small stake, small returns — the district grows without your name attached to it in any meaningful way. Work trickles through, which is all you paid for." },
    ],
  },
  {
    id: 'std-merchant-guild-politics',
    type: 'standard',
    npc: { emoji: '🏛️', name: 'Guildmaster Parveth', role: 'Merchant Guild Head' },
    situation: 'The city\'s merchant guild is electing a new leader. The reformist candidate wants lower tariffs; the incumbent wants stability. Both ask for your guild\'s public endorsement.',
    choices: [
      { label: 'Endorse the reformist', deltas: { quests: 10, gold: -8 }, major: false, reputation: -5, chains: null, rumorText: 'The guild has thrown its weight behind the reformist merchant faction.', resultText: "Backing the reformist costs something in the short term — the established merchant houses close their doors a little tighter. But lower tariffs, if they pass, will matter more than those doors." },
      { label: 'Endorse the incumbent', deltas: { quests: 8, gold: -5 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Stability is what the established houses want, and your endorsement delivers it. Parveth nods once at the next meeting, and the work that follows is the kind that comes from connections, not competition." },
    ],
  },
  {
    id: 'std-exotic-creature-import',
    type: 'standard',
    npc: { emoji: '🦎', name: 'Zoologist Fenna Marsh', role: 'Exotic Animal Trader' },
    situation: 'A trader has imported a caged wyvern hatchling — highly illegal, extraordinarily valuable. She asks your guild to quietly arrange its transfer to a private buyer outside the city.',
    choices: [
      { label: 'Handle the transfer', deltas: { gold: 18, adventurers: -10, quests: -5 }, major: false, reputation: -8, chains: null, rumorText: 'Strange growling sounds were heard from the guild\'s stable last night.', resultText: "Ten of your people spend a nerve-shredding two days keeping a hatchling wyvern quiet in the back stable. It leaves before anyone important notices. The fee is very good. Nobody speaks of it." },
      { label: 'Report the illegal import', deltas: { quests: 8, gold: -5 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: "Marsh and her cargo vanish before the city wardens arrive, but your report goes on record and earns the right kind of attention. Contracts from the warden's district start appearing on the board." },
    ],
  },
  {
    id: 'std-overdue-shipment',
    type: 'standard',
    npc: { emoji: '⏳', name: 'Factor Imriell', role: 'Logistics Coordinator' },
    situation: 'A critical equipment shipment is three days overdue. The factor suspects either bandit interference or an incompetent shipping agent. He needs someone to find out which — and recover the goods if possible.',
    choices: [
      { label: 'Send a search party', deltas: { adventurers: -10, equipment: 14 }, major: false, reputation: 8, chains: null, rumorText: null, resultText: "It was bandits. Your people handle them efficiently, recover most of the shipment, and bring it back with less fuss than the original shipping agent would have managed. Imriell makes a note." },
      { label: 'Buy replacement stock locally', deltas: { gold: -15, equipment: 12 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Local markets cover the gap at a price that hurts the budget but keeps operations running. Wherever the original shipment went, you're not waiting around to find out." },
    ],
  },
  {
    id: 'std-travelling-peddler-windfall',
    type: 'standard',
    npc: { emoji: '🎒', name: 'Old Morwith', role: 'Wandering Peddler' },
    situation: 'A weathered old peddler rolls into the guild hall with a cartload of odds and ends — second-hand weapons, old maps, mysterious trinkets. He\'s selling the whole cart for a flat rate before nightfall.',
    choices: [
      { label: 'Buy the whole cart', deltas: { gold: -10, equipment: 8, quests: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Old Morwith rolls out lighter and happier. Half of what you bought turns out to be useful — a few weapons worth keeping and a pair of maps that lead somewhere your board had already marked as interesting." },
      { label: 'Haggle for just the weapons', deltas: { gold: -5, equipment: 8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Morwith throws in a story about where the weapons came from — unprovable but entertaining. The gear itself is solid, and the rest of the cart was probably junk anyway." },
    ],
  },
  {
    id: 'std-temple-trade-contract',
    type: 'standard',
    npc: { emoji: '⛪', name: 'Steward Aldric', role: 'Temple Quartermaster' },
    situation: 'The city\'s main temple is tendering out its annual supply contract — pilgrimage supplies, candles, and provisions. A modest but steady job, and the temple\'s favour opens other doors.',
    choices: [
      { label: 'Bid for the contract', deltas: { gold: 8, quests: -5 }, major: false, reputation: 8, chains: null, rumorText: null, factions: { 'temple': 'allied' }, resultText: "Candles and pilgrim provisions aren't glamorous cargo, but the temple pays on time and the steward introduces you to people who don't usually speak to adventuring guilds. Steady work, useful contacts." },
      { label: 'Skip it — not worth the admin', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "Paperwork avoided, opportunity missed — the temple contract goes to a competitor who now has a quiet line into the city's religious institutions. Your people are rested, for what that's worth." },
    ],
  },
]
