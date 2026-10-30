# JENNY BIRD overview

Page: `projects/jenny-bird.html`. Linked from the homepage card.

Uses shared fonts, navigation, theme, contact section and Figma Video Control. Page-specific files: `css/jenny-bird.css`, `css/jenny-bird-motion.css`, `js/jenny-bird.js`. Figma frames: desktop `135:2186`, mobile `561:2433`.

Three demos use local Figma image layers and supplied animation keyframes. They scale within 960 × 620 panels, pause offscreen and in hidden tabs, and respect reduced motion. These can later be replaced by MP4 exports using the same pattern as Conversion. Assets are in `assets/images/jenny-bird/`.

Verified at 320, 390, 760, 1024 and 1440 px with no horizontal overflow or broken images. Mobile Love and Inbox crops follow the dedicated 350 × 517 and 350 × 503 Figma panels. All 25 supplied motion layers are implemented.

Hero video connected from `assets/videos/jenny-bird/hero.mp4`, with a clean first-frame poster and separate SVG wordmark. Original retained in `assets/videos/originals/jenny-bird/hero.mp4`. Original H.264 stream preserved without re-encoding, full 1440 × 600 resolution and original 23.976 FPS, fast-start metadata, no audio. Playback pauses offscreen and respects reduced motion.
