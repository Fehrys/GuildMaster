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
      <div class="discoveries-header">
        <h2 class="discoveries-title">Discoveries</h2>
      </div>
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
      <details class="discoveries-section" open>
        <summary class="discoveries-section-title">${label}</summary>
        <div class="discoveries-entries">
          <div class="discoveries-placeholder">More content coming soon.</div>
        </div>
      </details>
    `
  }

  const entries = unlocks.filter(u => u.type === type)
  const items = entries.map(entry => _renderEntry(entry, progress)).join('')

  return `
    <details class="discoveries-section" open>
      <summary class="discoveries-section-title">${label}</summary>
      <div class="discoveries-entries">
        ${items}
      </div>
    </details>
  `
}

function _renderEntry(entry, progress) {
  const unlocked = progress.unlockedContent.includes(entry.id)

  if (unlocked) {
    return `
      <div class="discoveries-entry unlocked">
        <span class="discoveries-entry-icon">${entry.emoji}</span>
        <div class="discoveries-entry-info">
          <div class="discoveries-entry-name">${entry.name}</div>
          <div class="discoveries-entry-flavor">${entry.flavor}</div>
        </div>
      </div>
    `
  }

  if (entry.secret) {
    return `
      <div class="discoveries-entry locked secret">
        <span class="discoveries-entry-icon">🔒</span>
        <div class="discoveries-entry-info">
          <div class="discoveries-entry-name">???</div>
        </div>
      </div>
    `
  }

  return `
    <div class="discoveries-entry locked">
      <span class="discoveries-entry-icon">🔒</span>
      <div class="discoveries-entry-info">
        <div class="discoveries-entry-name">${entry.name}</div>
        <div class="discoveries-entry-condition">${entry.hint ?? entry.conditionHint ?? ''}</div>
      </div>
    </div>
  `
}
