# Conversion case study

Page: `projects/conversion.html`
Layout: `css/conversion.css`
Video playback and section navigation: `js/conversion.js`
Videos: `assets/videos/conversion/`
Poster images: `assets/images/conversion/posters/`

The homepage Conversion card links to this page. “All work” returns to the homepage work section.

The ten displayed demos use H.264 MP4 exports with full original dimensions and 30 FPS. Website copies use CRF 20, yuv420p, no audio, and fast-start metadata. Compression reduced the combined video size from 55.06 MB to 8.08 MB. Originals remain untouched in `assets/videos/originals/conversion/`, excluded from Git. See `assets/videos/conversion/manifest.json` for individual sizes.

Videos load near the viewport, pause offscreen or when the tab is hidden, and retain still-image fallbacks. Reduced-motion visitors see posters until explicitly starting a demo. The controls use the Figma Video Control design.

The repetitive Shop the Look desktop demo has been removed from the page; its source file is preserved. The three mobile previews hide their controls. Browse, Shop the Look, and Quick add play consecutively using each export’s full duration, then repeat. Only one mobile clip plays at a time; the sequence pauses outside the viewport.

Edit written copy in the HTML outside the `motion-stage` elements. Replace videos and matching poster images together when updating demos. The old layered artwork and animation stylesheet remain available as source material but are no longer loaded by this page.

This page includes the shared two-line contact heading and your LinkedIn URL.

The gift bag demos also play A → B → C in a separate repeating sequence, pausing offscreen.

On desktop, the currently active Shop the Look clip expands to twice the width of its neighbors, following A → B → C. Media row height is reserved to avoid shifting subsequent content; mobile retains the stacked layout and reduced motion disables the resizing transition.
