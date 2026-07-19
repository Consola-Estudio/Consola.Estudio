// CONSOLA ESTUDIO — consola.js
// Intro + menú móvil + i18n + revelado + formulario + cookies + analítica.

const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================================================================
//  1. IDIOMA (DORMIDO) — sitio 100% en español desde julio 2026
// -------------------------------------------------------------------------
// Para reactivar el toggle ES/EN:
//   1) descomentar el bloque de abajo
//   2) volver a cargar traducciones.js en index.html y servicios.html
//   3) volver a agregar <div class="idioma" data-idioma>...</div> en el nav
//   4) volver a incluir los <link rel="alternate" hreflang="..."> en el head
// =========================================================================
/*
// Orden de precedencia: ?lang=xx  →  localStorage  →  idioma del navegador
// →  español por defecto. El usuario también puede cambiarlo con el toggle.

const IDIOMAS = ['es','en'];
function detectarIdioma(){
  const url = new URLSearchParams(location.search).get('lang');
  if (IDIOMAS.includes(url)) return url;
  const guardado = localStorage.getItem('idioma');
  if (IDIOMAS.includes(guardado)) return guardado;
  const nav = (navigator.language || 'es').slice(0,2).toLowerCase();
  return IDIOMAS.includes(nav) ? nav : 'es';
}

// El HTML en español es la fuente de verdad: en la primera carga
// guardamos lo que trae puesto cada elemento con data-i18n. Cuando el
// usuario pide español, restauramos ese original (así funciona editar
// el HTML a mano). Cuando pide otro idioma, aplicamos la traducción
// del diccionario. Volver a español restaura desde el original.
const originalES = new Map();
function capturarOriginal(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = 'txt:'+el.getAttribute('data-i18n');
    if (!originalES.has(k)) originalES.set(k, el.textContent);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const k = 'html:'+el.getAttribute('data-i18n-html');
    if (!originalES.has(k)) originalES.set(k, el.innerHTML);
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.getAttribute('data-i18n-attr').split(',').forEach(par => {
      const [attr,k] = par.trim().split('|');
      const key = 'attr:'+attr+':'+k;
      if (!originalES.has(key)) originalES.set(key, el.getAttribute(attr));
    });
  });
}

function aplicarIdioma(lang){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-idioma] button').forEach(b => {
    b.classList.toggle('activo', b.dataset.lang === lang);
  });
  localStorage.setItem('idioma', lang);

  capturarOriginal();

  const usarOriginal = (lang === 'es');
  const dicc = usarOriginal ? null : (window.TRADUCCIONES || {})[lang];
  if (!usarOriginal && !dicc) return; // idioma desconocido, no tocar

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    const val = usarOriginal ? originalES.get('txt:'+k) : dicc[k];
    if (val != null) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const k = el.getAttribute('data-i18n-html');
    const val = usarOriginal ? originalES.get('html:'+k) : dicc[k];
    if (val != null) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.getAttribute('data-i18n-attr').split(',').forEach(par => {
      const [attr,k] = par.trim().split('|');
      const key = 'attr:'+attr+':'+k;
      const val = usarOriginal ? originalES.get(key) : dicc[k];
      if (val != null) el.setAttribute(attr, val);
    });
  });
}

// Aplicar cuanto antes para evitar destello de contenido en español
const langInicial = detectarIdioma();
if (window.TRADUCCIONES) aplicarIdioma(langInicial);
document.addEventListener('DOMContentLoaded', () => aplicarIdioma(langInicial));

// Toggle
document.addEventListener('click', ev => {
  const btn = ev.target.closest('[data-idioma] button');
  if (btn) aplicarIdioma(btn.dataset.lang);
});

*/

// =========================================================================
//  2. INTRO DE ENTRADA (una vez por visita)
// =========================================================================
const intro = document.querySelector('[data-intro]');
if (intro) {
  if (sinMovimiento || sessionStorage.getItem('introVista')) {
    intro.remove();
  } else {
    sessionStorage.setItem('introVista', '1');
    const texto = intro.querySelector('[data-intro-texto]');
    const palabra = 'CONSOLA';
    let i = 0;
    const tic = setInterval(() => {
      texto.textContent = palabra.slice(0, ++i);
      if (i >= palabra.length) {
        clearInterval(tic);
        setTimeout(() => {
          intro.classList.add('fuera');
          setTimeout(() => intro.remove(), 500);
        }, 380);
      }
    }, 65);
  }
}

// =========================================================================
//  3. MENÚ MÓVIL (hamburguesa → X, overlay fullscreen)
// =========================================================================
const menuBtn = document.querySelector('[data-menu-btn]');
const menu = document.querySelector('[data-menu]');
if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    menuBtn.setAttribute('aria-expanded', abierto);
    document.body.style.overflow = abierto ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('abierto');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));
}

