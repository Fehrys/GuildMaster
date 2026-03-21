const music = new Audio('assets/music/Lute%20Over%20Gentle%20Kingdoms.mp3')
music.loop = true
music.volume = 0.5

const clickSfx = new Audio('assets/sound/Short_UI_click_sound_%234-1773952800612.wav')
clickSfx.volume = 0.7

let musicEnabled = true
let musicStarted = false

export function tryStartMusic() {
  if (musicStarted || !musicEnabled) return
  music.play().then(() => { musicStarted = true }).catch(() => {})
}

export function toggleMusic() {
  musicEnabled = !musicEnabled
  if (musicEnabled) {
    music.play().then(() => { musicStarted = true }).catch(() => {})
  } else {
    music.pause()
  }
  return musicEnabled
}

export function isMusicEnabled() {
  return musicEnabled
}

export function playClick() {
  clickSfx.currentTime = 0
  clickSfx.play().catch(() => {})
}
