// Year
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Inline demos (no sticky player) ----
const listEl = document.getElementById('audio-list');

function fmt(s){
  if(!isFinite(s) || s <= 0) return '--:--';
  const m = Math.floor(s/60);
  const sec = Math.round(s - m*60);
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// Single shared audio element
const A = new Audio();
A.preload = 'metadata';
let current = -1;
let seeking = false;

// Load audios.json robustly with cache-busting and fallback paths
async function loadList(){
  const base = (location.pathname.includes('/skybots-apple-style-landing/'))
    ? '/skybots-apple-style-landing/'
    : (document.baseURI || './');
  const candidates = [
    `data/audios.json?v=${Date.now()}`,
    `${base}data/audios.json?v=${Date.now()}`
  ];
  for (const url of candidates){
    try{
      const r = await fetch(url, {cache:'no-store'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      return await r.json();
    }catch(e){ /* try next */ }
  }
  throw new Error('audios.json not found');
}

loadList()
  .then(async (items) => {
    const demos = (items || []).slice(0,3);

    // Render the demo bars
    listEl.innerHTML = demos.map((d,i)=>`
      <div class="demo" role="listitem" data-i="${i}">
        <button class="play" aria-label="Play ${d.title}" data-i="${i}">▶</button>
        <h4>${d.title}</h4>
        <span class="time" id="dur-${i}">--:--</span>
        <input class="seek" id="seek-${i}" type="range" min="0" max="100" value="0" aria-label="Seek ${d.title}">
      </div>
    `).join('');

    // Load real durations
    await Promise.all(demos.map((d,i)=>new Promise(res=>{
      const a = new Audio(); a.preload='metadata'; a.src = d.url;
      a.onloadedmetadata = ()=>{ const el = document.getElementById(`dur-${i}`); if(el) el.textContent = fmt(a.duration); res(); };
      a.onerror = ()=> res();
    })));

    // Play/pause events
    listEl.addEventListener('click', e=>{
      const btn = e.target.closest('.play');
      if(!btn) return;
      const i = +btn.dataset.i;
      if(current !== i){
        current = i;
        A.src = demos[i].url;
        A.currentTime = 0;
      }
      if(A.paused){ A.play().catch(()=>{}); btn.textContent = '⏸'; }
      else { A.pause(); btn.textContent = '▶'; }
      listEl.querySelectorAll('.play').forEach(b=>{ if(+b.dataset.i !== i) b.textContent = '▶'; });
    });

    // Seek input events
    listEl.addEventListener('input', e=>{
      const s = e.target.closest('.seek');
      if(!s) return;
      if(current === -1) return;
      seeking = true;
    });
    listEl.addEventListener('change', e=>{
      const s = e.target.closest('.seek');
      if(!s) return;
      if(current === -1 || !isFinite(A.duration)) return;
      A.currentTime = (s.value/100) * A.duration;
      seeking = false;
    });

    // Update seek bar during playback
    A.addEventListener('timeupdate', () => {
      if(seeking || !isFinite(A.duration) || current === -1) return;
      const val = (A.currentTime/A.duration)*100;
      const s = document.getElementById(`seek-${current}`);
      if(s) s.value = val || 0;
    });

    A.addEventListener('ended', () => {
      const btn = listEl.querySelector(`.play[data-i="${current}"]`);
      if(btn) btn.textContent = '▶';
    });
  })
  .catch(()=>{ listEl.innerHTML = '<p class="muted">Demos unavailable.</p>'; });