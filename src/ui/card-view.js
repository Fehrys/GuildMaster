function fuzzyIndicator(delta) {
  if (delta === 0) return null
  const abs = Math.abs(delta)
  const sign = delta > 0 ? '+' : '-'
  if (abs <= 10) return sign
  if (abs <= 20) return sign + sign
  return sign + sign + sign
}

const RESOURCE_ICONS = { gold: '💰', adventurers: '⚔️', quests: '📜', equipment: '🛡️' }

function renderDeltasBefore(deltas) {
  const parts = []
  for (const [key, val] of Object.entries(deltas)) {
    if (!RESOURCE_ICONS[key]) continue
    const ind = fuzzyIndicator(val)
    if (!ind) continue
    const cls = val > 0 ? 'delta-pos' : 'delta-neg'
    parts.push(`<span class="delta">${RESOURCE_ICONS[key]} <span class="${cls}">${ind}</span></span>`)
  }
  return parts.length ? `<div class="deltas">${parts.join('')}</div>` : ''
}

function renderDeltasAfter(deltas) {
  const parts = []
  for (const [key, val] of Object.entries(deltas)) {
    if (!RESOURCE_ICONS[key]) continue
    if (val === 0) continue
    const cls = val > 0 ? 'delta-pos' : 'delta-neg'
    const sign = val > 0 ? '+' : ''
    parts.push(`<span class="delta">${RESOURCE_ICONS[key]} <span class="${cls}">${sign}${val}</span></span>`)
  }
  return parts.length ? `<div class="deltas">${parts.join('')}</div>` : ''
}

export function renderCard(card, onChoose) {
  const choices = card.choices.map((choice, idx) => {
    const deltas = renderDeltasBefore(choice.deltas)
    const delayed = choice.chains ? '<div class="delayed">⚠️ delayed</div>' : ''
    return `<button class="choice-btn" data-idx="${idx}">
      <div class="choice-label">${choice.label}</div>
      ${deltas}
      ${delayed}
    </button>`
  }).join('')

  return `<div class="card" id="current-card">
    <div class="npc-portrait">${card.npc.emoji}</div>
    <div class="npc-name">${card.npc.name}</div>
    <div class="npc-role">${card.npc.role}</div>
    <div class="situation">${card.situation}</div>
    <div class="choices">${choices}</div>
  </div>`
}

export function renderCardResult(card, chosenIdx) {
  const chosen = card.choices[chosenIdx]
  const other = card.choices[1 - chosenIdx]

  const choiceButtons = card.choices.map((choice, idx) => {
    const isChosen = idx === chosenIdx
    const deltas = renderDeltasAfter(choice.deltas)
    const cls = isChosen ? 'choice-btn chosen' : 'choice-btn not-chosen'
    const check = isChosen ? '✓ ' : ''
    return `<div class="${cls}">
      <div class="choice-label">${check}${choice.label}</div>
      ${deltas}
    </div>`
  }).join('')

  return `<div class="card result" id="current-card">
    <div class="npc-portrait">${card.npc.emoji}</div>
    <div class="npc-name">${card.npc.name}</div>
    <div class="npc-role">${card.npc.role}</div>
    <div class="situation">${card.situation}</div>
    <div class="choices">${choiceButtons}</div>
    <button class="continue-btn" id="continue-btn">Continue →</button>
  </div>`
}

export function renderRumorCard(text, onContinue) {
  return `<div class="card rumor-card" id="current-card">
    <div class="npc-portrait">📜</div>
    <div class="npc-name">Rumour</div>
    <div class="situation">${text}</div>
    <button class="continue-btn" id="continue-btn">Continue →</button>
  </div>`
}
