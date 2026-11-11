let CURRENT_USER = null;

// Escapa texto que viene de la base de datos antes de ponerlo en innerHTML (previene XSS)
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function cargarSesion() {
  try {
    const r = await fetch('api/auth/me.php', { credentials:'include' });
    const d = await r.json();
    CURRENT_USER = d.logged ? d.usuario : null;
  } catch { CURRENT_USER = null; }
  renderNav();
}

function renderNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  if (CURRENT_USER) {
    const admin = CURRENT_USER.rol === 'admin';
    nav.innerHTML = `
      <span class="usuario-actual">† ${esc(CURRENT_USER.nombre)}${admin ? ' (Admin)' : ''}</span>
      ${admin ? '<a href="admin.html">Panel Admin</a>' : ''}
      <button type="button" id="btnLogout" class="btn btn-outline btn-sm">Salir</button>`;
    document.getElementById('btnLogout').onclick = async () => {
      await fetch('api/auth/logout.php', { credentials:'include' });
      location.reload();
    };
  } else {
    nav.innerHTML = `
      <a href="register.html">Regístrate</a>
      <a href="login.html" class="btn btn-outline btn-sm">Ingresar</a>`;
  }
}
