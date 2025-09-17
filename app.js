// Scroll state for nav translucency
const nav = document.querySelector('.nav');
const setScroll = () => nav?.setAttribute('data-scrolled', window.scrollY > 8 ? '1' : '0');
setScroll(); window.addEventListener('scroll', setScroll);

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Audio gallery (EXACTLY 3 items expected)
const grid = document.getElementById('audio-grid');
const audio = document.getElementById('audio');
const playpause = document.getElementById('playpause');
const nowplaying = document.getElementById('nowplaying');
const seek = document.getElementById('seekbar');
const back15 = document.getElementById('back15');
const fwd15 = document.getElementById('fwd15');
const speed = document.getElementById('speed');

let list = [];
let current = -1;
let seeking = false;

fetch('data/audios.json')
  .then(r => r.json())
  .then(audios => {
    list = (audios || []).slice(0, 3); // enforce 3
    grid.innerHTML = list.map((a,i)=>`
      <div class="audio-card card" role="listitem">
        <h3>${a.title}</h3>
        <p class="muted">${a.duration ?? ''}</p>
        <button data-i="${i}" aria-label="Play ${a.title}">Play demo</button>
      </div>
    `).join('');
  })
  .catch(() => { grid.innerHTML = '<p class="muted">Demos unavailable.</p>'; });

grid.addEventListener('click', e=>{
  const btn = e.target.closest('button[data-i]');
  if(!btn) return;
  playIndex(+btn.dataset.i);
});

function playIndex(i){
  current = i;
  const {title,url} = list[i];
  audio.src = url;
  audio.playbackRate = parseFloat(speed.value) || 1;
  audio.play().catch(()=>{});
  nowplaying.textContent = title;
  playpause.textContent = '⏸';
}

playpause.addEventListener('click', ()=>{
  if(audio.paused){ audio.play(); playpause.textContent='⏸'; }
  else { audio.pause(); playpause.textContent='⏯'; }
});
back15.addEventListener('click', ()=> audio.currentTime = Math.max(0, audio.currentTime - 15));
fwd15.addEventListener('click', ()=> audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15));
speed.addEventListener('change', ()=> audio.playbackRate = parseFloat(speed.value));

audio.addEventListener('timeupdate', ()=>{
  if(seeking || !isFinite(audio.duration)) return;
  seek.value = (audio.currentTime / audio.duration) * 100 || 0;
});
seek.addEventListener('input', ()=> seeking = true);
seek.addEventListener('change', ()=>{
  if(isFinite(audio.duration)){
    audio.currentTime = (seek.value/100) * audio.duration;
  }
  seeking = false;
});
audio.addEventListener('ended', ()=> { playpause.textContent='⏯'; });

// Media Session
if ('mediaSession' in navigator){
  navigator.mediaSession.setActionHandler('play', ()=> audio.play());
  navigator.mediaSession.setActionHandler('pause', ()=> audio.pause());
  navigator.mediaSession.setActionHandler('seekbackward', ()=> back15.click());
  navigator.mediaSession.setActionHandler('seekforward', ()=> fwd15.click());
}
