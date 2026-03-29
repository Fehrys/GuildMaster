# Responsive Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every GuildMaster screen fit in the viewport without a scrollbar, on any window size including mobile, using fluid font scaling and a compact mode at small breakpoints.

**Architecture:** Two CSS rules do most of the work — a `clamp()` font size on `html` and a single `@media` compact block. The game layout becomes a flex column filling `100dvh`. The resource bar HTML is restructured to show icon + number inline. All changes are in `style.css` and `src/ui/resource-bar.js`.

**Tech Stack:** Vanilla CSS (`clamp()`, `dvh`, `@media`), plain JS DOM

---

## File Map

| File | What changes |
|------|-------------|
| `style.css` | Font clamp, body/app height, game layout, resource bar CSS, card constraints, compact @media block, background-size fix |
| `src/ui/resource-bar.js` | `renderResourceBar()` HTML structure: icon + value inline in `.resource-row`, track below |

---

## Task 1: Fix menu/splash background image

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Change `background-size` from `contain` to `cover` in both screen classes**

In `style.css`, find `.splash-screen` (around line 233) and `.menu-screen` (around line 269). Change `background-size: contain` to `background-size: cover` in both:

```css
/* ===== SPLASH SCREEN ===== */
.splash-screen {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('assets/image/main_menu_background.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #0a0808;
  cursor: pointer;
}
```

```css
/* ===== MAIN MENU ===== */
.menu-screen {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('assets/image/main_menu_background.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #0a0808;
}
```

- [ ] **Step 2: Verify visually**

Open the game in a browser. Resize the window to a narrow portrait shape (e.g. 390×844 — iPhone 14 size). The background pixel art should now fill the entire viewport, cropping the left/right edges rather than showing black bars. The guild building should remain visible in the center.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "fix: use background-size cover for menu/splash to fill viewport"
```

---

## Task 2: Fluid font scaling

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Replace fixed font size with `clamp()`**

In `style.css`, find `html { font-size: 22px; }` (line 29) and replace it:

```css
html { font-size: clamp(12px, 3vmin, 20px); }
```

This makes the root font size scale smoothly between 12px (floor) and 20px (ceiling) based on the smallest viewport dimension. All `rem`/`em` values in the codebase scale with it automatically.

- [ ] **Step 2: Verify visually**

Open the game and navigate to the main card view. Resize the browser window from wide to narrow. Font sizes should scale down smoothly without any sudden jumps. At ~375px width the text should be noticeably smaller but still legible.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "fix: fluid font scaling with clamp(12px, 3vmin, 20px)"
```

---

## Task 3: Root layout — viewport-filling flex structure

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Update `html` and `body` to use `100dvh` and `overflow: hidden`**

Find `html { font-size: ... }` (line 29 — already updated in Task 2) and add a separate `html` height rule directly before `body`. Then update the `body` rule:

```css
html { height: 100dvh; overflow: hidden; }

body {
  font-family: 'MontereyFLF', system-ui, sans-serif;
  background: #0e0c0a;
  color: #e8d5b7;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 2: Update `#app` to fill the viewport as a flex column**

Find the `#app` rule (around line 41) and update it:

```css
#app {
  width: 100%;
  max-width: min(680px, 96vw);
  padding: clamp(0.4rem, 2vmin, 1rem);
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
```

- [ ] **Step 3: Add game layout rules for `#game-header` and `#game-main`**

Add these rules after the `#app` rule:

```css
#game-header { flex-shrink: 0; }

#game-main {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.4rem, 2vmin, 1rem);
}
```

- [ ] **Step 4: Add size constraints to `.card`**

Find the `.card` rule (around line 106) and add `width`, `max-width`, and `max-height`:

```css
.card {
  background: #1a1714;
  border: 1px solid #3a2e1e;
  border-radius: 16px;
  padding: clamp(1.25rem, 3vw, 2rem);
  text-align: center;
  width: 100%;
  max-width: min(640px, 96vw);
  max-height: 100%;
}
```

- [ ] **Step 5: Verify visually**

Open the game and start a run to reach the card view. Resize the window to various heights. The resource bar should always be visible at top, the card should fill the remaining space without spilling outside the viewport. No scrollbar should appear at any size above the compact breakpoint.

- [ ] **Step 6: Commit**

```bash
git add style.css
git commit -m "fix: viewport-filling flex layout for body, app, game header/main"
```

---

## Task 4: Resource bar — inline icon + number layout

