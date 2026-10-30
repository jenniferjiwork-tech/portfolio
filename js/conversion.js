/* MP4 demos: defer downloads, preserve stills, and pause offscreen. */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sequences = [...document.querySelectorAll('.mobile-sequence')].map(stage => ({stage, players:[], index:0, visible:false}));
const players = [...document.querySelectorAll('[data-case-video]')].map(stage => ({
  stage, video:stage.querySelector('video'), button:stage.querySelector('.scene-toggle'),
  visible:false, manuallyPaused:false, userStarted:false, failed:false,
  sequence:sequences.find(sequence => sequence.stage.contains(stage))
}));
const giftPlayers = players.filter(player => player.stage.closest('.gift-steps'));
let focusedGift = null;
const playerByStage = new Map(players.map(player => [player.stage,player]));
for (const sequence of sequences) sequence.players = players.filter(player => player.sequence === sequence);
function loadVideo(player, preload = 'metadata') {
  if (player.failed) return;
  const video = player.video;
  video.preload = preload;
  if (!video.getAttribute('src')) {
    video.poster = video.dataset.poster;
    video.src = video.dataset.src;
  }
}
function isAllowedToPlay(player) {
  if (player.failed || document.hidden || player.manuallyPaused) return false;
  if (giftPlayers.includes(player) && player !== focusedGift) return false;
  if (player.sequence) return player.sequence.visible && player.sequence.players[player.sequence.index] === player && (!prefersReducedMotion.matches || player.userStarted);
  return player.visible && (!prefersReducedMotion.matches || player.userStarted);
}
function updatePlayerControl(player) {
  const playing = !player.video.paused && !player.video.ended;
  player.stage.dataset.playing = String(playing);
  updateVideoControl(player.button, playing);
}
function syncPlayer(player) {
  if (!isAllowedToPlay(player)) { player.video.pause(); updatePlayerControl(player); return; }
  loadVideo(player);
  const attempt = player.video.play();
  if (attempt) attempt.then(() => {
    // A pending play request may finish after the visitor scrolls away.
    if (!isAllowedToPlay(player)) player.video.pause();
    else delete player.stage.dataset.blocked;
    updatePlayerControl(player);
  }).catch(() => {
    player.stage.dataset.blocked = 'true';
    updatePlayerControl(player);
  });
}
function syncSequence(sequence) {
  for (const player of sequence.players) {
    if (sequence.visible && !prefersReducedMotion.matches && !document.hidden) loadVideo(player, 'auto');
    syncPlayer(player);
  }
}
function advanceSequence(sequence) {
  const sequencePlayers = sequence.players;
  sequencePlayers[sequence.index].video.pause();
  let next = sequence.index;
  for (let count = 0; count < sequencePlayers.length; count++) {
    next = (next + 1) % sequencePlayers.length;
    if (!sequencePlayers[next].failed) break;
  }
  if (sequencePlayers[next].failed) return;
  sequence.index = next;
  const video = sequencePlayers[next].video;
  try { video.currentTime = 0; } catch { /* play() starts at zero before metadata is ready. */ }
  sequence.stage.dataset.activeStep = ['a','b','c'][next];
  syncSequence(sequence);
}
const nearObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const player = playerByStage.get(entry.target);
    if (!prefersReducedMotion.matches) loadVideo(player);
    nearObserver.unobserve(entry.target);
  }
}, {rootMargin:'250px'});
const playerObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const player = playerByStage.get(entry.target);
    player.visible = entry.isIntersecting;
    syncPlayer(player);
  }
}, {threshold:0.1});
for (const player of players) {
  const {stage,video,button} = player;
  video.muted = true;
  video.playsInline = true;
  video.loop = !player.sequence;
  button.hidden = stage.dataset.videoControls !== 'true';
  updateVideoControl(button, false);
  video.addEventListener('loadeddata', () => { stage.dataset.ready = 'true'; });
  video.addEventListener('play', () => updatePlayerControl(player));
  video.addEventListener('pause', () => updatePlayerControl(player));
  video.addEventListener('ended', () => {
    updatePlayerControl(player);
    if (player.sequence && player.sequence.players[player.sequence.index] === player) advanceSequence(player.sequence);
  });
  video.addEventListener('error', () => {
    player.failed = true;
    stage.dataset.error = 'true';
    button.hidden = true;
    updatePlayerControl(player);
    if (player.sequence && player.sequence.players[player.sequence.index] === player) advanceSequence(player.sequence);
  });
  button.addEventListener('click', () => {
    if (giftPlayers.includes(player)) { focusedGift = player; giftPlayers.filter(other => other !== player).forEach(other => other.video.pause()); }
    if (video.paused) { player.manuallyPaused = false; player.userStarted = true; }
    else { player.manuallyPaused = true; }
    syncPlayer(player);
  });
  nearObserver.observe(stage);
  if (!player.sequence) playerObserver.observe(stage);
}
for (const sequence of sequences) {
  sequence.stage.dataset.activeStep = 'a';
  new IntersectionObserver(([entry]) => {
    sequence.visible = entry.isIntersecting;
    syncSequence(sequence);
  }, {threshold:0}).observe(sequence.stage);
}
function syncAllPlayers() {
  for (const player of players) if (!player.sequence) syncPlayer(player);
  for (const sequence of sequences) syncSequence(sequence);
}
document.addEventListener('visibilitychange', syncAllPlayers);
prefersReducedMotion.addEventListener('change', () => {
  for (const player of players) player.userStarted = false;
  syncAllPlayers();
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

/* Reserve the largest media height so focus changes do not move the next section. */
const focusSequence = document.querySelector('.mobile-sequence');
if (focusSequence) {
  const sizeFocusSequence = () => {
    const gap = parseFloat(getComputedStyle(focusSequence).columnGap) || 24;
    const largeWidth = Math.max(0, (focusSequence.clientWidth - gap * 2) / 2);
    focusSequence.style.setProperty('--sequence-media-height', `${largeWidth * 1200 / 912}px`);
  };
  new ResizeObserver(sizeFocusSequence).observe(focusSequence);
  sizeFocusSequence();
}

/* Only the visible gift bag demo nearest the viewport center autoplays. */
function focusNearestGift() {
  const center = innerHeight / 2;
  focusedGift = giftPlayers.filter(player => {
    const box = player.stage.getBoundingClientRect();
    return !player.failed && box.bottom > 0 && box.top < innerHeight;
  }).sort((a, b) => {
    const distance = player => { const box = player.stage.getBoundingClientRect(); return Math.abs((box.top + box.bottom) / 2 - center); };
    return distance(a) - distance(b);
  })[0] || null;
  for (const player of giftPlayers) {
    const box = player.stage.getBoundingClientRect();
    player.visible = box.bottom > 0 && box.top < innerHeight;
    syncPlayer(player);
  }
}
let giftFramePending = false;
function scheduleGiftFocus() {
  if (giftFramePending) return;
  giftFramePending = true;
  requestAnimationFrame(() => { giftFramePending = false; focusNearestGift(); });
}
window.addEventListener('scroll', scheduleGiftFocus, {passive:true});
window.addEventListener('resize', scheduleGiftFocus);
window.addEventListener('load', scheduleGiftFocus);
focusNearestGift();
