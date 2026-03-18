export function renderGuildIntro() {
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🏰</div>
    <div class="npc-name">Iron Hearth Guild</div>
    <div class="situation">
      Your hall smells of old leather and ambition.<br><br>
      Four things keep you in business:<br>
      <strong>💰 Gold · ⚔️ Adventurers · 📜 Quests · 🛡️ Equipment</strong><br><br>
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
