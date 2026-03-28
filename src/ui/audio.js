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
  if (menuMusic.paused) {
    menuMusic.currentTime = 0
    menuMusic.play().catch(() => {})
  }
}

export function playGameMusic() {
  activeTrack = 'game'
  menuMusic.pause()
  if (gameMusic.paused) {
    gameMusic.currentTime = 0
    gameMusic.play().catch(() => {})
  }
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
  if (v > 0) tryStartMusic()
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
