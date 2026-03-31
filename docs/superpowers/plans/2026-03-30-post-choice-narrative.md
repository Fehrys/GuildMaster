# Post-Choice Narrative — `resultText` Writing Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `resultText` string to every non-rumor card choice in the game, providing immersive post-decision narrative that varies by card type and NPC relationship.

**Architecture:** Pure data writing pass — no engine or UI changes needed (rendering is already wired in `game.js`). A coverage test validates completeness. Card files are edited group by group following the processing order in the spec.

**Tech Stack:** Vitest (test runner), vanilla JS card data files

---

## Spec Reference

Full writing rules: `docs/superpowers/specs/2026-03-30-post-choice-narrative.md`

**Length by card type:**
| Type | Length | Tone |
|------|--------|------|
| `standard` / `chained` | 1–2 sentences | Varied voice |
| `crisis` | 1–2 sentences | Urgent, heavy |
| `events` | 2–3 sentences | City-scale weight |
| `npc` | 2–4 sentences | Personal, name NPC, imply memory |
| `arc` milestones | 2–4 sentences | Story-forward, dramatic |

**Key rules:**
- **Show consequences diegetically** — every `resultText` must imply what was gained or lost in story terms. If adventurers left, say they left. If coin was spent, reference the cost. If gear arrived, mention the storeroom. The player should feel the outcome without reading the delta.
- **Voice rotation** — alternate between player, NPC reaction, third person, collective guild, and ambient world.
- **Diegetic numbers OK** — "You lost almost 150 gold just for that." Direct delta echoes forbidden — never write "+15 equipment."
- **NPC memory** — accept and refuse choices must feel drastically opposite from the NPC's point of view. Imply the NPC will remember.
- **No repetition** — no two `resultText` values in the same file should open identically or carry the same emotional beat.

---

## Files Modified

| File | Group | Action |
|------|-------|--------|
| `tests/data/result-text.test.js` | — | Create: coverage test |
| `src/data/cards/npcs/jolen-fence.js` | A – NPCs | Modify: add `resultText` |
| `src/data/cards/npcs/sister-maren.js` | A – NPCs | Modify: add `resultText` |
| `src/data/cards/npcs/lord-farwick.js` | A – NPCs | Modify: add `resultText` |
| `src/data/cards/npcs/sergeant-brek.js` | A – NPCs | Modify: add `resultText` |
| `src/data/arcs/bandit-war.js` | B – Arc | Modify: add `resultText` |
| `src/data/cards/third-choices.js` | B – Arc | Modify: add `resultText` |
| `src/data/cards/events.js` | C – Events | Modify: add `resultText` |
| `src/data/cards/guild-life.js` | D – Standard | Modify: add `resultText` |
| `src/data/cards/merchants.js` | D – Standard | Modify: add `resultText` |
| `src/data/cards/political.js` | D – Standard | Modify: add `resultText` |
| `src/data/cards/criminal.js` | D – Standard | Modify: add `resultText` |
| `src/data/cards/crisis.js` | E – Crisis | Modify: add `resultText` |
| `src/data/cards/standard.js` | F – Chained | Modify: add `resultText` |

---

## Task 1: Coverage Test

**Files:**
- Create: `tests/data/result-text.test.js`

- [ ] **Step 1: Create the test file**

