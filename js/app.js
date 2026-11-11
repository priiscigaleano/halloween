// 1. Imágenes
const imagenesPrevia = {
  'tate': 'img/previa-tate.gif',       
  'amanda': 'img/previa-amanda.gif',   
  'tiffany': 'img/previa-tiffany.gif', 
  'esther': 'img/previa-esther.gif',   
  'babadook': 'img/previa-babadook.jpg',
  'babyface': 'img/previa-babyface.jpg',
  'cazador': 'img/previa-cazador.jpg'
};

const imagenesExpandida = {
  'tate': 'img/full-tate.jpg',
  'tiffany': 'img/full-tiffany.jpg',
  'babadook': 'img/full-babadook.jpg',
  'amanda': 'img/full-amanda.jpg',
  'babyface': 'img/full-babyface.jpg',
  'esther': 'img/full-esther.jpg',
  'cazador': 'img/full-cazador.jpg'
};

function obtenerImagen(nombre, esExpandida, fotoBD) {
  if (fotoBD && fotoBD !== '') return `uploads/${fotoBD}`;
  const n = nombre.toLowerCase();
  if (n.includes('tate') || n.includes('langdon')) return esExpandida ? imagenesExpandida['tate'] : imagenesPrevia['tate'];
  if (n.includes('tiffany')) return esExpandida ? imagenesExpandida['tiffany'] : imagenesPrevia['tiffany'];
  if (n.includes('babadook')) return esExpandida ? imagenesExpandida['babadook'] : imagenesPrevia['babadook'];
  if (n.includes('amanda') || n.includes('saw')) return esExpandida ? imagenesExpandida['amanda'] : imagenesPrevia['amanda'];
  if (n.includes('babyface') || n.includes('baby face')) return esExpandida ? imagenesExpandida['babyface'] : imagenesPrevia['babyface'];
  if (n.includes('huérfana') || n.includes('esther') || n.includes('huerfana')) return esExpandida ? imagenesExpandida['esther'] : imagenesPrevia['esther'];
  if (n.includes('cazador')) return esExpandida ? imagenesExpandida['cazador'] : imagenesPrevia['cazador'];
  return 'img/previa-default.jpg'; 
}

const fichas = [
  ['No muerto', '31/10/1978', '0 (desaparecieron)'],
  ['Perturbada', '31/10/1998', '1 (Chucky)'],
  ['Entidad sin rostro', '13/05/2005', '0 (nadie sobrevive)'],
  ['Aprendiz de Jigsaw', '06/06/2004', '3 (trampas activas)'],
  ['Enmascarado', '31/10/2014', '666 (víctimas)'],
  ['Falsa inocencia', '29/10/2009', '1 (familia adoptiva)'],
  ['Presa en fuga', '31/10/2001', '2 (cazador y presa)']
];

const frases = [
  [/tate|langdon/i, 'La casa te estaba esperando. Quédate.'],
  [/tiffany/i, "Hi, I'm Chucky… wanna play?"],
  [/babadook/i, 'Ba-ba-dook... Ba-ba-dook...'],
  [/amanda|saw/i, 'I want to play a game.'],
  [/babyface/i, 'El bebé quiere jugar...'],
  [/huérfana|esther|huerfana/i, 'Solo quiero ser parte de la familia.'],
  [/cazador/i, 'Te vi desde el bosque.']
];

let DISFRACES = [];   // caché: abrir un expediente ya no vuelve a pedir toda la lista al servidor
let ID_ABIERTO = null;

async function cargarDisfraces() {
  const cont = document.getElementById('disfraces-container');
  const msg = document.getElementById('msg');
  try {
    const r = await fetch('api/disfraces/index.php');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    DISFRACES = await r.json();

    if (!DISFRACES.length) {
      cont.innerHTML = '<p>Los expedientes están vacíos… por ahora.</p>';
      return;
    }
    cont.innerHTML = DISFRACES.map(d => {
      const nombre = esc(d.nombre), id = Number(d.id);
      return `
      <article class="card" id="card-${id}">
        <div class="card-header">
          <div class="preview-img">
            <img src="${esc(obtenerImagen(d.nombre, false, d.foto))}" alt="Disfraz de ${nombre}">
          </div>
          <h3>${nombre}</h3>
          <button type="button" class="btn-ver-mas" aria-haspopup="dialog" onclick="abrirExpediente(${id})" aria-label="Abrir expediente de ${nombre}">Abrir expediente</button>
        </div>
      </article>`;
    }).join('');

    if (!document.getElementById('modal-container')) {
      document.body.insertAdjacentHTML('beforeend', '<div class="modal-fondo" id="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title" onclick="cerrarExpediente(event)"></div>');
    }
  } catch (e) {
    console.error('Error al cargar disfraces:', e);
    msg.className = 'msg error';
    msg.textContent = 'Algo no quiere que veas esto. Verifica que XAMPP esté corriendo.';
  }
}

