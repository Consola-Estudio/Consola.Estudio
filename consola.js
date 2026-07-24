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
// Correo del estudio.
const CORREO_ESTUDIO = 'hola.consola.info@gmail.com';

// -------------------------------------------------------------------------
// WEB3FORMS: envía el formulario a nuestro correo sin backend propio.
// No requiere dominio ni tarjeta. Envíos ilimitados en el plan gratis.
//
// CÓMO OBTENER LA CLAVE (2 minutos):
//   1. Entrar a https://web3forms.com
//   2. Escribir hola.consola.info@gmail.com en "Create Access Key"
//   3. Revisar el correo y copiar la clave que llega
//   4. Pegarla abajo reemplazando CLAVE_PENDIENTE
//   5. Descomentar el proveedor en politica-privacidad.html (hay un
//      comentario marcado ahí con el texto listo)
//
// Mientras la clave siga siendo CLAVE_PENDIENTE, el formulario cae al modo
// mailto: abre el correo del visitante con el mensaje ya escrito.
// -------------------------------------------------------------------------
const WEB3FORMS_KEY = 'CLAVE_PENDIENTE';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

// Mensajes del formulario. Viven aquí y no en traducciones.js porque ese
// archivo está dormido desde que el sitio quedó solo en español.
const MENSAJES = {
  form_enviando:     '> enviando...',
  form_ok:           '> mensaje enviado, te escribimos en menos de 24 h',
  form_error:        '> algo falló, escríbenos directo a ' + CORREO_ESTUDIO,
  form_mailto:       '> se abrió tu correo con el mensaje listo',
  form_acepta_falta: '> primero acepta la política de privacidad'
};
function t(k){
  const lang = document.documentElement.lang || 'es';
  return (window.TRADUCCIONES?.[lang]?.[k]) || MENSAJES[k] || k;
}

const form = document.querySelector('[data-form-contacto]');
if (form) {
  const boton = form.querySelector('button[type="submit"]');
  const textoBotonOriginal = boton ? boton.textContent : '';

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const nota = form.querySelector('[data-form-nota]');
    const datos = new FormData(form);

    if (!form.querySelector('[name="acepta"]').checked) {
      nota.textContent = t('form_acepta_falta');
      return;
    }

    // Trampa anti-spam: si el campo oculto viene lleno, es un bot.
    // Fingimos éxito para no darle pistas y no enviamos nada.
    if (datos.get('botcheck')) {
      form.reset();
      nota.textContent = t('form_ok');
      return;
    }

    // Modo 1: hay clave → POST a Web3Forms, sin salir de la web
    if (WEB3FORMS_KEY !== 'CLAVE_PENDIENTE') {
      const nombre = datos.get('nombre');
      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: 'Kickoff: ' + nombre,
        from_name: 'Web Consola Estudio',
        nombre: nombre,
        correo: datos.get('correo'),
        mensaje: datos.get('mensaje'),
        replyto: datos.get('correo')
      };

      if (boton) { boton.disabled = true; boton.textContent = t('form_enviando'); }
      nota.textContent = '';

      try {
        const r = await fetch(WEB3FORMS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        const res = await r.json();
        if (!r.ok || !res.success) throw new Error(res.message || 'http ' + r.status);

        form.reset();
        nota.textContent = t('form_ok');
        if (window.gtag) gtag('event','contacto_enviado',{metodo:'formulario'});
      } catch(e) {
        nota.textContent = t('form_error');
      } finally {
        if (boton) { boton.disabled = false; boton.textContent = textoBotonOriginal; }
      }
      return;
    }

    // Modo 2 (fallback): abre el correo del visitante con todo prellenado
    const cuerpo = encodeURIComponent(
      `Nombre: ${datos.get('nombre')}\nCorreo: ${datos.get('correo')}\n\n${datos.get('mensaje')}`
    );
    window.location.href = `mailto:${CORREO_ESTUDIO}?subject=${encodeURIComponent('Kickoff: ' + datos.get('nombre'))}&body=${cuerpo}`;
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
