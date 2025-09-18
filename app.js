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

// Render three stacked demo bars
fetch('data/audios.json')
  .then(r => r.json())
  .then(async items => {
    const demos = (items || []).slice(0,3);

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

    // Event: play/pause
    listEl.addEventListener('click', e=>{
      const btn = e.target.closest('.play');
      if(!btn) return;
      const i = +btn.dataset.i;
      if(current !== i){ // switch track
        current = i;
        A.src = demos[i].url;
        A.currentTime = 0;
      }
      if(A.paused){ A.play().catch(()=>{}); btn.textContent = '⏸'; }
      else { A.pause(); btn.textContent = '▶'; }
      // reset other buttons
      listEl.querySelectorAll('.play').forEach(b=>{ if(+b.dataset.i !== i) b.textContent = '▶'; });
    });

    // Seek bars
    listEl.addEventListener('input', e=>{
      const s = e.target.closest('.seek'); if(!s) return;
      if(current === -1) return;
      seeking = true;
    });
    listEl.addEventListener('change', e=>{
      const s = e.target.closest('.seek'); if(!s) return;
      if(current === -1 || !isFinite(A.duration)) return;
      A.currentTime = (s.value/100) * A.duration;
      seeking = false;
    });

    // Timeupdate -> update current seek
    A.addEventListener('timeupdate', ()=>{
      if(seeking || !isFinite(A.duration) || current === -1) return;
      const val = (A.currentTime/A.duration)*100;
      const s = document.getElementById(`seek-${current}`);
      if(s) s.value = val || 0;
    });

    A.addEventListener('ended', ()=>{
      const btn = listEl.querySelector(`.play[data-i="${current}"]`);
      if(btn) btn.textContent = '▶';
    });
  })
  .catch(()=>{ listEl.innerHTML = '<p class="muted">Demos unavailable.</p>'; });