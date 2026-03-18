# GuildMaster — Game Design Spec
_Date: 2026-03-18_

## Overview

GuildMaster is a browser-based text game inspired by Reigns. The player manages an adventurer guild, making binary decisions as NPCs arrive with requests. Each choice shifts four resources. The game ends when any resource hits 0 or 100. Completing a story arc wins the run and unlocks content for future runs.

**Platform:** Browser (JavaScript)
**Session length:** Short (~15–30 minutes per run)
**Tone:** Mixed — mostly lighthearted with moments of real stakes
**Guild name (v1):** Iron Hearth Guild (fixed, not player-chosen)

---

## Resources

Four resources, each ranging from 0 to 100, all starting at 50:

| Resource | Icon | Collapse (0) | Overflow (100) |
|---|---|---|---|
| Gold | 💰 | Bankruptcy — creditors seize the guild | Hoarding crisis — thieves and extortionists swarm |
| Adventurers | ⚔️ | Abandoned — no one left to take quests | Mob — infighting, city guard intervenes |
| Quests | 📜 | No work — reputation collapses, clients stop coming | Overwhelmed — guild drowns in failed commitments |
| Equipment | 🛡️ | Empty armory — adventurers refuse dangerous work | Black market — stolen gear draws criminal attention |

Both extremes end the run with a unique narrative. **Arc completion is checked before resource limits** — if the final arc milestone also pushes a resource to 0 or 100, the player wins.

### Tension Zones

When a resource value is **strictly less than 20** (`< 20`) or **strictly greater than 80** (`> 80`), a Crisis card is immediately queued (see NPC Card Types). The values 20 and 80 themselves do not trigger a tension zone. The standard card pool also shifts to reflect pressure:

- **Gold < 20:** Debt collectors appear. NPCs lowball you. Desperate high-risk quests.
- **Gold > 80:** Nobles want loans. Thieves target you. Lavish requests arrive.
- **Adventurers < 20:** NPCs exploit your weakness. Quests are refused. Bandits grow bold.
- **Adventurers > 80:** Infighting breaks out. City guard grows nervous. Rivals spy on you.
- **Quests < 20:** The guild is seen as inactive. Clients seek competitors. Desperation quests with brutal terms.
- **Quests > 80:** Requests flood in faster than they can be managed. NPCs grow impatient and demanding.
- **Equipment < 20:** Adventurers complain and hesitate. Costly gear requests arrive. Quests start failing.
- **Equipment > 80:** Thieves and fences take notice. Offers to "buy your surplus" turn predatory.

---

## Core Game Loop

Each turn:
1. Draw the next card from the queue (see Card Queue below)
2. Player reads the situation
3. Player chooses A or B — fuzzy impact indicators shown (`+`, `++`, `+++`, `-`, `--`, `---`)
4. Resources update — exact values revealed after the choice, along with the unchosen option's exact values
5. Check arc milestone trigger — if threshold reached, next draw is an Arc card
6. Check for resource limit (0 or 100) — end run if hit

### Card Queue

The card queue is ordered as follows (highest priority first):

1. **Arc milestone card** — fires when the standard card count since the last milestone reaches the threshold
2. **Crisis card** — inserted each time a resource transitions from safe (20–80) into a tension zone (`< 20` or `> 80`); only one Crisis card queued per resource at a time (the guard prevents duplicates while already in the zone). If an Arc milestone fires on the same turn a Crisis card is inserted, the Arc card fires first; the Crisis card fires on the following turn.
3. **Chained event card** — fires at the scheduled turn; if an Arc card also fires that turn, the Arc card goes first and the chained event is pushed back one turn
4. **Rumor card** — inserted after arc milestones or major choices; consumes a turn (no choice, player clicks Continue)
5. **Standard card** — random draw from the unlocked pool, weighted by active tension zones and reputation tier

### Arc Milestone Threshold

Between each milestone, a random number of standard cards are drawn: **4–7 standard cards**, chosen randomly at the start of each interval. Arc and Crisis cards do not count toward this threshold. This prevents players from counting turns to predict arc events.

### Run Opening (first two cards each run)

