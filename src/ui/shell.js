import { renderMenu } from './menu-view.js'
import { renderOptions, mountOptions } from './options-view.js'
import { playMenuMusic, playGameMusic, getStandardFont } from './audio.js'
import { loadProgress } from '../engine/progression.js'
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
let gameActive = false

export function showMenu() {
  gameActive = false
  playMenuMusic()
  mount(renderMenu(hasSave()))
  document.getElementById('menu-new-game').onclick  = () => startSetup()
  document.getElementById('menu-continue').onclick  = () => continueGame()
  document.getElementById('menu-options').onclick   = () => showMenuOptions()
}

function showMenuOptions() {
  mount(renderOptions('menu'))
  mountOptions('menu', { showMenu, hideOverlay })
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
  gameActive = true
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
  gameActive = true
  playGameMusic()
  game.continueRun(restored, {
    onEnd: () => showMenu(),
    shell: { showOverlay, hideOverlay, saveAndQuit },
  })
}

let escListener = null

export function showOverlay() {
  if (!gameActive) return
  if (document.getElementById('overlay-backdrop')) return
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

function showSplash() {
  mount(`
    <div class="splash-screen">
      <img class="menu-logo-img" src="assets/image/guildmaster_logo.png" alt="GuildMaster">
      <div class="splash-prompt">Click anywhere to begin</div>
    </div>
  `)
  app.addEventListener('click', () => {
    playMenuMusic()
    showMenu()
  }, { once: true })
}

// Boot
showSplash()
