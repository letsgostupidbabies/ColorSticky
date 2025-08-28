// popup.js
const COLORS = ['#ffd6a5','#fdffb6','#caffbf','#a0c4ff','#bdb2ff','#ffc6ff'];

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const state = {
  notes: [],
  todos: [],
  options: {
    defaultColor: COLORS[0]
  }
};

function uid(){ return Math.random().toString(36).slice(2,10) }

async function load(){
  const data = await chrome.storage.sync.get(['notes','todos','options']);
  state.notes = data.notes || [];
  state.todos = data.todos || [];
  state.options = Object.assign({ defaultColor: COLORS[0] }, data.options || {});
  renderNotes();
  renderTodos();
  buildPalette();
  bindTabs();
}
load();

function save(){
  chrome.storage.sync.set({ notes: state.notes, todos: state.todos, options: state.options });
}

function bindTabs(){
  $$('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('.tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.target;
      $$('.view').forEach(v=>v.classList.remove('active'));
      $('#view-'+target).classList.add('active');
    });
  });
}

function buildPalette(){
  const palette = $('#color-palette');
  palette.innerHTML = '';
  COLORS.forEach(c=>{
    const b = document.createElement('button');
    b.className = 'swatch';
    b.style.background = c;
    b.setAttribute('role','option');
    b.setAttribute('aria-label', c);
    if(c === state.options.defaultColor) b.setAttribute('aria-selected','true');
    b.addEventListener('click', ()=>{
      $$('#color-palette .swatch').forEach(s=>s.removeAttribute('aria-selected'));
      b.setAttribute('aria-selected','true');
      state.options.defaultColor = c;
      save();
    });
    palette.appendChild(b);
  });
}

function renderNotes(){
  const grid = $('#notes-grid');
  grid.innerHTML = '';
  const notes = [...state.notes].sort((a,b)=>b.updatedAt - a.updatedAt);
  notes.forEach(n=>{
    const card = document.createElement('article');
    card.className = 'note';
    card.style.background = n.color;
    card.style.setProperty('--rot', (Math.random()*1.4 - 0.7) + 'deg');
    card.innerHTML = `
      <div class="note-actions">
        <button class="icon-btn" title="Редактировать" data-act="edit" data-id="${n.id}">✏️</button>
        <button class="icon-btn" title="Удалить" data-act="del" data-id="${n.id}">🗑️</button>
      </div>
      <p>${escapeHtml(n.text)}</p>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('[data-act="del"]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      state.notes = state.notes.filter(n=>n.id !== id);
      save(); renderNotes();
    });
  });

  grid.querySelectorAll('[data-act="edit"]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      const n = state.notes.find(x=>x.id===id);
      openNoteDialog(n);
    });
  });
}

function renderTodos(){
  const list = $('#todo-list');
  list.innerHTML = '';
  state.todos.forEach(t=>{
    const li = document.createElement('li');
    li.className = 'todo-item' + (t.done ? ' done' : '');
    li.innerHTML = `
      <input type="checkbox" ${t.done?'checked':''} data-id="${t.id}">
      <div class="text" contenteditable="true" data-id="${t.id}">${escapeHtml(t.text)}</div>
      <button class="icon-btn" title="Удалить" data-del="${t.id}">🗑️</button>
    `;
    list.appendChild(li);
  });

  // Listeners
  list.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const id = cb.dataset.id;
      const t = state.todos.find(x=>x.id===id);
      t.done = cb.checked;
      save(); renderTodos();
    });
  });

  list.querySelectorAll('[data-del]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.del;
      state.todos = state.todos.filter(t=>t.id!==id);
      save(); renderTodos();
    });
  });

  list.querySelectorAll('.text').forEach(div=>{
    div.addEventListener('blur', ()=>{
      const id = div.dataset.id;
      const t = state.todos.find(x=>x.id===id);
      t.text = div.textContent.trim().slice(0,180);
      save();
    });
    div.addEventListener('keydown', (e)=>{
      if(e.key==='Enter'){ e.preventDefault(); div.blur(); }
    });
  });

  const remaining = state.todos.filter(t=>!t.done).length;
  $('#todo-count').textContent = `${remaining} невыполнено`;
}

// Note dialog logic
const dialog = $('#note-dialog');
$('#add-note').addEventListener('click', ()=>openNoteDialog());
$('#clear-notes').addEventListener('click', ()=>{
  if(confirm('Удалить все стикеры?')) {
    state.notes = [];
    save(); renderNotes();
  }
});

function openNoteDialog(note){
  $('#dialog-title').textContent = note ? 'Редактировать стикер' : 'Новый стикер';
  const txt = $('#note-text');
  txt.value = note ? note.text : '';
  // select current/default color
  $$('#color-palette .swatch').forEach(s=>{
    s.setAttribute('aria-selected', s.style.background === (note ? note.color : state.options.defaultColor) ? 'true':'false');
  });
  dialog.returnValue = '';
  dialog.showModal();

  $('#save-note').onclick = () => {
    const selected = $('#color-palette .swatch[aria-selected="true"]');
    const color = selected ? selected.style.background : state.options.defaultColor;
    const text = txt.value.trim();
    if(!text){ dialog.close(); return; }
    if(note){
      note.text = text;
      note.color = color;
      note.updatedAt = Date.now();
    }else{
      state.notes.push({ id: uid(), text, color, createdAt: Date.now(), updatedAt: Date.now() });
    }
    save(); renderNotes(); dialog.close();
  };
  $('#cancel-note').onclick = () => dialog.close();
}

// To‑Do add
$('#add-todo').addEventListener('click', addTodoFromInput);
$('#todo-text').addEventListener('keydown', (e)=>{
  if(e.key==='Enter'){ e.preventDefault(); addTodoFromInput(); }
});
function addTodoFromInput(){
  const input = $('#todo-text');
  const text = input.value.trim();
  if(!text) return;
  state.todos.unshift({ id: uid(), text: text.slice(0,180), done:false, createdAt: Date.now() });
  input.value = '';
  save(); renderTodos();
}

// Helper
function escapeHtml(str){
  return str.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}

// Context menu message from background (selection to note)
chrome.runtime.onMessage.addListener((msg)=>{
  if(msg && msg.type==='add-note-from-selection'){
    state.notes.push({
      id: uid(),
      text: msg.text,
      color: state.options.defaultColor,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    save(); renderNotes();
  }
});

// Clear completed todos (удалить выполненные)
const clearCompletedBtn = document.getElementById('clear-completed');
if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener('click', () => {
    if (!confirm('Удалить все выполненные задачи?')) return;
    state.todos = state.todos.filter(t => !t.done); // оставляем только невыполненные
    save();
    renderTodos();
  });
}

