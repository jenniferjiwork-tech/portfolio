/* Responsive, pauseable demos built from the original Figma keyframes. */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scenes = [...document.querySelectorAll('.motion-stage')];
const sceneStates = new Map();

function setScenePlaying(stage) {
  const state = sceneStates.get(stage);
  const playing = !document.hidden && state.visible && !state.manuallyPaused && (!prefersReducedMotion.matches || state.userStarted);
  stage.dataset.playing = String(playing);
  const button = stage.querySelector('.scene-toggle');
  updateVideoControl(button, playing);
}
const sceneObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    sceneStates.get(entry.target).visible = entry.isIntersecting;
    setScenePlaying(entry.target);
  }
}, {threshold:0.1});
function sceneBaseWidth(stage) { return innerWidth <= 760 && stage.dataset.mobileBase ? Number(stage.dataset.mobileBase) : Number(stage.dataset.baseWidth); }
const sceneResize = new ResizeObserver((entries) => {
  for (const entry of entries) entry.target.style.setProperty('--scene-scale', String(entry.contentRect.width / sceneBaseWidth(entry.target)));
});
for (const stage of scenes) {
  stage.setAttribute('role', 'group');
  sceneStates.set(stage, {visible:false, manuallyPaused:false, userStarted:false});
  stage.style.setProperty('--scene-scale', String(stage.clientWidth / sceneBaseWidth(stage)));
  stage.querySelector('.scene-toggle').addEventListener('click', () => {
    const state = sceneStates.get(stage);
    if (stage.dataset.playing === 'true') { state.manuallyPaused = true; }
    else { state.manuallyPaused = false; state.userStarted = true; }
    setScenePlaying(stage);
  });
  if (prefersReducedMotion.matches) stage.getAnimations({subtree:true}).forEach(animation => { animation.currentTime = 1200; });
  sceneResize.observe(stage);
  sceneObserver.observe(stage);
}
prefersReducedMotion.addEventListener('change', () => {
  for (const stage of scenes) {
    sceneStates.get(stage).userStarted = false;
    setScenePlaying(stage);
  }
});
/* Section navigation, with the active marker following reading position. */
const sectionNavigation = document.querySelector('#navigation');
const sectionLinks = [...sectionNavigation.querySelectorAll('a[href^="#"]')];
const indexedSections = sectionLinks.map(link => ({link, section:document.querySelector(link.getAttribute('href'))})).filter(item => item.section);
let pinnedSection = null;
let pinTimeout;
function selectSection(id) {
  for (const {link} of indexedSections) {
    const active = link.getAttribute('href') === '#' + id;
    link.classList.toggle('active', active);
    link.querySelector('.dot')?.classList.toggle('invisible', !active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  }
}
function updateSection() {
  if (pinnedSection) return;
  let current = indexedSections[0];
  for (const item of indexedSections) if (item.section.getBoundingClientRect().top <= innerHeight * 0.35) current = item;
  if (current) selectSection(current.section.id);
}
function pinSection(id) {
  pinnedSection = id; selectSection(id); clearTimeout(pinTimeout);
  pinTimeout = setTimeout(() => { pinnedSection = null; updateSection(); }, 1300);
}
sectionNavigation.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (link) pinSection(link.getAttribute('href').slice(1));
});
window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  if (indexedSections.some(({section}) => section.id === id)) pinSection(id);
});
let sectionFramePending = false;
window.addEventListener('scroll', () => {
  if (sectionFramePending) return;
  sectionFramePending = true;
  requestAnimationFrame(() => { sectionFramePending = false; updateSection(); });
}, {passive:true});
window.addEventListener('resize', updateSection);
window.addEventListener('load', updateSection);
updateSection();

document.addEventListener("visibilitychange", () => scenes.forEach(setScenePlaying));

/* The original campaign MP4 is connected through data-src after import. */
const heroVideo = document.querySelector('.jb-hero-video');
if (heroVideo?.dataset.src) {
  const heroButton = document.querySelector('.jb-hero-toggle');
  let heroVisible = false;
  let heroPaused = false;
  let heroStarted = false;
  const syncHero = () => {
    const allowed = heroVisible && !document.hidden && !heroPaused && (!prefersReducedMotion.matches || heroStarted);
    if (!allowed) { heroVideo.pause(); return; }
    if (!heroVideo.src) heroVideo.src = heroVideo.dataset.src;
    heroVideo.play().then(() => {
      if (!heroVisible || document.hidden || heroPaused) heroVideo.pause();
    }).catch(() => updateVideoControl(heroButton, false));
  };
  heroButton.hidden = false;
  updateVideoControl(heroButton, false);
  heroButton.addEventListener('click', () => {
    heroPaused = !heroVideo.paused;
    heroStarted = true;
    syncHero();
  });
  for (const event of ['play', 'pause', 'ended']) heroVideo.addEventListener(event, () => updateVideoControl(heroButton, !heroVideo.paused));
  heroVideo.addEventListener('error', () => { heroButton.hidden = true; });
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; syncHero(); }, {threshold:0.1}).observe(heroVideo);
  document.addEventListener('visibilitychange', syncHero);
  prefersReducedMotion.addEventListener('change', () => { heroStarted = false; syncHero(); });
}
