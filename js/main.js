/* Shared Figma Video Control, also used by CSS-animation demos. */
const videoControlIconUrl = new URL('../assets/icons/video-play.svg', document.currentScript.src).href;
function updateVideoControl(button, playing) {
  if (!button.querySelector('.video-control-face')) {
    button.classList.add('figma-video-control');
    button.replaceChildren();
    const play = document.createElement('span');
    play.className = 'video-control-face video-control-play';
    play.setAttribute('aria-hidden', 'true');
    const artwork = document.createElement('span');
    artwork.className = 'video-control-art';
    const image = document.createElement('img');
    image.src = videoControlIconUrl;
    image.alt = '';
    artwork.append(image); play.append(artwork);
    const pause = document.createElement('span');
    pause.className = 'video-control-face video-control-pause';
    pause.setAttribute('aria-hidden', 'true');
    pause.innerHTML = '<span class="pause-bar"></span><span class="pause-bar"></span>';
    button.append(play, pause);
  }
  button.dataset.state = playing ? 'pause' : 'play';
  button.setAttribute('aria-label', playing ? 'Pause demo' : 'Play demo');
  button.setAttribute('title', playing ? 'Pause demo' : 'Play demo');
  button.setAttribute('aria-pressed', String(playing));
}

/* Small, shared interactions. The homepage works without JavaScript too. */
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); } });

/* Work and About are now separate pages; keep the current-page marker stable. */
const currentPage = document.body.dataset.page;
navigation.querySelectorAll('a').forEach((link) => {
  const href = link.getAttribute('href');
  const page = href === 'about.html' ? 'about' : (href === '#work' || href === 'index.html#work') ? 'work' : null;
  if (!page) return;
  const active = page === currentPage;
  link.classList.toggle('active', active);
  if (active) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
  const marker = link.querySelector('.dot');
  if (marker) marker.classList.toggle('invisible', !active);
});

const themeButton = document.querySelector('.theme-toggle');
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}
try { setTheme(localStorage.getItem('portfolio-theme') === 'dark'); } catch { /* Storage is optional. */ }
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  setTheme(dark);
  try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch { /* Storage is optional. */ }
});

const copyButton = document.querySelector('.copy-button');
copyButton.addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText('jenniferji.work@gmail.com');
    copyButton.textContent = 'Copied';
    status.textContent = 'Email address copied.';
    setTimeout(() => { copyButton.textContent = 'Copy'; }, 2200);
  } catch {
    status.textContent = 'Copy unavailable. Select the email address to copy it, or click it to open your email app.';
    status.classList.remove('sr-only');
  }
});

/* Add only videos you have exported. Register them in this list by name.
   Example: const availableVideos = ['cari-preview.mp4'];
   This avoids broken requests while the media folders are empty. */
const availableVideos = ['conversion-preview.mp4', 'cari-preview.mp4', 'jenny-bird-preview.mp4'];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-video]').forEach((slot) => {
  const path = slot.dataset.video;
  if (!availableVideos.includes(path.split('/').pop())) return;
  // Project pages can opt into controls with data-video-controls="true".
  const showControls = slot.dataset.videoControls === 'true';
  if (reducedMotion.matches && !showControls) return;
  const video = document.createElement('video');
  const poster = slot.querySelector('.video-poster');
  if (poster) video.poster = poster.getAttribute('src');
  // Set src only when approaching the viewport, to avoid eager downloads.
  const loader = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    video.src = path;
    loader.disconnect();
    const bounds = slot.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < innerHeight && !reducedMotion.matches && !manuallyPaused) video.play().catch(() => {});
  }, { rootMargin: '200px' });
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';
  video.width = 1404;
  video.height = 1054;
  video.setAttribute('aria-label', slot.getAttribute('aria-label'));
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'video-toggle';
  updateVideoControl(button, false);
  let manuallyPaused = false;
  video.addEventListener('play', () => { updateVideoControl(button, true); });
  video.addEventListener('pause', () => { updateVideoControl(button, false); });
  video.addEventListener('error', () => { loader.disconnect(); video.remove(); button.remove(); });
  button.addEventListener('click', () => {
    if (video.paused) { manuallyPaused = false; if (!video.getAttribute('src')) video.src = path; video.play().catch(() => {}); }
    else { manuallyPaused = true; video.pause(); }
  });
  slot.append(video);
  loader.observe(slot);
  video.addEventListener('loadeddata', () => {
    const bounds = slot.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < innerHeight && !reducedMotion.matches && !manuallyPaused) video.play().catch(() => {});
  });
  if (showControls) slot.append(button);
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && video.getAttribute('src') && !reducedMotion.matches && !manuallyPaused) video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0.25 }).observe(slot);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) video.pause(); });
});
