import { createState, applyChoice, checkEndCondition, isInTensionZone } from './engine/state.js'
import { createQueueState, advanceQueue, recordStandardCardPlayed, resetMilestoneCounter,
         queueCrisis, dequeueCrisis, queueChained, dequeueChained, pushChainedBack,
         queueRumor, dequeueRumor, scheduleReplacement,
         scheduleNpc, clearNpcSchedule } from './engine/queue.js'
import { getRepTier, applyRepShift } from './engine/reputation.js'
import { createLedger, recordEvent, updateAdventurerStatus, buildLedgerText } from './engine/ledger.js'
import { loadProgress, saveProgress, unlockArc, completeArc, setLegacyTrait, addAdventurer } from './engine/progression.js'
import { renderResourceBar } from './ui/resource-bar.js'
import { renderCard, renderCardResult, renderRumorCard } from './ui/card-view.js'
import { tryStartMusic, toggleMusic, isMusicEnabled, playClick } from './ui/audio.js'
import { renderGuildIntro, renderArcIntro, renderGuildNaming, renderNpcSelection } from './ui/intro-view.js'
import { renderLedgerScreen, renderTraitSelection } from './ui/ledger-view.js'
import { buildBasePool } from './data/cards/registry.js'
import { chainedCards as standardChained } from './data/cards/standard.js'
import { crisisCards } from './data/cards/crisis.js'
import { banditWar } from './data/arcs/bandit-war.js'
import { baseAdventurers } from './data/adventurers.js'
import { traits } from './data/traits.js'
import { createRelationshipState, updateRelationship, getLevel, getFlags, resolveNpcCard, getNextNpc } from './engine/relationships.js'
import { createPoolState, drawCard, markPlayed, injectCards, removeCards, resetCycle, checkThirdChoice } from './engine/pool.js'
import { createFactionState, updateStance, getStance } from './engine/factions.js'
import { serializeRunState, deserializeRunState } from './engine/save.js'
import { npcRegistry, allNpcIds } from './data/cards/npcs/index.js'
import { banditWarThirdChoices } from './data/cards/third-choices.js'
import { thievesGuildAllied, thievesGuildOpposed } from './data/cards/factions/thieves-guild.js'
import { templeAllied, templeOpposed } from './data/cards/factions/temple.js'

const ALL_ARCS = { 'bandit-war': banditWar }
const ALL_CHAINED = [...standardChained, ...Object.values(ALL_ARCS).flatMap(a => a.chainedCards ?? [])]

const FACTION_CARDS = {
  'thieves-guild': { allied: thievesGuildAllied, opposed: thievesGuildOpposed },
  'temple': { allied: templeAllied, opposed: templeOpposed },
}

let gameState = null
let queueState = null
let ledger = null
let progress = null
let arc = null
let roster = []
let relationshipState = null
let poolState = null
let factionState = null
let guildName = 'Iron Hearth Guild'
let selectedNpcs = []
let npcEncounterCount = 0
let currentCard = null
let currentIsArc = false

const app = document.getElementById('app')

function mount(html) { app.innerHTML = html }

app.addEventListener('click', e => {
  if (e.target.id === 'music-toggle') {
    toggleMusic()
    const btn = document.getElementById('music-toggle')
    if (btn) btn.textContent = isMusicEnabled() ? '🎵' : '🔇'
  }
})

function renderBar() {
  const existing = document.querySelector('.resource-bar')
  if (existing) existing.outerHTML = renderResourceBar(gameState.resources)
  else app.insertAdjacentHTML('afterbegin', renderResourceBar(gameState.resources))
}

function pickArc() {
  const unlocked = progress.unlockedArcs.map(id => ALL_ARCS[id]).filter(Boolean)
  const weights = unlocked.map(a => progress.completedArcs.includes(a.id) ? 0.5 : 1.0)
  const total = weights.reduce((s, w) => s + w, 0)
  let r = Math.random() * total
  for (let i = 0; i < unlocked.length; i++) {
    r -= weights[i]
    if (r <= 0) return unlocked[i]
  }
  return unlocked[unlocked.length - 1]
}

function buildHeader() {
  const musicIcon = isMusicEnabled() ? '🎵' : '🔇'
  const guildLine = `<div class="guild-name">⚜️ ${guildName}<button id="music-toggle" class="music-btn" title="Toggle music">${musicIcon}</button></div>`
  const resBar = renderResourceBar(gameState.resources)
  return guildLine + resBar
}

