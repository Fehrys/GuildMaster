import { sisterMarenCards } from './sister-maren.js'
import { jolenFenceCards } from './jolen-fence.js'
import { sergeantBrekCards } from './sergeant-brek.js'
import { lordFarwickCards } from './lord-farwick.js'

export const npcRegistry = {
  'sister-maren': {
    id: 'sister-maren',
    emoji: '🙏',
    name: 'Sister Maren',
    role: 'Temple Priest',
    flavor: 'Faith, healing, moral dilemmas',
    cards: sisterMarenCards,
  },
  'jolen-fence': {
    id: 'jolen-fence',
    emoji: '🤫',
    name: 'Jolen the Fence',
    role: 'Black Market Contact',
    flavor: 'Crime, deals, moral grey areas',
    cards: jolenFenceCards,
  },
  'sergeant-brek': {
    id: 'sergeant-brek',
    emoji: '🏋️',
    name: 'Sergeant Brek',
    role: 'Combat Instructor',
    flavor: 'Training, discipline, warfare',
    cards: sergeantBrekCards,
  },
  'lord-farwick': {
    id: 'lord-farwick',
    emoji: '👑',
    name: 'Lord Farwick',
    role: 'Minor Nobleman',
    flavor: 'Politics, contracts, power plays',
    cards: lordFarwickCards,
  },
}

export const allNpcIds = Object.keys(npcRegistry)
