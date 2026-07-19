# Consola Estudio

Sitio web del estudio. Estático puro: HTML, CSS y JavaScript sin dependencias, sin build, sin frameworks.

Publicable directo en Cloudflare Pages, Netlify, GitHub Pages o cualquier hosting de archivos estáticos.

## Estructura

- `index.html` — página principal.
- `servicios.html` — catálogo con packs y precios.
- `caso-consola.html` — caso de estudio de la marca.
- `politica-privacidad.html`, `terminos.html`, `cookies.html` — páginas legales.
- `estilos.css` — sistema de diseño completo. Tokens en `:root` como fuente de verdad.
- `consola.js` — menú, intro, revelado, formulario, cookies. Sin dependencias.
- `traducciones.js` — diccionario ES/EN (actualmente dormido; se puede reactivar).
- `fuentes/` — Archivo variable y IBM Plex Mono en woff2.

## Cache-busting

El CSS y JS se referencian con `?v=N` para forzar refresh en navegadores. Cuando se hace un cambio grande, subir `N` en las cinco páginas HTML.

## Pendientes marcados en el código

- `G-XXXXXXXXXX` — reemplazar por el ID real de Google Analytics 4.
- `<!-- FOTO PENDIENTE -->` — fotos documentales del equipo.
- Comentarios `href="#"` en botones de redes sociales (Instagram, TikTok, Facebook, YouTube) — reemplazar cuando existan las cuentas.
