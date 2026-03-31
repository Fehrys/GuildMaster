# Post-Choice Narrative — `resultText` Writing Pass

**Date:** 2026-03-30
**Branch:** v4.1
**Sub-project:** A of V5 brainstorm (narrative → arcs → difficulty)

---

## 1. Overview

Every non-rumor card choice already has a `rumorText` field (optional city gossip). This pass adds a mandatory `resultText` string to every non-rumor choice — a short narrative reaction that appears after the player's decision, before the next card.

The field is already wired in `game.js` and renders after a choice is made. This spec covers **what to write** and **which files to touch**.

---

## 2. Writing Rules

### Length by card type

| Type | Length | Notes |
|------|--------|-------|
| `standard` | 1–2 sentences | Punchy, varied |
| `arc` (milestone) | 2–4 sentences | Story-forward, dramatic |
| `npc` | 2–4 sentences | Personal, name the NPC, imply memory |
| Events (`events.js`) | 2–3 sentences | City-scale weight, varies tone |
| Crisis (`crisis.js`) | 1–2 sentences | Urgent, heavy, bad-deal feeling |
| Chained cards | 1–2 sentences | Same as standard |

### Voice rotation
Vary the narrative perspective across all cards. Do not default to a single voice.

- **Player / guild master** — "You nod and sign the contract."
- **NPC reaction** — "Jolen raises an eyebrow. He didn't expect that."
- **Third person** — "The cart rolls away into the fog."
- **Collective / guild** — "Your crew murmurs approval around the fire."
- **Ambient / world** — "The city breathes a little easier tonight."

### Emotional range
Express widely different feelings across all cards. Even two choices with identical deltas must feel different. Include: relief, regret, dark humor, pride, unease, resignation, dread, satisfaction, dry irony.

### Show consequences diegetically
Every `resultText` must naturally imply what was gained or lost — in story terms, not mechanic terms. The player should be able to feel the outcome from the narrative alone without looking at the delta numbers.

- If adventurers decreased → mention people leaving, being sent out, not all coming back
- If gold decreased → reference the payment, the cost, the lighter ledger
- If equipment increased → reference new gear arriving, a storeroom fuller than before
- If reputation changed → hint at how the street or guild reacted

The consequence does not need to be the emotional center of the sentence — it can be a subordinate detail — but it must be present.

### Numbers
- **OK:** Diegetic numbers with no direct delta link — "You lost almost 150 gold just for that."
- **Forbidden:** Echoing the exact delta — "You gain +15 equipment." Never name the resource mechanic.

### NPC cards — memory rule
NPC choices produce **drastically opposite** results from the NPC's point of view. The `resultText` must reflect this. When appropriate, imply that the NPC will remember — future encounters will be colored by this moment.

- Accept choice: NPC is pleased, grateful, impressed, emboldened, or indebted.
- Refuse/counter choice: NPC is stung, cold, closed off, resentful, or simply unmoved.

### No repetition
Even within the same file, no two `resultText` values should open the same way or carry the same emotional beat. Each must feel distinct.

### Creativity
Short does not mean bland. Even a 1-sentence standard card result should feel alive and specific to its situation.

---

## 3. Scope

### Files requiring `resultText`

**Group A — NPCs** (2–4 sentences, memory-aware)

| File | Encounters | Choices |
|------|-----------|---------|
| `src/data/cards/npcs/jolen-fence.js` | 3 encounters, multiple levels | ~12 |
| `src/data/cards/npcs/lord-farwick.js` | TBD | ~12 |
| `src/data/cards/npcs/sergeant-brek.js` | TBD | ~12 |
| `src/data/cards/npcs/sister-maren.js` | 3 encounters, multiple levels | ~12 |

Approx. **48 choices** across 4 NPC files.

**Group B — Arc milestones** (2–4 sentences, story-forward)

| File | Milestones | Choices |
|------|-----------|---------|
| `src/data/arcs/bandit-war.js` | 6 milestones + 1 chained card | ~14 |

Approx. **14 choices**.

**Group C — Standard cards** (1–2 sentences)

| File | Cards | Choices |
|------|-------|---------|
| `src/data/cards/guild-life.js` | ~30 | ~60 |
| `src/data/cards/merchants.js` | ~26 | ~52 |
| `src/data/cards/political.js` | ~24 | ~48 |
| `src/data/cards/criminal.js` | ~20 | ~40 |

Approx. **200 choices** across 4 files.

**Group D — Events** (2–3 sentences, city-scale)

| File | Cards | Choices |
|------|-------|---------|
| `src/data/cards/events.js` | ~13 | ~26 |

**Group E — Crisis** (1–2 sentences, urgent/heavy)

| File | Cards | Choices |
|------|-------|---------|
| `src/data/cards/crisis.js` | ~8 | ~16 |

**Group F — Chained cards** (1–2 sentences, standard)

| File | Cards | Choices |
|------|-------|---------|
| `src/data/cards/standard.js` | chained only | ~4 |
| `src/data/cards/third-choices.js` | chained only | ~2 |

**Total: ~310 choices** to receive `resultText`.

---

## 4. Processing Order

Implement in this order to establish tone before tackling volume:

1. **NPCs** — highest craft requirement, sets the relational voice
2. **Arc milestones** — story anchors, dramatic weight
3. **Events** — city-scale, creative range
4. **Standard cards** — high volume, 1–2 sentences each (guild-life → merchants → political → criminal)
5. **Crisis** — urgent tone, short
6. **Chained cards** — lowest volume, same rules as standard

---

## 5. Examples

### NPC (jolen-fence — accept choice, encounter 1)
> Jolen's eyes light up just enough to notice. He says nothing, just tucks the coin away and nods once — the kind of nod that means you'll be hearing from him again.

### NPC (jolen-fence — refuse choice, encounter 1)
> He doesn't flinch. Just folds the cloak back over whatever he was carrying and steps into the rain. Something tells you Jolen keeps score.

### Arc milestone (bandit-war, m1 — accept)
> Farmer Osric grips your hand with both of his, shaking it too long, saying nothing. Outside, your first team is already pulling on boots and checking blades. The eastern road isn't going to clear itself.

### Arc milestone (bandit-war, m1 — demand payment)
> He hesitates, then counts out coins with trembling fingers. You don't feel great about it — but the eastern road won't be cleared by goodwill. Your team moves out at dawn.

### Event (positive outcome)
> By midday the news has spread to every tavern and market stall in the district. Whatever this costs, the city will remember which guild made it happen.

### Crisis (bad deal taken)
> It's a bitter fix. You patch the wound with coin you didn't have, knowing full well you'll be paying this price again in a different form.

### Standard (1 sentence, refuse)
> The map goes back in the old man's satchel, and so does any chance of what might've been in those ruins.

---

## 6. Technical Notes

- Add `resultText: "..."` as a new field on every choice object, adjacent to `rumorText`
- Rumor cards (choices where `rumorText` is a non-null string *and* no real decision is made) are **excluded** — wait, no: all non-rumor *choices* get `resultText`. Choices that happen to also have a `rumorText` still get `resultText`.
- The only choices excluded are those on *rumor cards* (cards of `type: 'rumor'`) — standard, npc, arc, crisis, and event choices all get `resultText`.
- Do not modify any other field, add comments, or reformat the file beyond inserting `resultText`.
- Maintain exact indentation style of each file.

---

## 7. Out of Scope

- Rumor cards (type: 'rumor') — no `resultText`
- Any UI changes — rendering is already handled
- New arc files (Dragon's Lair, Hero Rising) — covered by sub-project B, which will include `resultText` from the start
