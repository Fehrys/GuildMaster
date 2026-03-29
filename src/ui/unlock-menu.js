// src/ui/unlock-menu.js
import { unlocks } from '../data/unlocks.js'

const CATEGORIES = [
  { type: 'npc',   label: 'NPCs' },
  { type: 'arc',   label: 'Arcs' },
  { type: 'event', label: 'Events' },
  { type: 'card',  label: 'Cards' },
]

const PLACEHOLDER_TYPES = new Set(['event', 'card'])

/**
 * Renders the Discoveries screen.
 * @param {object} progress  Loaded progress state (needs .unlockedContent)
 * @returns {string} HTML string
 */
export function renderDiscoveriesMenu(progress) {
  const sections = CATEGORIES.map(cat => _renderSection(cat, progress)).join('')
  return `
    <div class="discoveries-screen">
      <h2 class="discoveries-title">Discoveries</h2>
      ${sections}
      <div class="discoveries-footer">
        <button class="menu-btn" id="discoveries-back-btn">← Back</button>
      </div>
    </div>
  `
}

function _renderSection({ type, label }, progress) {
  if (PLACEHOLDER_TYPES.has(type)) {
    return `
      <div class="discoveries-section">
        <div class="discoveries-section-label">${label}</div>
        <div class="discoveries-grid">
          <div class="disc-card disc-card--locked" style="grid-column: 1 / -1;">
            <div class="disc-card-flavor">More content coming soon.</div>
          </div>
        </div>
      </div>
    `
  }

  const entries = unlocks.filter(u => u.type === type)
  const items = entries.map(entry => _renderEntry(entry, progress)).join('')

  return `
    <div class="discoveries-section">
      <div class="discoveries-section-label">${label}</div>
      <div class="discoveries-grid">
        ${items}
      </div>
    </div>
  `
}

function _renderEntry(entry, progress) {
  const unlocked = progress.unlockedContent.includes(entry.id)

  if (unlocked) {
    return `
      <div class="disc-card disc-card--unlocked">
        <div class="disc-card-portrait">${entry.emoji}</div>
        <div class="disc-card-name">${entry.name}</div>
        <div class="disc-card-flavor">${entry.flavor}</div>
      </div>
    `
  }

  if (entry.secret) {
    return `
      <div class="disc-card disc-card--locked disc-card--secret">
        <div class="disc-card-portrait">🔒</div>
        <div class="disc-card-name">???</div>
      </div>
    `
  }

  return `
    <div class="disc-card disc-card--locked">
      <div class="disc-card-portrait">🔒</div>
      <div class="disc-card-name">${entry.name}</div>
      <div class="disc-card-hint">${entry.hint ?? entry.conditionHint ?? ''}</div>
    </div>
  `
}
