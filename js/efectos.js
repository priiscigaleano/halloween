(() => {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const $ = s => document.querySelector(s);
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const leer = k => { try { return localStorage.getItem(k); } catch { return null; } };



  /* --- Máquina de escribir (para las frases del expediente) --- */
  window.escribir = (el, texto) => {
    clearInterval(el._t); el.textContent = ''; let i = 0;
    el._t = setInterval(() => { el.textContent = texto.slice(0, ++i); if (i >= texto.length) clearInterval(el._t); }, 75);
  };

  /* --- Niebla y telarañas --- */
  body.insertAdjacentHTML('beforeend', '<div class="niebla"></div><div class="niebla b"></div>');
  const web = (() => {
    const ang = [0, 22, 45, 67, 90].map(a => a * Math.PI / 180);
    const pt = (r, a) => [(r * Math.cos(a)).toFixed(1), (r * Math.sin(a)).toFixed(1)];
    let d = ang.map(a => 'M0 0L' + pt(120, a).join(' ')).join('');
    [30, 60, 90].forEach(r => { d += 'M' + pt(r, ang[0]).join(' ');
      for (let i = 1; i < ang.length; i++) d += 'Q' + pt(r * .78, (ang[i - 1] + ang[i]) / 2).join(' ') + ' ' + pt(r, ang[i]).join(' '); });
    return `<svg viewBox="0 0 120 120"><path d="${d}" fill="none" stroke="#e4d6cc" stroke-width="1" opacity=".4"/></svg>`;
  })();
  body.insertAdjacentHTML('beforeend', `<div class="tela izq">${web}</div><div class="tela der">${web}</div>`);

  /* --- Contador de visitas --- */
  const vis = $('#visitas');
  if (vis) { const n = (+leer('visitas') || 0) + 1; guardar('visitas', n); vis.textContent = String(665 + n).padStart(6, '0'); }

  /* --- Pestaña viva --- */
  const titulo = document.title;
  document.addEventListener('visibilitychange', () => { document.title = document.hidden ? '¡Vuelve… 👁' : titulo; });
})();