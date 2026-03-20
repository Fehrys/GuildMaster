const npc = { emoji: '🤫', name: 'Jolen the Fence', role: 'Black Market Contact' }
const npcId = 'jolen-fence'

export const jolenFenceCards = {
  encounter1: {
    level0: {
      id: 'npc-jolen-fence-e1-l0',
      type: 'npc',
      npc,
      situation:
        'A wiry man in a heavy cloak slips into your office after hours. He introduces himself as Jolen and says he can move "surplus goods" for your guild — no questions asked. He has a shipment of confiscated weapons looking for a home.',
      choices: [
        {
          label: 'Buy the weapons at a steep discount',
          deltas: { gold: -10, equipment: 15 },
          major: false,
          reputation: -5,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Tell him you run a legitimate operation',
          deltas: {},
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },

  encounter2: {
    levelNeg1: {
      id: 'npc-jolen-fence-e2-lneg1',
      type: 'npc',
      npc,
      situation:
        'Jolen shows up again, all business. "Look, I know you\'re squeamish. But I\'ve got a client who needs monster parts — legally sourced. Your adventurers kill monsters anyway. I\'ll pay top coin, no grey area."',
      attribution:
        'Because you turned him down before, he\'s pitching something cleaner — but his margins are razor-thin.',
      choices: [
        {
          label: 'Sell him monster parts from your hunts',
          deltas: { gold: 15, quests: -5 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: 1 },
        },
        {
          label: 'You don\'t need a middleman for legal goods',
          deltas: { quests: 5 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: -1 },
        },
      ],
    },
    levelPos1: {
      id: 'npc-jolen-fence-e2-lpos1',
      type: 'npc',
      npc,
      situation:
        'Jolen grins when he sees you. "We\'re friends now, right? I need a favor. A noble\'s warehouse needs emptying before an audit. Your people do the heavy lifting, I handle the buyers. Sixty-forty split — your way."',
      attribution:
        'Because you played along last time, he thinks you\'re ready for bigger jobs.',
      choices: [
        {
          label: 'Send a crew to empty the warehouse',
          deltas: { gold: 20, adventurers: -3 },
          major: false,
          reputation: -10,
          chains: null,
          rumorText: 'Your guild was seen near a noble\'s warehouse at night.',
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Too risky — pass on this one',
          deltas: {},
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },

  encounter3: {
    levelNeg2: {
      id: 'npc-jolen-fence-e3-lneg2',
      type: 'npc',
      npc,
      situation:
        'Jolen corners you at a tavern. No pleasantries. "The city guard is cracking down on my network. I need to liquidate — fast. I\'ll sell you my entire inventory at cost. Weapons, potions, maps. Take it or I dump it in the river."',
      attribution:
        'You\'ve rejected him twice, so there\'s no trust — but desperation makes for honest deals.',
      choices: [
        {
          label: 'Buy his entire stock at cost',
          deltas: { gold: -25, equipment: 15, quests: 10 },
          major: false,
          reputation: -5,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Let him sort out his own problems',
          deltas: {},
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: 0 },
        },
      ],
    },
    level0: {
      id: 'npc-jolen-fence-e3-l0',
      type: 'npc',
      npc,
      situation:
        'Jolen offers a simple exchange: he has a buyer for trained adventurers as bodyguards for a merchant caravan. Good pay, legitimate contract — but your people will be gone for a while.',
      attribution:
        'Your mixed signals keep things transactional — he offers fair terms, nothing more.',
      choices: [
        {
          label: 'Hire out adventurers as caravan guards',
          deltas: { adventurers: -5, gold: 20 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Decline — you need all hands on deck',
          deltas: { adventurers: 3 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: -1 },
        },
      ],
    },
    levelPos2: {
      id: 'npc-jolen-fence-e3-lpos2',
      type: 'npc',
      npc,
      situation:
        'Jolen pulls you into a back room. "I trust you, so here\'s the real play. The merchant prince\'s vault key is being transported tomorrow. One heist, and we split enough gold to retire. But if we fail, we hang."',
      attribution:
        'Your partnership has emboldened him to propose something that could make or break you both.',
      choices: [
        {
          label: 'Plan the heist together',
          deltas: { gold: 25, adventurers: -5, equipment: -10 },
          major: true,
          reputation: -15,
          chains: null,
          rumorText: 'A guild master was spotted near the merchant prince\'s convoy.',
          relationships: { [npcId]: 1 },
        },
        {
          label: 'You\'ve gone far enough — walk away',
          deltas: { equipment: 5 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },
}
