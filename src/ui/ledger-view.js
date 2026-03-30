// src/ui/ledger-view.js

export function renderLedgerScreen(ledgerText, outcome) {
  const title = outcome === 'won' ? '🏆 Victory' : '💀 The Guild Falls'
  const titleClass = outcome === 'won' ? 'ledger-win' : 'ledger-loss'

  return `<div class="card ledger-card" id="ledger-screen">
    <div class="npc-portrait">${outcome === 'won' ? '🏆' : '💀'}</div>
    <div class="npc-name ${titleClass}">${title}</div>
    <div class="ledger-text">${ledgerText}</div>
    <div class="ledger-actions">
      <button class="continue-btn" id="play-again-btn">Return to Menu</button>
    </div>
  </div>`
}
