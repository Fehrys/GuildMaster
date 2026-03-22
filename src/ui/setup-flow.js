import { renderGuildNaming, renderNpcSelection } from './intro-view.js'
import { allNpcIds, npcRegistry } from '../data/cards/npcs/index.js'

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
      // data-npc-id (kebab) is accessed as dataset.npcId (camelCase) by the browser
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
