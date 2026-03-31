const npc = { emoji: '🏋️', name: 'Sergeant Brek', role: 'Combat Instructor' }
const npcId = 'sergeant-brek'

export const sergeantBrekCards = {
  encounter1: {
    level0: {
      id: 'npc-sergeant-brek-e1-l0',
      type: 'npc',
      npc,
      situation:
        'A scarred veteran marches into your guild hall and surveys your recruits with visible disdain. "I\'m Brek. Retired sergeant. Your people fight like farmers. I can fix that — if you let me run drills my way."',
      choices: [
        {
          label: 'Let him train your recruits his way',
          deltas: { adventurers: -3, equipment: 8 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "Three of your people are tied up in drills for a week and come back noticeably harder to surprise. Their equipment is better cared for too — Brek has opinions about maintenance. He grins once, on day three, then goes back to shouting.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Your guild trains its own people, thanks',
          deltas: { adventurers: 3 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          resultText: "Brek nods once and leaves without a word. Your people train at their own pace and the roster stays intact. You're fairly sure he respects the answer. You're less sure what you missed.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },

  encounter2: {
    levelNeg1: {
      id: 'npc-sergeant-brek-e2-lneg1',
      type: 'npc',
      npc,
      situation:
        'Brek reappears, arms crossed. "Fine, you don\'t want a teacher. But I\'ve got a contract your recruits can\'t handle alone — border skirmish, good pay. I\'ll lead the squad myself. Your people learn on the job, or they don\'t come back."',
      attribution:
        'Because you rejected his methods, he respects your independence but pushes you toward the deep end.',
      choices: [
        {
          label: 'Send a squad under Brek\'s command',
          deltas: { adventurers: -5, gold: 15, quests: 5 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "Five of your people march under Brek's flag and come back with coin and a look in their eyes that wasn't there before. Not all of them come back the same way they left. The contracts that follow Brek's name are the kind you can't get any other way.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Too dangerous for green fighters',
          deltas: { equipment: 5 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          resultText: "Brek finds another crew. You hear they handled it — took some losses. Your people stay on home contracts. The storeroom benefits from focused maintenance. Brek doesn't mention the skirmish rates next time.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
    levelPos1: {
      id: 'npc-sergeant-brek-e2-lpos1',
      type: 'npc',
      npc,
      situation:
        'Brek pulls you aside. "Your lot are shaping up. But I want to run a full combat trial — live steel, real danger. Some will wash out. Some might get hurt. But the ones who survive will be worth ten green recruits."',
      attribution:
        'Because you trusted his training, he\'s pushing for something harder — his loyalty demands you match his standards.',
      choices: [
        {
          label: 'Authorize the live combat trial',
          deltas: { adventurers: -5, equipment: 12 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "Two wash out. One breaks a wrist. The rest come back quieter, harder, and significantly better equipped for the work your guild actually does. Brek says nothing at the debrief except 'Again, tomorrow.' You start to understand why people follow him.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Drills are one thing, but this is too far',
          deltas: { adventurers: 3 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          resultText: "Brek accepts it without argument, which somehow feels worse than pushback. Your three promising recruits who might have washed out are still with you. The gap between what Brek thinks and what he says is quietly enormous.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },

  encounter3: {
    levelNeg2: {
      id: 'npc-sergeant-brek-e3-lneg2',
      type: 'npc',
      npc,
      situation:
        'Brek shows up with a dangerous glint in his eye. "I\'ve been hired to clear a monster nest in the old mines. My own crew fell through. I\'ll pay your guild handsomely — and I don\'t care if we like each other. Business is business."',
      attribution:
        'You\'ve repeatedly refused his guidance, so he treats you as a mercenary resource — but the pay is real.',
      choices: [
        {
          label: 'Take the contract — pure business',
          deltas: { gold: 20, adventurers: -8, quests: 10 },
          major: false,
          reputation: 5,
          chains: null,
          rumorText: null,
          resultText: "Eight of your fighters go into the mines. Some come back changed. Brek pays without delay, counts it correctly on the first try, and says: 'Good workers.' From him, that's a compliment.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Not worth the casualties',
          deltas: { quests: 5 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          resultText: "Brek finds another crew. You redirect your people to the contract board — the quests pile up efficiently. You wonder, later, what the mines cost the others.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
    level0: {
      id: 'npc-sergeant-brek-e3-l0',
      type: 'npc',
      npc,
      situation:
        'Brek has a proposition: the city garrison is short-staffed and offering bounties for guild fighters to fill temporary posts. Steady pay, decent experience, but your adventurers will be under military discipline for a month.',
      attribution:
        'He sees you as neither ally nor adversary — just another guild master he can do business with.',
      choices: [
        {
          label: 'Assign fighters to garrison duty',
          deltas: { adventurers: -5, gold: 15, equipment: 5 },
          major: false,
          reputation: 10,
          chains: null,
          rumorText: null,
          resultText: "Five of your fighters spend a month under garrison discipline and come back with city-issued gear, a healthy salary, and a mildly insufferable attitude about punctuality. Sergeant Brek sends a note: 'Keep it up.'",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Keep your people independent',
          deltas: { quests: 5 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
          resultText: "Brek shrugs. 'Your call.' No lecture. Your crew stays on your board. The contracts hold. He doesn't mention the garrison rates next time you cross paths.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
    levelPos2: {
      id: 'npc-sergeant-brek-e3-lpos2',
      type: 'npc',
      npc,
      situation:
        'Brek sits you down, dead serious. "I\'ve been building your people into soldiers. Now I need soldiers. A warlord is massing beyond the eastern pass. I\'m forming a volunteer company — and I want your best. This isn\'t a contract. It\'s a war."',
      attribution:
        'Your deep trust has made him see your guild as his own. Now he\'s calling in that bond for something massive.',
      choices: [
        {
          label: 'Commit your best fighters to the campaign',
          deltas: { adventurers: -10, equipment: -10, quests: 15 },
          major: true,
          reputation: 15,
          chains: null,
          rumorText: 'Your guild has joined the eastern volunteer company.',
          resultText: "Your ten best fighters march east carrying the good equipment. The city watches them go. That evening the hall is quieter than it's ever been — but the contracts that follow Brek's campaign will be the kind that define what your guild becomes.",
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Your guild isn\'t an army — refuse',
          deltas: { adventurers: 5 },
          major: false,
          reputation: -5,
          chains: null,
          rumorText: null,
          resultText: "Brek looks at you for a long moment. 'Fair enough,' he says. 'You built something worth protecting. I understand that.' He leaves alone. Your fighters stay. So does their reputation — for better and worse.",
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },
}
