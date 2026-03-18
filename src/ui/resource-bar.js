const RESOURCES = [
  { key: 'gold', icon: '💰', label: 'Gold' },
  { key: 'adventurers', icon: '⚔️', label: 'Adventurers' },
  { key: 'quests', icon: '📜', label: 'Quests' },
  { key: 'equipment', icon: '🛡️', label: 'Equipment' },
]

function dangerClass(value) {
  if (value < 20 || value > 80) return 'danger'
  if (value < 30 || value > 70) return 'warning'
  return ''
}

export function renderResourceBar(resources) {
  const items = RESOURCES.map(({ key, icon }) => {
    const value = resources[key]
    const cls = dangerClass(value)
    return `<div class="resource ${cls}">
      <span class="resource-icon">${icon}</span>
      <div class="resource-track">
        <div class="resource-fill" style="width:${value}%"></div>
      </div>
      <span class="resource-value">${value}</span>
    </div>`
  }).join('')
  return `<div class="resource-bar">${items}</div>`
}
