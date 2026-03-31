export const criminalCards = [
  {
    id: 'std-rival-spy',
    type: 'standard',
    npc: { emoji: '🕵️', name: 'Unknown Figure', role: 'Suspicious Stranger' },
    situation: 'A stranger offers coin to "share" your client list. You suspect a rival guild is behind this.',
    choices: [
      { label: 'Take the coin', deltas: { gold: 20, quests: -18 }, major: true, reputation: -5, chains: null, rumorText: 'Some bridges burn slowly. This one is now smouldering.', resultText: 'The coin is clean enough to spend. The client list is not yours anymore, not really — but you already knew what you were selling.' },
      { label: 'Show them the door', deltas: { quests: -6, adventurers: 8 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'They find someone with fewer scruples. You hear about the job later. Your name isn\'t on it — and that turns out to matter.' },
    ],
  },
  {
    id: 'std-protection-racket',
    type: 'standard',
    npc: { emoji: '😤', name: 'Thieves\' Guild Enforcer', role: 'Street Muscle' },
    situation: 'A city gang demands monthly "protection" fees. Pay them off, or refuse and deal with the harassment.',
    choices: [
      { label: 'Pay the fee', deltas: { gold: -10, quests: 8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: 'Coin changes hands in an envelope, no receipt, no eye contact. Business continues as normal. That is the point.' },
      { label: 'Refuse and hire guards', deltas: { gold: -8, adventurers: 6 }, major: false, reputation: 5, chains: null, rumorText: 'Word spreads that your guild doesn\'t bow to street thugs.', resultText: 'Hired blades take up positions at the entrance and the harassment dries up within a week. It cost money, but the message lands cleanly.' },
    ],
  },
  {
    id: 'std-escaped-prisoner',
    type: 'standard',
    npc: { emoji: '⛓️', name: 'Escaped Prisoner', role: 'Fugitive' },
    situation: 'A shackled prisoner begs for sanctuary. She claims she was falsely convicted. The city watch will come asking.',
    choices: [
      { label: 'Hide her', deltas: { adventurers: 8, gold: -5 }, major: false, reputation: -5, chains: null, rumorText: 'Rumour has it someone is sheltering a fugitive near the guild district.', resultText: 'She sleeps in the back storeroom for three nights and leaves before dawn on the fourth. You never learn her name. She doesn\'t offer it.' },
      { label: 'Turn her over', deltas: { gold: 8, quests: -6 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'A watch officer collects her without ceremony. She doesn\'t look at you on the way out. The reward is correct and you spend it the same afternoon.' },
    ],
  },
  {
    id: 'std-prison-break',
    type: 'standard',
    npc: { emoji: '🚔', name: 'City Warden Crale', role: 'Prison Authority' },
    situation: 'The city prison had a break-in — someone helped a prisoner escape. The warden suspects your guild. Cooperate with the investigation or stonewall it.',
    choices: [
      { label: 'Cooperate fully', deltas: { quests: -8, gold: 6 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'You open the books, answer the questions, and send the warden away satisfied. A small finder\'s consideration follows — apparently cooperation has a price after all.' },
      { label: 'Deny everything', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: 'The warden has been asking questions. Someone is talking.', resultText: 'Warden Crale leaves unconvinced but empty-handed. For now, that\'s enough. He\'ll be back with better questions.' },
    ],
  },
  {
    id: 'std-rival-smear',
    type: 'standard',
    npc: { emoji: '📣', name: 'Rival Guild Herald', role: 'Enemy Mouthpiece' },
    situation: 'A rival guild has been spreading lies about your guild\'s reliability in the market square. You can ignore it or fight back.',
    choices: [
      { label: 'Launch a counter-campaign', deltas: { gold: -12, quests: 10 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'Criers, posted notices, a well-placed word at the merchant exchange. By week\'s end the rival guild\'s narrative has been drowned out and your name is back on top.' },
      { label: 'Ignore the noise', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'Silence, as a strategy, works poorly against a loud opponent. The rumours settle in where good information should be.' },
    ],
  },
  {
    id: 'std-haunted-job',
    type: 'standard',
    npc: { emoji: '👻', name: 'Superstitious Client', role: 'Spooked Merchant' },
    situation: 'A merchant\'s warehouse is "haunted" — his workers refuse to enter. Probably rats. Your people investigate for a small fee.',
    choices: [
      { label: 'Take the job', deltas: { gold: 10, adventurers: -8, quests: 3 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: 'Rats, mostly — plus a hidden crawl space someone had been using for purposes the merchant didn\'t ask about. Your people clear it out and collect the fee without ceremony.' },
      { label: 'Too small a job', deltas: { quests: -8, equipment: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: 'Beneath all the superstitious hand-wringing, there was usable gear in that warehouse. Someone else takes the job and you make arrangements to relieve them of what they find.' },
    ],
  },
  {
    id: 'std-smuggler-route',
    type: 'standard',
    npc: { emoji: '🚢', name: 'Dockmaster Pellin', role: 'Corrupt Harbor Official' },
    situation: 'A dockmaster offers you a cut of a smuggling operation — exotic goods, no questions asked. The money is good, but the city guard has been tightening its net at the harbor.',
    choices: [
      { label: 'Take the cut', deltas: { gold: 20, quests: -10, adventurers: -8 }, major: false, reputation: -8, chains: null, rumorText: 'Dockside whispers say someone is moving untaxed goods through the harbor district.', resultText: 'Exotic goods flow through the back channels and coin flows the other way. Pellin handles the manifests. You handle looking unconcerned.' },
      { label: 'Report it to the watch', deltas: { quests: 8, gold: -5 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: 'You hand over enough detail to bury the operation without burying yourself. The watch is grateful. Pellin will find out eventually — but that\'s his problem.' },
    ],
  },
  {
    id: 'std-witness-silence',
    type: 'standard',
    npc: { emoji: '👁️', name: 'Nervous Witness Bram', role: 'Reluctant Informant' },
    situation: 'A frightened man witnessed a Thieves\' Guild assassination and wants your guild to help him disappear before the killers find him. Sheltering him will cost resources — and make you an enemy.',
    choices: [
      { label: 'Set him up with a safe house', deltas: { gold: -15, adventurers: -5, quests: 15 }, major: false, reputation: 8, chains: null, rumorText: 'Someone is hiding a witness. The guild killers are asking around.', resultText: 'Bram disappears into a quiet room above a tannery three streets over. Your people rotate the watch. Word reaches the court and the testimony sticks — at a cost.' },
      { label: 'Turn him away', deltas: { quests: -8, equipment: 6 }, major: false, reputation: -8, chains: null, rumorText: null, resultText: 'He goes, and whatever happens to him after isn\'t your responsibility. The freed attention gets spent on something more tangible.' },
    ],
    factions: { 'thieves-guild': 'hostile' },
  },
  {
    id: 'std-gang-war',
    type: 'standard',
    npc: { emoji: '⚔️', name: 'Scar-faced Lena', role: 'Gang Lieutenant' },
    situation: 'Two rival street gangs are going to war over territory that runs right past your guild hall. Both sides want you to stay neutral — and both have threatened consequences if you don\'t pick their side.',
    choices: [
      { label: 'Back the Ironhands', deltas: { gold: 15, adventurers: -8, quests: -10 }, major: true, reputation: -5, chains: null, rumorText: 'The guild has thrown in with the Ironhands. The Ash Dogs won\'t forget.', resultText: 'Your people hold the flank, the Ironhands win the block, and the payment arrives with a handshake. The Ash Dogs are still out there. They have a long memory.' },
      { label: 'Declare strict neutrality', deltas: { gold: -10, quests: 8 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'Staying out costs coin in precautions and a few skittish clients, but when the dust settles both gangs still need someone neutral to deal with. That turns out to be worth something.' },
    ],
  },
  {
    id: 'std-corrupt-magistrate',
    type: 'standard',
    npc: { emoji: '⚖️', name: 'Magistrate Harrow', role: 'Bent Judge' },
    situation: 'A city magistrate is openly extorting merchants for favorable rulings. One of those merchants is a steady quest-giver of yours. You could bribe Harrow to back off, expose him, or use the information for leverage.',
    choices: [
      { label: 'Expose him to the city council', deltas: { quests: 8, gold: -5 }, major: false, reputation: 12, chains: null, rumorText: 'A magistrate is being investigated. Someone fed the council some very detailed evidence.', resultText: 'The evidence is packaged carefully and delivered anonymously. Harrow is suspended pending inquiry, and your merchant client breathes again. It cost something to move that carefully.' },
      { label: 'Quietly blackmail Harrow yourself', deltas: { gold: 15, quests: -12 }, major: false, reputation: -10, chains: null, rumorText: null, resultText: 'A private word, a sealed envelope, a polite suggestion. Harrow pays and doesn\'t push back. You now own a piece of a corrupt magistrate — which is either an asset or a problem, depending on the week.' },
    ],
  },
  {
    id: 'std-pit-fight-ring',
    type: 'standard',
    npc: { emoji: '🥊', name: 'Promoter Dox', role: 'Underground Fight Organizer' },
    situation: 'An underground fighting ring wants to recruit one of your seasoned adventurers as a pit fighter. The pay is excellent, but injuries are common and the city watch occasionally raids the venue.',
    choices: [
      { label: 'Let them fight for the money', deltas: { gold: 18, adventurers: -15 }, major: false, reputation: -5, chains: null, rumorText: 'One of the guild\'s fighters has been seen bleeding in a back-alley arena.', resultText: 'They come back with coin and a collection of new bruises. How they feel about the arrangement, they don\'t say. The purse is real.' },
      { label: 'Invest in the ring itself', deltas: { gold: -20, quests: 18 }, major: false, reputation: -8, chains: null, rumorText: 'Word is the guild has money in the pit fights now.', resultText: 'Promoter Dox takes the investment and the operation doubles in size. Contracts flow from the new clientele. The watch knows where the money is — they just can\'t prove it.' },
    ],
  },
  {
    id: 'std-blackmail-ledger',
    type: 'standard',
    npc: { emoji: '📒', name: 'Forger Silas', role: 'Information Broker' },
    situation: 'A broker offers you a ledger containing damaging secrets about several noble houses. The price is steep, but the leverage could be invaluable — or catastrophically backfire.',
    choices: [
      { label: 'Buy the ledger', deltas: { gold: -22, quests: 18 }, major: true, reputation: -5, chains: null, rumorText: 'Rumour has it a certain guild has been making very bold requests of the nobility lately.', resultText: 'Silas delivers a leather-bound volume of quiet devastations. You read it carefully and start making very polite requests of people who are used to saying no.' },
      { label: 'Pass — too dangerous', deltas: { quests: -6, gold: 8 }, major: false, reputation: 3, chains: null, rumorText: null, resultText: 'Walking away from leverage that volatile is its own kind of discipline. You redirect the funds into steadier returns, and sleep without wondering who else has a copy.' },
    ],
  },
  {
    id: 'std-counterfeit-coin',
    type: 'standard',
    npc: { emoji: '🪙', name: 'Minter Voss', role: 'Counterfeit Coinsmith' },
    situation: 'Someone has been paying your guild in expertly faked silver — and your quartermaster only just noticed. You can trace it back to a small counterfeit operation. Turn them in, demand compensation, or quietly pass the fake coins along.',
    choices: [
      { label: 'Demand compensation from the forger', deltas: { gold: 15, quests: -12 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: 'Voss looks pained but pays. Real coin this time, counted twice. Some of those contracts go cold while the situation is quietly sorted, but you end up ahead.' },
      { label: 'Report the operation to the mint', deltas: { quests: 8, gold: -5 }, major: false, reputation: 10, chains: null, rumorText: 'A counterfeiting ring was broken up. The tip came from somewhere.', resultText: 'Mint inspectors arrive within two days. Voss and his press vanish; the operation doesn\'t. You file the report at a small net loss, but the goodwill from the merchant quarter is real.' },
    ],
  },
  {
    id: 'std-guild-informant',
    type: 'standard',
    npc: { emoji: '🤫', name: 'Snitch Torren', role: 'City Watch Informant' },
    situation: 'You discover one of your newer adventurers has been feeding information to the city watch. He claims he was coerced. The watch now has partial details about two active guild operations.',
    choices: [
      { label: 'Dismiss him and go quiet', deltas: { adventurers: -5, quests: -8, equipment: 8 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'Torren is shown out before noon and two active operations go dark for the season. The recovered gear does not make up for the lost work — but a quiet guild is harder to hand documents about.' },
      { label: 'Turn him into a double agent', deltas: { adventurers: -3, quests: 10, gold: -5 }, major: false, reputation: -5, chains: null, rumorText: 'The watch thinks it has a source inside the guild. They might be wrong.', resultText: 'Feeding controlled nonsense to the watch costs money and one more set of nervous eyes in the hall. The contracts that follow are worth it. Torren looks like a man who has stopped sleeping.' },
    ],
  },
  {
    id: 'std-pickpocket-ring',
    type: 'standard',
    npc: { emoji: '✋', name: 'Fingersmith Nell', role: 'Pickpocket Boss' },
    situation: 'A pickpocket ring operating near your guild is scooping coins from your own clients. You could shut them down, absorb them into your operation, or cut a deal with their boss.',
    choices: [
      { label: 'Absorb the ring into the guild', deltas: { adventurers: 8, gold: -10 }, major: false, reputation: -5, chains: null, rumorText: 'The guild seems to have a new crowd of street-level contacts.', resultText: "Nell's crew comes in carrying light fingers and lighter loyalties. The buyout empties a modest purse, and the neighbourhood's impression of you quietly shifts — but the guild has ears in places it didn't before." },
      { label: 'Shut them down hard', deltas: { adventurers: -8, quests: 6 }, major: false, reputation: 8, chains: null, rumorText: 'The pickpockets near the guild district have gone quiet.', resultText: 'Within a week the corner is empty and word travels ahead of itself. Some good fighters went into that job and came out walking funny, but the clients notice the silence and call it safety.' },
    ],
    factions: { 'thieves-guild': 'neutral' },
  },
  {
    id: 'std-contraband-cache',
    type: 'standard',
    npc: { emoji: '📦', name: 'Panicked Porter', role: 'Accidental Courier' },
    situation: 'One of your guild members accidentally received a shipment meant for someone else — crates packed with illicit alchemical substances. The original buyer will come looking. So will the watch.',
    choices: [
      { label: 'Sell the goods quickly', deltas: { gold: 22, quests: -18 }, major: false, reputation: -10, chains: null, rumorText: 'Someone moved a suspicious shipment through the market last night. Very quickly.', resultText: 'Gone by nightfall — buyers, crates, and any paper trail that might connect them to your loading dock. The coin is good. The speed required to earn it tells you everything about the risk.' },
      { label: 'Hold them and negotiate a finder\'s fee', deltas: { gold: 12, adventurers: -8 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'Three tense days with unmarked crates in the back and two of your people watching the door. The original buyer pays the fee without argument, which means it was not nearly high enough.' },
    ],
  },
  {
    id: 'std-thieves-guild-pact',
    type: 'standard',
    npc: { emoji: '🗝️', name: 'Guildmaster Shade', role: 'Thieves\' Guild Leader' },
    situation: 'The Thieves\' Guild proposes a formal arrangement: they handle the city\'s shadow economy, you handle contracts and muscle. Shared contacts, shared profits — and shared heat from the watch.',
    choices: [
      { label: 'Sign the pact', deltas: { gold: 15, quests: 12, adventurers: -8, equipment: -15 }, major: true, reputation: -10, chains: null, rumorText: 'The guild has gone into business with some very shady partners, they say.', resultText: 'Shade sets a ring on the table and you set one beside it. The arrangement is now real. Shared contacts, shared income, shared enemies — and the watch starts paying attention to your roof line.' },
      { label: 'Decline entirely', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: 8, chains: null, rumorText: null, resultText: 'Shade nods once, folds his hands, and leaves. Turning down the Thieves\' Guild costs you nothing today. What it costs you next season is a different question.' },
    ],
    factions: { 'thieves-guild': 'allied' },
  },
  {
    id: 'std-undercover-op',
    type: 'standard',
    npc: { emoji: '🎭', name: 'Agent Mira', role: 'Undercover Watch Officer' },
    situation: 'A watch officer approaches in secret: she wants to embed herself in your guild as a regular adventurer to gather evidence on a crime lord. In exchange: immunity for two past guild incidents on the record.',
    choices: [
      { label: 'Accept the arrangement', deltas: { quests: 12, adventurers: -5, gold: -5 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'Agent Mira joins the roster under a false name and does the work convincingly. Two old incidents vanish from the ledger. Your people like her, which is probably the point.' },
      { label: 'Warn the crime lord for a price', deltas: { gold: 20, quests: -18 }, major: false, reputation: -12, chains: null, rumorText: 'Someone tipped off a major criminal. The watch operation collapsed overnight.', resultText: 'A sealed note, a discreet delivery, and a chest of coin arrives the following morning. Mira\'s cover burns before she sets foot through the door. Her superiors will want to know how.' },
    ],
  },
  {
    id: 'std-safe-house-request',
    type: 'standard',
    npc: { emoji: '🏚️', name: 'Courier Dain', role: 'Fugitive Middleman' },
    situation: 'A middleman asks you to rent out a disused guild storage room as a safe house for a week. He won\'t say who it\'s for. The coin offered is generous, and questions are clearly unwelcome.',
    choices: [
      { label: 'Rent the room, no questions', deltas: { gold: 18, quests: -15 }, major: false, reputation: -8, chains: null, rumorText: 'Strange faces have been going in and out of the guild\'s back entrance at odd hours.', resultText: 'You collect the coin, hand over the key, and ask nothing. Seven days later the room is empty again, the lock is intact, and what happened inside is someone else\'s story.' },
      { label: 'Agree but have someone watch who uses it', deltas: { gold: 12, adventurers: -5, quests: -5 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'One of your people keeps an eye on the door and reports back in fragments. Whoever used the room was careful, numerous, and gone before anyone could put a name to a face. You know slightly more than you did, and none of it is comfortable.' },
    ],
  },
  {
    id: 'std-heist-invitation',
    type: 'standard',
    npc: { emoji: '💎', name: 'Maestro Croft', role: 'Master Thief' },
    situation: 'A legendary thief invites your guild to provide cover for a heist on a noble\'s vault — your people create the distraction, he does the actual theft, and you split whatever is inside. High reward, high risk.',
    choices: [
      { label: 'Provide the distraction crew', deltas: { gold: 25, adventurers: -10, quests: -8, equipment: -5 }, major: true, reputation: -10, chains: null, rumorText: 'Lord Vayne\'s vault was robbed during a very convenient street brawl. Questions are being asked.', resultText: 'Your people start a very convincing brawl on the street below while Croft disappears through the service entrance. The split arrives in three instalments, as agreed. Lord Vayne\'s investigators are still working outward from the wrong suspect.' },
      { label: 'Tip off the noble and pocket a reward instead', deltas: { gold: 15, quests: -12 }, major: false, reputation: 8, chains: null, rumorText: 'The heist never happened. Croft is furious and looking for whoever talked.', resultText: 'Lord Vayne pays promptly and with visible relief. Croft walks into an ambush and escapes, which means he is still alive and actively narrowing down who sold him out. The reward spends fine.' },
    ],
    factions: { 'thieves-guild': 'neutral' },
  },
]
