# Hero's Roll — Cozy RPG Slot Machine

> **⚠️ Notice:** *This platform and its repository files are strictly intended for a mini-project.*

---

## 🎨 Visual Theme Details

This project utilizes a soft indie cozy RPG beach aesthetic. It trades harsh digital neon glow effects and corporate dark modes for warm sand tones, layered blue ocean waves drawn in CSS, terracotta buttons, and rounded chocolate-brown chassis borders. Flanking decorative campsite gear reinforces the RPG environment.

---

## 👥 Team Composition

- **Developer:** Alex John Labis Tulen — *Student ID: 02-2223-01100*
- **Designers & Helpers:** Antigravity & Gemini — *Game Designers*

---

## ✨ Core Feature Manifest

1. **Balanced Odds Engine:** Employs a mathematically calculated probability distribution matrix to configure hits. Symbol weights (Gem 1, Sword 2, Shield 5) result in an engaging 26.17% win probability, maintaining active hearts.
2. **Immutable State Engine:** Enforces zero `let` keywords. All game variables are declared using `const` and stored in a static state object, updated via direct property mutations.
3. **Cascading Flywheel Friction Delays:** Mimics physical mechanical decay by applying staggered stop timers to the reels (Reel 1 halts at 1200ms, Reel 2 at 1900ms, and Reel 3 at 2600ms).
4. **Kinematic Motion Blurring:** Applies dynamic CSS filters and vertical scaling transforms to the reel containers during spin sequences to simulate rotational velocity.
5. **DOM-Driven Access Locks:** Prevents double-spin input overlap by reading and setting the `disabled` property directly on the primary button node, removing the need for state-tracking mutable variables.
