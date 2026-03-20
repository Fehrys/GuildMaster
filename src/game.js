import { createState, applyChoice, checkEndCondition, isInTensionZone } from './engine/state.js'
import { createQueueState, advanceQueue, recordStandardCardPlayed, resetMilestoneCounter,
         queueCrisis, dequeueCrisis, queueChained, dequeueChained, pushChainedBack,
         queueRumor, dequeueRumor, scheduleReplacement } from './engine/queue.js'
import { getRepTier, applyRepShift } from './engine/reputation.js'
import { createLedger, recordEvent, updateAdventurerStatus, buildLedgerText } from './engine/ledger.js'
import { loadProgress, saveProgress, unlockArc, completeArc, setLegacyTrait, addAdventurer } from './engine/progression.js'
import { renderResourceBar } from './ui/resource-bar.js'
import { renderCard, renderCardResult, renderRumorCard } from './ui/card-view.js'
import { renderGuildIntro, renderArcIntro } from './ui/intro-view.js'
import { renderLedgerScreen, renderTraitSelection } from './ui/ledger-view.js'
import { buildBasePool } from './data/cards/registry.js'
import { chainedCards as standardChained } from './data/cards/standard.js'
import { crisisCards } from './data/cards/crisis.js'
import { banditWar } from './data/arcs/bandit-war.js'
import { baseAdventurers } from './data/adventurers.js'
import { traits } from './data/traits.js'

const ALL_ARCS = { 'bandit-war': banditWar }
const ALL_CHAINED = [...standardChained, ...Object.values(ALL_ARCS).flatMap(a => a.chainedCards ?? [])]

let gameState = null
let queueState = null
let ledger = null
let progress = null
let arc = null
let roster = []
let lastStandardCardId = null

const app = document.getElementById('app')

function mount(html) { app.innerHTML = html }

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

function startRun() {
  progress = loadProgress()
  arc = pickArc()
  gameState = createState()

  // Apply legacy trait
  if (progress.activeLegacyTrait) {
    const trait = traits.find(t => t.id === progress.activeLegacyTrait)
    if (trait?.effect) {
      const deltas = { ...trait.effect }
      // reputation delta handled separately
      const repShift = deltas.reputation ?? 0
      delete deltas.reputation
      gameState = applyChoice(gameState, deltas, {})
      gameState = { ...gameState, turnCount: 0, reputation: applyRepShift(50, repShift) }
    }
  }

  // Build roster
  const pool = [...baseAdventurers, ...progress.unlockedAdventurers]
  const rosterSize = Math.min(Math.floor(Math.random() * 3) + 3, pool.length) // random 3–5
  roster = pool.sort(() => Math.random() - 0.5).slice(0, rosterSize)
  roster.forEach(name => { gameState.resources; }) // roster tracked separately

  ledger = createLedger()
  roster.forEach(name => { ledger = updateAdventurerStatus(ledger, name, 'alive') })

  queueState = { ...createQueueState(), totalMilestones: arc.totalMilestones }

  showGuildIntro()
}

function showGuildIntro() {
  mount(renderResourceBar(gameState.resources) + renderGuildIntro())
  document.getElementById('continue-btn').onclick = () => showArcIntro()
}

function showArcIntro() {
  mount(renderResourceBar(gameState.resources) + renderArcIntro(arc))
  document.getElementById('continue-btn').onclick = () => nextTurn()
}

function nextTurn() {
  // Detect tension zone transitions (only fire Crisis on crossing the boundary, not while staying in zone)
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
    // Push back any chained events due this turn (spec: arc fires first, chained pushed back 1 turn)
    queueState = {
      ...queueState,
      queuedChained: queueState.queuedChained.map(e =>
        e.firesAtTurn <= gameState.turnCount ? { ...e, firesAtTurn: gameState.turnCount + 1 } : e
      ),
    }
    showCard(milestone, true)
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
    // Standard draw
    queueState = recordStandardCardPlayed(queueState)
    // Check replacement adventurer
    const card = drawStandardCard()
    showCard(card, false)
  }
}

function drawStandardCard() {
  // Check if a replacement adventurer card should fire
  if (queueState.pendingReplacement) {
    const rep = queueState.pendingReplacement
    const withinWindow = gameState.turnCount <= rep.windowClosesTurn
    if (withinWindow || true) { // fires even after window closes — never discarded
      const card = rep.card
      queueState = { ...queueState, pendingReplacement: null }
      return card
    }
  }
  // Draw from standard pool, excluding the last played card to prevent repeats
  const basePool = buildBasePool()
  const pool = lastStandardCardId
    ? basePool.filter(c => c.id !== lastStandardCardId)
    : basePool
  const card = pool[Math.floor(Math.random() * pool.length)]
  lastStandardCardId = card.id
  return card
}

function showCard(card, isArc) {
  const html = renderResourceBar(gameState.resources) + renderCard(card, null)
  mount(html)

  if (isArc) {
    const badge = document.createElement('div')
    badge.className = 'arc-badge'
    badge.textContent = `🗡️ ${arc.title} · Milestone ${queueState.milestonesCompleted} of ${arc.totalMilestones}`
    document.querySelector('.card').prepend(badge)
  }

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.onclick = () => handleChoice(card, parseInt(btn.dataset.idx), isArc)
  })
}

function showRumor(text) {
  mount(renderResourceBar(gameState.resources) + renderRumorCard(text))
  document.getElementById('continue-btn').onclick = () => nextTurn()
}

function handleChoice(card, chosenIdx, isArc) {
  const choice = card.choices[chosenIdx]

  // Apply resource deltas
  gameState = applyChoice(gameState, choice.deltas, {})

  // Apply reputation shift
  if (choice.reputation) {
    gameState = { ...gameState, reputation: applyRepShift(gameState.reputation, choice.reputation) }
  }

  // Queue chained event
  if (choice.chains) {
    const delay = Math.floor(Math.random() * 3) + 3 // 3–5 turns
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

  // If a named adventurer was lost (card explicitly sets lostAdventurer), schedule replacement
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

  // Arc completion is checked BEFORE resource limits (spec: win overrides loss)
  if (isArc && card.isFinal) {
    handleWin(choice)
    return
  }

  // Show result then advance — but check arc completion first, then resource limits
  mount(renderResourceBar(gameState.resources) + renderCardResult(card, chosenIdx))
  document.getElementById('continue-btn').onclick = () => {
    // Arc completion check applies to all arc cards, not just isFinal
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

function handleWin(lastChoice) {
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
  })
  const ledgerText = buildLedgerText(arcLedger)

  mount(renderLedgerScreen(ledgerText, 'won'))

  // Trait selection before play again
  document.getElementById('play-again-btn').onclick = () => showTraitSelection()
}

function handleLoss(endCond) {
  const arcLedger = Object.assign({}, ledger, {
    arcName: arc.title,
    arcOutcome: 'abandoned',
    endCondition: endCond,
    turnCount: gameState.turnCount,
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
startRun()
