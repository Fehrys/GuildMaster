# Navigation Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a main menu, navigation shell, options system, and in-game overlay to GuildMaster, making it feel like a complete game.

**Architecture:** A new `shell.js` module owns `#app` and routes between three states (menu, setup, game). `game.js` is refactored into a pure run controller that exports `startGame(config, { onEnd })` and `stopGame()`. A new `setup-flow.js` extracts the pre-run wizard. New audio, menu, options, and setup UI modules support the shell.

**Tech Stack:** Vanilla ES modules, no bundler, no test framework — verification is done by opening `index.html` in a browser and following smoke test steps.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `index.html` | Change entry point from `src/game.js` to `src/ui/shell.js` |
| Modify | `style.css` | Menu layout, options layout, overlay backdrop, `.font-standard` override |
| Modify | `src/ui/audio.js` | Two named tracks, volume/mute API, settings persistence; retire `toggleMusic`/`isMusicEnabled` |
| Create | `src/ui/menu-view.js` | Pure HTML renderer for the main menu screen |
| Create | `src/ui/options-view.js` | Pure HTML renderer + event wirer for options panel (menu and overlay contexts) |
| Create | `src/ui/setup-flow.js` | Pre-run wizard: guild naming → NPC selection; produces `RunConfig` |
| Create | `src/ui/shell.js` | Navigation state machine; owns `#app`; entry point |
| Modify | `src/game.js` | Remove boot block, remove setup screens, export `startGame`/`stopGame`, gear button |

Engine files, card data, arc data: **no changes.**

---

## Task 1: Rework audio.js

**Files:**
- Modify: `src/ui/audio.js`

The audio module gains two named tracks, a full volume/mute API, and settings persistence. The old `toggleMusic` and `isMusicEnabled` exports are retired.

- [ ] **Step 1: Read the current file**

Read `src/ui/audio.js` to understand the current structure before editing.

- [ ] **Step 2: Rewrite audio.js**

Replace the entire file with:

```js
const SETTINGS_KEY = 'guildmaster_settings'

const DEFAULT_SETTINGS = {
  musicVolume: 50,
  sfxVolume: 70,
  musicMuted: false,
  sfxMuted: false,
  standardFont: false,
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) } catch {}
}

let settings = loadSettings()

// Two named tracks
const menuMusic = new Audio('assets/music/Moonlight%20in%20the%20Castle%20Garden.mp3')
menuMusic.loop = true

const gameMusic = new Audio('assets/music/Lute%20Over%20Gentle%20Kingdoms.mp3')
gameMusic.loop = true

const clickSfx = new Audio('assets/sound/Short_UI_click_sound_%234-1773952800612.wav')

// Which track is currently "active" (menu or game)
let activeTrack = null   // 'menu' | 'game' | null

function applyVolume() {
  const v = settings.musicMuted ? 0 : settings.musicVolume / 100
  menuMusic.volume = v
  gameMusic.volume = v
  clickSfx.volume = settings.sfxMuted ? 0 : settings.sfxVolume / 100
}

// Apply immediately on load
applyVolume()

export function playMenuMusic() {
  activeTrack = 'menu'
  gameMusic.pause()
  menuMusic.currentTime = 0
  menuMusic.play().catch(() => {})
}

export function playGameMusic() {
  activeTrack = 'game'
  menuMusic.pause()
  gameMusic.currentTime = 0
  gameMusic.play().catch(() => {})
}

export function tryStartMusic() {
  if (activeTrack === 'menu' && menuMusic.paused) menuMusic.play().catch(() => {})
  if (activeTrack === 'game' && gameMusic.paused) gameMusic.play().catch(() => {})
}

export function playClick() {
  clickSfx.currentTime = 0
  clickSfx.play().catch(() => {})
}

export function setMusicVolume(v) {
  settings = { ...settings, musicVolume: v }
  saveSettings(settings)
  applyVolume()
}

export function setSfxVolume(v) {
  settings = { ...settings, sfxVolume: v }
  saveSettings(settings)
  applyVolume()
}

export function getMusicVolume() { return settings.musicVolume }
export function getSfxVolume()   { return settings.sfxVolume }

export function setMusicMuted(muted) {
  settings = { ...settings, musicMuted: muted }
  saveSettings(settings)
  if (muted) {
    menuMusic.volume = 0
    gameMusic.volume = 0
  } else {
    applyVolume()
    tryStartMusic()
  }
}

export function setSfxMuted(muted) {
  settings = { ...settings, sfxMuted: muted }
  saveSettings(settings)
  applyVolume()
}

export function isMusicMuted() { return settings.musicMuted }
export function isSfxMuted()   { return settings.sfxMuted }

export function getStandardFont() { return settings.standardFont }

export function setStandardFont(enabled) {
  settings = { ...settings, standardFont: enabled }
  saveSettings(settings)
}
```

