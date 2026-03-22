# GuildMaster v3 — Spec A: Navigation Shell

**Date:** 2026-03-22
**Scope:** Main menu, navigation shell, setup flow extraction, options system, in-game overlay
**Out of scope:** i18n/translation (future spec), scenario selection (Spec B), meta progression rework (Spec B)

---

## 1. Goals

- Add a proper main menu (New Game, Continue, Options) as the game entry point
- Centralize navigation in a shell module so `game.js` is a pure run controller
- Extract the pre-run setup wizard (guild naming, NPC selection) into its own module
- Add an options overlay accessible from both the main menu and in-game
- Add volume controls for music and SFX, and a standard-font accessibility toggle
- Play a distinct music track on the main menu vs. during a run

---

## 2. Architecture

### 2.1 Screen ownership

`src/ui/shell.js` becomes the single owner of `#app`. It manages three top-level states: `menu`, `setup`, and `game`. The options panel is not a state — it is a layer rendered on top of the `game` state via a fixed-position `<div>` injected into `<body>` outside `#app`. The `game` state remains active while the overlay is visible.

| State | What is visible |
|---|---|
| `menu` | Main menu screen, menu music playing |
| `setup` | Pre-run wizard (guild naming → NPC selection), menu music still playing |
| `game` | Active run, game music playing |

The overlay is a separate DOM layer, not a state. Shell internal state stays as `game` while the overlay is open.

Shell public API:
```js
shell.showMenu()           // render main menu, play menu music
shell.startSetup()         // hand off to setup-flow, called by "New Game"
shell.continueGame()       // deserialize saved run, call game.startGame(runState)
shell.startGame(config)    // called by setup-flow on completion, calls game.startGame(config)
shell.showOverlay()        // inject options overlay into body; shell state stays 'game'
shell.hideOverlay()        // remove overlay backdrop from body, remove Escape listener
shell.saveAndQuit()        // call game.stopGame(), then shell.showMenu()
```

### 2.2 Module responsibilities

| Module | Responsibility |
|---|---|
| `src/ui/shell.js` | Navigation state machine, owns `#app`, applies font setting on init |
| `src/ui/menu-view.js` | Renders main menu HTML |
| `src/ui/setup-flow.js` | Pre-run wizard: guild naming → NPC selection; produces `RunConfig` |
| `src/ui/options-view.js` | Renders options panel HTML (shared by menu and overlay) |
| `src/ui/audio.js` | Two named tracks, volume control, settings persistence |
| `src/game.js` | Pure run logic; exports `startGame(config)` and `stopGame()` |

### 2.3 RunConfig

The setup flow produces a plain object passed to `game.startGame()`:
```js
{
  guildName: string,
  selectedNpcs: string[],  // array of 2 NPC IDs
}
```

Scenario ID will be added to `RunConfig` in Spec B when scenario selection is implemented.

### 2.4 game.js changes

- Remove direct page-load startup (`startRun()` is no longer called on boot)
- Remove `showGuildNaming()` and `showNpcSelection()` — moved to `setup-flow.js`
- Export `startGame(config)` — initializes run state from `RunConfig`, starts game loop
- Export `stopGame()` — serializes and saves run state, clears `#app` content (shell will re-render menu on top)
- Remove the existing `app` click listener for `#music-toggle`; replace with a listener for `#options-btn` that calls `shell.showOverlay()`
- `buildHeader()` replaces `<button id="music-toggle">` with `<button id="options-btn">⚙️</button>`
- Remove imports of `toggleMusic` and `isMusicEnabled` from `audio.js` — these functions are retired

**`stopGame()` contract:** captures the same 12 run-state variables that the existing `autoSave()` function captures (`gameState`, `queueState`, `ledger`, `arcId`, `guildName`, `selectedNpcs`, `npcEncounterCount`, `relationshipState`, `poolState`, `factionState`, `currentCard`, `currentIsArc`), serializes via `serializeRunState()`, and writes to `localStorage` under key `guildmaster_run`. `roster` is not serialized (the existing `autoSave()` does not save it; roster is rebuilt on each new run from progress). No event listeners or timers need teardown — all game click handlers are attached inline per `mount()` call and are automatically replaced when the shell overwrites `#app`.

---

## 3. Main Menu

### 3.1 Visual design

The main menu fills the full viewport. `assets/image/main_menu_background.jpg` (pixel-art medieval town at dusk) is set as a CSS `background-image` with `background-size: cover` and `background-position: center`.

The menu content (logo + buttons) is centered vertically and horizontally over the image, with no panel or border — content floats directly on the background. Text uses `text-shadow` for readability against the varied background.

### 3.2 Logo

