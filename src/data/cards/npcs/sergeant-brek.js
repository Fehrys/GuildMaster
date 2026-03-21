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
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Your guild trains its own people, thanks',
          deltas: { adventurers: 3 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
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
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Too dangerous for green fighters',
          deltas: { equipment: 5 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
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
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Drills are one thing, but this is too far',
          deltas: { adventurers: 3 },
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
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Not worth the casualties',
          deltas: { quests: 5 },
          major: false,
          reputation: 0,
          chains: null,
          rumorText: null,
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
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Keep your people independent',
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
          relationships: { [npcId]: 1 },
        },
        {
          label: 'Your guild isn\'t an army — refuse',
          deltas: { adventurers: 5 },
          major: false,
          reputation: -5,
          chains: null,
          rumorText: null,
          relationships: { [npcId]: -1 },
        },
      ],
    },
  },
}
