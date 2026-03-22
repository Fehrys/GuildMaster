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

`src/ui/shell.js` becomes the single owner of `#app`. It routes between three top-level states:

| State | What is visible |
|---|---|
| `menu` | Main menu screen, menu music playing |
| `setup` | Pre-run wizard (guild naming → NPC selection), menu music still playing |
| `game` | Active run, game music playing |
| `overlay` | Options overlay rendered on top of `game`; game visible but dimmed behind |

Shell public API:
```js
shell.showMenu()           // render main menu, play menu music
shell.startSetup()         // hand off to setup-flow, called by "New Game"
shell.continueGame()       // deserialize saved run, call game.startGame(runState)
shell.startGame(config)    // called by setup-flow on completion, calls game.startGame(config)
shell.showOverlay()        // inject options overlay over current game
shell.hideOverlay()        // remove overlay, return to game
shell.saveAndQuit()        // call game.stopGame(), then shell.showMenu()
```

### 2.2 Module responsibilities

| Module | Responsibility |
|---|---|
| `src/ui/shell.js` | Navigation state machine, owns `#app` |
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
- Export `stopGame()` — auto-saves current run state to `localStorage`, tears down game UI
- `buildHeader()` replaces the music toggle button with `<button id="options-btn">⚙️</button>`
- The gear button click wires to `shell.showOverlay()`

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
3. **Options** — renders the options panel in place of the menu buttons (same screen, no navigation)

A version/credit line appears at the bottom of the viewport.

### 3.4 Continue detection

On shell init, check `localStorage` for the existing auto-save key (`guildmaster_autosave`). If the value parses as valid JSON with a `poolState` field, Continue is enabled. If absent, empty, or corrupt, Continue is disabled.

### 3.5 Music

`audio.playMenuMusic()` is called when the menu is shown. Plays `assets/music/Moonlight in the Castle Garden.mp3` looped. When a run starts, `audio.playGameMusic()` is called, crossfading or immediately switching to `assets/music/Lute Over Gentle Kingdoms.mp3`.

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

When rendered from in-game overlay, an additional button appears below Back:

```
       [ Resume         ]
       [ Save & Quit    ]
```

### 4.2 Music volume

- A range input (`0`–`100`) controls `music.volume` in real time
- The 🎵 icon to the left is clickable: toggles mute (sets volume to `0` and remembers previous value; restores on second click)
- While muted, icon displays as 🔇

### 4.3 SFX volume

- A range input (`0`–`100`) controls `clickSfx.volume` in real time
- The 🔊 icon to the left is clickable: same mute/restore behavior as music
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

Settings are loaded by `audio.js` on module init. The font class is applied by `shell.js` on page load before any screen is rendered.

### 4.6 Component reuse

`src/ui/options-view.js` exports `renderOptions(context)` where `context` is either `'menu'` or `'overlay'`. The `'overlay'` context adds the "Resume" and "Save & Quit" buttons. Event wiring is done by a corresponding `mountOptions(context, shell)` function.

---

## 5. In-Game Overlay

### 5.1 Trigger

The game header contains `<button id="options-btn">⚙️</button>` (replaces the former music toggle). Clicking it calls `shell.showOverlay()`.

### 5.2 Overlay rendering

The shell injects a `<div id="overlay-backdrop">` as a direct child of `<body>` (not inside `#app`), with `position: fixed`, `inset: 0`, semi-transparent dark background (`rgba(0,0,0,0.65)`). Inside it, the options panel is centered.

The game remains fully mounted and visible behind the dimmed backdrop — no state change, no teardown.

### 5.3 Dismiss

- **Resume** button: calls `shell.hideOverlay()` — removes `#overlay-backdrop` from DOM
- **Save & Quit** button: calls `shell.saveAndQuit()` — `game.stopGame()` (auto-saves) then `shell.showMenu()`
- **Escape key**: same behavior as Resume

### 5.4 Save & Quit behavior

`game.stopGame()` serializes current run state via the existing `serializeRunState()` and writes to `localStorage` under the existing `guildmaster_autosave` key. No new save format is introduced. On return to the main menu, Continue will be enabled because a valid save now exists.

---

## 6. Audio Module Changes

Current `src/ui/audio.js` is expanded:

```js
// Two named tracks
const menuMusic = new Audio('assets/music/Moonlight in the Castle Garden.mp3')
const gameMusic = new Audio('assets/music/Lute Over Gentle Kingdoms.mp3')

// New exports
export function playMenuMusic()           // start menuMusic, stop gameMusic
export function playGameMusic()           // start gameMusic, stop menuMusic
export function setMusicVolume(v)         // 0–100, updates both tracks' .volume
export function setSfxVolume(v)           // 0–100, updates clickSfx.volume
export function getMusicVolume()
export function getSfxVolume()
export function setMusicMuted(muted)
export function setSfxMuted(muted)
export function isMusicMuted()
export function isSfxMuted()
```

Settings are loaded from `guildmaster_settings` on module init and applied immediately.

---

## 7. Setup Flow

`src/ui/setup-flow.js` owns the pre-run screens currently inside `game.js`:

1. **Guild naming screen** — text input, Continue button
2. **NPC selection screen** — grid of NPC cards, select 2, Begin button

When complete, calls `onComplete(RunConfig)` passed by the shell.

The setup flow renders inside `#app` (the shell hands it the mount function). No gear button appears during setup. A "Back" link at the top of each setup screen returns to the main menu via `shell.showMenu()`.

---

## 8. File Summary

| Action | File |
|---|---|
| Create | `src/ui/shell.js` |
| Create | `src/ui/menu-view.js` |
| Create | `src/ui/setup-flow.js` |
| Create | `src/ui/options-view.js` |
| Modify | `src/ui/audio.js` — two tracks, volume API, settings persistence |
| Modify | `src/game.js` — remove boot startup, remove setup screens, export `startGame`/`stopGame`, gear button |
| Modify | `style.css` — `.font-standard` override, overlay backdrop, menu layout, options layout |
| No change | All engine modules, card data, arc data |

---

## 9. Out of Scope

- Language/i18n (future spec — options panel has a placeholder slot for a language dropdown)
- Scenario selection (Spec B — `RunConfig` has a `scenarioId` field reserved for it)
- Multiple save slots
- Electron packaging (compatible by design, no additional changes needed)