Rendered using Augusta-Shadow (bold weight) at large size (`3rem+`), gold-toned color (`#c9a84c`), with a subtle `text-shadow` for depth. Decorative dividers (ornamental line with sword emojis) appear above and below the title block.

```
    ⚔️ ─────────────────── ⚔️
       G U I L D M A S T E R
           Guild Management
    ⚔️ ─────────────────── ⚔️
```

### 3.3 Buttons

Three buttons stacked vertically, centered, using the existing `.choice-btn` style:

1. **New Game** — calls `shell.startSetup()`
2. **Continue** — calls `shell.continueGame()`; rendered with `disabled` attribute and reduced opacity when no valid auto-save exists in `localStorage`
3. **Options** — `shell.js` swaps `#app` content to the options panel (same viewport, no route change); Back button in the options panel calls `shell.showMenu()` to restore the menu

A version/credit line appears at the bottom of the viewport.

### 3.4 Continue detection and execution

On shell init, read `localStorage` key `guildmaster_run`. If the raw value is `null` (no save exists), Continue is disabled immediately — `deserializeRunState()` is not called. If the raw value is a non-null string, call `deserializeRunState()` from `src/engine/save.js`. If the result is non-null, Continue is enabled; otherwise it is disabled. Using `deserializeRunState()` ensures the `poolState.playedThisCycle` Set/Array conversion is handled correctly and corrupt saves return `null`.

When `shell.continueGame()` is called, `deserializeRunState()` is called again (not cached) to re-validate. If it returns `null` (e.g., storage was cleared between init and click), the shell silently falls back to `shell.showMenu()` with Continue disabled.

### 3.5 Music

`audio.playMenuMusic()` is called when the menu is shown. Plays `assets/music/Moonlight in the Castle Garden.mp3` looped. When a run starts, `audio.playGameMusic()` is called, immediately switching to `assets/music/Lute Over Gentle Kingdoms.mp3`.

---

## 4. Options

### 4.1 Layout

```
           Options

  🎵  ──────●─────────  75%
  🔊  ────────────●───  90%

  [ ] Use standard font

  ──────────────────────────

       [ Back ]
```

When rendered from in-game overlay, `renderOptions('overlay')` adds two buttons instead of one:

```
       [ Resume         ]
       [ Save & Quit    ]
```

"Back" does not appear in overlay context — it is replaced by Resume and Save & Quit.

### 4.2 Music volume

- A range input (`0`–`100`) controls music volume in real time via `audio.setMusicVolume(v)`
- The 🎵 icon to the left is clickable: calls `audio.setMusicMuted(true)` and remembers the pre-mute volume; clicking again calls `audio.setMusicMuted(false)` and restores that volume
- While muted, icon displays as 🔇

### 4.3 SFX volume

- A range input (`0`–`100`) controls SFX volume in real time via `audio.setSfxVolume(v)`
- The 🔊 icon to the left is clickable: same mute/restore behavior via `audio.setSfxMuted()`
- SFX file: `assets/sound/Short_UI_click_sound_%234-1773952800612.wav` (existing)
- While muted, icon displays as 🔇

### 4.4 Standard font toggle

- A checkbox labeled "Use standard font"
- When checked: adds class `font-standard` to `<body>`, which overrides `font-family` to `system-ui, sans-serif` via CSS
- Effect is immediate — no page reload
- When unchecked: removes the class, Augusta font is restored

### 4.5 Persistence

All settings stored in `localStorage` under key `guildmaster_settings`:
```js
{
  musicVolume: number,     // 0–100, default 50
  sfxVolume: number,       // 0–100, default 70
  musicMuted: boolean,     // default false
  sfxMuted: boolean,       // default false
  standardFont: boolean,   // default false
}
```

Settings are loaded by `audio.js` on module init and applied immediately. The `standardFont` flag is read by `shell.js` on page load (before any screen is rendered) to apply the `font-standard` class to `<body>`.

### 4.6 Component reuse

`src/ui/options-view.js` exports:
- `renderOptions(context)` — where `context` is `'menu'` or `'overlay'`; controls which action buttons appear
- `mountOptions(context, shell)` — wires all event listeners (sliders, mute icons, checkbox, action buttons) after the HTML is injected into the DOM. The `shell` object must expose: `hideOverlay()` (Resume button), `saveAndQuit()` (Save & Quit button), `showMenu()` (Back button in menu context)

---

## 5. In-Game Overlay

### 5.1 Trigger

The game header contains `<button id="options-btn">⚙️</button>` (replaces the former `#music-toggle`). The `app` element's delegated click listener is updated to handle `e.target.id === 'options-btn'` and call `shell.showOverlay()`.

### 5.2 Overlay rendering