function startRun() {
  progress = loadProgress()
  arc = pickArc()
  showGuildNaming()
}

function showGuildNaming() {
  const prev = progress.lastGuildName || 'Iron Hearth Guild'
  mount(renderGuildNaming(prev))
  document.getElementById('continue-btn').onclick = () => {
    guildName = document.getElementById('guild-name-input').value.trim() || prev
    progress = { ...progress, lastGuildName: guildName }
    saveProgress(progress)
    showNpcSelection()
  }
}

function showNpcSelection() {
  const npcList = allNpcIds.map(id => npcRegistry[id])
  mount(renderNpcSelection(npcList))

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
    selectedNpcs = selected
    initializeRun()
  }
}

function initializeRun() {
  gameState = createState()

  // Apply legacy trait
  if (progress.activeLegacyTrait) {
    const trait = traits.find(t => t.id === progress.activeLegacyTrait)
    if (trait?.effect) {
      const deltas = { ...trait.effect }
      const repShift = deltas.reputation ?? 0
      delete deltas.reputation
      gameState = applyChoice(gameState, deltas, {})
      gameState = { ...gameState, turnCount: 0, reputation: applyRepShift(50, repShift) }
    }
  }

  // Build roster
  const pool = [...baseAdventurers, ...progress.unlockedAdventurers]
  const rosterSize = Math.min(Math.floor(Math.random() * 3) + 3, pool.length)
  roster = pool.sort(() => Math.random() - 0.5).slice(0, rosterSize)

  ledger = createLedger()
  roster.forEach(name => { ledger = updateAdventurerStatus(ledger, name, 'alive') })

  queueState = { ...createQueueState(), totalMilestones: arc.totalMilestones }

  // V2 state
  relationshipState = createRelationshipState(selectedNpcs)
  poolState = createPoolState(buildBasePool())
  factionState = createFactionState(['thieves-guild', 'temple'])
  npcEncounterCount = 0

  showGuildIntro()
}

function showGuildIntro() {
  mount(buildHeader() + renderGuildIntro())
  document.getElementById('continue-btn').onclick = () => { tryStartMusic(); showArcIntro() }
}

function showArcIntro() {
  mount(buildHeader() + renderArcIntro(arc))
  document.getElementById('continue-btn').onclick = () => nextTurn()
}

function nextTurn() {
  // Detect tension zone transitions
  const RESOURCES = ['gold', 'adventurers', 'quests', 'equipment']
  const prev = queueState.prevTensionZone ?? []
  for (const res of RESOURCES) {
    const inZoneNow = isInTensionZone(gameState.resources[res])
    const wasInZone = prev.includes(res)
    if (inZoneNow && !wasInZone && !queueState.queuedCrisis.includes(res)) {
      queueState = queueCrisis(queueState, res)
    }
  }
  queueState = { ...queueState, prevTensionZone: RESOURCES.filter(r => isInTensionZone(gameState.resources[r])) }

  const { nextCardType, chainedCardId } = advanceQueue(queueState, gameState.turnCount)

  if (nextCardType === 'arc') {
    const milestone = arc.milestones[queueState.milestonesCompleted]
    queueState = resetMilestoneCounter(queueState)
    poolState = resetCycle(poolState)

    // Push back chained events due this turn
    queueState = {
      ...queueState,
      queuedChained: queueState.queuedChained.map(e =>
        e.firesAtTurn <= gameState.turnCount ? { ...e, firesAtTurn: gameState.turnCount + 1 } : e
      ),
    }

    // Check for third choice
    const thirdChoiceDefs = banditWarThirdChoices.filter(tc => tc.cardId === milestone.id)
    let cardWithThird = { ...milestone, choices: [...milestone.choices] }
    for (const tc of thirdChoiceDefs) {
      const extra = checkThirdChoice(tc.conditions, tc.choice, relationshipState, gameState, factionState)
      if (extra) cardWithThird.choices.push(extra)
    }

    // Schedule NPC for this new cycle
    queueState = scheduleNpc(queueState)

    showCard(cardWithThird, true)

  } else if (nextCardType === 'npc') {
    const npcId = getNextNpc(selectedNpcs, npcEncounterCount)
    const npcData = npcRegistry[npcId]
    const encounterNum = Math.floor(npcEncounterCount / 2) + 1
    const level = getLevel(relationshipState, npcId)
    const card = resolveNpcCard(npcData.cards, encounterNum, level)

    // Add display metadata
    const displayCard = { ...card, npcTier: level }

    npcEncounterCount++
    queueState = clearNpcSchedule(queueState)
    showCard(displayCard, false)

  } else if (nextCardType === 'crisis') {
    const res = queueState.queuedCrisis[0]
    const extreme = gameState.resources[res] < 20 ? 'low' : 'high'
    const card = crisisCards[res][extreme]
    queueState = dequeueCrisis(queueState)
    showCard(card, false)

  } else if (nextCardType === 'chained') {
    const card = ALL_CHAINED.find(c => c.id === chainedCardId)
    queueState = dequeueChained(queueState, chainedCardId)
    if (card) showCard(card, false)
    else nextTurn()

  } else if (nextCardType === 'rumor') {
    const rumorText = arc.rumorTexts[Math.floor(Math.random() * arc.rumorTexts.length)]
    queueState = dequeueRumor(queueState)
    showRumor(rumorText)

  } else {
    // Standard draw from pool engine
    queueState = recordStandardCardPlayed(queueState)

    // Check replacement adventurer first
    if (queueState.pendingReplacement) {
      const rep = queueState.pendingReplacement
      const card = rep.card
      queueState = { ...queueState, pendingReplacement: null }
      showCard(card, false)
      return
    }

    const { card, updatedState } = drawCard(poolState)
    poolState = updatedState
    showCard(card, false)
  }
}

