// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav scroll state is no longer needed (nav is forced dark), but keep hook if used elsewhere.
const nav = document.querySelector('.nav');
if (nav) { const s=()=>{}; window.addEventListener('scroll', s); }

// Audio: inline grid (left column in the first light slab)
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

function fmtDuration(s){
  if(!isFinite(s) || s<=0) return '';
  const m = Math.floor(s/60);
  const sec = Math.round(s - m*60);
  const mm = String(m).padStart(2,'0');
  const ss = String(sec).padStart(2,'0');
  return `${mm}:${ss}`;
}
function getDuration(url){
  return new Promise(res=>{
    const a = new Audio();
    a.preload = 'metadata';
    a.src = url;
    a.addEventListener('loadedmetadata', ()=> res(a.duration));
    a.addEventListener('error', ()=> res(NaN));
  });
}

fetch('data/audios.json')
  .then(r => r.json())
  .then(async (audios) => {
    list = (audios || []).slice(0,3);

    // Render basic cards first (duration placeholder)
    grid.innerHTML = list.map((a,i)=>`
      <div class="audio-card card" role="listitem">
        <h3>${a.title}</h3>
        <p class="muted" id="dur-${i}">—:—</p>
        <button data-i="${i}" aria-label="Play ${a.title}">Play demo</button>
      </div>
    `).join('');

    // Fill real durations from metadata
    await Promise.all(list.map(async (a,i)=>{
      const d = await getDuration(a.url);
      const el = document.getElementById(`dur-${i}`);
      if(el) el.textContent = fmtDuration(d);
    }));
  })
  .catch(() => { grid.innerHTML = '<p class="muted">Demos unavailable.</p>'; });

// Play behavior
grid.addEventListener('click', e=>{
  const btn = e.target.closest('button[data-i]');
  if(!btn) return;
  playIndex(+btn.dataset.i);
});

// Prefetch on hover/touchstart to trim first-play lag
grid.addEventListener('mouseover', e=>{
  const btn = e.target.closest('button[data-i]'); if(!btn) return;
  const {url} = list[+btn.dataset.i] || {};
  if(url && audio.src!==url){ audio.src = url; }
});
grid.addEventListener('touchstart', e=>{
  const btn = e.target.closest('button[data-i]'); if(!btn) return;
  const {url} = list[+btn.dataset.i] || {};
  if(url && audio.src!==url){ audio.src = url; }
},{passive:true});

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