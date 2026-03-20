function fuzzyIndicator(delta) {
  if (delta === 0) return null
  const abs = Math.abs(delta)
  const sign = delta > 0 ? '+' : '-'
  if (abs <= 10) return sign
  if (abs <= 20) return sign + sign
  return sign + sign + sign
}

const RESOURCE_ICONS = { gold: '💰', adventurers: '⚔️', quests: '📜', equipment: '🛡️' }

const TIER_LABELS = { '-2': 'Hostile', '-1': 'Rival', '1': 'Friendly', '2': 'Ally' }
const TIER_CLASSES = { '-2': 'hostile', '-1': 'rival', '1': 'friendly', '2': 'ally' }

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

function renderChoiceBtn(choice, idx) {
  const deltas = renderDeltasBefore(choice.deltas)
  const delayed = choice.chains ? '<div class="delayed">⚠️ delayed</div>' : ''
  return `<button class="choice-btn" data-idx="${idx}">
    <div class="choice-label">${choice.label}</div>
    ${deltas}
    ${delayed}
  </button>`
}

export function renderModifierBar(modifierState) {
  const mods = modifierState.active
  if (mods.length === 0) return ''

  const pills = mods.map(mod => {
    const entries = Object.entries(mod.effects)
    const parts = entries.map(([res, pct]) => {
      const icon = RESOURCE_ICONS[res] || res
      const sign = pct > 0 ? '+' : ''
      const cls = pct > 0 ? 'mod-positive' : 'mod-negative'
      return `<span class="${cls}">${icon} ${sign}${pct}%</span>`
    }).join(' ')

    const durationText = mod.duration === null
      ? '<span class="mod-duration mod-permanent">∞</span>'
      : `<span class="mod-duration">${mod.duration} ⏱</span>`

    const cls = mod.duration === null ? 'mod-pill mod-pill-permanent' :
      Object.values(mod.effects).some(v => v > 0) ? 'mod-pill mod-pill-positive' : 'mod-pill mod-pill-negative'

    return `<div class="${cls}">${parts} ${durationText}</div>`
  }).join('')

  return `<div class="modifier-bar"><span class="mod-label">Effects</span>${pills}</div>`
}

export function renderCard(card, onChoose) {
  const tierBadge = card.npcTier && card.npcTier !== 0
    ? ` <span class="npc-tier npc-tier-${TIER_CLASSES[String(card.npcTier)]}">${TIER_LABELS[String(card.npcTier)]}</span>`
    : ''
  const attribution = card.attribution
    ? `<div class="attribution">${card.attribution}</div>`
    : ''

  const choicesHtml = card.choices.length === 3
    ? `<div class="choices choices-three">
        <div class="choices-row">${card.choices.slice(0, 2).map((c, i) => renderChoiceBtn(c, i)).join('')}</div>
        <div class="choices-third">${renderChoiceBtn(card.choices[2], 2)}</div>
      </div>`
    : `<div class="choices">${card.choices.map((c, i) => renderChoiceBtn(c, i)).join('')}</div>`

  return `<div class="card" id="current-card">
    <div class="npc-portrait">${card.npc.emoji}</div>
    <div class="npc-name">${card.npc.name}${tierBadge}</div>
    <div class="npc-role">${card.npc.role}</div>
    ${attribution}
    <div class="situation">${card.situation}</div>
    ${choicesHtml}
  </div>`
}

export function renderCardResult(card, chosenIdx) {
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

  const choicesHtml = card.choices.length === 3
    ? `<div class="choices choices-three">
        <div class="choices-row">${card.choices.slice(0, 2).map((choice, idx) => {
          const isChosen = idx === chosenIdx
          const deltas = renderDeltasAfter(choice.deltas)
          const cls = isChosen ? 'choice-btn chosen' : 'choice-btn not-chosen'
          const check = isChosen ? '✓ ' : ''
          return `<div class="${cls}">
            <div class="choice-label">${check}${choice.label}</div>
            ${deltas}
          </div>`
        }).join('')}</div>
        <div class="choices-third">${(() => {
          const choice = card.choices[2]
          const isChosen = 2 === chosenIdx
          const deltas = renderDeltasAfter(choice.deltas)
          const cls = isChosen ? 'choice-btn chosen' : 'choice-btn not-chosen'
          const check = isChosen ? '✓ ' : ''
          return `<div class="${cls}">
            <div class="choice-label">${check}${choice.label}</div>
            ${deltas}
          </div>`
        })()}</div>
      </div>`
    : `<div class="choices">${choiceButtons}</div>`

  return `<div class="card result" id="current-card">
    <div class="npc-portrait">${card.npc.emoji}</div>
    <div class="npc-name">${card.npc.name}</div>
    <div class="npc-role">${card.npc.role}</div>
    <div class="situation">${card.situation}</div>
    ${choicesHtml}
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
