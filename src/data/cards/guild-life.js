export const guildLifeCards = [
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
    id: 'std-young-recruit',
    type: 'standard',
    npc: { emoji: '🌟', name: 'Tam', role: 'Would-Be Adventurer' },
    situation: 'A bright-eyed kid walks in off the street wanting to join your guild. No skills to speak of, but plenty of enthusiasm.',
    choices: [
      { label: 'Take a chance', deltas: { adventurers: 8, gold: -3 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Send them away', deltas: {}, major: false, reputation: -3, chains: null, rumorText: 'Word gets out that your guild turned away an eager young recruit.' },
    ],
  },
  {
    id: 'std-old-map',
    type: 'standard',
    npc: { emoji: '🗺️', name: 'An Old Cartographer', role: 'Retired Explorer' },
    situation: 'An old man sells maps of uncharted ruins — supposedly equipment-rich. It\'s a gamble: could be gold or a waste of lives.',
    choices: [
      { label: 'Fund the expedition', deltas: { gold: -18, adventurers: -8, equipment: 22 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Pass', deltas: { quests: -3 }, major: false, reputation: 0, chains: null, rumorText: null },
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
    id: 'std-training-master',
    type: 'standard',
    npc: { emoji: '🏋️', name: 'Drill Sergeant Varn', role: 'Combat Trainer' },
    situation: 'A retired soldier offers to train your roster for a month. It costs upfront but your people come out sharper.',
    choices: [
      { label: 'Hire him', deltas: { gold: -12, adventurers: 15 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Decline the offer', deltas: { adventurers: -5 }, major: false, reputation: 0, chains: null, rumorText: null },
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
    id: 'std-alchemist-deal',
    type: 'standard',
    npc: { emoji: '⚗️', name: 'Maeva the Alchemist', role: 'City Alchemist' },
    situation: 'An alchemist wants to run experiments on some of your equipment — temporarily. In return: upgraded gear when done.',
    choices: [
      { label: 'Agree', deltas: { equipment: -10 }, major: false, reputation: 0, chains: 'chain-alchemist-done', rumorText: null },
      { label: 'Decline', deltas: {}, major: false, reputation: -3, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-scholar-request',
    type: 'standard',
    npc: { emoji: '📚', name: 'Scholar Davin', role: 'University Researcher' },
    situation: 'A scholar needs an escort to a remote ruin for research. The pay is modest, but he promises useful maps of the region.',
    choices: [
      { label: 'Take the contract', deltas: { gold: 8, adventurers: -5, quests: 8 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Too low-paying', deltas: {}, major: false, reputation: -3, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-guild-expansion',
    type: 'standard',
    npc: { emoji: '🏗️', name: 'Master Builder Oren', role: 'Construction Foreman' },
    situation: 'A builder proposes renovating your hall to fit more adventurers. Expensive, but your current space is cramped.',
    choices: [
      { label: 'Expand the hall', deltas: { gold: -20, adventurers: 20 }, major: true, reputation: 0, chains: null, rumorText: 'The hammering from the guild hall renovation can be heard across the district.' },
      { label: 'Not yet', deltas: { quests: -3 }, major: false, reputation: 0, chains: null, rumorText: null },
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
    id: 'std-sparring-accident',
    type: 'standard',
    npc: { emoji: '🩺', name: 'Medic Hessa', role: 'Guild Healer' },
    situation: 'Two members got carried away in a sparring session. One is nursing a cracked rib. Hessa says they can rest and heal properly, or push through at the risk of a worse injury.',
    choices: [
      { label: 'Rest them properly', deltas: { adventurers: -5 }, major: false, reputation: 0, chains: null, rumorText: null, modifiers: [{ id: 'careful-recovery', label: 'Careful Recovery', effects: { adventurers: 8 }, duration: 3 }] },
      { label: 'Back on their feet', deltas: { adventurers: -10 }, major: false, reputation: 0, chains: null, rumorText: 'Word gets out: your guild pushes its people too hard.' },
    ],
  },
  {
    id: 'std-equipment-audit',
    type: 'standard',
    npc: { emoji: '🔧', name: 'Torvin the Tinker', role: 'Guild Quartermaster' },
    situation: 'Torvin has finished his quarterly equipment audit. Half the swords are dulled and two sets of armor have cracked plates. You can invest in a full repair and restock, or patch only the worst of it.',
    choices: [
      { label: 'Full restock', deltas: { gold: -20, equipment: 18 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Patch the worst', deltas: { gold: -8, equipment: 5 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-brek-drills',
    type: 'standard',
    npc: { emoji: '⚔️', name: 'Drill Sergeant Varn', role: 'Combat Trainer' },
    situation: 'Varn wants to run a week of dawn-to-dusk combat drills. The roster will be exhausted and unavailable for quests, but he promises they\'ll be noticeably sharper afterward.',
    choices: [
      { label: 'Approve the drills', deltas: { quests: -8, adventurers: 12 }, major: false, reputation: 0, chains: null, rumorText: null, relationships: { 'sergeant-brek': 1 } },
      { label: 'Too much downtime', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null, relationships: { 'sergeant-brek': -1 } },
    ],
  },
  {
    id: 'std-hazing-complaint',
    type: 'standard',
    npc: { emoji: '😤', name: 'Recruit Pell', role: 'New Member' },
    situation: 'A new recruit reports being hazed by senior members — left overnight in the crypts as a "tradition." He\'s humiliated but unhurt. The veterans think it\'s harmless fun.',
    choices: [
      { label: 'Reprimand the veterans', deltas: { adventurers: -3 }, major: false, reputation: 5, chains: null, rumorText: 'The guild\'s new recruits look noticeably less rattled these days.' },
      { label: 'Let tradition stand', deltas: {}, major: false, reputation: -5, chains: null, rumorText: 'Rumor has it your guild\'s hazing rituals are driving away promising recruits.' },
    ],
  },
  {
    id: 'std-feast-day',
    type: 'standard',
    npc: { emoji: '🍖', name: 'Cook Brenna', role: 'Guild Cook' },
    situation: 'The Harvest Festival is tomorrow. Brenna is asking whether to throw a proper feast for the whole guild — it would cost a fair chunk of gold but morale is low after a rough month.',
    choices: [
      { label: 'Throw the feast', deltas: { gold: -15, adventurers: 8 }, major: false, reputation: 5, chains: null, rumorText: 'The smell of roasted boar drifted across the whole district last night.', modifiers: [{ id: 'feast-morale', label: 'Post-Feast Morale', effects: { adventurers: 5 }, duration: 3 }] },
      { label: 'Keep it simple', deltas: { gold: -5 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-maren-blessing',
    type: 'standard',
    npc: { emoji: '🕊️', name: 'Healer Josse', role: 'Temple Volunteer' },
    situation: 'A temple healer offers to bless the guild hall and tend to any injuries free of charge — she asks only that your members donate a day of labor to the temple district in return.',
    choices: [
      { label: 'Accept graciously', deltas: { adventurers: -5, equipment: 8 }, major: false, reputation: 5, chains: null, rumorText: null, relationships: { 'sister-maren': 1 } },
      { label: 'Politely decline', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null, relationships: { 'sister-maren': -1 } },
    ],
  },
  {
    id: 'std-night-watch',
    type: 'standard',
    npc: { emoji: '🌙', name: 'Dova', role: 'Guild Watchwoman' },
    situation: 'A string of petty thefts near the hall has your watchwoman Dova asking for a dedicated night rotation. Running it means pulling people from daytime tasks.',
    choices: [
      { label: 'Set up the rotation', deltas: { adventurers: -5, equipment: 5 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Keep current schedule', deltas: { equipment: -8 }, major: false, reputation: 0, chains: null, rumorText: 'Someone broke into the guild storeroom last night.' },
    ],
  },
  {
    id: 'std-inter-guild-tournament',
    type: 'standard',
    npc: { emoji: '🏆', name: 'Herald Aston', role: 'City Tournament Organizer' },
    situation: 'An inter-guild combat tournament has been announced. Entry costs gold and risks injuries, but winning would raise your standing in the city considerably.',
    choices: [
      { label: 'Enter the tournament', deltas: { gold: -12, adventurers: -8, quests: 15 }, major: true, reputation: 15, chains: null, rumorText: 'Crowds lined the square to watch your fighters compete. They put on a show.', modifiers: [{ id: 'tournament-edge', label: 'Tournament Edge', effects: { adventurers: 8 }, duration: 4 }] },
      { label: 'Sit it out', deltas: {}, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-jolen-tip',
    type: 'standard',
    npc: { emoji: '🕵️', name: 'Daveth the Ear', role: 'City Gossip' },
    situation: 'An informant slips you a tip: a rival guild is poaching your clients with undercut prices. He can spread counter-rumors for a fee, or you can simply outperform them on your next jobs.',
    choices: [
      { label: 'Pay him to spread word', deltas: { gold: -10 }, major: false, reputation: 5, chains: null, rumorText: 'Word around the taverns is that the other guild has been cutting corners.', relationships: { 'jolen-fence': 1 } },
      { label: 'Win on merit alone', deltas: { quests: -5 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-library-research',
    type: 'standard',
    npc: { emoji: '📖', name: 'Archivist Wren', role: 'Guild Librarian' },
    situation: 'Wren has found a trove of old expedition logs in the city archive. Sending a few members to study them would cost time away from active duty, but could improve planning on future quests.',
    choices: [
      { label: 'Send the research team', deltas: { adventurers: -5, quests: 12 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'No time for books', deltas: { quests: -3 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-roof-collapse',
    type: 'standard',
    npc: { emoji: '🏚️', name: 'Master Builder Oren', role: 'Construction Foreman' },
    situation: 'A section of the guild hall roof has caved in after weeks of heavy rain. Oren says you can do a full structural repair now, or nail boards over it and deal with it later.',
    choices: [
      { label: 'Full repair now', deltas: { gold: -18, equipment: 5 }, major: false, reputation: 5, chains: null, rumorText: 'The guild hall looks proper again — Oren did solid work.' },
      { label: 'Patch it for now', deltas: { gold: -5, equipment: -5 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-mentorship-program',
    type: 'standard',
    npc: { emoji: '🎓', name: 'Veteran Solla', role: 'Senior Adventurer' },
    situation: 'Solla proposes pairing each new recruit with a senior member for a month. Veterans will have less capacity for contracts, but recruits would develop faster.',
    choices: [
      { label: 'Launch the program', deltas: { adventurers: 15, quests: -10 }, major: false, reputation: 0, chains: null, rumorText: null, modifiers: [{ id: 'mentorship-cohesion', label: 'Mentorship Cohesion', effects: { adventurers: 5 }, duration: 5 }] },
      { label: 'Sink-or-swim approach', deltas: { adventurers: -5 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-staff-walkout',
    type: 'standard',
    npc: { emoji: '😠', name: 'Guild Steward Pel', role: 'Administrative Staff' },
    situation: 'Three support staff are threatening to quit over long hours and no pay raise. Losing them would hurt operations; paying them more will strain the treasury.',
    choices: [
      { label: 'Give the raise', deltas: { gold: -12, adventurers: 5 }, major: false, reputation: 5, chains: null, rumorText: 'The guild staff seem satisfied — for now.' },
      { label: 'Let them go', deltas: { adventurers: -8 }, major: false, reputation: -5, chains: null, rumorText: 'Your former steward was heard venting in the tavern. Loudly.' },
    ],
  },
  {
    id: 'std-supply-run',
    type: 'standard',
    npc: { emoji: '🛒', name: 'Quartermaster Finn', role: 'Supply Runner' },
    situation: 'Finn says supplies are running low — bandages, rations, rope. He can do a proper bulk run to the market district, or scrounge locally for less.',
    choices: [
      { label: 'Full market run', deltas: { gold: -15, equipment: 15 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Local scrounge', deltas: { gold: -5, equipment: 5 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-farwick-inspection',
    type: 'standard',
    npc: { emoji: '🎩', name: 'Overseer Cayne', role: 'City Guild Overseer' },
    situation: 'The city guild overseer announces a formal inspection of all licensed guilds next week. You can spend gold polishing the hall and briefing your people, or take your chances with what you have.',
    choices: [
      { label: 'Prepare thoroughly', deltas: { gold: -10, quests: 10 }, major: false, reputation: 10, chains: null, rumorText: 'The overseer left the guild hall looking quietly impressed.', relationships: { 'lord-farwick': 1 } },
      { label: 'Wing it', deltas: { quests: -5 }, major: false, reputation: -8, chains: null, rumorText: 'The inspection notes were... not favorable.', relationships: { 'lord-farwick': -1 } },
    ],
  },
  {
    id: 'std-weapon-forging',
    type: 'standard',
    npc: { emoji: '🔨', name: 'Blacksmith Kira', role: 'Weaponsmith' },
    situation: 'Kira has spare capacity in her forge and offers to craft custom weapons for a few of your best fighters at a discounted rate. It\'s still a significant cost, but the quality is exceptional.',
    choices: [
      { label: 'Commission the weapons', deltas: { gold: -20, equipment: 20 }, major: true, reputation: 0, chains: null, rumorText: 'Kira\'s blades have been turning heads at the practice yard.' },
      { label: 'Standard issue is fine', deltas: { equipment: -5 }, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-injury-recovery',
    type: 'standard',
    npc: { emoji: '🦽', name: 'Renn', role: 'Recovering Fighter' },
    situation: 'Renn was badly hurt on the last job. Your healer says a proper recovery will take three weeks — paid downtime. Pushing him back into the field risks permanent damage.',
    choices: [
      { label: 'Full paid recovery', deltas: { gold: -8, adventurers: -5 }, major: false, reputation: 5, chains: null, rumorText: null, relationships: { 'sister-maren': 1 } },
      { label: 'Light duty only', deltas: { adventurers: -10 }, major: false, reputation: -5, chains: null, rumorText: 'Renn is limping through jobs. People have noticed.' },
    ],
  },
  {
    id: 'std-competitive-challenge',
    type: 'standard',
    npc: { emoji: '😏', name: 'Rival Guildmaster Cael', role: 'Competing Guild Leader' },
    situation: 'Cael of the Ironveil Guild publicly challenges your members to a timed dungeon run. Winning means bragging rights and a bounty; losing could embarrass you in front of major clients.',
    choices: [
      { label: 'Accept the challenge', deltas: { adventurers: -8, equipment: -5, quests: 12 }, major: false, reputation: 10, chains: null, rumorText: 'Your team beat Ironveil\'s time by a quarter-hour. The whole district heard about it.' },
      { label: 'Decline publicly', deltas: {}, major: false, reputation: -8, chains: null, rumorText: 'Cael has been telling anyone who will listen that you were afraid to compete.' },
    ],
  },
  {
    id: 'std-guild-morale-slump',
    type: 'standard',
    npc: { emoji: '😞', name: 'Veteran Solla', role: 'Senior Adventurer' },
    situation: 'After a string of low-paying jobs and one failed mission, morale in the hall is visibly low. Solla suggests organizing team activities and lighter duties for a week. The alternative is driving through it.',
    choices: [
      { label: 'Give them a breather', deltas: { quests: -8, gold: -5 }, major: false, reputation: 0, chains: null, rumorText: null, modifiers: [{ id: 'morale-rebound', label: 'Morale Rebound', effects: { adventurers: 10 }, duration: 4 }] },
      { label: 'Work through it', deltas: { adventurers: -8 }, major: false, reputation: 0, chains: null, rumorText: 'Three members handed in their resignation this week. No explanation.' },
    ],
  },
  {
    id: 'std-lapsed-license',
    type: 'standard',
    npc: { emoji: '📜', name: 'City Clerk Nata', role: 'Municipal Official' },
    situation: 'A clerk informs you that one of your operating licenses lapsed last month. You can pay the renewal fee now and avoid trouble, or bribe her to look the other way.',
    choices: [
      { label: 'Pay the renewal fee', deltas: { gold: -10 }, major: false, reputation: 5, chains: null, rumorText: null, relationships: { 'lord-farwick': 1 } },
      { label: 'Offer a quiet bribe', deltas: { gold: -5 }, major: false, reputation: -5, chains: null, rumorText: 'A city clerk was seen pocketing something outside your hall. People talk.', relationships: { 'lord-farwick': -1 } },
    ],
  },
]