- [ ] **Step 3: Verify the file has no syntax errors**

Open browser DevTools console, load `index.html` — the game still boots (even if broken at the menu level, no import errors from audio.js).

Alternatively: `node --input-type=module < src/ui/audio.js` should exit cleanly (ignoring DOM-related errors).

- [ ] **Step 4: Commit**

```bash
git add src/ui/audio.js
git commit -m "feat: rework audio module — two tracks, volume API, settings persistence"
```

---

## Task 2: CSS additions

**Files:**
- Modify: `style.css`

Add styles for: main menu layout, options panel, overlay backdrop, and the `.font-standard` accessibility class.

- [ ] **Step 1: Read style.css**

Read `style.css` to find a good insertion point (append to end).

- [ ] **Step 2: Append new CSS rules**

Add to the bottom of `style.css`:

```css
/* ===== FONT OVERRIDE ===== */
body.font-standard,
body.font-standard * {
  font-family: system-ui, sans-serif !important;
}

/* ===== MAIN MENU ===== */
.menu-screen {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('assets/image/main_menu_background.jpg');
  background-size: cover;
  background-position: center;
}

.menu-logo {
  text-align: center;
  margin-bottom: 2.5rem;
}

.menu-divider {
  font-size: 0.75rem;
  color: #c9a84c;
  letter-spacing: 3px;
  text-shadow: 0 0 8px #000, 1px 1px 0 #000;
  margin: 4px 0;
}

.menu-title {
  font-weight: bold;
  font-size: 3rem;
  color: #c9a84c;
  letter-spacing: 8px;
  text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 0 0 30px rgba(0,0,0,0.9);
  line-height: 1.1;
}

.menu-subtitle {
  font-size: 0.75rem;
  color: #d4b896;
  letter-spacing: 4px;
  text-shadow: 0 1px 6px #000;
  margin-top: 4px;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.menu-btn {
  background: rgba(10, 8, 4, 0.85);
  border: 1px solid #6a5a38;
  color: #e8d5b7;
  font-family: 'Angelina', system-ui, sans-serif;
  font-size: 1rem;
  padding: 12px 0;
  min-width: 200px;
  text-align: center;
  letter-spacing: 2px;
  cursor: pointer;
  text-shadow: 0 1px 4px rgba(0,0,0,0.9);
  transition: border-color 0.15s, color 0.15s;
}

.menu-btn:hover:not(:disabled) {
  border-color: #c9a84c;
  color: #c9a84c;
}

.menu-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  border-color: #3a3a3a;
  color: #666;
}

.menu-version {
  position: fixed;
  bottom: 16px;
  font-size: 0.65rem;
  color: rgba(200, 180, 150, 0.45);
  letter-spacing: 1px;
  text-shadow: 0 1px 4px #000;
}

/* ===== OPTIONS PANEL ===== */
.options-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.options-title {
  font-weight: bold;
  font-size: 1.4rem;
  color: #c9a84c;
  letter-spacing: 4px;
  margin-bottom: 2rem;
}

.options-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 18px;
}

.options-icon {
  font-size: 1.1rem;
  cursor: pointer;
  user-select: none;
  width: 26px;
  text-align: center;
  flex-shrink: 0;
}

.options-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 3px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  background: linear-gradient(to right, #c9a84c var(--pct, 50%), #3a3020 var(--pct, 50%));
}

.options-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #c9a84c;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(0,0,0,0.5);
}

.options-pct {
  font-size: 0.75rem;
  color: #888;
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}

.options-divider {
  width: 100%;
  height: 1px;
  background: #2a2a3a;
  margin: 4px 0 18px;
}

.options-checkbox-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 2rem;
  cursor: pointer;
}

.options-checkbox {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.options-checkbox-label {
  font-size: 0.85rem;
  color: #c0a880;
  letter-spacing: 1px;
}

.options-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: center;
}

/* ===== OVERLAY BACKDROP ===== */
#overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.overlay-panel {
  background: #14121e;
  border: 1px solid #4a3a20;
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.9);
  min-width: 280px;
}

/* ===== SETUP FLOW ===== */
.setup-back-link {
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 0.75rem;
  color: #666;
  cursor: pointer;
  letter-spacing: 1px;
  text-decoration: none;
}

.setup-back-link:hover { color: #c9a84c; }
```

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add CSS for menu, options, overlay, and font-standard class"
```

---

## Task 3: Create menu-view.js and options-view.js

**Files:**
- Create: `src/ui/menu-view.js`
- Create: `src/ui/options-view.js`

### menu-view.js

Pure HTML renderer. Takes a boolean `saveExists` to control whether Continue is disabled.

- [ ] **Step 1: Create src/ui/menu-view.js**

```js
export function renderMenu(saveExists) {
  const continueDisabled = saveExists ? '' : 'disabled'
  return `
    <div class="menu-screen">
      <div class="menu-logo">
        <div class="menu-divider">⚔️ ─────────────── ⚔️</div>
        <div class="menu-title">GUILDMASTER</div>
        <div class="menu-subtitle">Guild Management</div>
        <div class="menu-divider">⚔️ ─────────────── ⚔️</div>
      </div>
      <div class="menu-buttons">
        <button class="menu-btn" id="menu-new-game">New Game</button>
        <button class="menu-btn" id="menu-continue" ${continueDisabled}>Continue</button>
        <button class="menu-btn" id="menu-options">Options</button>
      </div>
      <div class="menu-version">v3.0 · 2026</div>
    </div>
  `
}
```

### options-view.js

- [ ] **Step 2: Create src/ui/options-view.js**

```js
import {
  getMusicVolume, getSfxVolume,
  isMusicMuted, isSfxMuted,
  setMusicVolume, setSfxVolume,
  setMusicMuted, setSfxMuted,
  getStandardFont, setStandardFont,
} from './audio.js'