**Files:**
- Modify: `src/ui/resource-bar.js`
- Modify: `style.css`

- [ ] **Step 1: Update `renderResourceBar` HTML structure in `resource-bar.js`**

Find `renderResourceBar` (line 29). Change the template inside the `RESOURCES.map()` so icon and value are in a `.resource-row` flex row, with the track below:

```js
export function renderResourceBar(resources) {
  const items = RESOURCES.map(({ key, icon }) => {
    const v = resources[key]
    return `<div class="resource ${dangerClass(v)}" data-res="${key}">
      <div class="resource-row">
        <span class="resource-icon">${icon}</span>
        <span class="resource-value"><span class="resource-num">${v}</span><span class="resource-delta-label"></span></span>
      </div>
      <div class="resource-track">
        <div class="resource-fill" style="width:${v}%"></div>
        <div class="resource-delta"></div>
      </div>
    </div>`
  }).join('')
  return `<div class="resource-bar">${items}</div>`
}
```

The animation code in `updateResourceBar` queries `.resource-fill`, `.resource-delta`, `.resource-num`, and `.resource-delta-label` — these selectors are unchanged and still work.

- [ ] **Step 2: Update resource CSS in `style.css`**

Find the `/* ===== RESOURCE BAR ===== */` section (around line 47) and replace the `.resource`, `.resource-icon`, and `.resource-value` rules:

```css
.resource {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.resource-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.resource-icon { font-size: 1rem; line-height: 1; }

.resource-value {
  font-size: 0.8rem;
  color: #7a6a50;
  line-height: 1;
}
```

- [ ] **Step 3: Verify visually**

Open a game run. The resource bar should now show each resource as: `[emoji] [number]` on one line, with the progress bar below. The delta animation (number changing, bar animating) should still work correctly — trigger a card choice and confirm the bar animates.

- [ ] **Step 4: Run tests to confirm animation logic is unaffected**

```bash
npm test
```

Expected: all tests pass. (The animation code queries `.resource-num`, `.resource-fill` etc. — these are still present in the new HTML.)

- [ ] **Step 5: Commit**

```bash
git add src/ui/resource-bar.js style.css
git commit -m "feat: resource bar inline layout — icon and number side by side"
```

---

## Task 5: Compact breakpoint

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add the compact `@media` block at the end of `style.css`**

Append after the last rule (after the `/* ===== DISCOVERIES ===== */` section):

```css
/* ===== COMPACT MODE (small phones / short windows) ===== */
@media (max-height: 650px), (max-width: 400px) {

  /* Outer container — flush to screen edges */
  #app {
    padding: 0;
    max-width: 100%;
  }

  #game-main { padding: 0; }

  /* Resource bar — flush, tight */
  .resource-bar {
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    margin-bottom: 0;
    padding: 0.25rem 0.4rem;
    gap: 0.3rem;
  }

  .resource-track { height: 2px; }

  .guild-name { margin-bottom: 0.2rem; }

  /* Card — flush to sides, no border-radius */
  .card {
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: 0.55rem 0.6rem;
  }

  .npc-portrait { font-size: 1.8rem; margin-bottom: 0.1rem; }

  .situation {
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }

  .choices { gap: 0.4rem; }

  .choice-btn { padding: 0.5rem 0.4rem; }

  /* Setup screens — tighter grids */
  .arc-select-grid { gap: 0.4rem; }
  .npc-select-grid { gap: 0.4rem; }
  .npc-select-card { padding: 0.6rem; }
  .arc-select-card { padding: 0.6rem; }
}
```

- [ ] **Step 2: Verify compact mode — game card view**

Open the game and navigate to a card. In browser DevTools, set the viewport to 390×667 (iPhone SE) or 375×667. Confirm:
- Resource bar is flush to the top and sides of the screen with no gap
- No space between the resource bar and the card below
- Card has no left/right border or rounded corners (full-width)
- All text and choices are visible without scrolling

- [ ] **Step 3: Verify compact mode — setup screens**

Navigate through the setup flow (tutorial → scenario → guild name → NPC selection). At 375×667:
- All cards in the NPC grid and scenario grid should be visible without scrolling
- The back link and continue button should be visible

- [ ] **Step 4: Verify normal mode is unaffected**

Resize the browser back to 1280×800. The normal layout should be identical to before: padded `#app`, rounded resource bar, bordered card with radius.

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add style.css
git commit -m "feat: compact breakpoint for small phone and short window viewports"
```