```js
import { describe, test, expect } from 'vitest'
import { npcRegistry } from '../../src/data/cards/npcs/index.js'
import { buildBasePool, worldEventCards } from '../../src/data/cards/registry.js'
import { crisisCards } from '../../src/data/cards/crisis.js'
import { chainedCards } from '../../src/data/cards/standard.js'
import { banditWarThirdChoices } from '../../src/data/cards/third-choices.js'
import { banditWar } from '../../src/data/arcs/bandit-war.js'

function hasResultText(choice) {
  return typeof choice.resultText === 'string' && choice.resultText.trim().length > 0
}

describe('resultText coverage', () => {
  test('all standard pool choices have resultText', () => {
    const pool = buildBasePool()
    for (const card of pool) {
      for (const choice of card.choices) {
        expect(
          hasResultText(choice),
          `${card.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
  })

  test('all event card choices have resultText', () => {
    for (const card of worldEventCards) {
      for (const choice of card.choices) {
        expect(
          hasResultText(choice),
          `${card.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
  })

  test('all crisis card choices have resultText', () => {
    for (const resource of Object.values(crisisCards)) {
      for (const card of Object.values(resource)) {
        for (const choice of card.choices) {
          expect(
            hasResultText(choice),
            `${card.id} / "${choice.label}" is missing resultText`
          ).toBe(true)
        }
      }
    }
  })

  test('all chained card choices have resultText', () => {
    for (const card of chainedCards) {
      for (const choice of card.choices) {
        expect(
          hasResultText(choice),
          `${card.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
  })

  test('all third-choice choices have resultText', () => {
    for (const entry of banditWarThirdChoices) {
      expect(
        hasResultText(entry.choice),
        `${entry.cardId} / "${entry.choice.label}" is missing resultText`
      ).toBe(true)
    }
  })

  test('all NPC card choices have resultText', () => {
    for (const [npcId, npcEntry] of Object.entries(npcRegistry)) {
      for (const [encKey, encounter] of Object.entries(npcEntry.cards)) {
        for (const [levelKey, card] of Object.entries(encounter)) {
          for (const choice of card.choices) {
            expect(
              hasResultText(choice),
              `${npcId} / ${encKey} / ${levelKey} / "${choice.label}" is missing resultText`
            ).toBe(true)
          }
        }
      }
    }
  })

  test('all bandit war milestone choices have resultText', () => {
    for (const milestone of banditWar.milestones) {
      for (const choice of milestone.choices) {
        expect(
          hasResultText(choice),
          `${milestone.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
    for (const card of banditWar.chainedCards) {
      for (const choice of card.choices) {
        expect(
          hasResultText(choice),
          `${card.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

Expected: ALL 7 tests FAIL with messages like `npc-jolen-fence-e1-l0 / "Buy the weapons at a steep discount" is missing resultText`

- [ ] **Step 3: Commit the test**

```bash
git add tests/data/result-text.test.js
git commit -m "test: add resultText coverage test for all card choices"
```

---

## Task 2: NPC — Jolen the Fence

**Files:**
- Modify: `src/data/cards/npcs/jolen-fence.js`

Add `resultText` after `rumorText` and before `relationships` on each choice.

Deltas reference: `gold: -10, equipment: +15` / `equipment: -3` / `gold: +15, quests: -5` / `quests: +5` / `gold: +20, adventurers: -3, reputation: -10` / `gold: -5` / `gold: -25, equipment: +15, quests: +10` / `quests: -5` / `adventurers: -5, gold: +20` / `adventurers: +3` / `gold: +25, adventurers: -5, equipment: -10, reputation: -15` / `equipment: +5`

- [ ] **Step 1: Add resultText to every choice in `jolen-fence.js`**

**encounter1 / level0** (first meeting, weapons deal — `gold: -10, equipment: +15` / `equipment: -3`):
```js
// Choice 1: Buy the weapons
resultText: "Jolen pulls back the tarp — blades, crossbows, kit enough to outfit half your roster. He pockets the coin without a word, just a slow nod. By morning your storeroom is fuller than it's been in months.",
// Choice 2: Tell him you run a legitimate operation
resultText: "He shrugs and pulls the cloak back over whatever he was carrying. You return to your accounts. The storeroom stays lean. It's an honest life, or something like it.",
```

**encounter2 / levelNeg1** (monster parts — you rejected him before — `gold: +15, quests: -5` / `quests: +5`):
```js
// Choice 1: Sell him monster parts
resultText: "Jolen counts the coin twice. 'Pleasure doing business.' He almost means it. Your hunters spend three days on delivery runs instead of contract work, but the purse is healthier for it.",
// Choice 2: You don't need a middleman for legal goods
resultText: "His expression doesn't change, but he writes something in that little book he carries. Your hunters keep their contracts. You keep your distance from Jolen's books.",
```

**encounter2 / levelPos1** (warehouse job — you played along before — `gold: +20, adventurers: -3, reputation: -10` / `gold: -5`):
```js
// Choice 1: Send a crew to empty the warehouse
resultText: "Three of your people are gone for a week and come back without much to say about where they were. The cut arrives on time, clean and counted. Jolen is pleased. The neighborhood is already talking.",
// Choice 2: Too risky — pass on this one
resultText: "Jolen doesn't argue. He just marks something in that book and leaves. You'll feel the opportunity cost in the ledger by end of month. Worth it, probably.",
```

**encounter3 / levelNeg2** (desperate liquidation — `gold: -25, equipment: +15, quests: +10` / `quests: -5`):
```js
// Choice 1: Buy his entire stock at cost
resultText: "You walk out carrying more than you arrived with — weapons, salves, maps — at cost price that still left a sizable hole in your treasury. Jolen seems almost relieved. 'You're stranger than I thought,' he mutters.",
// Choice 2: Let him sort out his own problems
resultText: "He dumps it in the river. You hear about it later from a fisherman. Three contracts that might have come from those maps are simply gone now. Probably for the best.",
```

**encounter3 / level0** (caravan guards — neutral — `adventurers: -5, gold: +20` / `adventurers: +3`):
```js
// Choice 1: Hire out adventurers as caravan guards
resultText: "Five of your people are gone three weeks and come back sunburned and decently paid. The coin arrives right on schedule. Jolen is the most reliable person you've done business with. That fact alone is unsettling.",
// Choice 2: Decline — you need all hands on deck
resultText: "Jolen finds someone else. He always does. You redirect the extra hands to your own board. The hall benefits. You wonder, briefly, about the road.",
```

**encounter3 / levelPos2** (vault heist — deep partnership — `gold: +25, adventurers: -5, equipment: -10, reputation: -15` / `equipment: +5`):
```js
// Choice 1: Plan the heist together
resultText: "You wake up three days later richer than planned, short five fighters, and missing equipment you'd rather not explain. Jolen is already gone. In the spot where he slept: 'Don't contact me for a while. — J'",
// Choice 2: You've gone far enough — walk away
resultText: "Jolen stares at you a long time. 'You know,' he says finally, 'I almost respect that.' He walks out alone. The gear you'd earmarked for the job stays in the storeroom — put it to better use.",
```

- [ ] **Step 2: Run test**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

- [ ] **Step 3: Commit**

```bash
git add src/data/cards/npcs/jolen-fence.js
git commit -m "feat: add resultText to Jolen the Fence NPC choices"
```

---

## Task 3: NPC — Sister Maren

**Files:**
- Modify: `src/data/cards/npcs/sister-maren.js`

Deltas reference: `adventurers: -5, quests: +5, reputation: +10` / `gold: -15, reputation: +5` / `gold: -10, equipment: +10` / `gold: -5, equipment: +8, reputation: -5` / `quests: -5, adventurers: +5, reputation: +10` / `quests: -5, reputation: -5` / `equipment: +15, adventurers: +3, reputation: -10` / `quests: -3, reputation: +5` / `adventurers: -3, equipment: +8, reputation: +5` / `quests: +5` / `gold: +20, equipment: +10, quests: -10, reputation: -5` / `quests: +10, reputation: +15`

- [ ] **Step 1: Add resultText to every choice in `sister-maren.js`**

**encounter1 / level0** (plague escort — `adventurers: -5, quests: +5, reputation: +10` / `gold: -15, reputation: +5`):
```js
// Choice 1: Send a team to help the villages
resultText: "Sister Maren clasps her hands briefly. Five of your people spend the week escorting healers instead of chasing contracts, but the work earns your guild more goodwill than most paid jobs do. 'The villages will remember,' she says softly.",
// Choice 2: Offer gold but keep your people
resultText: "She takes the coin with a small nod — you paid what you would have spent on people, plus more, and she still needed people. The transaction is complete, and somehow that makes it feel smaller than it should.",
```

**encounter2 / levelNeg1** (selling salves — `gold: -10, equipment: +10` / `gold: -5, equipment: +8, reputation: -5`):
```js
// Choice 1: Buy the salves at her asking price
resultText: "She handles it with quiet efficiency — goods exchanged, coin counted, receipt issued. You leave with a solid supply of blessed salves and a lighter purse. You're starting to understand each other.",
// Choice 2: Haggle — she needs the money more than you
resultText: "Sister Maren hands over the salves without argument. You saved some coin and came away with slightly fewer than the asking price warranted. She notes it the way she notes everything — without comment.",
```

**encounter2 / levelPos1** (council seat — `quests: -5, adventurers: +5, reputation: +10` / `quests: -5, reputation: -5`):
```js
// Choice 1: Accept the council seat
resultText: "The weekly meetings cost you contracts you'd normally have chased. But the temple's network starts routing fighters your way — people who trust Maren's word more than a guild notice board. The tradeoff holds.",
// Choice 2: Decline respectfully — too many commitments
resultText: "Sister Maren accepts the refusal with grace. The contracts you'd have gained through her network simply go elsewhere. She doesn't walk you to the door this time.",
```

**encounter3 / levelNeg2** (refugees and relics — `equipment: +15, adventurers: +3, reputation: -10` / `quests: -3, reputation: +5`):
```js
// Choice 1: Take the relics and hide the refugees
resultText: "The three refugees are quiet and take up space in the back hall. The relics — worth more than you expected — go into secure storage. Temple contacts start appearing on your recruitment boards within the week. Sister Maren says only: 'I won't forget this.'",
// Choice 2: Refuse — too much heat for any price
resultText: "She nods once, as though she had already prepared for this answer. Three temple-connected contracts that might have come your way quietly don't. You watch her walk back in alone and feel the weight of something you chose not to carry.",
```

**encounter3 / level0** (healer training — `adventurers: -3, equipment: +8, reputation: +5` / `quests: +5`):
```js
// Choice 1: Send adventurers for healer training
resultText: "Your fighters spend three days at the temple and come back lighter on recklessness and heavier on field medicine knowledge. Sister Maren sends a note: 'They were attentive. Unexpected.'",
// Choice 2: Decline — can't spare anyone right now
resultText: "Sister Maren thanks you for your time. Your crew stays on the board and the quests pile up. She means it when she says the offer stands — and you get the sense that makes declining feel oddly worse.",
```

**encounter3 / levelPos2** (crypt excavation — `gold: +20, equipment: +10, quests: -10, reputation: -5` / `quests: +10, reputation: +15`):
```js
// Choice 1: Excavate the crypt in secret
resultText: "The crypt yields its secrets at the cost of weeks your crew could have spent on contracts. The artifacts surface one by one — valuable enough to justify every lost commission. Sister Maren prays over each one. You're not sure if that's comfort or a warning.",
// Choice 2: Report the crypt to the city council
resultText: "The council dispatches a team by afternoon and credits your guild for the find — ten new institutional contracts follow. Sister Maren learns of it by evening. She doesn't speak to you at the next gathering. Not unkindly. Just carefully.",
```

- [ ] **Step 2: Run test**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

- [ ] **Step 3: Commit**

```bash
git add src/data/cards/npcs/sister-maren.js
git commit -m "feat: add resultText to Sister Maren NPC choices"
```

---

## Task 4: NPC — Lord Farwick

**Files:**
- Modify: `src/data/cards/npcs/lord-farwick.js`

Deltas reference: `adventurers: -3, quests: +10, reputation: +5` / `gold: +5, reputation: -5` / `gold: +10, quests: -5` / `gold: -10, quests: +5, reputation: +5` / `quests: +10, gold: +10, reputation: -5` / `equipment: +5, reputation: +5` / `gold: +20, quests: +5, reputation: -15` / `quests: +5, reputation: +10` / `adventurers: -3, gold: +15, reputation: +5` / `equipment: +5` / `gold: +25, quests: +10, adventurers: -8, reputation: -10` / `adventurers: +5, reputation: +10`

- [ ] **Step 1: Add resultText to every choice in `lord-farwick.js`**

**encounter1 / level0** (gala security — `adventurers: -3, quests: +10, reputation: +5` / `gold: +5, reputation: -5`):
```js
// Choice 1: Accept the gala contract
resultText: "Three of your people spend an evening standing guard at the most boring party in the city. By the following week, Farwick's introductions have put ten new commissions on your board. Insufferable man. He delivers.",
// Choice 2: Decline — you're not for hire by nobles
resultText: "Lord Farwick receives the refusal with a thin smile. You save the evening's expenses and go back to your work. He files you away, along with everything else he'll use to define you eventually.",
```

**encounter2 / levelNeg1** (supply contract — `gold: +10, quests: -5` / `gold: -10, quests: +5, reputation: +5`):
```js
// Choice 1: Sign the exclusive supply contract
resultText: "The lawyer drafts it. You sign it. Farwick's rival backs down by the end of the week. The exclusive arrangement costs you flexibility on the board, but his estates pay reliably and on time.",
// Choice 2: Handle Lady Caston yourself
resultText: "You spend coin handling Caston that Farwick would have blocked for free. The board gains room to breathe. You hear that Farwick spent the morning in a noticeably poor mood.",
```

**encounter2 / levelPos1** (candidacy endorsement — `quests: +10, gold: +10, reputation: -5` / `equipment: +5, reputation: +5`):
```js
// Choice 1: Endorse his candidacy publicly
resultText: "Your guild's name appears on posters the next morning. Farwick's introductions pay — contracts and coin both follow. Three rival factions are visibly not pleased, and the cost of that will arrive in time.",
// Choice 2: Stay out of politics
resultText: "Lord Farwick says 'Of course' in the tone that means the opposite. You use the resources you kept for yourself rather than his campaign. He pours more wine. You both know what his tone meant.",
```

**encounter3 / levelNeg2** (witness intimidation — `gold: +20, quests: +5, reputation: -15` / `quests: +5, reputation: +10`):
```js
// Choice 1: Intimidate the witness, take the property
resultText: "The witness goes silent. The deed arrives via courier the next morning — a warehouse district property, free and clear, plus a finder's fee Farwick never explicitly authorized. He confirms nothing. That's how men like him stay clean.",
// Choice 2: Let him lose on his own terms
resultText: "Farwick loses the case. You gain a clean conscience and the kind of reputation that doesn't cost anything today. The commissions you passed on stay where they are. With Farwick, you suspect the ledger will reopen eventually.",
```

**encounter3 / level0** (grain-for-patrol trade — `adventurers: -3, gold: +15, reputation: +5` / `equipment: +5`):
```js
// Choice 1: Accept the trade and patrol arrangement
resultText: "Three of your people spend the season on estate roads — quiet work, reliable pay. The grain arrives on schedule. It's the most ordinary transaction you've had with a nobleman. That, you realize, is its own kind of relief.",
// Choice 2: You prefer to source provisions independently
resultText: "He accepts the refusal with a short nod. You source your own provisions, your own way — the storeroom stays stocked. Farwick goes back to his accounting. It's not personal. He makes everything feel personal anyway.",
```

**encounter3 / levelPos2** (merchant guild power grab — `gold: +25, quests: +10, adventurers: -8, reputation: -10` / `adventurers: +5, reputation: +10`):
```js
// Choice 1: Secure the merchant guild headquarters
resultText: "Eight of your people lock down the building while the vote goes through. Farwick's reward arrives promptly — enough coin and new contracts to justify who you used and what it looked like. The merchant guild calls it a coup. Technically, it was.",
// Choice 2: This is where you draw the line
resultText: "Farwick stares long enough to become uncomfortable. Then: 'I suppose there are limits after all.' He sounds almost approving. Your people stay where they belong. Some lines are worth the reputation.",
```

- [ ] **Step 2: Run test**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

- [ ] **Step 3: Commit**

```bash
git add src/data/cards/npcs/lord-farwick.js
git commit -m "feat: add resultText to Lord Farwick NPC choices"
```

---

## Task 5: NPC — Sergeant Brek

**Files:**
- Modify: `src/data/cards/npcs/sergeant-brek.js`

Deltas reference: `adventurers: -3, equipment: +8, reputation: +5` / `adventurers: +3` / `adventurers: -5, gold: +15, quests: +5, reputation: +5` / `equipment: +5` / `adventurers: -5, equipment: +12, reputation: +5` / `adventurers: +3` / `gold: +20, adventurers: -8, quests: +10, reputation: +5` / `quests: +5` / `adventurers: -5, gold: +15, equipment: +5, reputation: +10` / `quests: +5` / `adventurers: -10, equipment: -10, quests: +15, reputation: +15` / `adventurers: +5, reputation: -5`

- [ ] **Step 1: Add resultText to every choice in `sergeant-brek.js`**

**encounter1 / level0** (recruit training — `adventurers: -3, equipment: +8, reputation: +5` / `adventurers: +3`):
```js
// Choice 1: Let him train your recruits his way
resultText: "Three of your people are tied up in drills for a week and come back noticeably harder to surprise. Their equipment is better cared for too — Brek has opinions about maintenance. He grins once, on day three, then goes back to shouting.",
// Choice 2: Your guild trains its own people, thanks
resultText: "Brek nods once and leaves without a word. Your people train at their own pace and the roster stays intact. You're fairly sure he respects the answer. You're less sure what you missed.",
```

**encounter2 / levelNeg1** (border skirmish — `adventurers: -5, gold: +15, quests: +5, reputation: +5` / `equipment: +5`):
```js
// Choice 1: Send a squad under Brek's command
resultText: "Five of your people march under Brek's flag and come back with coin and a look in their eyes that wasn't there before. Not all of them come back the same way they left. The contracts that follow Brek's name are the kind you can't get any other way.",
// Choice 2: Too dangerous for green fighters
resultText: "Brek finds another crew. You hear they handled it — took some losses. Your people stay on home contracts. The storeroom benefits from focused maintenance. Brek doesn't mention the skirmish rates next time.",
```

**encounter2 / levelPos1** (live combat trial — `adventurers: -5, equipment: +12, reputation: +5` / `adventurers: +3`):
```js
// Choice 1: Authorize the live combat trial
resultText: "Two wash out. One breaks a wrist. The rest come back quieter, harder, and significantly better equipped for the work your guild actually does. Brek says nothing at the debrief except 'Again, tomorrow.' You start to understand why people follow him.",
// Choice 2: Drills are one thing, but this is too far
resultText: "Brek accepts it without argument, which somehow feels worse than pushback. Your three promising recruits who might have washed out are still with you. The gap between what Brek thinks and what he says is quietly enormous.",
```

**encounter3 / levelNeg2** (monster nest — `gold: +20, adventurers: -8, quests: +10, reputation: +5` / `quests: +5`):
```js
// Choice 1: Take the contract — pure business
resultText: "Eight of your fighters go into the mines. Some come back changed. Brek pays without delay, counts it correctly on the first try, and says: 'Good workers.' From him, that's a compliment.",
// Choice 2: Not worth the casualties
resultText: "Brek finds another crew. You redirect your people to the contract board — the quests pile up efficiently. You wonder, later, what the mines cost the others.",
```

**encounter3 / level0** (garrison duty — `adventurers: -5, gold: +15, equipment: +5, reputation: +10` / `quests: +5`):
```js
// Choice 1: Assign fighters to garrison duty
resultText: "Five of your fighters spend a month under garrison discipline and come back with city-issued gear, a healthy salary, and a mildly insufferable attitude about punctuality. Sergeant Brek sends a note: 'Keep it up.'",
// Choice 2: Keep your people independent
resultText: "Brek shrugs. 'Your call.' No lecture. Your crew stays on your board. The contracts hold. He doesn't mention the garrison rates next time you cross paths.",
```

**encounter3 / levelPos2** (eastern campaign — `adventurers: -10, equipment: -10, quests: +15, reputation: +15` / `adventurers: +5, reputation: -5`):
```js
// Choice 1: Commit your best fighters to the campaign
resultText: "Your ten best fighters march east carrying the good equipment. The city watches them go. That evening the hall is quieter than it's ever been — but the contracts that follow Brek's campaign will be the kind that define what your guild becomes.",
// Choice 2: Your guild isn't an army — refuse
resultText: "Brek looks at you for a long moment. 'Fair enough,' he says. 'You built something worth protecting. I understand that.' He leaves alone. Your fighters stay. So does their reputation — for better and worse.",
```

- [ ] **Step 2: Run test — NPC test should now pass**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

Expected: `all NPC card choices have resultText` — PASS.

- [ ] **Step 3: Commit**

```bash
git add src/data/cards/npcs/sergeant-brek.js
git commit -m "feat: add resultText to Sergeant Brek NPC choices"
```

---

## Task 6: Arc — Bandit War

**Files:**
- Modify: `src/data/arcs/bandit-war.js`
- Modify: `src/data/cards/third-choices.js`

Add `resultText` to every choice in `milestones`, `chainedCards`, and the third-choice `choice` objects.

Note: `third-choices.js` has entries with a single `choice` (not an array) — add `resultText` inside that `choice` object.

- [ ] **Step 1: Add resultText to bandit-war.js milestones and chainedCards**

**bw-m1** (Farmer Osric — `gold: -5, adventurers: -20, quests: +22` / `gold: +20, adventurers: -15, quests: -8`):
```js
// Choice 1: Accept the job
resultText: "Farmer Osric grips your hand with both of his, shaking it too long, saying nothing. Outside, twenty of your people are already pulling on boots and checking blades. The gold you spent to outfit them barely registers against what this job is worth — if they pull it through.",
// Choice 2: Demand payment first
resultText: "He hesitates, counts out coins with trembling fingers. You take them. Fifteen fighters move out at dawn — fewer than you'd have sent otherwise — and the board shrinks for it. The road doesn't care about your arrangements.",
```

**bw-m2** (Scout Leyla — `adventurers: -20, equipment: -5, quests: +22` / `adventurers: -20, equipment: -5, quests: +22, chains`):
```js
// Choice 1: Full assault — take all three
resultText: "Three camps. Three flags pulled down. Your team comes back thinner and lighter — equipment spent, people tired — but the board fills from the cleared road faster than you can post new commissions.",
// Choice 2: Target the largest camp only
resultText: "The big camp falls before nightfall at the same cost in fighters and equipment as a full assault. But two smaller ones are still out there. They watched from the treeline and said nothing. Somewhere in those hills, survivors are deciding what comes next.",
```

**bw-m3** (The Informant — `gold: -20, quests: +15, equipment: +3` / `gold: +20, adventurers: +3, quests: -20, equipment: -5`):
```js
// Choice 1: Pay for the proof
resultText: "Twenty coins lighter. The document changes hands in a back room lit by one candle. The proof nets you recovered equipment and opens new commission lines. You read it twice on the walk home. Lord Harwick's bastard. The city is going to be interesting for a while.",
// Choice 2: Threaten them instead
resultText: "The informant talks fast when afraid. The information arrives cheap and you pocket what you would have spent. But three fewer fighters' worth of quest leads evaporate — and the informant's network just closed to you permanently.",
```

**bw-m4** (Bandit Vanguard — `adventurers: -20, equipment: -5, quests: +22` / `gold: -20, adventurers: +3, quests: -5, equipment: +20`):
```js
// Choice 1: Fight through
resultText: "The road runs red briefly. Then it runs clear. Your team emerges from the ambush short fighters and light on equipment — but the road ahead is theirs. Nobody speaks on the march back.",
// Choice 2: Negotiate a retreat
resultText: "They let your team pass for a price and a promise you're not proud of. You paid twenty in coin and came back with salvaged equipment that softens the loss — but half your crew saw the exchange, and the quests you abandoned weigh more than the gear.",
```

**bw-m5** (Darro Half-Blood — `gold: -5, adventurers: -20, quests: +22` / `gold: +20, quests: -15, equipment: -8`):
```js
// Choice 1: Refuse — end this
resultText: "Twenty fighters march again. The messenger rides back empty-handed. Whatever this costs in coin and lives, at least you'll be able to name it when it's over.",
// Choice 2: Take the deal
resultText: "The deal is signed in a tavern nobody will remember. Darro Half-Blood raises a cup. You don't. The coin is real. The fifteen contracts that disappear from your board are real. The equipment you hand over as a show of good faith is real. What you call it is up to you.",
```

**bw-m6-final** (Final Stand — `quests: +20, gold: +3, adventurers: -20` / `adventurers: -20, quests: +22, equipment: -5, gold: +5`):
```js
// Choice 1: Show mercy — exile him
resultText: "Darro Half-Blood walks away into the grey morning. Twenty fighters come home. The eastern road opens — and with it, more new work than your board can hold. Whatever comes next, you built that.",
// Choice 2: No mercy
resultText: "Steel ends what coin couldn't. The stronghold goes quiet. Twenty fighters short and a storeroom lighter — but the eastern road opens like a held breath finally released. The new commissions start arriving before the smoke clears.",
```

**chain-bw-survivors** (Innkeeper — `gold: -20, quests: +15, equipment: +3` / `quests: -20, adventurers: +5, gold: +15`):
```js
// Choice 1: Fund the rebuilding
resultText: "You open the ledger and sign the order — twenty in coin and some timber, a real cost. By morning the first cart is rolling. The innkeeper stares at the receipt like he can't believe it. The road to his inn opens again, and so do new commissions from merchants who heard what you did.",
// Choice 2: Express regret, nothing more
resultText: "The innkeeper thanks you for the words and goes back to sifting ash. Your coin stays in the ledger. But twenty quests' worth of eastern road goodwill quietly evaporates. The road to the inn stays empty for a long time.",
```

- [ ] **Step 2: Add resultText to third-choices.js**

Each entry has a single `choice` object. Add `resultText` inside it, after `rumorText`:

**bw-m3 third choice** (`gold: -15, quests: +15, reputation: +10`):
```js
choice: {
  label: "Expose the informant's employer",
  deltas: { gold: -15, quests: 15 },
  major: true,
  reputation: 10,
  chains: null,
  rumorText: 'Names were named. Powerful people are not happy.',
  resultText: "You spend fifteen to buy the moment it takes to say the name. The room goes quiet. By evening it's all over the city — and with it, new commissions from people who'd been waiting for someone to say the unsayable out loud. Powerful people are quietly furious.",
},
```

**bw-m5 third choice** (`adventurers: -10, quests: +20, reputation: +15`):
```js
choice: {
  label: 'Offer sanctuary through the temple',
  deltas: { adventurers: -10, quests: 20 },
  major: true,
  reputation: 15,
  chains: null,
  rumorText: 'An unusual alliance. The temple shelters those who lay down arms.',
  resultText: "Ten of your fighters escort the bandits to the temple gate before dawn. Sister Maren meets them with blankets and bread. No speeches. Twenty new commissions open from an eastern road that is suddenly, improbably, peaceful. Nobody predicted an alliance like this. That's probably why it worked.",
},
```

- [ ] **Step 3: Run test — arc tests should pass**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

Expected: `all bandit war milestone choices have resultText` + `all third-choice choices have resultText` — PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/arcs/bandit-war.js src/data/cards/third-choices.js
git commit -m "feat: add resultText to Bandit War arc and third-choice options"
```

---

## Task 7: Events

**Files:**
- Modify: `src/data/cards/events.js`

- [ ] **Step 1: Read the file in full before writing**

Read `src/data/cards/events.js` completely. Note the situation and deltas for each card before writing.

- [ ] **Step 2: Add `resultText` to every choice**

Write 2–3 sentences per choice. The narrative must:
- Reflect the consequence diegetically (if the city gained resources, show the district responding; if adventurers left, show the streets quieter)
- Vary tone across cards — some hopeful, some ominous, some ambivalent
- Feel city-scale, not just personal-guild-scale

Anchor examples:
```js
// Positive event, choose to act:
resultText: "By midday the news has spread to every tavern and market stall in the district. Whatever this costs your people, the city will remember which guild moved when nobody else would. You close the ledger feeling, for once, like you're on the right side of something big.",

// Difficult event, cost accepted:
resultText: "The coin leaves your treasury before the ink on the order is dry. By evening the streets are calmer, the immediate crisis past. The deeper cause is still there — you just bought the city time to deal with it. Whether they use it well is not your problem.",

// Refusing an event:
resultText: "Someone else handles it eventually. The district notices the gap where your guild wasn't, and so do you. Some things cost more to walk away from than they cost to fix.",
```

- [ ] **Step 3: Run test**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

Expected: `all event card choices have resultText` — PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/cards/events.js
git commit -m "feat: add resultText to world event card choices"
```

---

## Task 8: Standard Cards — Guild Life

**Files:**
- Modify: `src/data/cards/guild-life.js`

- [ ] **Step 1: Read the file in full before writing**

Read `src/data/cards/guild-life.js` completely. Note the deltas for every card.

- [ ] **Step 2: Add `resultText` to every choice**

Write 1–2 sentences per choice. Every sentence must imply the consequence diegetically. Rotate voice across the file.

Anchor examples (from the first 3 cards of the file):
```js
// std-wounded-merc / Take her in (adventurers: +8, gold: -5):
resultText: "She sleeps in the corner bunk for a week without saying much. By the end of it, three of your fighters are asking when she's joining the roster — and she already has.",

// std-wounded-merc / Turn her away (adventurers: -6, equipment: +8):
resultText: "Word spreads. The wounded remember those who turned them away — and so do the ones who were watching. Your storeroom gains what your reputation loses.",

// std-young-recruit / Take a chance (adventurers: +8, gold: -5):
resultText: "Tam spends the first day lost, the second day overwhelmed, and the third day useful. You've made worse bets.",

// std-young-recruit / Send them away (adventurers: -6, equipment: +8):
resultText: "The kid walks out, shoulders dropped. By month's end you've turned three more away just like that one — and you notice the roster is thinner for it.",

// std-old-map / Fund the expedition (gold: -18, adventurers: -8, equipment: +22):
resultText: "Eighteen from the treasury and eight of your best gone for two weeks. They come back carrying everything the maps promised and then some. The old man wasn't wrong.",

// std-old-map / Pass (quests: -6, gold: +8):
resultText: "The map goes back in the old man's satchel, and so does any chance of what might've been in those ruins. You keep the coin. The board stays thin.",
```

- [ ] **Step 3: Run test**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

- [ ] **Step 4: Commit**

```bash
git add src/data/cards/guild-life.js
git commit -m "feat: add resultText to guild-life standard card choices"
```

---

## Task 9: Standard Cards — Merchants

**Files:**
- Modify: `src/data/cards/merchants.js`

- [ ] **Step 1: Read the file in full before writing**

Read `src/data/cards/merchants.js` completely. Note the deltas for every card.

- [ ] **Step 2: Add `resultText` to every choice**

Write 1–2 sentences per choice. Merchant cards deal with coin, supply chains, trade deals — the economic stakes must feel present in the narrative without naming the mechanic.

Anchor examples:
```js
// Accepting a profitable contract (gold: +X):
resultText: "The ink dries before the merchant is halfway out the door. The coin follows within the week, as promised.",

// Accepting a risky supply deal (gold: -X, equipment: +Y):
resultText: "The deal costs more than you'd like and takes three weeks to deliver. What arrives is worth it. Your treasurer says nothing, which means she agrees.",

// Refusing a contract (quests: -X, gold: +Y):
resultText: "The merchant finds someone else before the week is out. You keep the coin you would have spent and hear about the job in passing — which is the only way you ever hear about the ones that got away.",
```

- [ ] **Step 3: Run test**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

- [ ] **Step 4: Commit**

```bash
git add src/data/cards/merchants.js
git commit -m "feat: add resultText to merchant standard card choices"
```

---

## Task 10: Standard Cards — Political

**Files:**
- Modify: `src/data/cards/political.js`

- [ ] **Step 1: Read the file in full before writing**

Read `src/data/cards/political.js` completely. Note the deltas for every card.

- [ ] **Step 2: Add `resultText` to every choice**

Write 1–2 sentences per choice. Political stakes are social and systemic — hint at reputation shifts, faction reactions, and the ripple effects of public decisions.

Anchor examples:
```js
// Backing a faction (reputation: -X, quests: +Y):
resultText: "Your name goes into the right ledgers. Three new commission lines open from the faction's network. Whether that's a good thing depends entirely on which other ledgers you're now in.",

// Refusing political entanglement (reputation: +X):
resultText: "You walk away clean, which is the one thing politics rarely allows. Enjoy it while it lasts.",

// Overcommitting to a council decision (adventurers: -X, reputation: -Y):
resultText: "The council meeting runs past midnight. Six of your people stood guard outside it. The decision goes through — and so does the part of it you didn't fully read.",
```

- [ ] **Step 3: Run test**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

- [ ] **Step 4: Commit**

```bash
git add src/data/cards/political.js
git commit -m "feat: add resultText to political standard card choices"
```

---

## Task 11: Standard Cards — Criminal

**Files:**
- Modify: `src/data/cards/criminal.js`

- [ ] **Step 1: Read the file in full before writing**

Read `src/data/cards/criminal.js` completely. Note the deltas for every card.

- [ ] **Step 2: Add `resultText` to every choice**

Write 1–2 sentences per choice. Criminal cards involve grey-market deals, bribes, contraband — tone ranges from darkly comic to quietly ominous. No preaching. The consequence (goods acquired, coin spent, reputation lost) should be visible.

Anchor examples:
```js
// Taking a shady deal (equipment: +X, reputation: -Y):
resultText: "The goods disappear into your storeroom and the paperwork disappears into a fire. The storeroom is better for it. The rest you'll deal with later.",

// Refusing criminal involvement (reputation: +X):
resultText: "They find someone with fewer scruples. You hear about the job later. You're not sure if you made the right call — but at least your name isn't on it.",

// Bribing a guard (gold: -X, quests: +Y):
resultText: "The guard pockets it without breaking eye contact. The path clears. You've both done this before and neither of you will mention it again.",
```

- [ ] **Step 3: Run test — standard pool test should now pass**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

Expected: `all standard pool choices have resultText` — PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/cards/criminal.js
git commit -m "feat: add resultText to criminal standard card choices"
```

---

## Task 12: Crisis Cards

**Files:**
- Modify: `src/data/cards/crisis.js`

8 cards (16 choices). 1–2 sentences. Always heavy — these are bad deals to counter immediate problems. Both choices cost something; the narrative must reflect it.

- [ ] **Step 1: Add resultText to every choice in `crisis.js`**

**crisis-gold-low** (Master Creditor — `gold: +20, equipment: -25` / `gold: +15, adventurers: -15`):
```js
// Choice 1: Liquidate equipment
resultText: "You strip the storeroom bare and dump it all on the market at a loss. The creditors leave. The shelves stay empty. This is what surviving looks like when there's nothing left to look good about.",
// Choice 2: Cut adventurer pay
resultText: "The pay slips go out lighter. Nobody says anything directly — they don't have to. Three fighters are gone by end of week, and the ones who stayed know why.",
```

**crisis-gold-high** (Baron Crestholt — `gold: -25, quests: +10` / `quests: -15, reputation: +5`):
```js
// Choice 1: Comply
resultText: "You sign the request with a steady hand and a face that gives nothing away. The baron's man collects and bows. Your ledger is twenty-five lighter. The next favor on that ledger is yours — or so they'll tell you.",
// Choice 2: Refuse
resultText: "He takes it badly, as expected. The political pressure follows, also as expected. The coin stays in your treasury. What you didn't expect was how good it felt to say no.",
```

**crisis-adventurers-low** (Desperate Client — `gold: -20, adventurers: +10` / `quests: -20, reputation: -5`):
```js
// Choice 1: Hire mercenaries
resultText: "They cost twice what they're worth and half their stories are lies, but they show up — and that's what matters right now. The quest limps forward and the client stays quiet. You'll count the coin tomorrow.",
// Choice 2: Let the quest fail
resultText: "The client makes good on the threat and word spreads before nightfall. Twenty quests' worth of board confidence evaporates with it. You sit with that for a while. Sometimes there's nothing to do but sit with it.",
```

**crisis-adventurers-high** (Guild Sergeant — `adventurers: -20, quests: +10` / `gold: -15, adventurers: -5`):
```js
// Choice 1: Dispatch a large expedition
resultText: "By noon the hall is half-empty and blessedly quiet. The city watch sends no further questions. Twenty people gone is a steep price for peace — but it's the price that worked.",
// Choice 2: Pay fines and manage tensions
resultText: "Coin changes hands at the city watch office. Rations get reduced. Five people leave anyway. You hold two tense conversations and avoid a third. The lid goes back on, for now.",
```

**crisis-quests-low** (Town Crier — `adventurers: -10, quests: +18, reputation: +10` / `quests: -8, reputation: -5`):
```js
// Choice 1: Run a charitable quest
resultText: "Ten of your people spend three days on a job that pays nothing. Your board fills back up within the week. The pamphlets find something else to mock by morning. Today, at least, they won't.",
// Choice 2: Ignore the gossip
resultText: "You've heard worse said about better guilds. The pamphlets are unsigned, the ink is cheap — but the board gets eight quests thinner while the city watches and wonders.",
```

**crisis-quests-high** (Overburdened Clerk — `quests: -20, gold: -10` / `gold: -20, adventurers: +12`):
```js
// Choice 1: Turn away new clients
resultText: "The word goes out: board closed, temporarily. Twenty quests go elsewhere and so does the coin they'd have brought. Your people stop bleeding. That's what this costs.",
// Choice 2: Hire temporary help
resultText: "The new hands arrive by afternoon — some better than expected, some exactly as bad as feared. The board clears. The ledger doesn't. You'll sort out which cost more later.",
```

**crisis-equipment-low** (Lead Adventurer — `gold: -25, equipment: +20` / `adventurers: -10, quests: -5`):
```js
// Choice 1: Emergency procurement
resultText: "The supplier knows they have you. The price reflects that. You pay twenty-five to make the problem go away and hand out the new gear before dawn. Your lead adventurer inspects it, nods, and says nothing. That's enough.",
// Choice 2: Force the issue
resultText: "The quest goes out with the wrong gear. Two adventurers refuse and walk. Three come back bruised. The board loses five contracts from the fallout. You resolve to never let the stores run this low again.",
```

**crisis-equipment-high** (Black Market Broker — `gold: +20, equipment: -25, reputation: -5` / `gold: -15, equipment: -5`):
```js
// Choice 1: Sell to the fence
resultText: "The goods move fast — faster than you'd like. The fence is gone before you finish counting the coin. Your storeroom is bare. You're lighter now, in multiple senses of the word.",
// Choice 2: Hire night guards
resultText: "A week of quiet nights and the threat seems to pass. The guards cost coin and the precautions cost five pieces of equipment lost to handling. You'll never know if the fence moved on or just waited.",
```

- [ ] **Step 2: Run test — crisis test should pass**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test -- tests/data/result-text.test.js
```

Expected: `all crisis card choices have resultText` — PASS.

- [ ] **Step 3: Commit**

```bash
git add src/data/cards/crisis.js
git commit -m "feat: add resultText to crisis card choices"
```

---

## Task 13: Chained Cards

**Files:**
- Modify: `src/data/cards/standard.js`

4 chained cards (8 choices). 1–2 sentences each.

- [ ] **Step 1: Add resultText to every choice in `standard.js`**

**chain-alchemist-done** (Maeva — `equipment: +18, gold: -15` / `gold: +15, equipment: -12`):
```js
// Choice 1: Accept the return
resultText: "Maeva hands over the equipment with the careful pride of someone who stayed up late to get it right. Fifteen coin poorer, your storeroom is considerably better armed for it.",
// Choice 2: Sell the upgraded gear
resultText: "The buyer pays well and asks no questions. Maeva would be annoyed if she found out. You decide not to tell her — and pocket the coin before you change your mind.",
```

**chain-treasure-dig** (Exhausted Prospector — `gold: +20, adventurers: -12, quests: -5, reputation: +5` / `gold: +25, adventurers: -20`):
```js
// Choice 1: Share the windfall
resultText: "You split it right there in the hall, coin by coin, until everyone has a share. The room gets loud in the best possible way. Three fewer contracts handled this week — worth every one.",
// Choice 2: Keep the lion's share
resultText: "The ledger looks excellent. The hall looks empty. Three of your best fighters are quietly asking around about other guilds by end of week. You note this without noting it.",
```

**chain-tax-ignored** (City Bailiff — `gold: -20, quests: +15` / `gold: -10, quests: -10, adventurers: +15`):
```js
// Choice 1: Pay the fine
resultText: "You sign the payment order without argument, which seems to confuse the bailiff. He double-checks the stamp and leaves. Twenty coin gone. The board reopens. That's the deal.",
// Choice 2: Argue the case
resultText: "The argument costs ten in coin, ten in lost contracts, and earns your fighters a story they find funnier than you do. You gained a reputation for stubbornness and fifteen people who respect it.",
```

**chain-merc-healed** (Sera Ironfoot — `adventurers: +10, equipment: -8, reputation: +5` / `gold: +6, quests: -8`):
```js
// Choice 1: Welcome her in
resultText: "Sera Ironfoot takes the oath like she means it. The gear she needs comes out of the storeroom and goes onto her back where it belongs. The crew accept her the way they accept anyone who's proven something: quickly, and without fanfare.",
// Choice 2: Wish her luck
resultText: "You send her off with a handshake and a coin for the road. She doesn't look back. A few of the contracts she'd have taken go unfilled. You watch her go and think about the kind of people who walk through your doors.",
```

- [ ] **Step 2: Run ALL tests — everything should pass**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test
```

Expected: 117 original tests + 7 new resultText tests = **124 tests, all passing**.

- [ ] **Step 3: Commit**

```bash
git add src/data/cards/standard.js
git commit -m "feat: add resultText to chained card choices"
```

---

## Final Verification

- [ ] **Run full test suite**

```bash
cd C:/Users/micka/.config/superpowers/worktrees/GuildMaster/v5
npm test
```

All 124 tests pass.

- [ ] **Smoke-check in browser**

Start the dev server (`npm run dev`) and play through at least 3 card types (one NPC, one arc milestone, one standard) to confirm `resultText` renders correctly after choices.
