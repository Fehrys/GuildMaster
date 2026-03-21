// audit-balance.mjs — Zero-sum balance audit for GuildMaster card files
// Rule: for every non-exempt choice, sum(gold + adventurers + quests + equipment) must be in [-5, +5]
// Exempt: crisis cards, NPC cards

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const TOLERANCE = 5;

// Files to audit: [url, exportName, cardSource]
// cardSource: 'array' = file exports array directly
//             'object.milestones' = file exports object with .milestones array (arc cards)
const FILES = [
  { path: '../src/data/cards/criminal.js',          export: 'criminalCards',        source: 'array' },
  { path: '../src/data/cards/guild-life.js',         export: 'guildLifeCards',       source: 'array' },
  { path: '../src/data/cards/merchants.js',          export: 'merchantCards',        source: 'array' },
  { path: '../src/data/cards/political.js',          export: 'politicalCards',       source: 'array' },
  { path: '../src/data/cards/standard.js',           export: 'chainedCards',         source: 'array' },
  { path: '../src/data/cards/factions/temple.js',    export: 'templeAllied',         source: 'array' },
  { path: '../src/data/cards/factions/thieves-guild.js', export: 'thievesGuildAllied', source: 'array' },
  { path: '../src/data/arcs/bandit-war.js',          export: 'banditWar',            source: 'object.milestones' },
  // events.js may not exist — handled with skipIfMissing
  { path: '../src/data/cards/events.js',             export: 'eventCards',           source: 'array', skipIfMissing: true },
];

function sumDeltas(deltas) {
  if (!deltas) return 0;
  return (deltas.gold || 0)
       + (deltas.adventurers || 0)
       + (deltas.quests || 0)
       + (deltas.equipment || 0);
}

function truncate(str, len) {
  if (!str) return '(no label)';
  return str.length > len ? str.slice(0, len - 1) + '…' : str;
}

async function auditFile(entry) {
  const fileUrl = new URL(entry.path, import.meta.url);
  let mod;

  try {
    mod = await import(fileUrl.href);
  } catch (err) {
    if (entry.skipIfMissing && (err.code === 'ERR_MODULE_NOT_FOUND' || err.code === 'MODULE_NOT_FOUND')) {
      return { skipped: true };
    }
    throw err;
  }

  const exported = mod[entry.export];
  if (!exported) {
    console.warn(`  WARNING: export "${entry.export}" not found in ${entry.path}`);
    return { violations: [] };
  }

  let cards;
  if (entry.source === 'array') {
    cards = exported;
  } else if (entry.source === 'object.milestones') {
    cards = exported.milestones || [];
  } else {
    cards = exported;
  }

  const violations = [];

  for (const card of cards) {
    if (!card.choices || !Array.isArray(card.choices)) continue;
    for (const choice of card.choices) {
      const sum = sumDeltas(choice.deltas);
      if (Math.abs(sum) > TOLERANCE) {
        violations.push({
          cardId: card.id || '(no id)',
          label: truncate(choice.label, 40),
          sum,
        });
      }
    }
  }

  return { violations };
}

async function main() {
  let totalViolations = 0;
  let anyViolations = false;

  for (const entry of FILES) {
    const label = entry.path.replace('../', '');
    const result = await auditFile(entry);

    if (result.skipped) {
      console.log(`\n[SKIP] ${label} — file not found`);
      continue;
    }

    const { violations } = result;

    if (violations.length === 0) {
      console.log(`\n[OK]  ${label} — no violations`);
    } else {
      anyViolations = true;
      console.log(`\n[FAIL] ${label} — ${violations.length} violation(s)`);
      for (const v of violations) {
        const sumStr = v.sum > 0 ? `+${v.sum}` : `${v.sum}`;
        console.log(`       ${v.cardId.padEnd(35)} "${v.label.padEnd(40)}" sum=${sumStr}`);
      }
      totalViolations += violations.length;
    }
  }

  console.log('\n' + '─'.repeat(70));
  if (anyViolations) {
    console.log(`AUDIT FAILED — ${totalViolations} zero-sum violation(s) found (threshold: ±${TOLERANCE})`);
    process.exit(1);
  } else {
    console.log(`AUDIT PASSED — all choices are within ±${TOLERANCE} zero-sum tolerance`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(2);
});
