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
       <button class="choice-btn btn-danger" id="options-save-quit">Save &amp; Quit</button>`
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
