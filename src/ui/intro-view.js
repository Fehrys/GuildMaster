export function renderGuildIntro(guildName) {
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🏰</div>
    <div class="npc-name">${guildName}</div>
    <div class="situation">
      Your hall smells of old leather and ambition.<br><br>
      Four things keep you in business:<br>
      <strong>💰 Gold · ⚔️ Adventurers <br>📜 Quests · 🛡️ Equipment</strong><br><br>
      Let none reach ruin — or excess.
    </div>
    <button class="continue-btn" id="continue-btn">Begin →</button>
  </div>`
}

export function renderArcIntro(arc) {
  return `<div class="card intro-card arc-card" id="current-card">
    <div class="arc-badge">🗡️ ${arc.title}</div>
    <div class="npc-portrait">⚔️</div>
    <div class="npc-name">A New Threat</div>
    <div class="situation">${arc.intro}</div>
    <button class="continue-btn" id="continue-btn">Face it →</button>
  </div>`
}

export function renderGuildNaming(previousName) {
  const defaultName = previousName || 'Iron Hearth Guild'
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🏰</div>
    <div class="npc-name">Name Your Guild</div>
    <div class="situation">Every guild begins with a name. Choose one that will be remembered.</div>
    <input type="text" id="guild-name-input" class="guild-input" value="${defaultName}" maxlength="30" />
    <button class="continue-btn" id="continue-btn">Continue →</button>
  </div>`
}

export function renderNpcSelection(npcList) {
  const cards = npcList.map(npc => `
    <div class="npc-select-card" data-npc-id="${npc.id}">
      <div class="npc-select-portrait">${npc.emoji}</div>
      <div class="npc-select-name">${npc.name}</div>
      <div class="npc-select-role">${npc.role}</div>
      <div class="npc-select-flavor">${npc.flavor}</div>
    </div>
  `).join('')

  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🤝</div>
    <div class="npc-name">Choose Your Contacts</div>
    <div class="situation">Pick 2 NPCs who will appear throughout your run.</div>
    <div class="npc-select-grid">${cards}</div>
    <button class="continue-btn" id="npc-confirm-btn" disabled>Select 2 to continue →</button>
  </div>`
}
