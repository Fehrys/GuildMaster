const npc = { emoji: '🙏', name: 'Sister Maren', role: 'Temple Priest' }
const npcId = 'sister-maren'

export const sisterMarenCards = {
  encounter1: {
    level0: {
      id: 'npc-sister-maren-e1-l0',
      type: 'npc',
      npc,
      situation:
        'A priestess in faded robes approaches your guild hall. She explains the temple infirmary is overwhelmed — plague season — and she needs adventurers to escort healers into the outer villages.',
      choices: [
        {
          label: 'Send a team to help the villages',
          deltas: { adventurers: -9, quests: 12 },
          major: false,
          reputation: 10,
          chains: null,
          rumorText: null,
          resultText: "Sister Maren clasps her hands briefly. Five of your people spend the week escorting healers instead of chasing contracts, but the work earns your guild more goodwill than most paid jobs do. 'The villages will remember,' she says softly.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Offer gold but keep your people',
          deltas: { gold: -15 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "She takes the coin with a small nod — you paid what you would have spent on people, plus more, and she still needed people. The transaction is complete, and somehow that makes it feel smaller than it should.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },

  encounter2: {
    levelNeg1: {
      id: 'npc-sister-maren-e2-lneg1',
      type: 'npc',
      npc,
      situation:
        'Sister Maren returns, visibly exhausted. She doesn\'t ask for favors this time — instead she offers to sell you a cache of blessed salves the temple can no longer afford to store.',
      attribution:
        'Because you kept your distance last time, she treats this as a simple transaction.',
      choices: [
        {
          label: 'Buy the salves at her asking price',
          deltas: { gold: -14, equipment: 16 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          resultText: "She handles it with quiet efficiency — goods exchanged, coin counted, receipt issued. You leave with a solid supply of blessed salves and a lighter purse. You're starting to understand each other.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Haggle — she needs the money more than you need the salves',
          deltas: { gold: 12, equipment: -18 },
          major: false,
          reputation: -5,
          chains: null,
          rumorText: null,
          resultText: "Sister Maren hands over the salves without argument. You saved some coin and came away with slightly fewer than the asking price warranted. She notes it the way she notes everything — without comment.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
    levelPos1: {
      id: 'npc-sister-maren-e2-lpos1',
      type: 'npc',
      npc,
      situation:
        'Sister Maren invites you to sit on the temple council as a lay advisor. It\'s an honor — but the council meets weekly, and they expect your guild to enforce their moral edicts in the district.',
      attribution:
        'Because you helped before, she sees you as a genuine ally of the faith.',
      choices: [
        {
          label: 'Accept the council seat',
          deltas: { quests: -13, adventurers: 17 },
          major: false,
          reputation: 10,
          chains: null,
          rumorText: null,
          resultText: "The weekly meetings cost you contracts you'd normally have chased. But the temple's network starts routing fighters your way — people who trust Maren's word more than a guild notice board. The tradeoff holds.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Decline respectfully — too many commitments',
          deltas: { quests: -15 },
          major: false,
          reputation: -5,
          chains: null,
          rumorText: null,
          resultText: "Sister Maren accepts the refusal with grace. The contracts you'd have gained through her network simply go elsewhere. She doesn't walk you to the door this time.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },

  encounter3: {
    levelNeg2: {
      id: 'npc-sister-maren-e3-lneg2',
      type: 'npc',
      npc,
      situation:
        'Sister Maren arrives unannounced, clearly desperate. The temple has been accused of harboring fugitives. She offers you the temple\'s sacred relics — worth a fortune — if you hide three refugees in your guild hall. No loyalty required; just a deal.',
      attribution:
        'Because you\'ve shown no interest in the temple, she\'s offering raw value with no obligations.',
      choices: [
        {
          label: 'Take the relics and hide the refugees',
          deltas: { equipment: 20, adventurers: 10 },
          major: true,
          reputation: -10,
          chains: null,
          rumorText: 'Your guild is sheltering temple fugitives.',
          resultText: "The three refugees are quiet and take up space in the back hall. The relics — worth more than you expected — go into secure storage. Temple contacts start appearing on your recruitment boards within the week. Sister Maren says only: 'I won't forget this.'",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Refuse — too much heat for any price',
          deltas: { quests: -20 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "She nods once, as though she had already prepared for this answer. Three temple-connected contracts that might have come your way quietly don't. You watch her walk back in alone and feel the weight of something you chose not to carry.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
    level0: {
      id: 'npc-sister-maren-e3-l0',
      type: 'npc',
      npc,
      situation:
        'Sister Maren stops by with a straightforward proposition: the temple is training new healers and needs a practice group. Lend her some adventurers for a week, and they\'ll come back patched up and knowing basic field medicine.',
      attribution:
        'You\'ve been neither ally nor obstacle — she keeps things professional.',
      choices: [
        {
          label: 'Send adventurers for healer training',
          deltas: { adventurers: -16, equipment: 16 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "Your fighters spend three days at the temple and come back lighter on recklessness and heavier on field medicine knowledge. Sister Maren sends a note: 'They were attentive. Unexpected.'",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Decline — can\'t spare anyone right now',
          deltas: { adventurers: 9, quests: 8 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          resultText: "Sister Maren thanks you for your time. Your crew stays on the board and the quests pile up. She means it when she says the offer stands — and you get the sense that makes declining feel oddly worse.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
    levelPos2: {
      id: 'npc-sister-maren-e3-lpos2',
      type: 'npc',
      npc,
      situation:
        'Sister Maren trusts you completely now — perhaps too much. She reveals the temple has discovered an underground crypt beneath the city, likely filled with artifacts. She wants your guild to excavate it secretly before the city council finds out. If discovered, both of you face serious consequences.',
      attribution:
        'Because of your deep bond with the temple, she\'s sharing secrets that could ruin you both.',
      choices: [
        {
          label: 'Excavate the crypt in secret',
          deltas: { gold: 25, equipment: 22, quests: -15, adventurers: -8 },
          major: true,
          reputation: -5,
          chains: null,
          rumorText: 'Strange activity has been spotted beneath the old quarter.',
          resultText: "The crypt yields its secrets at the cost of weeks your crew could have spent on contracts. The artifacts surface one by one — valuable enough to justify every lost commission. Sister Maren prays over each one. You're not sure if that's comfort or a warning.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Report the crypt to the city council',
          deltas: { quests: 20, adventurers: 20, equipment: 10, gold: -10 },
          major: false,
          reputation: 15,
          chains: null,
          rumorText: null,
          resultText: "The council dispatches a team by afternoon and credits your guild for the find — ten new institutional contracts follow. Sister Maren learns of it by evening. She doesn't speak to you at the next gathering. Not unkindly. Just carefully.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },
}
