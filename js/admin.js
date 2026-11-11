let LISTA = [];
async function cargarLista() {
  const r = await fetch('api/disfraces/index.php');
  LISTA = await r.json();
  const cont = document.getElementById('lista');
  cont.innerHTML = LISTA.map(d => `
    <article class="card">
      ${d.foto ? `<img src="uploads/${escapeHtml(d.foto)}" alt="Foto del disfraz de ${escapeHtml(d.nombre)}">` : ''}
      <h3>${escapeHtml(d.nombre)}</h3>
      <p>${escapeHtml(d.descripcion)}</p>
      <div class="votos">${Number(d.votos)} voto(s)</div>
      <div class="actions">
        <button type="button" class="btn" data-accion="editar" data-id="${Number(d.id)}">Editar<span class="sr-only"> ${escapeHtml(d.nombre)}</span></button>
        <button type="button" class="btn btn-danger" data-accion="eliminar" data-id="${Number(d.id)}">Eliminar<span class="sr-only"> ${escapeHtml(d.nombre)}</span></button>
      </div>
    </article>
  `).join('');
}

// Delegación de eventos: sin onclick en línea ni datos de la BD dentro de atributos JS
document.getElementById('lista').addEventListener('click', e => {
  const b = e.target.closest('button[data-accion]');
  if (!b) return;
  const id = Number(b.dataset.id), d = LISTA.find(x => x.id == id);
  if (b.dataset.accion === 'editar' && d) editar(id, d.nombre, d.descripcion);
  if (b.dataset.accion === 'eliminar') eliminar(id);
});

function escapeHtml(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function editar(id, nombre, desc) {
  const n = prompt('Nuevo nombre:', nombre); if (n === null) return;
  const d = prompt('Nueva descripción:', desc); if (d === null) return;
  const r = await fetch('api/disfraces/update.php', {
    method:'PUT', credentials:'include',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({id, nombre:n, descripcion:d})
  });
  const j = await r.json();
  if (!r.ok) return alert(j.error);
  cargarLista();
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este disfraz?')) return;
  const r = await fetch('api/disfraces/delete.php', {
    method:'DELETE', credentials:'include',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({id})
  });
  const j = await r.json();
  if (!r.ok) return alert(j.error);
  cargarLista();
}

document.getElementById('formNuevo').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const r = await fetch('api/disfraces/index.php', {
    method:'POST', credentials:'include', body: fd
  });
  const j = await r.json();
  const msg = document.getElementById('msgNuevo');
  if (!r.ok) { msg.className='msg error'; msg.textContent = j.error; return; }
  msg.className='msg ok'; msg.textContent = 'Creado ✔';
  e.target.reset(); cargarLista();
});

(async () => {
  await cargarSesion();
  if (!CURRENT_USER || CURRENT_USER.rol !== 'admin') {
    document.querySelector('main').innerHTML = '<h2 role="alert">Acceso solo para administrador</h2>';
    return;
  }
  cargarLista();
})();