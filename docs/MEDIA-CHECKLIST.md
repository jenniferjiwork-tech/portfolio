# Media to export

Start with the three homepage thumbnails. We will collect full project-page media when we build each project, rather than exporting the whole Figma file at once.

## Homepage video files

Put these inside `assets/videos/home/`:

| Figma thumbnail | Exact filename | Shape |
| --- | --- | --- |
| Designing for conversion / Shop the Look | `conversion-preview.mp4` | 4:3 |
| Cari / pile → Cari → logo | `cari-preview.mp4` | 4:3 |
| JENNY BIRD / email and shopping preview | `jenny-bird-preview.mp4` | 4:3 |

Use MP4 with H.264 video for broad browser compatibility, around 936 × 702 pixels (twice the 468 × 351 desktop thumbnail), 24 or 30 frames per second, and no audio. Export only the thumbnail animation area, including its coloured background, without surrounding Figma interface or the project caption. Keep the full loop; avoid adding blank time before or after it. Aim for a few MB per clip when it still looks crisp; this is a practical target rather than a strict limit.

If your Figma export workflow only produces a different format, send that file and tell me how you exported it. We can work from what you have. Do not rename a different video format to `.mp4`.

To activate an export yourself, open `js/main.js`, find:

```js
const availableVideos = [];
```

Replace it with the filenames you have actually added:

```js
const availableVideos = [
  'conversion-preview.mp4',
  'cari-preview.mp4',
  'jenny-bird-preview.mp4'
];
```

Save and refresh. Each video loops while visible, has a Play/Pause button, and pauses when it scrolls off screen. Visitors who request reduced motion get manual playback. If a video fails to load, the still artwork underneath stays visible.

## Poster images

Also export a representative still from each thumbnail. Use PNG or WebP, 936 × 702 pixels, with the same crop as its video:

- `conversion-poster.png`
- `cari-poster.png`
- `jenny-bird-poster.png`

Put these in `assets/images/home/`. Send them here to have me wire them into the markup; simply adding a poster file does not activate it. A clear JENNY BIRD poster will replace its blank opening state and provide a useful fallback when videos are paused or unavailable.

## Naming and future pages

Use lowercase names with hyphens and a descriptive subject: `cari-catch-up-desktop.png`, `conversion-shop-the-look.mp4`. Avoid names like `final-final-2.png` and spaces. Keep originals elsewhere as a backup, and put website-ready exports in this project.

For each later page, keep its media together:

```text
assets/images/conversion/
assets/videos/conversion/
assets/images/cari/
assets/videos/cari/
assets/images/jenny-bird/
assets/videos/jenny-bird/
```

Export photos and detailed screenshots around twice their displayed width where practical. SVG is suitable for logos and icons. Keep text that visitors need to read in HTML whenever possible, rather than exporting a whole page as an image.
