export function renderMenu(saveExists) {
  const continueDisabled = saveExists ? '' : 'disabled'
  return `
    <div class="menu-screen">
      <div class="menu-logo">
        <div class="menu-divider">⚔️ ─────────────── ⚔️</div>
        <div class="menu-title">GUILDMASTER</div>
        <div class="menu-subtitle">Guild Management</div>
        <div class="menu-divider">⚔️ ─────────────── ⚔️</div>
      </div>
      <div class="menu-buttons">
        <button class="menu-btn" id="menu-new-game">New Game</button>
        <button class="menu-btn" id="menu-continue" ${continueDisabled}>Continue</button>
        <button class="menu-btn" id="menu-options">Options</button>
      </div>
      <div class="menu-version">v3.0 · 2026</div>
    </div>
  `
}