1. **Guild Intro Card** (fixed, no choice): Introduces the guild, the four resources, and the player's role. Player clicks **Continue** to advance. _"You are the Guild Master of Iron Hearth Guild. Your hall smells of old leather and ambition. Four things keep you in business: gold, adventurers, quests, and equipment. Let none reach ruin — or excess."_
2. **Arc Intro Card** (varies per arc, no choice): Sets the story for the active arc. Player clicks **Continue** to advance. _Example (The Bandit War): "Merchants on the eastern road have stopped arriving. The last one who made it through said one word before collapsing: bandits."_

---

## NPC Card Types

| Type | Description |
|---|---|
| **Standard** | Random draw from unlocked pool, weighted by tension zones and reputation tier. Two choices with resource deltas. |
| **Arc** | Tied to the active story arc. Fires at milestone threshold. Advances the narrative. Marked with a colored border and milestone badge. |
| **Recurring** | Named NPCs who remember past choices. Return with different dialogue and options based on history. Unlocked via meta-progression. |
| **Crisis** | Inserted into the queue when a resource first enters a tension zone. Offers risky, high-stakes options. Only one Crisis card queued per resource at a time. |
| **Rumor** | No choice — flavor text hinting at upcoming events. Fires after arc milestones or major choices. Player clicks Continue. Consumes a turn. |

The "road not taken" feedback (revealing exact values of the unchosen option) applies to all card types with choices: Standard, Arc, Recurring, and Crisis.

### Card UI

- **Resource bar** always visible at the top of the screen (shows current values)
- **NPC portrait** (emoji), name, and role shown
- **Situation text** centered below the portrait
- **Two choice buttons** side by side, each showing:
  - Fuzzy impact indicators per affected resource (`+`/`-` scale)
  - `⚠️ delayed` on a separate line below the deltas, if the choice triggers a chained event
  - Resources with zero delta are not shown (omitted entirely from the button)
- After choosing: exact deltas shown inline, unchosen option also reveals its exact values

---

## Story Arc System

Each run has one active arc, randomly selected from the unlocked pool. Each arc has a draw weight: uncompleted arcs have weight **1.0**, completed arcs have weight **0.5** (per-arc, not per-group). The probability of selecting a given arc equals its weight divided by the sum of all arc weights in the pool. The arc has 5–7 milestone events; the **exact count is fixed per arc in its authored data**, not randomly assigned at run time. Completing all milestones wins the run.

### Arc Unlock Tree

| Arc | Unlocked by | Unlocks |
|---|---|---|
| ✅ The Bandit War | (starter) | The Noble's Debt, The Rival Guild |
| 🔒 The Noble's Debt | The Bandit War | The Dragon Awakens |
| 🔒 The Rival Guild | The Bandit War | The Plague |
| 🔒 The Dragon Awakens | The Noble's Debt | The Heist (requires The Plague too) |
| 🔒 The Plague | The Rival Guild | The Heist (requires The Dragon Awakens too) |
| 🔒 The Heist | The Dragon Awakens + The Plague | — |

### Arc Themes

| Arc | Theme |
|---|---|
| The Bandit War | External threat, clear enemy, moral grey choices about mercy |
| The Noble's Debt | Political intrigue — collecting may cost more than it gains |
| The Dragon Awakens | Existential threat — everyone wants your adventurers |
| The Rival Guild | Competition — deals to undercut or join your rival |
| The Plague | Internal crisis — short vs. long-term tradeoffs |
| The Heist | Lighthearted caper — high-reward, morally dubious |

---

## Meta-Progression

Completing a run (winning an arc) unlocks content for future runs:

| Unlock Type | Description |
|---|---|
| **New Story Arcs** | Follows the unlock tree above. |
| **Guild Legacy Traits** | Awarded at the win screen — player picks one of two traits drawn randomly from the global trait pool, excluding any trait currently held. Takes effect at the start of the next run. One trait active at a time; winning again replaces the previous trait. Losing a run does not clear the active trait. Example: _"War Veterans: Adventurers start at 60."_ |
| **Named Adventurers** | Completing an arc unlocks 1–2 named adventurers who appear as Recurring NPCs in future runs, with callbacks to past events. |
| **New Choice Options** | Reserved for post-v1. Not implemented in the initial version. |