function showCard(card, isArc) {
  currentCard = card
  currentIsArc = isArc
  autoSave()

  const html = buildHeader() + renderCard(card, null)
  mount(html)

  if (isArc) {
    const badge = document.createElement('div')
    badge.className = 'arc-badge'
    badge.textContent = `🗡️ ${arc.title} · Milestone ${queueState.milestonesCompleted} of ${arc.totalMilestones}`
    document.querySelector('.card').prepend(badge)
  }

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.onclick = () => {
      tryStartMusic()
      playClick()
      handleChoice(card, parseInt(btn.dataset.idx), isArc)
    }
  })
}

function showRumor(text) {
  mount(buildHeader() + renderRumorCard(text))
  document.getElementById('continue-btn').onclick = () => nextTurn()
}

function handleChoice(card, chosenIdx, isArc) {
  const choice = card.choices[chosenIdx]

  gameState = applyChoice(gameState, choice.deltas, {})

  // Apply reputation shift
  if (choice.reputation) {
    gameState = { ...gameState, reputation: applyRepShift(gameState.reputation, choice.reputation) }
  }

  // V2: Process relationship shifts
  // Format: { 'npc-id': shiftValue } — plain object, NOT array
  if (choice.relationships) {
    for (const [npcId, shift] of Object.entries(choice.relationships)) {
      relationshipState = updateRelationship(relationshipState, npcId, shift)
    }
  }

  // V2: Process faction stance changes
  // Format: { 'faction-id': 'stance' } — plain object
  if (choice.factions) {
    for (const [factionId, stance] of Object.entries(choice.factions)) {
      const oldStance = getStance(factionState, factionId)
      factionState = updateStance(factionState, factionId, stance)
      if (oldStance === 'neutral' && stance !== 'neutral') {
        const factionCards = FACTION_CARDS[factionId]?.[stance]
        if (factionCards) poolState = injectCards(poolState, factionCards)
      }
    }
  }

  // Queue chained event
  if (choice.chains) {
    const delay = Math.floor(Math.random() * 3) + 3
    queueState = queueChained(queueState, choice.chains, gameState.turnCount + delay)
  }

  // Queue rumor
  if (choice.rumorText || (isArc && choice.major)) {
    queueState = queueRumor(queueState)
  }

  // Log major choices to ledger
  if (choice.major) {
    ledger = recordEvent(ledger, `${card.npc.name}: "${choice.label}"`)
  }

  // If a named adventurer was lost, schedule replacement
  if (card.lostAdventurer) {
    ledger = updateAdventurerStatus(ledger, card.lostAdventurer, 'lost')
    const replacementCard = {
      id: `replacement-${card.lostAdventurer}`,
      type: 'standard',
      npc: { emoji: '🌟', name: 'A New Face', role: 'Recruit' },
      situation: `Word travels fast. A recruit arrived at your door the morning after ${card.lostAdventurer} didn't return. They look earnest. They look young.`,
      choices: [
        { label: 'Take them in', deltas: { adventurers: 5, equipment: -3 }, major: false, reputation: 0, chains: null, rumorText: null },
        { label: 'Not yet', deltas: {}, major: false, reputation: 0, chains: null, rumorText: null },
      ],
    }
    queueState = scheduleReplacement(queueState, replacementCard, gameState.turnCount)
  }

  // Auto-save
  autoSave()

  // Arc completion check (win overrides loss)
  if (isArc && card.isFinal) {
    handleWin(choice)
    return
  }

  // Show result then advance
  mount(buildHeader() + renderCardResult(card, chosenIdx))
  document.getElementById('continue-btn').onclick = () => {
    if (isArc && queueState.milestonesCompleted >= arc.totalMilestones) {
      handleWin(choice)
      return
    }
    const endCond = checkEndCondition(gameState)
    if (endCond) {
      handleLoss(endCond)
    } else {
      nextTurn()
    }
  }
}

