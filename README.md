# Skybots – Apple-inspired Landing (Static)

Deployed on GitHub Pages. No build step.

## Assets
Place images in `images/`:
- hero.webp, speed.webp, integrations.webp, dashboard.webp, cta.webp

Place EXACTLY three demos in `audio/`:
- demo_1.mp3, demo_2.mp3, demo_3.mp3

## Update the audio list
Edit `data/audios.json` so it references only those three files. Do not include durations; the site computes true durations from metadata.

## Dev notes
- **Inline demos**: The three audio demos are embedded as stacked bars in the first light slab, left of the latency image. There is no sticky/floating player.
- **Navigation**: The sticky top bar is permanently dark and readable on every section.
- **Copy**: The third feature slab reads “Throughout peak hours, consistent voice…” to reflect the scalability story.
- **Performance & accessibility**: Relative asset paths (no leading `/`), visible focus rings, `prefers-reduced-motion` honored, explicit `width`/`height` on images.

(Optional) add `images/favicon.ico`, `images/icon-180.png` (simple generated if missing).
