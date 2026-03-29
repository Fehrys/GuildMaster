// src/ui/setup-flow.js
import {
  renderTutorialCard, renderScenarioSelection,
  renderGuildNaming, renderNpcSelection,
} from './intro-view.js'
import { allNpcIds, npcRegistry } from '../data/cards/npcs/index.js'
import { unlocks } from '../data/unlocks.js'
import { saveProgress } from '../engine/progression.js'

/**
 * Runs the pre-run setup wizard.
 * @param {{ progress, mount, onComplete, onBack }} opts
 *   progress   - loaded progress object
 *   mount      - function(html) to render into #app
 *   onComplete - function({ guildName, selectedNpcs, arcId }) called when done
 *   onBack     - function() called when player clicks Back
 */
export function start({ progress, mount, onComplete, onBack }) {
  if (progress.skipTutorial) {
    showScenarioSelection({ progress, mount, onComplete, onBack })
  } else {
    showTutorial({ progress, mount, onComplete, onBack })
  }
}

function showTutorial({ progress, mount, onComplete, onBack }) {
  mount(renderTutorialCard())

  document.getElementById('continue-btn').onclick = () => {
    const skipChecked = document.getElementById('tutorial-skip-checkbox')?.checked ?? false
    let updatedProgress = progress
    if (skipChecked) {
      updatedProgress = { ...progress, skipTutorial: true }
      saveProgress(updatedProgress)
    }
    showScenarioSelection({ progress: updatedProgress, mount, onComplete, onBack })
  }
}

function showScenarioSelection({ progress, mount, onComplete, onBack }) {
  const arcEntries = unlocks.filter(u => u.type === 'arc')
  mount(`
    <a class="setup-back-link" id="setup-back">← Back</a>
    ${renderScenarioSelection(arcEntries, progress.unlockedContent)}
  `)

  document.getElementById('setup-back').onclick = () => {
    if (progress.skipTutorial) {
      onBack()
    } else {
      showTutorial({ progress, mount, onComplete, onBack })
    }
  }

  let selectedArcId = null

  // Auto-select if there is exactly one unlocked arc
  const unlockedArcs = arcEntries.filter(e => progress.unlockedContent.includes(e.id))
  if (unlockedArcs.length === 1) {
    selectedArcId = unlockedArcs[0].contentId
    const btn = document.getElementById('arc-confirm-btn')
    if (btn) {
      btn.disabled = false
      btn.textContent = `Play ${unlockedArcs[0].name} →`
    }
    const card = document.querySelector(`[data-arc-id="${selectedArcId}"]`)
    if (card) card.classList.add('selected')
  }

  document.querySelectorAll('.arc-select-card').forEach(card => {
    card.onclick = () => {
      if (card.dataset.locked === 'true') return
      document.querySelectorAll('.arc-select-card').forEach(c => c.classList.remove('selected'))
      card.classList.add('selected')
      selectedArcId = card.dataset.arcId
      const btn = document.getElementById('arc-confirm-btn')
      if (btn) {
        btn.disabled = false
        const entry = arcEntries.find(e => e.contentId === selectedArcId)
        btn.textContent = entry ? `Play ${entry.name} →` : 'Continue →'
      }
    }
  })

  document.getElementById('arc-confirm-btn').onclick = () => {
    if (!selectedArcId) return
    showGuildNaming({ arcId: selectedArcId, progress, mount, onComplete, onBack })
  }
}

function showGuildNaming({ arcId, progress, mount, onComplete, onBack }) {
  const prev = progress.lastGuildName || 'Iron Hearth Guild'
  mount(`
    <a class="setup-back-link" id="setup-back">← Back</a>
    ${renderGuildNaming(prev)}
  `)
  document.getElementById('setup-back').onclick = () =>
    showScenarioSelection({ progress, mount, onComplete, onBack })

  document.getElementById('continue-btn').onclick = () => {
    const guildName = document.getElementById('guild-name-input').value.trim() || prev
    showNpcSelection({ arcId, guildName, progress, mount, onComplete, onBack })
  }
}

function showNpcSelection({ arcId, guildName, progress, mount, onComplete, onBack }) {
  // Only show unlocked NPCs
  const unlockedNpcIds = unlocks
    .filter(u => u.type === 'npc' && progress.unlockedContent.includes(u.id))
    .map(u => u.contentId)
  const npcList = unlockedNpcIds.map(id => npcRegistry[id]).filter(Boolean)

  mount(`
    <a class="setup-back-link" id="setup-back">← Back</a>
    ${renderNpcSelection(npcList)}
  `)

  document.getElementById('setup-back').onclick = () =>
    showGuildNaming({ arcId, progress, mount, onComplete, onBack })

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
    onComplete({ guildName, selectedNpcs: selected, arcId })
  }
}
