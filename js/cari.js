/* Cari page: responsive figures, optional MP4 demos, and section navigation. */
const visuals = [...document.querySelectorAll('.cari-visual')];
const scaleFigure = figure => figure.style.setProperty('--cari-scale',String(figure.clientWidth / Number(figure.dataset.baseWidth)));
const figureObserver = new ResizeObserver(entries => entries.forEach(entry=>scaleFigure(entry.target)));
visuals.forEach(figure=>{scaleFigure(figure);figureObserver.observe(figure);});
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const videoPlayers = [...document.querySelectorAll('[data-cari-video]')].filter(stage=>stage.querySelector('video').dataset.src).map(stage=>({stage,video:stage.querySelector('video'),button:stage.querySelector('button'),visible:false,paused:false,started:false}));
function syncCariVideo(player){
 const allowed=player.visible&&!document.hidden&&!player.paused&&(!motionPreference.matches||player.started);
 if(!allowed){player.video.pause();return;}
 if(!player.video.getAttribute('src'))player.video.src=player.video.dataset.src;
 player.video.play().then(()=>{if(!player.visible||document.hidden||player.paused)player.video.pause();}).catch(()=>updateVideoControl(player.button,false));
}
const videoObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{const player=videoPlayers.find(player=>player.stage===entry.target);player.visible=entry.isIntersecting;syncCariVideo(player);});},{threshold:.1});
videoPlayers.forEach(player=>{
 player.video.hidden=false;player.video.muted=true;player.video.playsInline=true;player.button.hidden=false;updateVideoControl(player.button,false);
 player.video.addEventListener('loadeddata',()=>player.stage.dataset.ready='true');
 for(const event of ['play','pause','ended'])player.video.addEventListener(event,()=>updateVideoControl(player.button,!player.video.paused));
 player.button.addEventListener('click',()=>{player.paused=!player.video.paused;player.started=true;syncCariVideo(player);});
 player.video.addEventListener('error',()=>{player.stage.dataset.ready='false';player.button.hidden=true;});
 videoObserver.observe(player.stage);
});
document.addEventListener('visibilitychange',()=>videoPlayers.forEach(syncCariVideo));
motionPreference.addEventListener('change',()=>videoPlayers.forEach(player=>{player.started=false;syncCariVideo(player);}));
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


const artObserver = new ResizeObserver(entries => entries.forEach(({target}) => target.style.setProperty('--art-scale',Math.min(1,target.clientWidth/190))));
document.querySelectorAll('.cari-positioning [data-name="Visual"]').forEach(el=>artObserver.observe(el));
