// src/ui/unlock-toast.js
// Non-blocking animated unlock notification.
// Queue-based: multiple unlocks are shown sequentially.
// Call setActive(false) to suppress toasts (e.g. while on menu/discoveries).

const QUEUE_DELAY_MS = 400   // gap between sequential toasts
const TOAST_DURATION_MS = 2500

let _queue = []
let _running = false
let _active = true
let _activeToast = null

/**
 * Show an unlock toast. If another toast is playing, queues this one.
 * @param {{ name: string, emoji: string, conditionHint: string|null }} entry
 */
export function show(entry) {
  _queue.push(entry)
  if (!_running) _processQueue()
}

/** Suppress or re-enable toast display. Clears the queue when suppressed. */
export function setActive(active) {
  _active = active
  if (!active) {
    _queue = []
    _running = false
    if (_activeToast) {
      _activeToast.remove()
      _activeToast = null
    }
  }
}

function _processQueue() {
  if (!_active || _queue.length === 0) {
    _running = false
    return
  }
  _running = true
  const entry = _queue.shift()
  _animate(entry, () => {
    setTimeout(() => _processQueue(), QUEUE_DELAY_MS)
  })
}

function _animate(entry, onDone) {
  const toast = document.createElement('div')
  toast.className = 'unlock-toast'
  toast.innerHTML = `
    <span class="unlock-toast-icon">🔒</span>
    <span class="unlock-toast-name">${entry.name}</span>
    <span class="unlock-toast-status">${entry.conditionHint ?? 'Unlocked'}</span>
  `
  toast.style.cssText = `
    position: fixed;
    top: 16px;
    right: -300px;
    z-index: 9999;
    background: #2a2a2a;
    color: #eee;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    min-width: 200px;
    max-width: 280px;
    transition: right 0.3s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  `
  document.body.appendChild(toast)
  _activeToast = toast

  // Slide in
  void toast.offsetHeight
  toast.style.right = '16px'

  // Phase 1 (~700ms): lock shake
  setTimeout(() => {
    const icon = toast.querySelector('.unlock-toast-icon')
    if (icon) {
      icon.style.display = 'inline-block'
      icon.style.animation = 'toast-shake 0.4s ease'
    }
  }, 700)

  // Phase 2 (~1200ms): background flash green, icon unlocks, text updates
  setTimeout(() => {
    toast.style.background = '#1a4a2a'
    const icon = toast.querySelector('.unlock-toast-icon')
    if (icon) { icon.style.animation = ''; icon.textContent = '🔓' }
    const status = toast.querySelector('.unlock-toast-status')
    if (status) status.textContent = 'Unlocked!'
  }, 1200)

  // Phase 3: fade out and slide away
  setTimeout(() => {
    toast.style.transition = 'right 0.3s ease, opacity 0.3s ease'
    toast.style.right = '-300px'
    toast.style.opacity = '0'
  }, TOAST_DURATION_MS - 300)

  setTimeout(() => {
    toast.remove()
    _activeToast = null
    onDone()
  }, TOAST_DURATION_MS)
}