export function renderOptions(context) {
  // context: 'menu' | 'overlay'
  const musicVol  = getMusicVolume()
  const sfxVol    = getSfxVolume()
  const musicMute = isMusicMuted()
  const sfxMute   = isSfxMuted()
  const stdFont   = getStandardFont()

  const musicIcon = musicMute ? '🔇' : '🎵'
  const sfxIcon   = sfxMute   ? '🔇' : '🔊'

  const actions = context === 'overlay'
    ? `<button class="choice-btn" id="options-resume">Resume</button>
       <button class="choice-btn" id="options-save-quit" style="color:#c08060;border-color:#6a3820">Save &amp; Quit</button>`
    : `<button class="choice-btn" id="options-back">← Back</button>`

  return `
    <div class="options-panel">
      <div class="options-title">Options</div>

      <div class="options-row">
        <span class="options-icon" id="opt-music-icon">${musicIcon}</span>
        <input type="range" class="options-slider" id="opt-music-slider"
               min="0" max="100" value="${musicVol}"
               style="--pct:${musicVol}%">
        <span class="options-pct" id="opt-music-pct">${musicVol}%</span>
      </div>

      <div class="options-row">
        <span class="options-icon" id="opt-sfx-icon">${sfxIcon}</span>
        <input type="range" class="options-slider" id="opt-sfx-slider"
               min="0" max="100" value="${sfxVol}"
               style="--pct:${sfxVol}%">
        <span class="options-pct" id="opt-sfx-pct">${sfxVol}%</span>
      </div>

      <div class="options-divider"></div>

      <label class="options-checkbox-row">
        <input type="checkbox" class="options-checkbox" id="opt-font-checkbox" ${stdFont ? 'checked' : ''}>
        <span class="options-checkbox-label">Use standard font</span>
      </label>

      <div class="options-actions">
        ${actions}
      </div>
    </div>
  `
}

