export const banditWar = {
  id: 'bandit-war',
  title: 'The Bandit War',
  totalMilestones: 6,
  intro: 'Merchants on the eastern road have stopped arriving. The last one who made it through said one word before collapsing: bandits.',
  unlocks: ['nobles-debt', 'rival-guild'],
  adventurerUnlocks: ['Rena the Axe'],

  milestones: [
    {
      id: 'bw-m1',
      type: 'arc',
      npc: { emoji: '🧑‍🌾', name: 'Farmer Osric', role: 'Frightened Villager' },
      situation: 'A farmer staggers in from the eastern road. His cart was taken, his family threatened. He begs you to investigate the bandit camps.',
      choices: [
        { label: 'Accept the job', deltas: { gold: 5, adventurers: -5 }, major: true, reputation: 5, chains: null, rumorText: 'The eastern road is quiet — but not empty. Something is watching.' },
        { label: 'Demand payment first', deltas: { gold: 15, adventurers: -5 }, major: true, reputation: -5, chains: null, rumorText: 'Coin changes hands. The eastern road waits.' },
      ],
    },
    {
      id: 'bw-m2',
      type: 'arc',
      npc: { emoji: '🗺️', name: 'Scout Leyla', role: 'Guild Scout' },
      situation: 'Your scouts return with maps of three bandit camps. Attacking all three costs lives and coin. But leaving any intact risks retaliation.',
      choices: [
        { label: 'Full assault — take all three', deltas: { adventurers: -15, equipment: -10, quests: 12 }, major: true, reputation: 5, chains: null, rumorText: 'Three camps taken. But the survivors scattered. Where do outlaws go?' },
        { label: 'Target the largest camp only', deltas: { adventurers: -8, equipment: -5, quests: 6 }, major: true, reputation: 0, chains: 'chain-bw-survivors', rumorText: 'The largest camp fell. Two smaller ones watched from the treeline.' },
      ],
    },
    {
      id: 'bw-m3',
      type: 'arc',
      npc: { emoji: '🕵️', name: 'The Informant', role: 'Shadowy Figure' },
      situation: 'A hooded figure arrives at night. They know who leads the bandits — a disgraced noble\'s bastard son. They\'ll sell you proof. What\'s that worth?',
      choices: [
        { label: 'Pay for the proof', deltas: { gold: -20 }, major: true, reputation: 0, chains: null, rumorText: 'The proof is damning. Lord Harwick will not be pleased when he finds out you know.' },
        { label: 'Threaten them instead', deltas: { adventurers: 5 }, major: true, reputation: -5, chains: null, rumorText: 'Fear has its uses. The information came cheap — but at a cost to your name.' },
      ],
    },
    {
      id: 'bw-m4',
      type: 'arc',
      npc: { emoji: '⚔️', name: 'Bandit Vanguard', role: 'Ambush Party' },
      situation: 'They knew you were coming. Your lead team is surrounded on the old road. Fight through or negotiate a retreat?',
      choices: [
        { label: 'Fight through', deltas: { adventurers: -12, equipment: -8 }, major: true, reputation: 5, chains: null, rumorText: null },
        { label: 'Negotiate a retreat', deltas: { gold: -15, adventurers: -3 }, major: true, reputation: -5, chains: null, rumorText: 'They let you go — for a price. Some of your crew saw that as weakness.' },
      ],
    },
    {
      id: 'bw-m5',
      type: 'arc',
      npc: { emoji: '🗡️', name: 'Darro Half-Blood', role: 'Bandit Lord' },
      situation: 'The bandit leader sends a messenger. He offers a deal: stop hunting his people, and he\'ll ensure the eastern road stays clear — for a cut of merchant tolls.',
      choices: [
        { label: 'Refuse — end this', deltas: { adventurers: -5 }, major: true, reputation: 5, chains: null, rumorText: null },
        { label: 'Take the deal', deltas: { gold: 10, quests: -15 }, major: true, reputation: -10, chains: null, rumorText: 'Some will call it pragmatism. Others will call it what it is.' },
      ],
    },
    {
      id: 'bw-m6-final',
      type: 'arc',
      npc: { emoji: '🏹', name: 'Darro Half-Blood', role: 'Bandit Lord — Final Stand' },
      situation: 'You\'ve cornered Darro at his stronghold. His last fighters stand between you and the end of this war. One last call: mercy or steel?',
      choices: [
        { label: 'Show mercy — exile him', deltas: { quests: 15, reputation: 5 }, major: true, reputation: 10, chains: null, rumorText: null },
        { label: 'No mercy', deltas: { adventurers: -8, quests: 20 }, major: true, reputation: 0, chains: null, rumorText: null },
      ],
      isFinal: true,
    },
  ],

  // Chained card for milestone 2 "target largest only" choice
  chainedCards: [
    {
      id: 'chain-bw-survivors',
      type: 'chained',
      npc: { emoji: '🔥', name: 'Frightened Innkeeper', role: 'Roadside Witness' },
      situation: 'The surviving bandit camps retaliated. A roadside inn was burned. The innkeeper blames your guild for acting half-heartedly.',
      choices: [
        { label: 'Fund the rebuilding', deltas: { gold: -18, quests: -5, reputation: 5 }, major: false, reputation: 5, chains: null, rumorText: null },
        { label: 'Express regret, nothing more', deltas: { quests: -10 }, major: false, reputation: -5, chains: null, rumorText: null },
      ],
    },
  ],

  rumorTexts: [
    'A merchant from the east swears the bandits have a benefactor in the city.',
    'Three scouts haven\'t reported back. The eastern road smells of smoke.',
    'Lord Harwick visited the city council this morning. His mood was reportedly foul.',
  ],
}
