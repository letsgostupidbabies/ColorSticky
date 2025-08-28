const COLORS = ['#ffd6a5','#fdffb6','#caffbf','#a0c4ff','#bdb2ff','#ffc6ff'];

const palette = document.getElementById('palette');

function build(){
  palette.innerHTML = '';
  chrome.storage.sync.get(['options']).then(({options})=>{
    const current = (options && options.defaultColor) || COLORS[0];
    COLORS.forEach(color=>{
      const b = document.createElement('button');
      b.className = 'swatch';
      b.style.background = color;
      if(color===current) b.setAttribute('aria-selected','true');
      b.addEventListener('click', ()=>{
        document.querySelectorAll('.swatch').forEach(s=>s.removeAttribute('aria-selected'));
        b.setAttribute('aria-selected','true');
        chrome.storage.sync.set({ options: { defaultColor: color } });
      });
      palette.appendChild(b);
    });
  });
}
build();

// Export / Import / Wipe
document.getElementById('export').addEventListener('click', async ()=>{
  const data = await chrome.storage.sync.get(null);
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'color-sticky-export.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('import-btn').addEventListener('click', ()=>{
  document.getElementById('import').click();
});

document.getElementById('import').addEventListener('change', async (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const text = await file.text();
  try{
    const json = JSON.parse(text);
    await chrome.storage.sync.set(json);
    alert('Импорт завершён');
    build();
  }catch(e){
    alert('Не удалось импортировать: ' + e.message);
  }
});

document.getElementById('wipe').addEventListener('click', async ()=>{
  if(confirm('Стереть все данные расширения? Это действие необратимо.')){
    await chrome.storage.sync.clear();
    alert('Данные стёрты');
    build();
  }
});
