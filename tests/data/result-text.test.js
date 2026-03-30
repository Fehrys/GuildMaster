import { describe, test, expect } from 'vitest'
import { npcRegistry } from '../../src/data/cards/npcs/index.js'
import { buildBasePool, worldEventCards } from '../../src/data/cards/registry.js'
import { crisisCards } from '../../src/data/cards/crisis.js'
import { chainedCards } from '../../src/data/cards/standard.js'
import { banditWarThirdChoices } from '../../src/data/cards/third-choices.js'
import { banditWar } from '../../src/data/arcs/bandit-war.js'

function hasResultText(choice) {
  return typeof choice.resultText === 'string' && choice.resultText.trim().length > 0
}

describe('resultText coverage', () => {
  test('all standard pool choices have resultText', () => {
    const pool = buildBasePool()
    for (const card of pool) {
      for (const choice of card.choices) {
        expect(
          hasResultText(choice),
          `${card.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
  })

  test('all event card choices have resultText', () => {
    for (const card of worldEventCards) {
      for (const choice of card.choices) {
        expect(
          hasResultText(choice),
          `${card.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
  })

  test('all crisis card choices have resultText', () => {
    for (const resource of Object.values(crisisCards)) {
      for (const card of Object.values(resource)) {
        for (const choice of card.choices) {
          expect(
            hasResultText(choice),
            `${card.id} / "${choice.label}" is missing resultText`
          ).toBe(true)
        }
      }
    }
  })

  test('all chained card choices have resultText', () => {
    for (const card of chainedCards) {
      for (const choice of card.choices) {
        expect(
          hasResultText(choice),
          `${card.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
  })

  test('all third-choice choices have resultText', () => {
    for (const entry of banditWarThirdChoices) {
      expect(
        hasResultText(entry.choice),
        `${entry.cardId} / "${entry.choice.label}" is missing resultText`
      ).toBe(true)
    }
  })

  test('all NPC card choices have resultText', () => {
    for (const [npcId, npcEntry] of Object.entries(npcRegistry)) {
      for (const [encKey, encounter] of Object.entries(npcEntry.cards)) {
        for (const [levelKey, card] of Object.entries(encounter)) {
          for (const choice of card.choices) {
            expect(
              hasResultText(choice),
              `${npcId} / ${encKey} / ${levelKey} / "${choice.label}" is missing resultText`
            ).toBe(true)
          }
        }
      }
    }
  })

  test('all bandit war milestone choices have resultText', () => {
    for (const milestone of banditWar.milestones) {
      for (const choice of milestone.choices) {
        expect(
          hasResultText(choice),
          `${milestone.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
    for (const card of banditWar.chainedCards) {
      for (const choice of card.choices) {
        expect(
          hasResultText(choice),
          `${card.id} / "${choice.label}" is missing resultText`
        ).toBe(true)
      }
    }
  })
})
