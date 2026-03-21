import { merchantCards } from './merchants.js'
import { politicalCards } from './political.js'
import { criminalCards } from './criminal.js'
import { guildLifeCards } from './guild-life.js'
import { worldEventCards } from './events.js'

export { worldEventCards }

export function buildBasePool() {
  return [
    ...merchantCards,
    ...politicalCards,
    ...criminalCards,
    ...guildLifeCards,
  ]
}
