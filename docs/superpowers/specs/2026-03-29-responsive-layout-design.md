# Responsive Layout — Design Spec
Date: 2026-03-29

## Goal
Make every screen of GuildMaster visible without any scrollbar, on all window sizes including mobile. Font size, padding, and margins adapt to the viewport. A compact mode activates on small screens.

## Decisions Made
- **Approach B**: fluid base (`clamp()`) + dedicated compact breakpoint
- **Resource bar**: icon + number inline (horizontal) in all modes, progress bar below
- **Compact outer spacing**: zero padding — resource bar flush to screen edges, no gap between resource bar and card

---

## 1. Root Layout

### Current problem
`body` vertically centers `#app` but has no height constraint. Tall content causes page scroll.

### New structure
```
html, body        → height: 100dvh; overflow: hidden
#app              → height: 100dvh; display: flex; flex-direction: column;
                    overflow: hidden; justify-content: center;
                    padding: clamp(0.4rem, 2vmin, 1rem);   ← kept in normal mode
                    max-width: min(680px, 96vw)             ← kept in normal mode
```

The game view mounts two children into `#app`:
```
#game-header      → flex-shrink: 0   (always visible, never squashed)
#game-main        → flex: 1; overflow: hidden; display: flex;
                    align-items: center; justify-content: center;
                    padding: clamp(0.4rem, 2vmin, 1rem)
```

Setup screens (tutorial, scenario, guild naming, NPC selection) and Discoveries are rendered directly into `#app` as a single `.card` child. The `justify-content: center` on `#app` keeps them vertically centered.

Splash and menu screens already use `position: fixed; inset: 0` — their sizing is fine. See Section 6 for the background image fix.

---

## 2. Fluid Font Scaling

Replace `html { font-size: 22px }` with:
```css
html { font-size: clamp(12px, 3vmin, 20px) }
```

Since all existing spacing uses `rem` and `em`, this single rule causes everything to scale automatically across screen sizes:

| Screen | vmin | Result |
|--------|------|--------|
| 1440×900 desktop | 27px | → clamped to **20px** |
| 1024×768 laptop | 23px | → clamped to **20px** |
| 480×720 small tablet | 14.4px | → **14.4px** (fluid) |
| 375×667 iPhone SE | 11.3px | → clamped to **12px** |

---

## 3. Resource Bar — Inline Layout (All Modes)

Change from stacked (icon above, number below) to inline (icon + number side by side, bar underneath). Applied in both normal and compact modes.

```html
<!-- New structure per resource cell -->
<div class="resource">
  <div class="resource-row">
    <span class="resource-icon">💰</span>
    <span class="resource-value">52</span>
  </div>
  <div class="resource-track">
    <div class="resource-fill"></div>
  </div>
</div>
```

CSS: `.resource-row { display: flex; align-items: center; justify-content: center; gap: 0.25em }`

This affects `resource-bar.js` (HTML generation) and `style.css` (layout rules).

---

## 4. Compact Breakpoint

Triggers on small phones or short windows:
```css
@media (max-height: 650px), (max-width: 400px) { … }
```

### Outer spacing — zero
```css
#app               → padding: 0; max-width: 100%   (overrides normal-mode values)
#game-main         → padding: 0
.card              → border-radius: 0; border-left: none; border-right: none
```
Resource bar goes flush to the top and sides of the screen. No gap between resource bar and card.

### Resource bar — tighter
```css
.resource-bar      → padding: 0.3rem 0.5rem; gap: 0.25rem
.resource          → padding: 0.2rem 0.25rem
.resource-track    → height: 2px
```

### Card — tighter
```css
.card              → padding: 0.55rem 0.6rem
.npc-portrait      → font-size: 1.8rem; margin-bottom: 0.1rem
.situation         → line-height: 1.4; margin-bottom: 0.5rem
.choices           → gap: 0.4rem
.choice-btn        → padding: 0.5rem 0.4rem
```

### Setup screens — tighter
```css
.arc-select-grid   → gap: 0.4rem
.npc-select-grid   → gap: 0.4rem
.npc-select-card   → padding: 0.6rem
.arc-select-card   → padding: 0.6rem
```

---

## 5. Card Size Constraint

The card must never overflow `#game-main`:
```css
.card {
  width: 100%;
  max-width: min(640px, 96vw);
  max-height: 100%;
}
```

---

## 6. Menu & Splash Background Image

### Problem
Both `.splash-screen` and `.menu-screen` use `background-size: contain`. The background image is wide landscape pixel art — on portrait mobile this leaves large black bars top and bottom.

### Fix
Switch to `background-size: cover` so the image always fills the full viewport, cropping edges instead of letterboxing. `background-position: center` keeps the guild building (image focal point) centered on any aspect ratio.

```css
.splash-screen,
.menu-screen {
  background-size: cover;      /* was: contain */
  background-position: center; /* unchanged */
}
```

The logo `<img>` (`menu-logo-img`) already uses `width: 80%; max-width: 720px` and adapts fine — no change needed there.

---

## 7. Files to Change

| File | Changes |
|------|---------|
| `style.css` | Font clamp, root layout, inline resource bar, compact breakpoint rules, card constraints, background-size fix |
| `src/ui/resource-bar.js` | HTML structure: icon + value inline, bar below |

No other JS files need changes — the DOM structure of cards, setup screens, and discoveries is already correct; only CSS rules change.

---

## Out of Scope
- Landscape phone orientation (not a target use case)
- Accessibility / touch target size audit (separate concern)
- Animation changes
