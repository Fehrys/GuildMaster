// Chained cards — follow-up events triggered by choices above
export const chainedCards = [
  {
    id: 'chain-alchemist-done',
    type: 'chained',
    npc: { emoji: '⚗️', name: 'Maeva the Alchemist', role: 'City Alchemist' },
    situation: 'Maeva returns your equipment — reinforced, sharpened, treated with alchemical compounds. She looks satisfied.',
    choices: [
      { label: 'Accept the return', deltas: { equipment: 18, gold: -15 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "Maeva hands over the equipment with the careful pride of someone who stayed up late to get it right. Fifteen coin poorer, your storeroom is considerably better armed for it." },
      { label: 'Sell the upgraded gear', deltas: { gold: 15, equipment: -12 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "The buyer pays well and asks no questions. Maeva would be annoyed if she found out. You decide not to tell her — and pocket the coin before you change your mind." },
    ],
  },
  {
    id: 'chain-treasure-dig',
    type: 'chained',
    npc: { emoji: '🪙', name: 'Exhausted Prospector', role: 'Amateur Treasure Hunter' },
    situation: 'Your team returns from the dig. The hoard was real — but smaller than expected. Still, everyone gets a cut.',
    choices: [
      { label: 'Share the windfall', deltas: { gold: 20, adventurers: -12, quests: -5 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "You split it right there in the hall, coin by coin, until everyone has a share. The room gets loud in the best possible way. Three fewer contracts handled this week — worth every one." },
      { label: 'Keep the lion\'s share', deltas: { gold: 25, adventurers: -20 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "The ledger looks excellent. The hall looks empty. Three of your best fighters are quietly asking around about other guilds by end of week." },
    ],
  },
  {
    id: 'chain-tax-ignored',
    type: 'chained',
    npc: { emoji: '⚖️', name: 'City Bailiff', role: 'Law Enforcement' },
    situation: 'The city sent officers. Your guild is fined double for the missed declaration. Resistance is not advised.',
    choices: [
      { label: 'Pay the fine', deltas: { gold: -20, quests: 15 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "You sign the payment order without argument, which seems to confuse the bailiff. He double-checks the stamp and leaves. Twenty coin gone. The board reopens. That's the deal." },
      { label: 'Argue the case', deltas: { gold: -10, quests: -10, adventurers: 15 }, major: false, reputation: -5, chains: null, rumorText: null, resultText: "The argument costs ten in coin, ten in lost contracts, and earns your fighters a story they find funnier than you do." },
    ],
  },
  {
    id: 'chain-merc-healed',
    type: 'chained',
    npc: { emoji: '🩹', name: 'Sera Ironfoot', role: 'Recovered Mercenary' },
    situation: 'The mercenary you sheltered has recovered. She offers to join your roster properly — for a modest equipment cost.',
    choices: [
      { label: 'Welcome her in', deltas: { adventurers: 10, equipment: -8 }, major: false, reputation: 5, chains: null, rumorText: null, resultText: "Sera Ironfoot takes the oath like she means it. The gear she needs comes out of the storeroom and goes onto her back where it belongs." },
      { label: 'Wish her luck', deltas: { gold: 6, quests: -8 }, major: false, reputation: 0, chains: null, rumorText: null, resultText: "You send her off with a handshake and a coin for the road. A few of the contracts she'd have taken go unfilled." },
    ],
  },
]
