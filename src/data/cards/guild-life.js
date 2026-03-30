export const guildLifeCards = [
  {
    id: 'std-wounded-merc',
    type: 'standard',
    npc: { emoji: '🩹', name: 'A Wounded Mercenary', role: 'Wandering Sword' },
    situation: 'A battered mercenary collapses at your door. She asks only for a place to rest and heal. It will cost nothing but space.',
    choices: [
      { label: 'Take her in', deltas: { adventurers: 8, gold: -5 }, major: false, reputation: 5, chains: 'chain-merc-healed', rumorText: null, resultText: "She sleeps in the corner bunk for a week without saying much. By the end of it, three of your fighters are asking when she's joining the roster — and she already has." },
      { label: 'Turn her away', deltas: { adventurers: -6, equipment: 8 }, major: false, reputation: -5, chains: null, rumorText: 'Word spreads. The wounded remember those who turned them away.', resultText: "Word spreads. The wounded remember those who turned them away — and so do the ones who were watching. Your storeroom gains what your reputation loses." },
    ],
  },
  {
    id: 'std-young-recruit',
    type: 'standard',
    npc: { emoji: '🌟', name: 'Tam', role: 'Would-Be Adventurer' },
    situation: 'A bright-eyed kid walks in off the street wanting to join your guild. No skills to speak of, but plenty of enthusiasm.',
    choices: [
      { label: 'Take a chance', deltas: { adventurers: 8, gold: -5 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Tam spends the first day lost, the second day overwhelmed, and the third day useful. You've made worse bets." },
      { label: 'Send them away', deltas: { adventurers: -6, equipment: 8 }, major: false, reputation: -3, chains: null, rumorText: 'Word gets out that your guild turned away an eager young recruit.', resultText: "Out the door and gone, shoulders dropped. By month's end you've turned three more away just like that one — and you notice the roster is thinner for it." },
    ],
  },
  {
    id: 'std-old-map',
    type: 'standard',
    npc: { emoji: '🗺️', name: 'An Old Cartographer', role: 'Retired Explorer' },
    situation: 'An old man sells maps of uncharted ruins — supposedly equipment-rich. It\'s a gamble: could be gold or a waste of lives.',
    choices: [
      { label: 'Fund the expedition', deltas: { gold: -18, adventurers: -8, equipment: 22 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Eighteen from the treasury and eight of your best gone for two weeks. They come back carrying everything the maps promised and then some. The old man wasn't wrong." },
      { label: 'Pass', deltas: { quests: -6, gold: 8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Back into the old man's satchel goes the map — and with it any chance of what might've been in those ruins. You keep the coin. The board stays thin." },
    ],
  },
  {
    id: 'std-overdue-quest',
    type: 'standard',
    npc: { emoji: '📋', name: 'Guild Accountant', role: 'Internal Staff' },
    situation: 'Three quests are running overdue. You can send extra people to resolve them fast, or let clients wait and risk reputation.',
    choices: [
      { label: 'Send reinforcements', deltas: { adventurers: -10, quests: 15 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Hard days, all three of them. Clients get their reports; the queue clears. You're short-handed for a week, but the contracts are settled and no one's waiting on you anymore." },
      { label: 'Let them wait', deltas: { quests: -10, adventurers: 5 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "Two clients pull their work before it's finished. The roster stays full, but you're explaining yourself to people who expected better — and not all of them believe you." },
    ],
  },
  {
    id: 'std-training-master',
    type: 'standard',
    npc: { emoji: '🏋️', name: 'Drill Sergeant Varn', role: 'Combat Trainer' },
    situation: 'A retired soldier offers to train your roster for a month. It costs upfront but your people come out sharper.',
    choices: [
      { label: 'Hire him', deltas: { gold: -12, adventurers: 15 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Thirty days of Varn running the hall like a barracks. By the end of it your fighters move differently — tighter, quieter, meaner. Worth every coin." },
      { label: 'Decline the offer', deltas: { adventurers: -8, equipment: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "His offer taken elsewhere, Varn leaves without a fuss. A handful of your fighters follow him out of curiosity — and don't come back. The budget goes to the armoury instead." },
    ],
  },
  {
    id: 'std-monster-sighting',
    type: 'standard',
    npc: { emoji: '🐉', name: 'Terrified Shepherd', role: 'Local Villager' },
    situation: 'Reports of a large creature near the valley farms. Nobody else will go. Eliminating it would be a boon for your reputation — if your team returns.',
    choices: [
      { label: 'Take the job', deltas: { adventurers: -10, equipment: -8, quests: 18 }, major: false, reputation: 10, chains: null, rumorText: null, resultText: "Battered, short two sets of armor, and grinning like idiots — they come back with the job done. The shepherd pays. The valley sleeps. Your name spreads through every farmhouse between here and the pass." },
      { label: 'Decline the risk', deltas: { quests: -8, adventurers: 5 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "Another guild takes the contract and comes back heroes. Your hall stays safe, your people rested — and the farmers stop looking you in the eye at market." },
    ],
  },
  {
    id: 'std-alchemist-deal',
    type: 'standard',
    npc: { emoji: '⚗️', name: 'Maeva the Alchemist', role: 'City Alchemist' },
    situation: 'An alchemist wants to run experiments on some of your equipment — temporarily. In return: upgraded gear when done.',
    choices: [
      { label: 'Agree', deltas: { equipment: -10, quests: 8 }, major: false, reputation: 0, chains: 'chain-alchemist-done', rumorText: null, resultText: "Half your gear disappears into Maeva's workshop for two weeks. New contracts come in while you wait — the queue fills itself. Whatever she's doing in there, you hope it's worth it." },
      { label: 'Decline', deltas: { quests: -6, gold: 8 }, major: false, reputation: -3, chains: null, rumorText: null, resultText: "Maeva takes her patronage to a guild across the river. You pocket the savings — and quietly watch three contracts you might have chased disappear with her." },
    ],
  },
  {
    id: 'std-scholar-request',
    type: 'standard',
    npc: { emoji: '📚', name: 'Scholar Davin', role: 'University Researcher' },
    situation: 'A scholar needs an escort to a remote ruin for research. The pay is modest, but he promises useful maps of the region.',
    choices: [
      { label: 'Take the contract', deltas: { gold: 8, adventurers: -5, quests: -5 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Modest pay, long walk, one very grateful scholar. His maps of the region are already proving useful — and he's started recommending you to colleagues at the university." },
      { label: 'Too low-paying', deltas: { quests: -8, equipment: 6 }, major: false, reputation: -3, chains: null, rumorText: null, resultText: "Davin finds another escort, somewhere cheaper. You redirect the freed time toward the armoury — though the region's mapped routes stay someone else's knowledge for now." },
    ],
  },
  {
    id: 'std-guild-expansion',
    type: 'standard',
    npc: { emoji: '🏗️', name: 'Master Builder Oren', role: 'Construction Foreman' },
    situation: 'A builder proposes renovating your hall to fit more adventurers. Expensive, but your current space is cramped.',
    choices: [
      { label: 'Expand the hall', deltas: { gold: -20, adventurers: 20 }, major: true, reputation: 0, chains: null, rumorText: 'The hammering from the guild hall renovation can be heard across the district.', resultText: "Three weeks of hammering and sawdust, then silence. When it clears, the hall can hold twice as many bodies — and the new faces start showing up almost immediately." },
      { label: 'Not yet', deltas: { quests: -6, gold: 8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Oren takes his blueprints home. The hall stays cramped, the treasury stays intact, and three potential jobs go to guilds with more room to maneuver." },
    ],
  },
  {
    id: 'std-veteran-retires',
    type: 'standard',
    npc: { emoji: '🧓', name: 'Old Garrus', role: 'Veteran Adventurer' },
    situation: 'One of your oldest members wants to retire. You could give him a generous sendoff, or try to convince him to stay on as an instructor.',
    choices: [
      { label: 'Generous sendoff', deltas: { gold: -10, adventurers: -5, quests: 12 }, major: false, reputation: 5, chains: null, rumorText: 'Old Garrus was seen at the docks, laughing with a tankard in his hand. He earned it.', resultText: "Food, drink, a small purse — a proper send-off. He leaves smiling, and the hall fills with stories about him for a week. Contracts follow, as if honoring the man brought something back with it." },
      { label: 'Keep him as instructor', deltas: { gold: -5, adventurers: 10 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Garrus grumbles, then agrees. He trades his sword for a chalk-line and starts filling the younger fighters' heads with thirty years of hard-won mistakes. The hall gets noticeably better at not dying." },
    ],
  },
  {
    id: 'std-sparring-accident',
    type: 'standard',
    npc: { emoji: '🩺', name: 'Medic Hessa', role: 'Guild Healer' },
    situation: 'Two members got carried away in a sparring session. One is nursing a cracked rib. Hessa says they can rest and heal properly, or push through at the risk of a worse injury.',
    choices: [
      { label: 'Rest them properly', deltas: { adventurers: -8, equipment: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Hessa wraps the rib, grounds them both, and puts the recovered hours into sharpening whatever's left on the rack. Two weeks later they're back — and they remember who kept them off the field." },
      { label: 'Back on their feet', deltas: { adventurers: -10, quests: 8 }, major: false, reputation: 0, chains: null, rumorText: 'Word gets out: your guild pushes its people too hard.', resultText: "Contracts get done — barely. Three days later one of them reburies the rib and is out for a month anyway, plus two others who didn't want to be the only ones admitting they were struggling." },
    ],
  },
  {
    id: 'std-equipment-audit',
    type: 'standard',
    npc: { emoji: '🔧', name: 'Torvin the Tinker', role: 'Guild Quartermaster' },
    situation: 'Torvin has finished his quarterly equipment audit. Half the swords are dulled and two sets of armor have cracked plates. You can invest in a full repair and restock, or patch only the worst of it.',
    choices: [
      { label: 'Full restock', deltas: { gold: -20, equipment: 18 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Torvin spends a small fortune and takes three days to do it right. Every blade is sharp, every plate is solid. People notice the difference on the first job out." },
      { label: 'Patch the worst', deltas: { gold: -8, equipment: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Quick repairs, a fraction of the cost. The worst of it is fixed, the rest limps along. Torvin mutters something about the audit next quarter — you pretend not to hear him." },
    ],
  },
  {
    id: 'std-brek-drills',
    type: 'standard',
    npc: { emoji: '⚔️', name: 'Drill Sergeant Varn', role: 'Combat Trainer' },
    situation: 'Varn wants to run a week of dawn-to-dusk combat drills. The roster will be exhausted and unavailable for quests, but he promises they\'ll be noticeably sharper afterward.',
    choices: [
      { label: 'Approve the drills', deltas: { quests: -8, adventurers: 12 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Pre-dawn wake-ups, bruised shins, and then something clicks. The same fighters who were sloppy with formations are running them clean. Varn doesn't say much. He doesn't need to." },
      { label: 'Too much downtime', deltas: { adventurers: -8, equipment: 6 }, major: false, reputation: -5, chains: null, rumorText: 'Word is the guild has been skipping training. Standards are slipping.', resultText: "Drills unrun, Varn leaves — and takes a few fighters who'd rather train than idle. The armoury gets a modest top-up, but the gap in readiness doesn't go away on its own." },
    ],
  },
  {
    id: 'std-hazing-complaint',
    type: 'standard',
    npc: { emoji: '😤', name: 'Recruit Pell', role: 'New Member' },
    situation: 'A new recruit reports being hazed by senior members — left overnight in the crypts as a "tradition." He\'s humiliated but unhurt. The veterans think it\'s harmless fun.',
    choices: [
      { label: 'Reprimand the veterans', deltas: { adventurers: -6, quests: 8 }, major: false, reputation: 5, chains: null, rumorText: 'The guild\'s new recruits look noticeably less rattled these days.', resultText: "Sulking for a day, the veterans get over it. Pell gets assigned a proper mentor. New work trickles in — apparently people have been watching how you handle your own house." },
      { label: 'Let tradition stand', deltas: { adventurers: -8, gold: 6 }, major: false, reputation: -5, chains: null, rumorText: 'Rumor has it your guild\'s hazing rituals are driving away promising recruits.', resultText: "Pell isn't the last one to leave quietly. The veterans pocket a small bonus you had budgeted for growth — and the hall gets a little emptier with nothing to show for it." },
    ],
  },
  {
    id: 'std-feast-day',
    type: 'standard',
    npc: { emoji: '🍖', name: 'Cook Brenna', role: 'Guild Cook' },
    situation: 'The Harvest Festival is tomorrow. Brenna is asking whether to throw a proper feast for the whole guild — it would cost a fair chunk of gold but morale is low after a rough month.',
    choices: [
      { label: 'Throw the feast', deltas: { gold: -15, adventurers: 12 }, major: false, reputation: 5, chains: null, rumorText: 'The smell of roasted boar drifted across the whole district last night.', resultText: "By the end of the night people are laughing again — actually laughing. Brenna outdoes herself. New faces turn up the next morning asking if there's room on the roster." },
      { label: 'Keep it simple', deltas: { gold: -8, equipment: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Decent bread, a round of ale, a night without misery — Brenna stretches the budget without complaint. The gear fund gets a quiet contribution. Nobody throws a party, but nobody quits." },
    ],
  },
  {
    id: 'std-maren-blessing',
    type: 'standard',
    npc: { emoji: '🕊️', name: 'Healer Josse', role: 'Temple Volunteer' },
    situation: 'A temple healer offers to bless the guild hall and tend to any injuries free of charge — she asks only that your members donate a day of labor to the temple district in return.',
    choices: [
      { label: 'Accept graciously', deltas: { adventurers: -5, equipment: 8 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Rubble shifted, temple walls patched — a day's honest labor, grumbling but not meanly. Josse tends three injuries that were quietly festering, and leaves behind more than she took." },
      { label: 'Politely decline', deltas: { equipment: -8, gold: 6 }, major: false, reputation: -3, chains: null, rumorText: null, resultText: "Josse nods, smiles, and finds another guild happy to accept. Your people miss out on a day's hard work and a healer's attention — and something in the storeroom quietly falls into disrepair." },
    ],
  },
  {
    id: 'std-night-watch',
    type: 'standard',
    npc: { emoji: '🌙', name: 'Dova', role: 'Guild Watchwoman' },
    situation: 'A string of petty thefts near the hall has your watchwoman Dova asking for a dedicated night rotation. Running it means pulling people from daytime tasks.',
    choices: [
      { label: 'Set up the rotation', deltas: { adventurers: -8, equipment: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Dova runs the new rotation without complaint. The thefts stop. The gear stays where you put it. You lose some daytime capacity, but nothing else goes missing." },
      { label: 'Keep current schedule', deltas: { equipment: -8, gold: 6 }, major: false, reputation: 0, chains: null, rumorText: 'Someone broke into the guild storeroom last night.', resultText: "Someone helps themselves to the storeroom a few nights later. You recover enough coin to cover the gap — and spend the rest of the week wondering what else walked out the door." },
    ],
  },
  {
    id: 'std-inter-guild-tournament',
    type: 'standard',
    npc: { emoji: '🏆', name: 'Herald Aston', role: 'City Tournament Organizer' },
    situation: 'An inter-guild combat tournament has been announced. Entry costs gold and risks injuries, but winning would raise your standing in the city considerably.',
    choices: [
      { label: 'Enter the tournament', deltas: { gold: -12, adventurers: -8, quests: 15 }, major: true, reputation: 15, chains: null, rumorText: 'Crowds lined the square to watch your fighters compete. They put on a show.', resultText: "Entry fees paid, fighters bruised, pride tested — and worth it. The crowd remembers your colors. New contracts start arriving from people who were watching from the stands." },
      { label: 'Sit it out', deltas: { quests: -8, adventurers: 5 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "From the sidelines, you watch another guild take the prize. Your people stay rested; the queue quietly empties. Some work goes to whoever showed up." },
    ],
  },
  {
    id: 'std-jolen-tip',
    type: 'standard',
    npc: { emoji: '🕵️', name: 'Daveth the Ear', role: 'City Gossip' },
    situation: 'An informant slips you a tip: a rival guild is poaching your clients with undercut prices. He can spread counter-rumors for a fee, or you can simply outperform them on your next jobs.',
    choices: [
      { label: 'Pay him to spread word', deltas: { gold: -10, quests: 8 }, major: false, reputation: 5, chains: null, rumorText: 'Word around the taverns is that the other guild has been cutting corners.', resultText: "Daveth earns his coin. Within a week the taverns are full of second-hand doubts about your rival's quality — and your queue fills accordingly. You don't ask what exactly he said." },
      { label: 'Win on merit alone', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Merit is your answer. Some contracts go to the cheaper option anyway — clients don't always wait. The ones who stay are loyal, and your fighters have more room to breathe between jobs." },
    ],
  },
  {
    id: 'std-library-research',
    type: 'standard',
    npc: { emoji: '📖', name: 'Archivist Wren', role: 'Guild Librarian' },
    situation: 'Wren has found a trove of old expedition logs in the city archive. Sending a few members to study them would cost time away from active duty, but could improve planning on future quests.',
    choices: [
      { label: 'Send the research team', deltas: { adventurers: -5, quests: 10 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Five of your people spend a week buried in expedition logs. They come back quieter and more careful — and the next batch of jobs gets planned with noticeably fewer surprises." },
      { label: 'No time for books', deltas: { quests: -6, gold: 8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Wren locks the archive back up, and the knowledge stays dormant. A clutch of contracts slip away unused. The treasury gets a modest top-up from what you'd earmarked for the research." },
    ],
  },
  {
    id: 'std-roof-collapse',
    type: 'standard',
    npc: { emoji: '🏚️', name: 'Master Builder Oren', role: 'Construction Foreman' },
    situation: 'A section of the guild hall roof has caved in after weeks of heavy rain. Oren says you can do a full structural repair now, or nail boards over it and deal with it later.',
    choices: [
      { label: 'Full repair now', deltas: { gold: -18, equipment: 15 }, major: false, reputation: 5, chains: null, rumorText: 'The guild hall looks proper again — Oren did solid work.', resultText: "Stripped and rebuilt properly — Oren's crew doesn't cut corners. It costs more than you'd like, but the hall is solid again, and the work brought the storage up to standard while they were at it." },
      { label: 'Patch it for now', deltas: { gold: -8, equipment: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Boards go up over the gap. It holds. Barely. You recover a little from what you'd set aside, but every time it rains you find yourself looking at the ceiling." },
    ],
  },
  {
    id: 'std-mentorship-program',
    type: 'standard',
    npc: { emoji: '🎓', name: 'Veteran Solla', role: 'Senior Adventurer' },
    situation: 'Solla proposes pairing each new recruit with a senior member for a month. Veterans will have less capacity for contracts, but recruits would develop faster.',
    choices: [
      { label: 'Launch the program', deltas: { adventurers: 15, quests: -12 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Veterans grumble about babysitting, then quietly start taking it seriously. A month later the recruits aren't dead weight anymore — they're holding the line on jobs that would've stretched you thin." },
      { label: 'Sink-or-swim approach', deltas: { adventurers: -8, gold: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Some of the new ones figure it out. Most don't stick around long enough to. The turnover frees up a little in the budget; the hall stays leaner than Solla would like." },
    ],
  },
  {
    id: 'std-staff-walkout',
    type: 'standard',
    npc: { emoji: '😠', name: 'Guild Steward Pel', role: 'Administrative Staff' },
    situation: 'Three support staff are threatening to quit over long hours and no pay raise. Losing them would hurt operations; paying them more will strain the treasury.',
    choices: [
      { label: 'Give the raise', deltas: { gold: -12, adventurers: 10 }, major: false, reputation: 5, chains: null, rumorText: 'The guild staff seem satisfied — for now.', resultText: "Pay up, complaints quiet, hall running smoother — it costs, but the word spreads that you treat your own well. A handful of fighters who were on the fence about joining make up their minds." },
      { label: 'Let them go', deltas: { adventurers: -8, equipment: 6 }, major: false, reputation: -5, chains: null, rumorText: 'Your former steward was heard venting in the tavern. Loudly.', resultText: "Empty desks by morning, all three of them. What's left of their budget goes into the armoury, but plugging the gap in operations costs more in lost time than you'd like to admit." },
    ],
  },
  {
    id: 'std-supply-run',
    type: 'standard',
    npc: { emoji: '🛒', name: 'Quartermaster Finn', role: 'Supply Runner' },
    situation: 'Finn says supplies are running low — bandages, rations, rope. He can do a proper bulk run to the market district, or scrounge locally for less.',
    choices: [
      { label: 'Full market run', deltas: { gold: -15, equipment: 15 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Loaded cart, receipt that stings — Finn comes back with the full haul. The storeroom hasn't looked this good in months. People stop improvising on the road." },
      { label: 'Local scrounge', deltas: { gold: -8, equipment: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Local scrounge, modest result — a little rope here, some patched bandaging there. The coin saved is real; so is the gap between what you have and what you'll need next time." },
    ],
  },
  {
    id: 'std-farwick-inspection',
    type: 'standard',
    npc: { emoji: '🎩', name: 'Overseer Cayne', role: 'City Guild Overseer' },
    situation: 'The city guild overseer announces a formal inspection of all licensed guilds next week. You can spend gold polishing the hall and briefing your people, or take your chances with what you have.',
    choices: [
      { label: 'Prepare thoroughly', deltas: { gold: -10, quests: 10 }, major: false, reputation: 10, chains: null, rumorText: 'The overseer left the guild hall looking quietly impressed.', resultText: "Floors scrubbed, members briefed, everything in order. Cayne walks through without a word and leaves. The inspection report comes back clean — and so do several contracts that needed city approval." },
      { label: 'Wing it', deltas: { quests: -8, adventurers: 6 }, major: false, reputation: -8, chains: null, rumorText: 'The inspection notes were... not favorable.', resultText: "Cayne finds what he finds. The report is politely damning. A clutch of city-approved jobs evaporate, and a handful of fighters who saw the whole thing quietly start looking elsewhere." },
    ],
  },
  {
    id: 'std-weapon-forging',
    type: 'standard',
    npc: { emoji: '🔨', name: 'Blacksmith Kira', role: 'Weaponsmith' },
    situation: 'Kira has spare capacity in her forge and offers to craft custom weapons for a few of your best fighters at a discounted rate. It\'s still a significant cost, but the quality is exceptional.',
    choices: [
      { label: 'Commission the weapons', deltas: { gold: -20, equipment: 20 }, major: true, reputation: 0, chains: null, rumorText: 'Kira\'s blades have been turning heads at the practice yard.', resultText: "Serious coin out the door, serious craft through the other end. What comes out of Kira's forge two weeks later is something else — fighters who hadn't shown enthusiasm in months are back at the yard before dawn." },
      { label: 'Standard issue is fine', deltas: { equipment: -8, gold: 6 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Kira's offer passes unaccepted. The standard kit keeps wearing down at its usual pace, and the savings go back to the treasury. Practical, if uninspiring." },
    ],
  },
  {
    id: 'std-injury-recovery',
    type: 'standard',
    npc: { emoji: '🦽', name: 'Renn', role: 'Recovering Fighter' },
    situation: 'Renn was badly hurt on the last job. Your healer says a proper recovery will take three weeks — paid downtime. Pushing him back into the field risks permanent damage.',
    choices: [
      { label: 'Full paid recovery', deltas: { gold: -8, adventurers: -5, quests: 8 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Forced rest, three long weeks. By the end of it he's angry enough to actually be useful again. The contracts ran fine in his absence. He comes back knowing the guild kept paying him anyway." },
      { label: 'Light duty only', deltas: { adventurers: -10, equipment: 8 }, major: false, reputation: -5, chains: null, rumorText: 'Renn is limping through jobs. People have noticed.', resultText: "Gritting his teeth, Renn reports for light work. He's not fooling anyone — the limp is visible across the yard. Others start taking fewer risks, quietly, because they've seen how you handle it." },
    ],
  },
  {
    id: 'std-competitive-challenge',
    type: 'standard',
    npc: { emoji: '😏', name: 'Rival Guildmaster Cael', role: 'Competing Guild Leader' },
    situation: 'Cael of the Ironveil Guild publicly challenges your members to a timed dungeon run. Winning means bragging rights and a bounty; losing could embarrass you in front of major clients.',
    choices: [
      { label: 'Accept the challenge', deltas: { adventurers: -8, equipment: -5, quests: 12 }, major: false, reputation: 10, chains: null, rumorText: 'Your team beat Ironveil\'s time by a quarter-hour. The whole district heard about it.', resultText: "Scraped knuckles, bruised pride, and a margin that shut Cael up for a week — they do it. The contracts that follow make it clear the city was watching." },
      { label: 'Decline publicly', deltas: { quests: -8, adventurers: 5 }, major: false, reputation: -8, chains: null, rumorText: 'Cael has been telling anyone who will listen that you were afraid to compete.', resultText: "Cael wins by default, and doesn't let anyone forget it. Your people stay fresh and your gear intact — but the queue thins as clients quietly start taking their work to someone who showed up." },
    ],
  },
  {
    id: 'std-guild-morale-slump',
    type: 'standard',
    npc: { emoji: '😞', name: 'Veteran Solla', role: 'Senior Adventurer' },
    situation: 'After a string of low-paying jobs and one failed mission, morale in the hall is visibly low. Solla suggests organizing team activities and lighter duties for a week. The alternative is driving through it.',
    choices: [
      { label: 'Give them a breather', deltas: { quests: -8, gold: -5, adventurers: 10 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Lighter work, shorter shifts, a little coin on small comforts — and within a week the hall gets loud again. Not loud like trouble. Loud like people who've remembered why they're here." },
      { label: 'Work through it', deltas: { adventurers: -8, equipment: 6 }, major: false, reputation: 0, chains: null, rumorText: 'Three members handed in their resignation this week. No explanation.', resultText: "Push hard enough and the hall pushes back — quietly, one departure at a time. What's left gets redistributed into the armoury. What's lost doesn't announce itself; it just empties out." },
    ],
  },
  {
    id: 'std-lapsed-license',
    type: 'standard',
    npc: { emoji: '📜', name: 'City Clerk Nata', role: 'Municipal Official' },
    situation: 'A clerk informs you that one of your operating licenses lapsed last month. You can pay the renewal fee now and avoid trouble, or bribe her to look the other way.',
    choices: [
      { label: 'Pay the renewal fee', deltas: { gold: -10, quests: 8 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Fee paid, license current, problem gone. Nata stamps it and moves on. The clean paperwork opens up city-approved contracts you couldn't have touched last week." },
      { label: 'Offer a quiet bribe', deltas: { gold: -8, adventurers: 6 }, major: false, reputation: -5, chains: null, rumorText: 'A city clerk was seen pocketing something outside your hall. People talk.', resultText: "Nata takes it without blinking. The license goes back in the drawer and the problem disappears — for now. A few of your fighters who saw the exchange start looking at you differently." },
    ],
  },
]
