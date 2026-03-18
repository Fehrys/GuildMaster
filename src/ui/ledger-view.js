export function renderLedgerScreen(ledgerText, outcome) {
  const title = outcome === 'won' ? '🏆 Victory' : '💀 The Guild Falls'
  const titleClass = outcome === 'won' ? 'ledger-win' : 'ledger-loss'

  return `<div class="card ledger-card" id="ledger-screen">
    <div class="npc-portrait">${outcome === 'won' ? '🏆' : '💀'}</div>
    <div class="npc-name ${titleClass}">${title}</div>
    <div class="ledger-text">${ledgerText}</div>
    <div class="ledger-actions">
      <button class="continue-btn" id="play-again-btn">Play Again</button>
    </div>
  </div>`
}

export function renderTraitSelection(traitA, traitB) {
  return `<div class="card" id="trait-screen">
    <div class="npc-portrait">🏅</div>
    <div class="npc-name">Guild Legacy</div>
    <div class="situation">Choose a legacy that will shape your next guild:</div>
    <div class="choices">
      <button class="choice-btn" id="trait-a">
        <div class="choice-label">${traitA.label}</div>
        <div style="font-size:0.8rem;color:#aaa;margin-top:4px">${traitA.description}</div>
      </button>
      <button class="choice-btn" id="trait-b">
        <div class="choice-label">${traitB.label}</div>
        <div style="font-size:0.8rem;color:#aaa;margin-top:4px">${traitB.description}</div>
      </button>
    </div>
  </div>`
}