---

## Depth Mechanics

### 1. Chained Events
Some choices tag the game state and insert a follow-up card into the queue 2–5 turns later. **The turn count includes all card types** (Standard, Arc, Crisis, Rumor) — it is a wall-clock turn count, not a Standard-card-only count. If an Arc milestone fires on the same turn as a chained event, the Arc card goes first and the chained event is pushed back one turn. The `⚠️ delayed` indicator on the choice button signals a consequence is coming, without specifying what.

### 2. Rumor Cards
After arc milestones or choices tagged as `major: true` in card data, a Rumor card is inserted immediately after the current card. It consumes a turn. The player clicks Continue to dismiss it. No choice is offered — only flavor text hinting at what's coming.

**"Major" definition:** A choice is tagged `major: true` by the card author when it: (a) has a large resource delta (`+++` or `---` on any resource), (b) advances an arc, or (c) is explicitly marked as narratively significant. This is an authoring decision, not computed at runtime.

### 3. Named Adventurer Roster
3–5 named adventurers exist in the roster at all times. **On the very first run** (before any meta-progression unlocks), the roster is pre-populated with 3 generic named adventurers built into the base game (e.g. "Aldra the Stout", "Corvin", "Mira Swift"). Meta-progression unlocks add adventurers to the global pool for subsequent runs; the roster cap remains 3–5. When the pool exceeds the roster cap, the **roster is populated by random selection from the pool at the start of each run**.

Named adventurers appear individually in NPC cards — sent on quests, injured, returning with loot or grudges. When a named adventurer is lost, their replacement card is added to the Standard draw pool with a weight of **3.0** (compared to 1.0 for a normal Standard card). This elevated weight stacks additively with any tension-zone weighting. The window length is **chosen randomly between 3 and 5 turns at the moment of loss**. The window opens on the turn of loss. The replacement fires on the next Standard draw that falls within the window. If the window closes with no Standard draw (e.g. only Arc/Crisis/Rumor cards fired), the replacement fires on the next Standard draw regardless. The replacement is never discarded.

### 4. Reputation Shadow
Starts at 50. Three tiers:
- **Low (0–33):** Desperate and shady NPCs dominate the pool. Clients address the player dismissively.
- **Medium (34–66):** Standard pool. Normal tone.
- **High (67–100):** Powerful and prestigious clients appear. NPCs show deference.

Each choice tagged `reputation: +5` or `reputation: -5` in card data shifts the score by that amount. Not all choices affect reputation — only those explicitly tagged by the card author. The score is clamped to 0–100 and never shown to the player.

### 5. The Ledger (End-of-Run Recap)
When a run ends (win or lose), a narrative Ledger screen summarizes the run as a short story. Player clicks **Play Again** or **Quit** from this screen.

The following data must be tracked during the run to populate the Ledger:
- **Turn count** — total turns played
- **Named adventurer status** — alive or lost, per adventurer
- **Arc name and outcome** — won (completed) or abandoned (resource failure)
- **End condition** — which resource hit 0 or 100, if applicable. If multiple resources hit a limit on the same turn, record the one appearing first in the resource table (Gold → Adventurers → Quests → Equipment).
- **Major choice log** — each choice tagged `major: true` is recorded as a one-line event summary

_Example: "Your guild lasted 31 turns. Rena the Axe survived. The bandit war ended in a negotiated peace — some say you were bribed. Gold ran dry on a cold Tuesday."_

---

## Impact Indicator Scale

| Symbol | Meaning |
|---|---|
| `+` / `-` | Small impact (~5–10) |
| `++` / `--` | Moderate impact (~11–20) |
| `+++` / `---` | Large impact (~21+) |
| _(omitted)_ | Zero delta — resource not shown in button |
| `⚠️ delayed` | Chained event — consequence arrives in 2–5 turns; shown on its own line below deltas |

Exact values are hidden until after the choice is made. The unchosen option also reveals its exact values post-decision.

---

## Out of Scope (v1)

- Sound / music
- Animations beyond simple CSS transitions
- Save/load mid-run (meta-progression saves between runs, not within)
- More than 4 resources
- Player-named guild
- New Choice Options unlock (third button on standard cards)
