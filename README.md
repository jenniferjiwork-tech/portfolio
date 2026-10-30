# Jennifer Ji — Portfolio

Personal portfolio of Jennifer Ji, a product designer based in Switzerland. Built with HTML, CSS and JavaScript from my Figma designs.

## Pages

- `index.html` — homepage and selected work
- `about/index.html` — background, experience and education
- `projects/conversion/index.html` — conversion design and testing at JENNY BIRD
- `projects/jenny-bird/index.html` — JENNY BIRD experience, site design and email work

## Preview locally

There is no build step or package installation. Open `index.html` in a browser for a quick preview, or serve this folder locally for more reliable media and clipboard testing:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000. Stop the server with Ctrl+C.

## Project structure

```text
assets/
  fonts/       Local fonts and their license notices
  icons/       Shared SVG icons
  images/      Page artwork and video posters
  videos/      Optimized website videos
css/           Shared and page-specific styles
js/            Navigation, theme, video and animation behavior
projects/      Individual project pages
docs/          Build notes and media guidance
```

Edit written content in the relevant HTML page. Shared styling is in `css/styles.css`; project-specific styles and scripts use matching filenames. The site includes responsive layouts, a light/dark theme, local fonts, video controls and reduced-motion support.

## Media

Keep master video exports in `assets/videos/originals/`. This directory is excluded from Git; only the optimized website copies are published. Back up the originals separately. Pair website videos with poster images so the page has a still while playback loads or is unavailable.

The Conversion page uses MP4 demos. Its Shop the Look and gift bag groups each play their three clips in sequence. The JENNY BIRD hero uses an MP4 with a separate SVG wordmark; its remaining demos currently use Figma artwork and CSS keyframes.

## Hosting

This is a static website suitable for GitHub Pages. In repository Settings → Pages, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then save. The included `.nojekyll` file disables Jekyll processing. A custom domain is optional.

## Rights and third-party materials

See `LICENSE` for the portfolio rights notice. Client work and JENNY BIRD branding are shown as portfolio examples and remain the property of their respective owners. Bundled fonts retain their separate license notices in `assets/fonts/`.

Public routes use `/`, `/about/`, `/projects/conversion/`, and `/projects/jenny-bird/`. Older `.html` project and About links redirect to the corresponding clean route, preserving anchors. Use a local HTTP server to preview root-relative asset paths.
