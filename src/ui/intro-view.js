// src/ui/intro-view.js

// --- Tutorial card ---

export function renderTutorialCard() {
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">📖</div>
    <div class="npc-name">Welcome, Guild Master</div>
    <div class="situation">
      <strong>Who you are:</strong> You run a guild in a world that doesn't care if you succeed.<br><br>
      <strong>What to do:</strong> Keep your guild running for 60 turns. If any of your four resources —
      💰 Gold, ⚔️ Adventurers, 📜 Quests, 🛡️ Equipment — hits 0 or 100, the run ends.<br><br>
      <strong>How:</strong> Every turn, someone walks through your door with a problem.
      You choose how to handle it. Every choice costs and gains resources.
    </div>
    <label class="tutorial-skip-label">
      <input type="checkbox" id="tutorial-skip-checkbox"> Don't show this again
    </label>
    <button class="continue-btn" id="continue-btn">Begin →</button>
  </div>`
}

// --- Scenario selection ---

/**
 * @param {Array}    arcEntries      Unlock registry entries of type 'arc'
 * @param {string[]} unlockedContent progress.unlockedContent
 */
export function renderScenarioSelection(arcEntries, unlockedContent) {
  const cards = arcEntries.map(entry => {
    const isUnlocked = unlockedContent.includes(entry.id)
    const lockedClass = isUnlocked ? '' : 'arc-select-card--locked'
    const condition = !isUnlocked && entry.conditionHint
      ? `<div class="arc-select-condition">${entry.conditionHint}</div>`
      : ''
    return `
      <div class="arc-select-card ${lockedClass}" data-arc-id="${entry.contentId}" data-locked="${!isUnlocked}">
        <div class="arc-select-emoji">${entry.emoji}</div>
        <div class="arc-select-name">${entry.name}</div>
        <div class="arc-select-flavor">${entry.flavor}</div>
        ${condition}
      </div>
    `
  }).join('')

  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🗺️</div>
    <div class="npc-name">Choose Your Scenario</div>
    <div class="situation">Every town has a story. Choose which one you'll try to survive.</div>
    <div class="arc-select-grid">${cards}</div>
    <button class="continue-btn" id="arc-confirm-btn" disabled>Select a scenario →</button>
  </div>`
}

// --- Guild naming ---

export function renderGuildNaming(previousName) {
  const defaultName = previousName || 'Iron Hearth Guild'
  return `<div class="card intro-card" id="current-card">
    <div class="npc-portrait">🏰</div>
    <div class="npc-name">Name Your Guild</div>
    <div class="situation">You've just arrived in a small town with big ambitions. A building stands ready to welcome adventurers — it just needs a name.</div>
    <input type="text" id="guild-name-input" class="guild-input" value="${defaultName}" maxlength="30" />
    <button class="continue-btn" id="continue-btn">Continue →</button>
  </div>`
}

// --- NPC selection ---

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
    <div class="situation">These faces will cross your path again and again. How you treat them shapes what they offer — and what they withhold.</div>
    <div class="npc-select-grid">${cards}</div>
    <button class="continue-btn" id="npc-confirm-btn" disabled>Select 2 to continue →</button>
  </div>`
}

// --- In-run intros (shown after game starts) ---

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
