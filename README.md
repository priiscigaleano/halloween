# Concurso de Disfraces de Halloween — La Web del Terror Accesible

Frontend en HTML/CSS/JS vanilla + API REST en PHP (PDO) + MySQL.

## Instalación (XAMPP)
1. Copiar la carpeta en `htdocs/` y arrancar Apache y MySQL.
2. Importar `halloween.sql` en phpMyAdmin. Usuario inicial: `admin` / `admin123` (cambiar en producción).
3. Abrir `http://localhost/halloween/`.

## Estructura
- `api/config` conexión PDO · `api/helpers` sesión, CORS y `fail()` · `api/auth`, `api/disfraces`, `api/votos` endpoints
- `js/auth.js` sesión y `esc()` · `js/app.js` lista y votación · `js/admin.js` panel · `js/efectos.js` ambiente
- `docs/FICHA_ISO_25010.md` autoevaluación de calidad

## Accesibilidad
WCAG 2.1 AA: skip link, elementos nativos, `:focus-visible`, `aria-live`, diálogo con foco y `inert`.