// =========================================================================
//  4. HERO: el kicker se escribe solo (solo si existe en la página)
// =========================================================================
const kicker = document.querySelector('.hero .kicker');
if (kicker && !sinMovimiento) {
  const texto = kicker.textContent;
  kicker.textContent = '';
  kicker.classList.add('in');
  let i = 0;
  const tic = setInterval(() => {
    kicker.textContent = texto.slice(0, ++i);
    if (i >= texto.length) clearInterval(tic);
  }, 45);
}

// =========================================================================
//  5. REVELADO AL HACER SCROLL (con red de seguridad a 1.6 s)
// =========================================================================
const io = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.rv').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 60 + 'ms';
  io.observe(el);
});
setTimeout(() => {
  document.querySelectorAll('.rv:not(.in)').forEach(el => el.classList.add('in'));
}, 1600);

// =========================================================================
//  6. FORMULARIO DE CONTACTO
// =========================================================================
// Correo del estudio (personal de Javier mientras se estrena el dominio).
const CORREO_ESTUDIO = 'hola.consola.info@gmail.com';

// Endpoint para enviar el formulario SIN backend propio.
// Opciones probadas (elegir una, crear cuenta y pegar el endpoint aquí):
//   • Formspree:   https://formspree.io/f/xxxxxxxx      (50 envíos/mes gratis)
//   • Web3Forms:   https://api.web3forms.com/submit    (ilimitado, gratis)
//   • FormSubmit:  https://formsubmit.co/hola.consola.info@gmail.com  (gratis)
// Mientras esté en blanco, el formulario cae al modo mailto: abre el
// programa de correo del visitante con el mensaje ya escrito.
const FORM_ENDPOINT = ''; // ← pegar aquí el endpoint cuando exista

function t(k){ // helper para traducir mensajes del formulario
  const lang = document.documentElement.lang || 'es';
  return (window.TRADUCCIONES?.[lang]?.[k]) || k;
}

const form = document.querySelector('[data-form-contacto]');
if (form) {
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const nota = form.querySelector('[data-form-nota]');
    const datos = new FormData(form);

    if (!form.querySelector('[name="acepta"]').checked) {
      nota.textContent = t('form_acepta_falta');
      return;
    }

    // Modo 1: hay endpoint → POST silencioso, sin salir de la web
    if (FORM_ENDPOINT) {
      try {
        const r = await fetch(FORM_ENDPOINT, {
          method:'POST', body:datos, headers:{Accept:'application/json'}
        });
        if (!r.ok) throw new Error('http '+r.status);
        form.reset();
        nota.textContent = t('form_ok');
        // Evento para Google Analytics (solo dispara si hay consentimiento)
        if (window.gtag) gtag('event','contacto_enviado',{metodo:'formulario'});
      } catch(e) {
        nota.textContent = t('form_error');
      }
      return;
    }

    // Modo 2 (fallback): abre el correo del visitante con todo prellenado
    const cuerpo = encodeURIComponent(
      `Nombre: ${datos.get('nombre')}\nCorreo: ${datos.get('correo')}\n\n${datos.get('mensaje')}`
    );
    window.location.href = `mailto:${CORREO_ESTUDIO}?subject=${encodeURIComponent('Kickoff — ' + datos.get('nombre'))}&body=${cuerpo}`;
    nota.textContent = t('form_mailto');
    if (window.gtag) gtag('event','contacto_enviado',{metodo:'mailto'});
  });
}

// =========================================================================
//  7. AVISO DE COOKIES + ENCENDIDO DE ANALYTICS
// =========================================================================
// Habeas Data (Ley 1581 de 2012, Colombia): pedimos consentimiento antes
// de encender cookies de analítica. Guardamos la decisión en localStorage.

const aviso = document.querySelector('[data-cookies]');
function activarAnalytics(){
  if (window.gtag) gtag('consent','update',{analytics_storage:'granted'});
}
function desactivarAnalytics(){
  if (window.gtag) gtag('consent','update',{analytics_storage:'denied'});
}
if (aviso) {
  const decision = localStorage.getItem('cookies');
  if (decision === 'aceptado') activarAnalytics();
  else if (decision === 'rechazado') desactivarAnalytics();
  else setTimeout(() => aviso.classList.add('visible'), 800);

  aviso.querySelector('[data-cookies-aceptar]').addEventListener('click', () => {
    localStorage.setItem('cookies','aceptado');
    aviso.classList.remove('visible');
    activarAnalytics();
  });
  aviso.querySelector('[data-cookies-rechazar]').addEventListener('click', () => {
    localStorage.setItem('cookies','rechazado');
    aviso.classList.remove('visible');
    desactivarAnalytics();
  });
}