`shell.showOverlay()` injects `<div id="overlay-backdrop">` as a direct child of `<body>` (outside `#app`), with `position: fixed`, `inset: 0`, semi-transparent dark background (`rgba(0,0,0,0.65)`). Inside it, `renderOptions('overlay')` is called and `mountOptions('overlay', shell)` wires the buttons.

The game remains fully mounted and visible behind the dimmed backdrop — no state change, no teardown.

### 5.3 Dismiss

- **Resume** button: calls `shell.hideOverlay()`
- **Save & Quit** button: calls `shell.saveAndQuit()` — `game.stopGame()` (saves to `guildmaster_run`) then `shell.showMenu()`
- **Escape key**: `shell.showOverlay()` attaches a `keydown` listener to `document` that calls `shell.hideOverlay()` on `key === 'Escape'`

`shell.hideOverlay()` removes `#overlay-backdrop` from the DOM and removes the `document` keydown listener (stored as a named reference to allow `removeEventListener`).

### 5.4 Save & Quit behavior

`game.stopGame()` serializes current run state via `serializeRunState()` and writes to `localStorage` under key `guildmaster_run`. On return to the main menu, `shell.showMenu()` re-runs the Continue detection logic — Continue will be enabled because a valid save now exists.

---

## 6. Audio Module Changes

`src/ui/audio.js` is reworked. The existing `toggleMusic()` and `isMusicEnabled()` exports are **removed** (no longer used after the gear button replaces the music toggle). The single `music` track is replaced with two named tracks.

```js
// Two named tracks
const menuMusic = new Audio('assets/music/Moonlight in the Castle Garden.mp3')
const gameMusic = new Audio('assets/music/Lute Over Gentle Kingdoms.mp3')
// Existing SFX track unchanged
const clickSfx = new Audio('assets/sound/Short_UI_click_sound_%234-1773952800612.wav')

// Removed exports: toggleMusic, isMusicEnabled
// New exports:
export function playMenuMusic()      // start menuMusic looped, pause gameMusic
export function playGameMusic()      // start gameMusic looped, pause menuMusic
export function tryStartMusic()      // kept — resumes whichever track is currently active (menu or game); no-op if already playing or if the active track has not been set yet
export function playClick()          // kept unchanged

export function setMusicVolume(v)    // 0–100; updates both tracks' .volume proportionally
export function setSfxVolume(v)      // 0–100; updates clickSfx.volume
export function getMusicVolume()     // returns current 0–100 value
export function getSfxVolume()
export function setMusicMuted(muted) // true = pause active track; false = resume and restore volume
export function setSfxMuted(muted)
export function isMusicMuted()
export function isSfxMuted()
```

Settings are loaded from `guildmaster_settings` on module init and applied immediately to volume and mute state.

---

## 7. Setup Flow

`src/ui/setup-flow.js` owns the pre-run screens currently inside `game.js`. It is invoked by the shell as:

```js
setupFlow.start({ progress, mount, onComplete, onBack })
```

Where:
- `progress` — the loaded progress object (shell calls `loadProgress()` and passes it in; setup-flow does not call `loadProgress()` itself)
- `mount` — the shell's mount function for rendering into `#app`
- `onComplete(RunConfig)` — called when the player confirms NPC selection
- `onBack()` — called when the player clicks Back from either setup screen; shell calls `shell.showMenu()`

Screens in order:

1. **Guild naming screen** — text input pre-filled with `progress.lastGuildName`, Continue button
2. **NPC selection screen** — grid of NPC cards, select 2, Begin button

No gear button appears during setup. Each screen shows a "← Back" link in the top-left.

---

## 8. File Summary

| Action | File |
|---|---|
| Create | `src/ui/shell.js` |
| Create | `src/ui/menu-view.js` |
| Create | `src/ui/setup-flow.js` |
| Create | `src/ui/options-view.js` |
| Modify | `src/ui/audio.js` — two tracks, retire toggleMusic/isMusicEnabled, add volume API and settings persistence |
| Modify | `src/game.js` — remove boot startup, remove setup screens, export `startGame`/`stopGame`, replace music toggle with gear button, update click listener |
| Modify | `style.css` — `.font-standard` body override, overlay backdrop, menu layout, options layout |
| Modify | `index.html` — change `<script type="module">` src from `src/game.js` to `src/ui/shell.js` |
| No change | All engine modules, card data, arc data |

---

## 9. Out of Scope

- Language/i18n (future spec — options panel has a placeholder slot for a language dropdown)
- Scenario selection (Spec B — `RunConfig` has a `scenarioId` field reserved for it)
- Multiple save slots
- Electron packaging (compatible by design, no additional changes needed)
