export const criminalCards = [
  {
    id: 'std-rival-spy',
    type: 'standard',
    npc: { emoji: '🕵️', name: 'Unknown Figure', role: 'Suspicious Stranger' },
    situation: 'A stranger offers coin to "share" your client list. You suspect a rival guild is behind this.',
    choices: [
      { label: 'Take the coin', deltas: { gold: 20, quests: -20 }, major: true, reputation: -5, chains: null, rumorText: 'Some bridges burn slowly. This one is now smouldering.' },
      { label: 'Show them the door', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-protection-racket',
    type: 'standard',
    npc: { emoji: '😤', name: 'Thieves\' Guild Enforcer', role: 'Street Muscle' },
    situation: 'A city gang demands monthly "protection" fees. Pay them off, or refuse and deal with the harassment.',
    choices: [
      { label: 'Pay the fee', deltas: { gold: -10 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Refuse and hire guards', deltas: { gold: -8, adventurers: -3 }, major: false, reputation: 5, chains: null, rumorText: 'Word spreads that your guild doesn\'t bow to street thugs.' },
    ],
  },
  {
    id: 'std-escaped-prisoner',
    type: 'standard',
    npc: { emoji: '⛓️', name: 'Escaped Prisoner', role: 'Fugitive' },
    situation: 'A shackled prisoner begs for sanctuary. She claims she was falsely convicted. The city watch will come asking.',
    choices: [
      { label: 'Hide her', deltas: { adventurers: 8, gold: -5 }, major: false, reputation: -5, chains: null, rumorText: 'Rumour has it someone is sheltering a fugitive near the guild district.' },
      { label: 'Turn her over', deltas: {}, major: false, reputation: 5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-prison-break',
    type: 'standard',
    npc: { emoji: '🚔', name: 'City Warden Crale', role: 'Prison Authority' },
    situation: 'The city prison had a break-in — someone helped a prisoner escape. The warden suspects your guild. Cooperate with the investigation or stonewall it.',
    choices: [
      { label: 'Cooperate fully', deltas: { quests: -8 }, major: false, reputation: 5, chains: null, rumorText: null },
      { label: 'Deny everything', deltas: {}, major: false, reputation: -5, chains: null, rumorText: 'The warden has been asking questions. Someone is talking.' },
    ],
  },
  {
    id: 'std-rival-smear',
    type: 'standard',
    npc: { emoji: '📣', name: 'Rival Guild Herald', role: 'Enemy Mouthpiece' },
    situation: 'A rival guild has been spreading lies about your guild\'s reliability in the market square. You can ignore it or fight back.',
    choices: [
      { label: 'Launch a counter-campaign', deltas: { gold: -12, quests: 10 }, major: false, reputation: 10, chains: null, rumorText: null },
      { label: 'Ignore the noise', deltas: { quests: -5 }, major: false, reputation: -5, chains: null, rumorText: null },
    ],
  },
  {
    id: 'std-haunted-job',
    type: 'standard',
    npc: { emoji: '👻', name: 'Superstitious Client', role: 'Spooked Merchant' },
    situation: 'A merchant\'s warehouse is "haunted" — his workers refuse to enter. Probably rats. Your people investigate for a small fee.',
    choices: [
      { label: 'Take the job', deltas: { gold: 10, adventurers: -3, quests: 5 }, major: false, reputation: 0, chains: null, rumorText: null },
      { label: 'Too small a job', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
    ],
  },
]