// Mientras el diálogo está abierto, el resto de la página queda inerte (no recibe foco ni lectura)
function bloquearFondo(bloquear) {
  document.querySelectorAll('body > *:not(#modal-container):not(script)').forEach(el => { el.inert = bloquear; });
}

window.abrirExpediente = function(id) {
  const d = DISFRACES.find(item => item.id == id);
  if (!d) return;
  ID_ABIERTO = id;

  const nombre = esc(d.nombre);
  const f = fichas[d.id % fichas.length];
  const frase = frases.find(([re]) => re.test(d.nombre));
  const modal = document.getElementById('modal-container');

  modal.innerHTML = `
    <div class="card expanded" onclick="event.stopPropagation()">
      <div class="card-body">
        <div class="disfraz-img">
          <img src="${esc(obtenerImagen(d.nombre, true, d.foto))}" alt="Foto completa del disfraz de ${nombre}">
        </div>
        <ul class="ficha">
          <li class="exp">EXPEDIENTE N.º ${String(d.id).padStart(4, '0')}</li>
          <li><b>Sujeto:</b> <span id="modal-title">${nombre}</span></li>
          <li><b>Estado:</b> ${f[0]}</li>
          <li><b>Último avistamiento:</b> ${f[1]}</li>
          <li><b>Conocidos:</b> ${f[2]}</li>
          <li><b>Observaciones:</b> ${esc(d.descripcion)}</li>
        </ul>
        ${frase ? `<p class="frase" data-frase="${frase[1]}"></p>` : ''}
        <div class="votos-count">🕯 ${Number(d.votos)} alma(s) a favor</div>
        <button type="button" class="btn-votar" onclick="votar(${Number(d.id)}, event)">Ofrecer mi alma</button>
        <button type="button" class="btn-ver-mas" style="margin-top:10px;" onclick="cerrarExpediente(event)">Cerrar expediente</button>
      </div>
    </div>`;

  modal.classList.add('activo');
  document.body.style.overflow = 'hidden';
  bloquearFondo(true);
  modal.querySelector('.btn-ver-mas').focus();   // el foco entra al diálogo
  if (window.escribir) modal.querySelectorAll('.frase').forEach(e => window.escribir(e, e.dataset.frase));
};

window.cerrarExpediente = function(event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('modal-container');
  if (!modal) return;
  modal.classList.remove('activo');
  modal.innerHTML = '';
  document.body.style.overflow = 'auto';
  bloquearFondo(false);
  const volver = document.querySelector(`#card-${ID_ABIERTO} .btn-ver-mas`);   // el foco vuelve a la tarjeta
  if (volver) volver.focus();
};

// Escape cierra el diálogo
document.addEventListener('keydown', e => {
  const modal = document.getElementById('modal-container');
  if (e.key === 'Escape' && modal && modal.classList.contains('activo')) cerrarExpediente();
});

async function votar(id, event) {
  event.preventDefault();
  if (!CURRENT_USER) {
    if (confirm('Debes iniciar sesión para votar. ¿Ir al login?')) location.href = 'login.html';
    return;
  }
  const msg = document.getElementById('msg');
  const boton = event.currentTarget;
  boton.disabled = true;
  boton.textContent = 'Procesando...';
  boton.setAttribute('aria-busy', 'true');

  try {
    const r = await fetch('api/votos/votar.php', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_disfraz: id })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);

    msg.className = 'msg ok';
    msg.textContent = 'Voto sellado con sangre.';
    setTimeout(() => { msg.textContent = ''; msg.className = 'msg'; }, 4000);

    await cargarDisfraces();
    abrirExpediente(id);
  } catch (e) {
    msg.className = 'msg error';
    msg.textContent = e.message;
  } finally {
    if (boton.isConnected) {
      boton.disabled = false;
      boton.textContent = 'Ofrecer mi alma';
      boton.removeAttribute('aria-busy');
    }
  }
}

(async () => {
  if (typeof cargarSesion === 'function') await cargarSesion();
  await cargarDisfraces();
})();
