export function renderMenu(saveExists) {
  const continueDisabled = saveExists ? '' : 'disabled'
  return `
    <div class="menu-screen">
      <img class="menu-logo-img" src="assets/image/guildmaster_logo.png" alt="GuildMaster">
      <div class="menu-buttons">
        <button class="menu-btn" id="menu-new-game">New Game</button>
        <button class="menu-btn" id="menu-continue" ${continueDisabled}>Continue</button>
        <button class="menu-btn" id="menu-discoveries">Discoveries</button>
        <button class="menu-btn" id="menu-options">Options</button>
      </div>
      <div class="menu-version">v4.0 · 2026</div>
    </div>
  `
}