function autoSave() {
  const runState = {
    gameState, queueState, relationshipState,
    poolState, factionState, ledger,
    arcId: arc.id, guildName, selectedNpcs, npcEncounterCount,
    currentCard, currentIsArc,
  }
  localStorage.setItem('guildmaster_run', serializeRunState(runState))
}

function clearRunSave() {
  localStorage.removeItem('guildmaster_run')
}

function handleWin(lastChoice) {
  clearRunSave()
  progress = completeArc(progress, arc.id)

  // Unlock new arcs
  arc.unlocks?.forEach(id => { progress = unlockArc(progress, id) })

  // Unlock adventurers
  arc.adventurerUnlocks?.forEach(name => { progress = addAdventurer(progress, name) })

  saveProgress(progress)

  // Build ledger
  const arcLedger = Object.assign({}, ledger, {
    arcName: arc.title,
    arcOutcome: 'won',
    endCondition: null,
    turnCount: gameState.turnCount,
    guildName,
    relationships: relationshipState,
    factionStances: factionState,
  })
  const ledgerText = buildLedgerText(arcLedger)

  mount(renderLedgerScreen(ledgerText, 'won'))

  // Trait selection before play again
  document.getElementById('play-again-btn').onclick = () => showTraitSelection()
}

function handleLoss(endCond) {
  clearRunSave()
  const arcLedger = Object.assign({}, ledger, {
    arcName: arc.title,
    arcOutcome: 'abandoned',
    endCondition: endCond,
    turnCount: gameState.turnCount,
    guildName,
    relationships: relationshipState,
    factionStances: factionState,
  })
  const ledgerText = buildLedgerText(arcLedger)

  saveProgress(progress)
  mount(renderLedgerScreen(ledgerText, 'lost'))
  document.getElementById('play-again-btn').onclick = () => startRun()
}

function showTraitSelection() {
  const available = traits.filter(t => t.id !== progress.activeLegacyTrait)
  const shuffled = available.sort(() => Math.random() - 0.5)
  const [traitA, traitB] = shuffled

  mount(renderTraitSelection(traitA, traitB))

  document.getElementById('trait-a').onclick = () => {
    progress = setLegacyTrait(progress, traitA.id)
    saveProgress(progress)
    startRun()
  }
  document.getElementById('trait-b').onclick = () => {
    progress = setLegacyTrait(progress, traitB.id)
    saveProgress(progress)
    startRun()
  }
}

// Boot
const savedRun = localStorage.getItem('guildmaster_run')
if (savedRun) {
  const restored = deserializeRunState(savedRun)
  if (restored) {
    gameState = restored.gameState
    queueState = restored.queueState
    relationshipState = restored.relationshipState
    poolState = restored.poolState
    factionState = restored.factionState
    ledger = restored.ledger
    guildName = restored.guildName
    selectedNpcs = restored.selectedNpcs
    npcEncounterCount = restored.npcEncounterCount
    arc = ALL_ARCS[restored.arcId]
    currentCard = restored.currentCard ?? null
    currentIsArc = restored.currentIsArc ?? false
    progress = loadProgress()
    if (currentCard) {
      showCard(currentCard, currentIsArc)
    } else {
      nextTurn()
    }
  } else {
    startRun()
  }
} else {
  startRun()
}
