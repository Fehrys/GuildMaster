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
          deltas: { adventurers: -5, quests: 5 },
          major: false,
          reputation: 10,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Offer gold but keep your people',
          deltas: { gold: -15 },
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
          deltas: { gold: -10, equipment: 10 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Haggle — she needs the money more than you need the salves',
          deltas: { gold: -5, equipment: 8 },
          major: false,
          reputation: -5,
          chains: null,
          rumorText: null,
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
          deltas: { quests: -5, adventurers: 5 },
          major: false,
          reputation: 10,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Decline respectfully — too many commitments',
          deltas: {},
          major: false,
          reputation: -5,
          chains: null,
          rumorText: null,
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
          deltas: { equipment: 15, adventurers: 3 },
          major: true,
          reputation: -10,
          chains: null,
          rumorText: 'Your guild is sheltering temple fugitives.',
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Refuse — too much heat for any price',
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
          deltas: { adventurers: -3, equipment: 8 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Decline — can\'t spare anyone right now',
          deltas: { quests: 5 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
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
          deltas: { gold: 20, equipment: 10, quests: -10 },
          major: true,
          reputation: -5,
          chains: null,
          rumorText: 'Strange activity has been spotted beneath the old quarter.',
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Report the crypt to the city council',
          deltas: { quests: 10 },
          major: false,
          reputation: 15,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },
}
