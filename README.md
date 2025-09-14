# Skybots Apple-inspired Landing (Static)
Deployed on GitHub Pages (root). No build step.

## Add or update audio demos
1) Upload your files to `/audio/` (e.g., `sales_intro.mp3`).\
2) Edit `/data/audios.json` to add entries:
```json
[
  {"title":"Your Title","url":"/audio/your_file.mp3","duration":"00:32"}
]
```

3. Commit changes to main. The gallery auto-renders.

Customize panels

Replace /images/* with your own images (no Apple IP). Keep aspect ratios ~3:2 or 4:3.

Accessibility & perf
• Keyboard focus visible, prefers-reduced-motion supported.
• Images lazy-loaded where safe, JS deferred.
• System font stack to avoid FOIT.

---

## What Agent/Codex will actually do for you
- **Codex**: scaffolds repo, writes these files, opens the PR.\
- **Agent**: clicks GitHub UI to enable **Pages**, verifies the live URL, and posts a QA note to the PR.\
- **You**: drop your real audio into `/audio/` or paste URLs you already host; update `audios.json`.

---

## Why this layout reads “Apple-like” (without copying)
- **Hierarchy**: oversized hero type + single focal visual, then alternating high-contrast slabs.\
- **Rhythm**: generous vertical spacing and simple two-column panels.\
- **Tone**: short, declarative copy; no clutter.\
- **Craft**: sharp grid, soft radii, subtle translucency on sticky nav, strict color discipline.

---                    
