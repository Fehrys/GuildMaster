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
        { label: 'Accept the job', deltas: { gold: -5, adventurers: -20, quests: 22, equipment: 0 }, major: true, reputation: 5, chains: null, rumorText: 'The eastern road is quiet — but not empty. Something is watching.', resultText: 'Farmer Osric grips your hand with both of his, shaking it too long, saying nothing. Outside, twenty of your people are already pulling on boots and checking blades. The gold you spent to outfit them barely registers against what this job is worth — if they pull it through.' },
        { label: 'Demand payment first', deltas: { gold: 20, adventurers: -15, quests: -8, equipment: 0 }, major: true, reputation: -5, chains: null, rumorText: 'Coin changes hands. The eastern road waits.', resultText: 'He hesitates, counts out coins with trembling fingers. You take them. Fifteen fighters move out at dawn — fewer than you\'d have sent otherwise — and the board shrinks for it. The road doesn\'t care about your arrangements.' },
      ],
    },
    {
      id: 'bw-m2',
      type: 'arc',
      npc: { emoji: '🗺️', name: 'Scout Leyla', role: 'Guild Scout' },
      situation: 'Your scouts return with maps of three bandit camps. Attacking all three costs lives and coin. But leaving any intact risks retaliation.',
      choices: [
        { label: 'Full assault — take all three', deltas: { adventurers: -20, equipment: -5, quests: 22, gold: 0 }, major: true, reputation: 5, chains: null, rumorText: 'Three camps taken. But the survivors scattered. Where do outlaws go?', resultText: 'Three camps. Three flags pulled down. Your team comes back thinner and lighter — equipment spent, people tired — but the board fills from the cleared road faster than you can post new commissions.' },
        { label: 'Target the largest camp only', deltas: { adventurers: -20, equipment: -5, quests: 22, gold: 0 }, major: true, reputation: 0, chains: 'chain-bw-survivors', rumorText: 'The largest camp fell. Two smaller ones watched from the treeline.', resultText: 'The big camp falls before nightfall at the same cost in fighters and equipment as a full assault. But two smaller ones are still out there. They watched from the treeline and said nothing. Somewhere in those hills, survivors are deciding what comes next.' },
      ],
    },
    {
      id: 'bw-m3',
      type: 'arc',
      npc: { emoji: '🕵️', name: 'The Informant', role: 'Shadowy Figure' },
      situation: 'A hooded figure arrives at night. They know who leads the bandits — a disgraced noble\'s bastard son. They\'ll sell you proof. What\'s that worth?',
      choices: [
        { label: 'Pay for the proof', deltas: { gold: -20, quests: 15, equipment: 3, adventurers: 0 }, major: true, reputation: 0, chains: null, rumorText: 'The proof is damning. Lord Harwick will not be pleased when he finds out you know.', resultText: 'Twenty coins lighter. The document changes hands in a back room lit by one candle. The proof nets you recovered equipment and opens new commission lines. You read it twice on the walk home. Lord Harwick\'s bastard. The city is going to be interesting for a while.' },
        { label: 'Threaten them instead', deltas: { gold: 20, adventurers: 3, quests: -20, equipment: -5 }, major: true, reputation: -5, chains: null, rumorText: 'Fear has its uses. The information came cheap — but their network closed to you.', resultText: 'The informant talks fast when afraid. The information arrives cheap and you pocket what you would have spent. But twenty quests\' worth of contract leads evaporate — and the informant\'s network just closed to you permanently.' },
      ],
    },
    {
      id: 'bw-m4',
      type: 'arc',
      npc: { emoji: '⚔️', name: 'Bandit Vanguard', role: 'Ambush Party' },
      situation: 'They knew you were coming. Your lead team is surrounded on the old road. Fight through or negotiate a retreat?',
      choices: [
        { label: 'Fight through', deltas: { adventurers: -20, equipment: -5, quests: 22, gold: 0 }, major: true, reputation: 5, chains: null, rumorText: null, resultText: 'The road runs red briefly. Then it runs clear. Your team emerges from the ambush short fighters and light on equipment — but the road ahead is theirs. Nobody speaks on the march back.' },
        { label: 'Negotiate a retreat', deltas: { gold: -20, adventurers: 3, quests: -5, equipment: 20 }, major: true, reputation: -5, chains: null, rumorText: 'They let you go — for a price. Some of your crew saw that as weakness.', resultText: 'They let your team pass for a price and a promise you\'re not proud of. You paid twenty in coin and came back with salvaged equipment that softens the loss — but half your crew saw the exchange, and the quests you abandoned weigh more than the gear.' },
      ],
    },
    {
      id: 'bw-m5',
      type: 'arc',
      npc: { emoji: '🗡️', name: 'Darro Half-Blood', role: 'Bandit Lord' },
      situation: 'The bandit leader sends a messenger. He offers a deal: stop hunting his people, and he\'ll ensure the eastern road stays clear — for a cut of merchant tolls.',
      choices: [
        { label: 'Refuse — end this', deltas: { gold: -5, adventurers: -20, quests: 22, equipment: 0 }, major: true, reputation: 5, chains: null, rumorText: null, resultText: 'Twenty fighters march again. The messenger rides back empty-handed. Whatever this costs in coin and lives, at least you\'ll be able to name it when it\'s over.' },
        { label: 'Take the deal', deltas: { gold: 20, adventurers: 0, quests: -15, equipment: -8 }, major: true, reputation: -10, chains: null, rumorText: 'Some will call it pragmatism. Others will call it what it is.', resultText: 'The deal is signed in a tavern nobody will remember. Darro Half-Blood raises a cup. You don\'t. The coin is real. The fifteen contracts that disappear from your board are real. The equipment you hand over as a show of good faith is real. What you call it is up to you.' },
      ],
    },
    {
      id: 'bw-m6-final',
      type: 'arc',
      npc: { emoji: '🏹', name: 'Darro Half-Blood', role: 'Bandit Lord — Final Stand' },
      situation: 'You\'ve cornered Darro at his stronghold. His last fighters stand between you and the end of this war. One last call: mercy or steel?',
      choices: [
        { label: 'Show mercy — exile him', deltas: { quests: 20, gold: 3, adventurers: -20, equipment: 0 }, major: true, reputation: 10, chains: null, rumorText: null, resultText: 'Darro Half-Blood walks away into the grey morning. Twenty fighters come home. The eastern road opens — and with it, more new work than your board can hold. Whatever comes next, you built that.' },
        { label: 'No mercy', deltas: { adventurers: -20, quests: 22, equipment: -5, gold: 5 }, major: true, reputation: 0, chains: null, rumorText: null, resultText: 'Steel ends what coin couldn\'t. The stronghold goes quiet. Twenty fighters short and a storeroom lighter — but the eastern road opens like a held breath finally released. The new commissions start arriving before the smoke clears.' },
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
        { label: 'Fund the rebuilding', deltas: { gold: -20, quests: 15, equipment: 3, adventurers: 0 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: 'You open the ledger and sign the order — twenty in coin and some timber, a real cost. By morning the first cart is rolling. The innkeeper stares at the receipt like he can\'t believe it. The road to his inn opens again, and so do new commissions from merchants who heard what you did.' },
        { label: 'Express regret, nothing more', deltas: { quests: -20, adventurers: 5, gold: 15, equipment: 0 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: 'The innkeeper thanks you for the words and goes back to sifting ash. Your coin stays in the ledger. But twenty quests\' worth of eastern road goodwill quietly evaporates. The road to the inn stays empty for a long time.' },
      ],
    },
  ],

  rumorTexts: [
    'A merchant from the east swears the bandits have a benefactor in the city.',
    'Three scouts haven\'t reported back. The eastern road smells of smoke.',
    'Lord Harwick visited the city council this morning. His mood was reportedly foul.',
  ],
}
