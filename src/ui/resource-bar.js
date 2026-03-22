const RESOURCES = [
  { key: 'gold', icon: '💰' },
  { key: 'adventurers', icon: '⚔️' },
  { key: 'quests', icon: '📜' },
  { key: 'equipment', icon: '🛡️' },
]

const PREVIEW_MS = 2000
const ANIM_MS = 500

function dangerClass(value) {
  if (value < 20 || value > 80) return 'danger'
  if (value < 30 || value > 70) return 'warning'
  return ''
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

// Per-resource animation state
const _s = {}
RESOURCES.forEach(({ key }) => {
  _s[key] = { phase: 'idle', from: 50, to: 50, previewTimer: null, rafId: null }
})

export function renderResourceBar(resources) {
  const items = RESOURCES.map(({ key, icon }) => {
    const v = resources[key]
    return `<div class="resource ${dangerClass(v)}" data-res="${key}">
      <span class="resource-icon">${icon}</span>
      <div class="resource-track">
        <div class="resource-fill" style="width:${v}%"></div>
        <div class="resource-delta"></div>
      </div>
      <span class="resource-value"><span class="resource-num">${v}</span><span class="resource-delta-label"></span></span>
    </div>`
  }).join('')
  return `<div class="resource-bar">${items}</div>`
}

// Sync internal state to current values with no animation (call after initial render)
export function syncResourceBar(resources) {
  RESOURCES.forEach(({ key }) => {
    const v = clamp(resources[key], 0, 100)
    _s[key].from = v
    _s[key].to = v
    _s[key].phase = 'idle'
  })
}

// Animate bar from previous values to new values
export function updateResourceBar(newResources) {
  RESOURCES.forEach(({ key }) => {
    const el = document.querySelector(`.resource[data-res="${key}"]`)
    if (!el) return

    const newVal = clamp(newResources[key], 0, 100)
    const st = _s[key]
    const oldVal = st.from

    // Cancel in-progress animation
    if (st.previewTimer) { clearTimeout(st.previewTimer); st.previewTimer = null }
    if (st.rafId) { cancelAnimationFrame(st.rafId); st.rafId = null }

    if (oldVal === newVal) { st.phase = 'idle'; return }

    st.phase = 'preview'
    st.from = oldVal
    st.to = newVal

    const fillEl = el.querySelector('.resource-fill')
    const deltaEl = el.querySelector('.resource-delta')
    const numEl = el.querySelector('.resource-num')
    const labelEl = el.querySelector('.resource-delta-label')

    const delta = newVal - oldVal
    const positive = delta > 0
    const segStart = positive ? oldVal : newVal
    const segWidth = Math.abs(delta)

    // Freeze fill at old value, show delta segment
    fillEl.style.width = `${oldVal}%`
    deltaEl.style.left = `${segStart}%`
    deltaEl.style.width = `${segWidth}%`
    deltaEl.style.background = positive ? '#4caf7d' : '#e74c3c'
    deltaEl.style.opacity = '1'

    // Show delta label
    labelEl.textContent = ` (${delta > 0 ? '+' : ''}${Math.round(delta)})`
    labelEl.style.color = positive ? '#4caf7d' : '#e74c3c'
    labelEl.style.opacity = '1'

    // Update danger class for the new value immediately
    el.className = `resource ${dangerClass(newVal)}`

    // After preview delay, animate
    st.previewTimer = setTimeout(() => {
      st.phase = 'animating'
      const t0 = performance.now()

      function tick(now) {
        const t = clamp((now - t0) / ANIM_MS, 0, 1)
        const cur = oldVal + (newVal - oldVal) * easeInOut(t)

        fillEl.style.width = `${cur}%`

        // Shrink delta segment as fill catches up
        if (positive) {
          deltaEl.style.left = `${cur}%`
          deltaEl.style.width = `${Math.max(0, newVal - cur)}%`
        } else {
          deltaEl.style.width = `${Math.max(0, cur - newVal)}%`
        }

        numEl.textContent = Math.round(cur)

        // Fade out label in the last 30% of animation
        if (t > 0.7) labelEl.style.opacity = `${1 - (t - 0.7) / 0.3}`

        if (t < 1) {
          st.rafId = requestAnimationFrame(tick)
        } else {
          fillEl.style.width = `${newVal}%`
          deltaEl.style.width = '0'
          deltaEl.style.opacity = '0'
          numEl.textContent = Math.round(newVal)
          labelEl.textContent = ''
          st.from = newVal
          st.to = newVal
          st.phase = 'idle'
          st.rafId = null
        }
      }

      st.rafId = requestAnimationFrame(tick)
      st.previewTimer = null
    }, PREVIEW_MS)
  })
}
