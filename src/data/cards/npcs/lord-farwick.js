const npc = { emoji: '👑', name: 'Lord Farwick', role: 'Minor Nobleman' }
const npcId = 'lord-farwick'

export const lordFarwickCards = {
  encounter1: {
    level0: {
      id: 'npc-lord-farwick-e1-l0',
      type: 'npc',
      npc,
      situation:
        'A perfumed messenger delivers an invitation to dine with Lord Farwick, a minor nobleman known for his political ambitions. At dinner, he proposes a contract: your guild provides security for his upcoming gala in exchange for introductions to the merchant elite.',
      choices: [
        {
          label: 'Accept the gala contract',
          deltas: { adventurers: -10, quests: 10 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "Three of your people spend an evening standing guard at the most boring party in the city. By the following week, Farwick's introductions have put ten new commissions on your board. Insufferable man. He delivers.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Decline — you\'re not for hire by nobles',
          deltas: { gold: 5, quests: -10 },
          major: false,
          reputation: -5,
          chains: null,
          rumorText: null,
          resultText: "Lord Farwick receives the refusal with a thin smile. You save the evening's expenses and go back to your work. He files you away, along with everything else he'll use to define you eventually.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },

  encounter2: {
    levelNeg1: {
      id: 'npc-lord-farwick-e2-lneg1',
      type: 'npc',
      npc,
      situation:
        'Farwick sends a different kind of message this time — through a lawyer. His rival, Lady Caston, is encroaching on territory near your guild hall. Farwick offers to block her petition in court if you sign an exclusive supply contract with his estates. No friendship required.',
      attribution:
        'Because you rebuffed him before, he\'s approaching through legal channels instead of charm.',
      choices: [
        {
          label: 'Sign the exclusive supply contract',
          deltas: { gold: 10, quests: -8 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          resultText: "The lawyer drafts it. You sign it. Farwick's rival backs down by the end of the week. The exclusive arrangement costs you flexibility on the board, but his estates pay reliably and on time.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Handle Lady Caston yourself',
          deltas: { gold: -10, quests: 8 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "You spend coin handling Caston that Farwick would have blocked for free. The board gains room to breathe. You hear that Farwick spent the morning in a noticeably poor mood.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
    levelPos1: {
      id: 'npc-lord-farwick-e2-lpos1',
      type: 'npc',
      npc,
      situation:
        'Farwick invites you to a private meeting. He\'s maneuvering for a seat on the city council and needs your guild to publicly endorse his candidacy. In return, he promises favorable guild regulations — but rival factions will take notice.',
      attribution:
        'Because you helped with the gala, he now sees your guild as a political asset to leverage.',
      choices: [
        {
          label: 'Endorse his candidacy publicly',
          deltas: { quests: 10, gold: 10 },
          major: false,
          reputation: -5,
          chains: null,
          rumorText: 'Your guild is backing Farwick\'s political ambitions.',
          resultText: "Your guild's name appears on posters the next morning. Farwick's introductions pay — contracts and coin both follow. Three rival factions are visibly not pleased, and the cost of that will arrive in time.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Stay out of politics',
          deltas: { equipment: 5, gold: 5 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "Lord Farwick says 'Of course' in the tone that means the opposite. You use the resources you kept for yourself rather than his campaign. He pours more wine. You both know what his tone meant.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },

  encounter3: {
    levelNeg2: {
      id: 'npc-lord-farwick-e3-lneg2',
      type: 'npc',
      npc,
      situation:
        'Farwick\'s servant arrives with a sealed letter. He\'s losing a power struggle and his enemies are circling. He offers you the deed to a warehouse district property — free and clear — if your guild intimidates a key witness in the proceedings. He knows you owe him nothing, so the bribe is generous.',
      attribution:
        'You\'ve refused him twice. He\'s desperate enough to offer real value with no pretense of friendship.',
      choices: [
        {
          label: 'Intimidate the witness, take the property',
          deltas: { gold: 25, quests: 10 },
          major: true,
          reputation: -15,
          chains: null,
          rumorText: 'A witness in the Farwick trial has gone suspiciously silent.',
          resultText: "The witness goes silent. The deed arrives via courier the next morning — a warehouse district property, free and clear, plus a finder's fee Farwick never explicitly authorized. He confirms nothing. That's how men like him stay clean.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Let him lose on his own terms',
          deltas: { quests: -10 },
          major: false,
          reputation: 10,
          chains: null,
          rumorText: null,
          resultText: "Farwick loses the case. You gain a clean conscience and the kind of reputation that doesn't cost anything today. The commissions you passed on stay where they are. With Farwick, you suspect the ledger will reopen eventually.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
    level0: {
      id: 'npc-lord-farwick-e3-l0',
      type: 'npc',
      npc,
      situation:
        'Farwick proposes a straightforward arrangement: his estates produce more food than they can sell, and your guild always needs provisions. A trade deal — his surplus grain for your guild\'s patrol services along his trade routes.',
      attribution:
        'With no strong feelings either way, he keeps things practical and mutually beneficial.',
      choices: [
        {
          label: 'Accept the trade and patrol arrangement',
          deltas: { adventurers: -8, gold: 15 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "Three of your people spend the season on estate roads — quiet work, reliable pay. The grain arrives on schedule. It's the most ordinary transaction you've had with a nobleman. That, you realize, is its own kind of relief.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'You prefer to source provisions independently',
          deltas: { equipment: 15 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          resultText: "He accepts the refusal with a short nod. You source your own provisions, your own way — the storeroom stays stocked. Farwick goes back to his accounting. It's not personal. He makes everything feel personal anyway.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
    levelPos2: {
      id: 'npc-lord-farwick-e3-lpos2',
      type: 'npc',
      npc,
      situation:
        'Farwick has won his council seat — with your help. Now he reveals his true play: he\'s orchestrating a hostile takeover of the merchant guild and wants your adventurers to "secure" their headquarters during the vote. It\'s technically legal. Technically.',
      attribution:
        'Your alliance has given him the confidence to use your guild as the muscle in a major power grab.',
      choices: [
        {
          label: 'Secure the merchant guild headquarters',
          deltas: { gold: 25, quests: 10, adventurers: -10 },
          major: true,
          reputation: -10,
          chains: null,
          rumorText: 'Armed adventurers were seen at the merchant guild during the council vote.',
          resultText: "Eight of your people lock down the building while the vote goes through. Farwick's reward arrives promptly — enough coin and new contracts to justify who you used and what it looked like. The merchant guild calls it a coup. Technically, it was.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'This is where you draw the line',
          deltas: { adventurers: 15, gold: -10 },
          major: false,
          reputation: 10,
          chains: null,
          rumorText: null,
          resultText: "Farwick stares long enough to become uncomfortable. Then: 'I suppose there are limits after all.' He sounds almost approving. Your people stay where they belong. Some lines are worth the reputation.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },
}
