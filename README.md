# Skybots – Apple-inspired Landing (Static)
Deployed on GitHub Pages. No build step.

## Assets
Place images in `/images/`:
- hero.webp, speed.webp, integrations.webp, dashboard.webp, cta.webp

Place EXACTLY three demos in `/audio/`:
- demo_1.mp3, demo_2.mp3, demo_3.mp3

## Update the audio list
Edit `data/audios.json` so it references only those three files.

## Dev notes
- Relative asset paths for GitHub Pages project sites (no leading `/`).
- Accessibility: visible focus, `prefers-reduced-motion` honored, alt text provided.
- Performance: explicit `width`/`height` on images, lazy-load non-hero images.

(Optional) add images/favicon.ico, images/icon-180.png (simple generated if missing).