export function mountOptions(context, shell) {
  // Music slider
  const musicSlider = document.getElementById('opt-music-slider')
  const musicPct    = document.getElementById('opt-music-pct')
  const musicIcon   = document.getElementById('opt-music-icon')

  musicSlider.addEventListener('input', () => {
    const v = Number(musicSlider.value)
    setMusicVolume(v)
    musicPct.textContent = v + '%'
    musicSlider.style.setProperty('--pct', v + '%')
    if (v > 0 && isMusicMuted()) {
      setMusicMuted(false)
      musicIcon.textContent = '🎵'
    }
  })

  musicIcon.addEventListener('click', () => {
    const muted = !isMusicMuted()
    setMusicMuted(muted)
    musicIcon.textContent = muted ? '🔇' : '🎵'
    if (!muted) {
      const v = getMusicVolume()
      musicSlider.value = v
      musicPct.textContent = v + '%'
      musicSlider.style.setProperty('--pct', v + '%')
    }
  })

  // SFX slider
  const sfxSlider = document.getElementById('opt-sfx-slider')
  const sfxPct    = document.getElementById('opt-sfx-pct')
  const sfxIcon   = document.getElementById('opt-sfx-icon')

  sfxSlider.addEventListener('input', () => {
    const v = Number(sfxSlider.value)
    setSfxVolume(v)
    sfxPct.textContent = v + '%'
    sfxSlider.style.setProperty('--pct', v + '%')
    if (v > 0 && isSfxMuted()) {
      setSfxMuted(false)
      sfxIcon.textContent = '🔊'
    }
  })

  sfxIcon.addEventListener('click', () => {
    const muted = !isSfxMuted()
    setSfxMuted(muted)
    sfxIcon.textContent = muted ? '🔇' : '🔊'
    if (!muted) {
      const v = getSfxVolume()
      sfxSlider.value = v
      sfxPct.textContent = v + '%'
      sfxSlider.style.setProperty('--pct', v + '%')
    }
  })

  // Font toggle
  const fontCheckbox = document.getElementById('opt-font-checkbox')
  fontCheckbox.addEventListener('change', () => {
    const enabled = fontCheckbox.checked
    setStandardFont(enabled)
    document.body.classList.toggle('font-standard', enabled)
  })

  // Action buttons
  if (context === 'overlay') {
    document.getElementById('options-resume').onclick    = () => shell.hideOverlay()
    document.getElementById('options-save-quit').onclick = () => shell.saveAndQuit()
  } else {
    document.getElementById('options-back').onclick = () => shell.showMenu()
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/ui/menu-view.js src/ui/options-view.js
git commit -m "feat: add menu-view and options-view UI modules"
```

---

## Task 4: Create setup-flow.js

**Files:**
- Create: `src/ui/setup-flow.js`

Extracts `showGuildNaming` and `showNpcSelection` from `game.js` into a standalone wizard module.

- [ ] **Step 1: Read the current setup functions in game.js**

Read `src/game.js` lines 95–131 to copy the exact HTML/logic of `showGuildNaming` and `showNpcSelection`.

Also read `src/ui/intro-view.js` to understand `renderGuildNaming` and `renderNpcSelection`.

- [ ] **Step 2: Create src/ui/setup-flow.js**

```js
import { renderGuildNaming, renderNpcSelection } from './intro-view.js'
import { allNpcIds } from '../data/cards/npcs/index.js'
import { npcRegistry } from '../data/cards/npcs/index.js'

/**
 * Runs the pre-run setup wizard.
 * @param {{ progress, mount, onComplete, onBack }} opts
 *   progress   - loaded progress object (has lastGuildName)
 *   mount      - function(html) to render into #app
 *   onComplete - function(RunConfig) called when NPC selection is confirmed
 *   onBack     - function() called when player clicks Back
 */
export function start({ progress, mount, onComplete, onBack }) {
  showGuildNaming({ progress, mount, onComplete, onBack })
}

function showGuildNaming({ progress, mount, onComplete, onBack }) {
  const prev = progress.lastGuildName || 'Iron Hearth Guild'
  mount(`
    <a class="setup-back-link" id="setup-back">← Back</a>
    ${renderGuildNaming(prev)}
  `)
  document.getElementById('setup-back').onclick = () => onBack()
  document.getElementById('continue-btn').onclick = () => {
    const guildName = document.getElementById('guild-name-input').value.trim() || prev
    showNpcSelection({ guildName, mount, onComplete, onBack })
  }
}

function showNpcSelection({ guildName, mount, onComplete, onBack }) {
  const npcList = allNpcIds.map(id => npcRegistry[id])
  mount(`
    <a class="setup-back-link" id="setup-back">← Back</a>
    ${renderNpcSelection(npcList)}
  `)

  document.getElementById('setup-back').onclick = () => onBack()

  let selected = []
  document.querySelectorAll('.npc-select-card').forEach(card => {
    card.onclick = () => {
      const npcId = card.dataset.npcId
      if (selected.includes(npcId)) {
        selected = selected.filter(id => id !== npcId)
        card.classList.remove('selected')
      } else if (selected.length < 2) {
        selected.push(npcId)
        card.classList.add('selected')
      }
      const btn = document.getElementById('npc-confirm-btn')
      btn.disabled = selected.length !== 2
      btn.textContent = selected.length === 2 ? 'Begin →' : 'Select 2 to continue →'
    }
  })

  document.getElementById('npc-confirm-btn').onclick = () => {
    onComplete({ guildName, selectedNpcs: selected })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/ui/setup-flow.js
git commit -m "feat: add setup-flow module (guild naming + NPC selection wizard)"
```

---

## Task 5: Rework game.js

**Files:**
- Modify: `src/game.js`

Remove the boot block, remove setup screen functions, export `startGame` and `stopGame`, replace music toggle with gear button, update click listener. Game end (win/loss "Play Again") calls the `onEnd` callback so the shell can navigate back to the menu.

- [ ] **Step 1: Read game.js fully**

Read the entire `src/game.js` to understand the full current structure before editing.

- [ ] **Step 2: Remove retired imports**

Remove from the import line for `audio.js`:
- `toggleMusic`
- `isMusicEnabled`

The updated audio import should be:
```js
import { tryStartMusic, playGameMusic, playClick } from './ui/audio.js'
```

- [ ] **Step 3: Remove showGuildNaming and showNpcSelection functions**

Delete the `showGuildNaming()` function (currently lines ~95–104) and `showNpcSelection()` function (currently lines ~106–131). These have moved to `setup-flow.js`.

- [ ] **Step 4: Remove the old startRun() function**

Delete the `startRun()` function (currently lines ~89–93). Its body will be replaced by `startGame(config)`.

- [ ] **Step 5: Add module-level shell references**

After the existing module-level variable declarations, add:
```js
let onEndCallback = null
let shellRef = null
```

- [ ] **Step 6: Add exported startGame(config, { onEnd }) function**

Add this function to replace `startRun()` and `initializeRun()` as the public entry point. Keep `initializeRun()` as an internal helper:

```js
export function startGame(config, { onEnd, shell } = {}) {
  onEndCallback = onEnd ?? null
  shellRef = shell ?? null
  progress = loadProgress()
  guildName = config.guildName
  selectedNpcs = config.selectedNpcs

  // Persist guild name
  progress = { ...progress, lastGuildName: guildName }
  saveProgress(progress)

  arc = pickArc()
  initializeRun()
}
```

Update `initializeRun()` so it no longer calls `loadProgress()` or handles guildName/selectedNpcs (those are set by `startGame`). It should start from building the roster and continue as before, calling `showGuildIntro()` at the end.

- [ ] **Step 7: Add exported stopGame() function**

```js
export function stopGame() {
  autoSave()
}
```

`autoSave()` writes to `guildmaster_run`. The shell will overwrite `#app` when showing the menu.

- [ ] **Step 8: Update buildHeader() — replace music toggle with gear button**

Change:
```js
const guildLine = `<div class="guild-name">⚜️ ${guildName}<button id="music-toggle" class="music-btn" title="Toggle music">${musicIcon}</button></div>`
```

To:
```js
const guildLine = `<div class="guild-name">⚜️ ${guildName}<button id="options-btn" class="music-btn" title="Options">⚙️</button></div>`
```

Also remove the `musicIcon` variable and `isMusicEnabled()` call from `buildHeader()`.

- [ ] **Step 9: Update the app click listener**

Change:
```js
app.addEventListener('click', e => {
  if (e.target.id === 'music-toggle') {
    toggleMusic()
    const btn = document.getElementById('music-toggle')
    if (btn) btn.textContent = isMusicEnabled() ? '🎵' : '🔇'
  }
})
```

To:
```js
app.addEventListener('click', e => {
  if (e.target.id === 'options-btn') {
    import('./ui/shell.js').then(m => m.showOverlay())
  }
})
```

Note: using a dynamic import here avoids a circular dependency (shell imports game, game needs to call shell). Alternatively, you can pass the shell reference into `startGame`:

```js
export function startGame(config, { onEnd, shell } = {}) {
  onEndCallback = onEnd ?? null
  shellRef = shell ?? null
  // ...
}
```

And store `let shellRef = null` at the top. Then in the click listener:
```js
app.addEventListener('click', e => {
  if (e.target.id === 'options-btn' && shellRef) shellRef.showOverlay()
})
```

**Use the `shellRef` approach** — it avoids dynamic imports and circular dependency issues.

- [ ] **Step 10: Update handleWin and handleLoss "Play Again" buttons**

In `handleWin()`, change:
```js
document.getElementById('play-again-btn').onclick = () => showTraitSelection()
```
to:
```js
document.getElementById('play-again-btn').onclick = () => {
  showTraitSelection()
}
```
(no change here — trait selection is internal)

In `showTraitSelection()`, the two trait button handlers currently call `startRun()`. Change both to:
```js
document.getElementById('trait-a').onclick = () => {
  progress = setLegacyTrait(progress, traitA.id)
  saveProgress(progress)
  if (onEndCallback) onEndCallback()
}
document.getElementById('trait-b').onclick = () => {
  progress = setLegacyTrait(progress, traitB.id)
  saveProgress(progress)
  if (onEndCallback) onEndCallback()
}
```

In `handleLoss()`, change:
```js
document.getElementById('play-again-btn').onclick = () => startRun()
```
to:
```js
document.getElementById('play-again-btn').onclick = () => {
  if (onEndCallback) onEndCallback()
}
```

- [ ] **Step 11: Remove the boot block**

Delete lines 474–502 (the entire boot block that reads `guildmaster_run` and calls `startRun()`):
```js
// Boot
const savedRun = localStorage.getItem('guildmaster_run')
if (savedRun) {
  // ...
} else {
  startRun()
}
```

The shell will handle boot logic.

- [ ] **Step 12: Add exported continueRun() for shell.continueGame()**

The shell calls `deserializeRunState` itself, then needs to hand the restored state to game.js. Add:

```js
export function continueRun(restored, { onEnd, shell } = {}) {
  // restored is the output of deserializeRunState()
  onEndCallback = onEnd ?? null
  shellRef = shell ?? null
  gameState      = restored.gameState
  queueState     = restored.queueState
  relationshipState = restored.relationshipState
  poolState      = restored.poolState
  factionState   = restored.factionState
  ledger         = restored.ledger
  guildName      = restored.guildName
  selectedNpcs   = restored.selectedNpcs
  npcEncounterCount = restored.npcEncounterCount
  arc            = ALL_ARCS[restored.arcId]
  currentCard    = restored.currentCard ?? null
  currentIsArc   = restored.currentIsArc ?? false
  progress       = loadProgress()

  if (currentCard) {
    showCard(currentCard, currentIsArc)
  } else {
    nextTurn()
  }
}
```


- [ ] **Step 13: Commit**

```bash
git add src/game.js
git commit -m "feat: refactor game.js — export startGame/stopGame/continueRun, remove boot block and setup screens"
```

---

## Task 6: Create shell.js

**Files:**
- Create: `src/ui/shell.js`

The navigation state machine. This is the new entry point.

- [ ] **Step 1: Create src/ui/shell.js**

```js
import { renderMenu } from './menu-view.js'
import { renderOptions, mountOptions } from './options-view.js'
import { playMenuMusic, playGameMusic, getStandardFont } from './audio.js'
import { loadProgress, saveProgress } from '../engine/progression.js'
import { deserializeRunState } from '../engine/save.js'
import * as game from '../game.js'
import * as setupFlow from './setup-flow.js'

const app = document.getElementById('app')

function mount(html) {
  app.innerHTML = html
}

function hasSave() {
  const raw = localStorage.getItem('guildmaster_run')
  if (!raw) return false
  return deserializeRunState(raw) !== null
}

// Apply font setting before first render
if (getStandardFont()) document.body.classList.add('font-standard')

// Shell public API (exposed as named exports so game.js can reference them)
export function showMenu() {
  playMenuMusic()
  mount(renderMenu(hasSave()))
  document.getElementById('menu-new-game').onclick  = () => startSetup()
  document.getElementById('menu-continue').onclick  = () => continueGame()
  document.getElementById('menu-options').onclick   = () => showMenuOptions()
}

function showMenuOptions() {
  mount(renderOptions('menu'))
  mountOptions('menu', { showMenu, hideOverlay, saveAndQuit })
}

export function startSetup() {
  const progress = loadProgress()
  setupFlow.start({
    progress,
    mount,
    onComplete: (config) => startGame(config),
    onBack: () => showMenu(),
  })
}

export function startGame(config) {
  playGameMusic()
  game.startGame(config, {
    onEnd: () => showMenu(),
    shell: { showOverlay, hideOverlay, saveAndQuit },
  })
}

export function continueGame() {
  const raw = localStorage.getItem('guildmaster_run')
  if (!raw) { showMenu(); return }
  const restored = deserializeRunState(raw)
  if (!restored) { showMenu(); return }
  playGameMusic()
  game.continueRun(restored, {
    onEnd: () => showMenu(),
    shell: { showOverlay, hideOverlay, saveAndQuit },
  })
}

let escListener = null

export function showOverlay() {
  const backdrop = document.createElement('div')
  backdrop.id = 'overlay-backdrop'
  backdrop.innerHTML = `<div class="overlay-panel">${renderOptions('overlay')}</div>`
  document.body.appendChild(backdrop)
  mountOptions('overlay', { showMenu, hideOverlay, saveAndQuit })

  escListener = (e) => { if (e.key === 'Escape') hideOverlay() }
  document.addEventListener('keydown', escListener)
}

export function hideOverlay() {
  const backdrop = document.getElementById('overlay-backdrop')
  if (backdrop) backdrop.remove()
  if (escListener) {
    document.removeEventListener('keydown', escListener)
    escListener = null
  }
}

export function saveAndQuit() {
  game.stopGame()
  hideOverlay()
  showMenu()
}

// Boot
showMenu()
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/shell.js
git commit -m "feat: add shell.js — navigation state machine and game entry point"
```

---

## Task 7: Wire index.html and smoke test

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update index.html entry point**

Change:
```html
<script type="module" src="src/game.js"></script>
```
To:
```html
<script type="module" src="src/ui/shell.js"></script>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: change entry point to shell.js"
```

- [ ] **Step 3: Open index.html in browser and run smoke tests**

Open `index.html` directly (or via a local server). Run through each scenario:

**Menu:**
- [ ] Main menu shows background image, Angelina font logo, 3 buttons
- [ ] "Continue" is disabled on first load (no save)
- [ ] Menu music plays (Moonlight in the Castle Garden)

**Options from menu:**
- [ ] Clicking "Options" shows the options panel
- [ ] Music slider updates volume in real time
- [ ] Clicking 🎵 icon mutes/unmutes
- [ ] SFX slider updates click sound volume
- [ ] "Use standard font" checkbox switches to system font instantly and back
- [ ] "← Back" returns to the main menu
- [ ] Settings persist after page reload

**New Game setup flow:**
- [ ] "New Game" → guild naming screen with Back link
- [ ] Back link returns to main menu
- [ ] Entering a name and continuing → NPC selection screen
- [ ] Back link returns to guild naming
- [ ] Selecting 2 NPCs enables Begin button
- [ ] Begin → game screen with resource bar and first card

**In-game:**
- [ ] Game music plays (Lute Over Gentle Kingdoms)
- [ ] ⚙️ gear button in header opens overlay
- [ ] Overlay shows game dimmed behind it
- [ ] Options sliders work in overlay
- [ ] "Resume" dismisses overlay, game continues
- [ ] Escape key also dismisses overlay
- [ ] "Save & Quit" saves and returns to main menu
- [ ] After Save & Quit, Continue button is now enabled on main menu

**Continue:**
- [ ] Clicking Continue resumes the exact saved run state (same card showing)

**Win/Loss:**
- [ ] Play through to win or loss; "Play Again" button returns to main menu
- [ ] After win: trait selection shows, selecting a trait returns to menu

- [ ] **Step 4: Final commit if smoke tests pass**

```bash
git add -A
git commit -m "chore: smoke test complete — shell v3 navigation working"
```
