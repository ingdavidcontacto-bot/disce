/* =========================================================
   disce · lógica de la página
   No necesitas editar este archivo: el contenido se cambia
   en data/contenido.js
   ========================================================= */

(function () {
  const D = window.DISCE || {};
  const proyectos = D.proyectos || [];
  const bitacora = D.bitacora || [];
  const contacto = D.contacto || {};
  const $ = (s) => document.querySelector(s);

  // Escapa texto para que nunca se interprete como HTML
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Seguridad: solo se aceptan enlaces https:// o rutas internas de la página
     (assets/..., archivo.html). Así un enlace mal pegado en data/contenido.js
     (p. ej. "javascript:..." o "data:...") nunca llega a un href o src. */
  const urlSegura = (v) => {
    const u = String(v ?? "").trim();
    if (!u) return "";
    if (/^https:\/\//i.test(u)) return u;
    if (/^(?![a-z][a-z0-9+.-]*:)(?!\/\/)[\w\-./#?=&%]+$/i.test(u)) return u;   // ruta relativa sin esquema
    return "";
  };
  // Valida el correo de contacto antes de armar el enlace mailto:
  const correoSeguro = (v) => (/^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(String(v || "").trim()) ? String(v).trim() : "");

  /* Videos: solo YouTube (sin cookies), Vimeo y Google Drive, convertidos a su
     dirección de inserción. Cualquier otra dirección se ignora. */
  const embedUrl = (url) => {
    const u = String(url || "").trim();
    let m = u.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,20})/);
    if (m) return "https://www.youtube-nocookie.com/embed/" + m[1];
    m = u.match(/^https:\/\/(?:www\.|player\.)?vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return "https://player.vimeo.com/video/" + m[1];
    m = u.match(/^https:\/\/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (m) return "https://drive.google.com/file/d/" + m[1] + "/preview";
    return "";
  };

  const formatDate = (s) => {
    if (!/^\d{4}-\d{2}-\d{2}/.test(s || "")) return esc(s);
    const d = new Date(String(s).slice(0, 10) + "T12:00:00");
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  };

  const img = (src, alt, cls) =>
    src
      ? `<img class="${cls}" src="${esc(urlSegura(src))}" alt="${esc(alt)}" loading="lazy">`
      : `<div class="placeholder" role="img" aria-label="Sin captura todavía">CAPTURA DEL JUEGO</div>`;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =======================================================
     CARRUSEL
     ======================================================= */
  const ICONOS = {
    cubo: `<svg class="slide__icon" viewBox="0 0 80 92" aria-hidden="true"><polygon points="40,4 76,24 40,44 4,24" fill="#5E86BF" stroke="#16161A" stroke-width="4" stroke-linejoin="round"/><polygon points="4,24 40,44 40,88 4,68" fill="#16161A" stroke="#16161A" stroke-width="4" stroke-linejoin="round"/><polygon points="40,44 76,24 76,68 40,88" fill="#FFFFFF" stroke="#16161A" stroke-width="4" stroke-linejoin="round"/></svg>`,
    esfera: `<svg class="slide__icon" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#16161A" stroke-width="4"/><ellipse cx="50" cy="50" rx="44" ry="15" fill="none" stroke="#16161A" stroke-width="3"/><ellipse cx="50" cy="50" rx="17" ry="44" fill="none" stroke="#16161A" stroke-width="3"/><circle cx="34" cy="32" r="8" fill="#5E86BF" stroke="#16161A" stroke-width="3"/></svg>`,
    pixel: `<svg class="slide__icon" viewBox="0 0 70 70" aria-hidden="true">${
      ["0110110","1111111","1111111","1111111","0111110","0011100","0001000"]
        .map((row, y) => [...row].map((c, x) => c === "1" ? `<rect x="${x * 10}" y="${y * 10}" width="10" height="10" fill="${(x + y) % 5 === 0 ? "#5E86BF" : "#16161A"}" stroke="#FFFFFF" stroke-width="1"/>` : "").join("")).join("")
    }</svg>`,
    mando: `<svg class="slide__icon" viewBox="0 0 120 80" aria-hidden="true"><rect x="4" y="10" width="112" height="62" rx="28" fill="#FFFFFF" stroke="#16161A" stroke-width="4"/><rect x="26" y="34" width="26" height="9" fill="#16161A"/><rect x="34.5" y="25.5" width="9" height="26" fill="#16161A"/><circle cx="84" cy="32" r="7" fill="#5E86BF" stroke="#16161A" stroke-width="3"/><circle cx="96" cy="44" r="7" fill="#16161A"/></svg>`
  };
  // Los degradados están en css/styles.css (.slide__art--lavanda, etc.).
  // Antes iban en style="..." dentro del HTML, lo que obligaba a permitir estilos en línea en la CSP.
  const COLORES = ["lavanda", "menta", "durazno", "celeste", "lima"];
  const colorDe = (c) => "slide__art--" + (COLORES.includes(c) ? c : "lavanda");

  function initCarousel() {
    const slides = D.carrusel || [];
    const track = $("#carouselTrack");
    const dots = $("#carouselDots");
    if (!slides.length) { $("#carousel").hidden = true; return; }

    track.innerHTML = slides.map((s, i) => `
      <div class="slide" role="group" aria-roledescription="diapositiva" aria-label="${i + 1} de ${slides.length}: ${esc(s.titulo)}" ${i ? 'aria-hidden="true"' : ""}>
        ${s.imagen
          ? `<img src="${esc(urlSegura(s.imagen))}" alt="${esc(s.titulo)}" loading="lazy">${s.titulo ? `<span class="slide__caption">${esc(s.titulo)}</span>` : ""}`
          : s.captura
          ? `<div class="slide__art slide__art--shot ${colorDe(s.color)}">
               <div class="slide__copy">
                 ${s.logo ? `<img class="slide__logo" src="${esc(urlSegura(s.logo))}" alt="Logo de ${esc(s.titulo)}">` : ""}
                 <p class="slide__kicker">${esc(s.kicker)}</p>
                 <p class="slide__title${s.logo ? " sr-only" : ""}">${esc(s.titulo)}</p>
                 <p class="slide__text">${esc(s.texto)}</p>
               </div>
               <figure class="slide__shot"><span class="slide__bar" aria-hidden="true"><i></i><i></i><i></i></span><img src="${esc(urlSegura(s.captura))}" alt="Captura de pantalla de ${esc(s.titulo)}" loading="lazy"></figure>
             </div>`
          : `<div class="slide__art ${colorDe(s.color)}">
               ${s.logo ? `<img class="slide__logo" src="${esc(urlSegura(s.logo))}" alt="Logo de ${esc(s.titulo)}">` : (ICONOS[s.icono] || ICONOS.cubo)}
               <div>
                 <p class="slide__kicker">${esc(s.kicker)}</p>
                 <p class="slide__title${s.logo ? " sr-only" : ""}">${esc(s.titulo)}</p>
                 <p class="slide__text">${esc(s.texto)}</p>
               </div>
             </div>`}
      </div>`).join("");

    dots.innerHTML = slides.map((s, i) =>
      `<button class="dot" type="button" data-i="${i}" aria-label="Ir a ${esc(s.titulo)}" aria-current="${i === 0}"><span></span></button>`).join("");

    let index = 0, timer = null;
    const go = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      track.querySelectorAll(".slide").forEach((el, n) => el.setAttribute("aria-hidden", n !== index));
      dots.querySelectorAll(".dot").forEach((el, n) => el.setAttribute("aria-current", n === index));
    };
    const start = () => { if (!reducedMotion && slides.length > 1) { stop(); timer = setInterval(() => go(index + 1), 6000); } };
    const stop = () => { clearInterval(timer); timer = null; };

    $("#prevSlide").addEventListener("click", () => { go(index - 1); start(); });
    $("#nextSlide").addEventListener("click", () => { go(index + 1); start(); });
    dots.addEventListener("click", (e) => { const b = e.target.closest(".dot"); if (b) { go(Number(b.dataset.i)); start(); } });

    const box = $("#carousel");
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", start);
    box.addEventListener("focusin", stop);
    box.addEventListener("focusout", start);

    // Deslizar con el dedo en celular
    let x0 = null;
    box.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      x0 = null; start();
    });
    start();
  }

  /* =======================================================
     CONTADORES (solo muestran contenido real)
     ======================================================= */
  const stats = {
    proyectos: proyectos.filter((p) => !p.ejemplo).length,
    clases: bitacora.filter((b) => !b.ejemplo).length,
    testimonios: 0
  };
  function renderCounters() {
    const items = [
      [stats.proyectos, "proyectos publicados"],
      [stats.clases, "clases en la bitácora"],
      [stats.testimonios, "testimonios de estudiantes"]
    ].filter(([n]) => n > 0);
    $("#counters").hidden = items.length === 0;
    $("#counters").innerHTML = items.map(([n, t]) => `<li><strong>${n}</strong><span>${t}</span></li>`).join("");
  }

  /* =======================================================
     RUTA DE NIVELES
     ======================================================= */
  function renderLevels() {
    const niveles = D.niveles || [];
    const actual = Math.max(0, Math.min(Number(D.progresoClase) || 0, niveles.length));
    $("#levels").innerHTML = niveles.map((n, i) => {
      const num = i + 1;
      const cls = actual && num < actual ? "level--done" : actual === num ? "level--now" : "";
      const estado = actual && num < actual ? "Superado" : actual === num ? "En curso" : "";
      return `<li class="level ${cls}"><span class="level__num">NIVEL ${num}</span><span class="level__name">${esc(n)}</span>${estado ? `<span class="level__state">${estado}</span>` : ""}</li>`;
    }).join("");

    if (actual > 0 && niveles.length) {
      const pct = Math.round(((actual - 1) / niveles.length) * 100);
      $("#xp").hidden = false;
      $("#xpText").textContent = `Nivel ${actual} de ${niveles.length}`;
      const bar = $("#xpBar");
      bar.setAttribute("aria-valuemax", niveles.length);
      bar.setAttribute("aria-valuenow", actual);
      bar.setAttribute("aria-valuetext", `Nivel ${actual} de ${niveles.length}`);
      requestAnimationFrame(() => { $("#xpFill").style.width = Math.max(pct, 4) + "%"; });
    }
  }

  /* =======================================================
     CLASES GRATIS
     ======================================================= */
  function renderFree() {
    const clases = D.clasesGratis || [];
    const play = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="#16161A"/></svg>`;
    $("#freeClasses").innerHTML = clases.map((c) => urlSegura(c.url)
      ? `<a class="free-card" href="${esc(urlSegura(c.url))}" target="_blank" rel="noopener noreferrer">
           <span class="free-card__play">${play}</span>
           <h3>${esc(c.titulo)}</h3><p>${esc(c.descripcion)}</p>
           <span class="badge badge--lime">Ver clase gratis</span>
         </a>`
      : `<div class="free-card free-card--soon">
           <span class="free-card__play">${play}</span>
           <h3>${esc(c.titulo)}</h3><p>${esc(c.descripcion)}</p>
           <span class="badge badge--off">Próximamente</span>
         </div>`).join("");
    const tiktok = urlSegura(contacto.tiktok);
    if (/^https:/.test(tiktok)) { const t = $("#linkTiktok"); t.href = tiktok; t.hidden = false; }
  }

  /* =======================================================
     REDES SOCIALES (Instagram, TikTok, canal de WhatsApp)
     ======================================================= */
  function renderRedes() {
    const ico = {
      instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="currentColor"/></svg>`,
      tiktok: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M14 3c.4 2.9 2.3 4.8 5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
      canal: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5l1.3-3.9A8 8 0 1 1 8.6 19z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`
    };
    // Saca "@usuario" del enlace del perfil para mostrarlo en la tarjeta.
    const usuario = (url) => {
      const m = /(?:instagram\.com|tiktok\.com)\/@?([\w.]+)/i.exec(url);
      return m ? "@" + m[1] : "";
    };
    const segura = (v) => (/^https:\/\//i.test(urlSegura(v)) ? urlSegura(v) : "");
    const redes = [
      { id: "instagram", nombre: "Instagram", url: segura(contacto.instagram), texto: "Capturas, avances de los proyectos y la vida del curso." },
      { id: "tiktok", nombre: "TikTok", url: segura(contacto.tiktok), texto: "Clases cortas y gratis para que veas cómo enseñamos." },
      { id: "canal", nombre: "Canal de WhatsApp", url: segura(contacto.canal), texto: "Avisos de cupos, fechas y la lista de espera." }
    ];
    $("#redesLista").innerHTML = redes.map((r) => {
      const arroba = r.id === "canal" ? "disce" : usuario(r.url);
      const cuerpo = `
        <span class="red__ico red__ico--${r.id}">${ico[r.id]}</span>
        <span class="red__txt">
          <strong>${esc(r.nombre)}</strong>
          ${arroba && r.url ? `<span class="red__user">${esc(arroba)}</span>` : ""}
          <span class="red__desc">${esc(r.texto)}</span>
        </span>`;
      return r.url
        ? `<a class="red" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${cuerpo}<span class="red__go">Seguir <span aria-hidden="true">→</span></span></a>`
        : `<div class="red red--soon">${cuerpo}<span class="badge badge--off">Muy pronto</span></div>`;
    }).join("");
    $("#footerRedes").innerHTML = redes.filter((r) => r.url).map((r) =>
      `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="disce en ${esc(r.nombre)}">${ico[r.id]}</a>`).join("");
  }

  /* =======================================================
     PROYECTOS + FILTROS + MODAL
     ======================================================= */
  let filtro = "Todos";
  function renderFilters() {
    const generos = ["Todos", ...new Set(proyectos.map((p) => p.genero).filter(Boolean))];
    $("#filters").innerHTML = generos.map((g) => `<button class="chip" type="button" data-g="${esc(g)}" aria-pressed="${g === filtro}">${esc(g)}</button>`).join("");
  }
  function renderProjects() {
    const lista = proyectos.map((p, i) => ({ ...p, _i: i })).filter((p) => filtro === "Todos" || p.genero === filtro);
    $("#projectsEmpty").hidden = lista.length > 0;
    $("#projects").innerHTML = lista.map((p) => `
      <button class="project" type="button" data-i="${p._i}" aria-label="Ver proyecto ${esc(p.titulo)}">
        ${img(p.imagen, "Captura de " + p.titulo, "project__img")}
        <div class="project__body">
          ${p.ejemplo ? '<span class="ejemplo">EJEMPLO</span>' : ""}
          <h3>${esc(p.titulo)}</h3>
          <span class="project__meta">por ${esc(p.alumno)} · ${esc(p.genero)}</span>
          <div class="project__tags">${(p.temas || []).map((t) => `<span class="badge">${esc(t)}</span>`).join("")}</div>
        </div>
      </button>`).join("");
  }
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    filtro = b.dataset.g; renderFilters(); renderProjects();
  });

  function openProject(i) {
    const p = proyectos[i];
    if (!p) return;
    const compare = p.antes || p.despues
      ? `<div class="detail__compare">
           <figure>${img(p.antes, "Primer avance", "")}<figcaption>Antes · primer avance</figcaption></figure>
           <figure>${img(p.despues, "Resultado final", "")}<figcaption>Después · resultado final</figcaption></figure>
         </div>` : "";
    const video = embedUrl(p.video);   // solo YouTube / Vimeo / Drive
    const media = video
      ? `<div class="detail__media"><iframe src="${esc(video)}" title="Video de ${esc(p.titulo)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe></div>`
      : `<div class="detail__media">${img(p.imagen, "Captura de " + p.titulo, "")}</div>`;
    $("#modalBody").innerHTML = `
      ${p.ejemplo ? '<span class="ejemplo">EJEMPLO</span>' : ""}
      <h2 id="modalTitle">${esc(p.titulo)}</h2>
      <p class="project__meta">por ${esc(p.alumno)} · ${esc(p.genero)}</p>
      ${media}
      <p>${esc(p.descripcion)}</p>
      ${p.aprendizaje ? `<blockquote class="quote">“${esc(p.aprendizaje)}”<br><small>— ${esc(p.alumno)}</small></blockquote>` : ""}
      ${compare}
      <div class="project__tags">${(p.temas || []).map((t) => `<span class="badge">${esc(t)}</span>`).join("")}</div>
      ${urlSegura(p.jugar) ? `<div class="detail__links"><a class="btn btn--lime" href="${esc(urlSegura(p.jugar))}" target="_blank" rel="noopener noreferrer">Jugar ahora</a></div>` : ""}`;
    $("#projectModal").showModal();
  }
  $("#projects").addEventListener("click", (e) => { const c = e.target.closest(".project"); if (c) openProject(Number(c.dataset.i)); });

  /* =======================================================
     BITÁCORA
     ======================================================= */
  function renderTimeline() {
    $("#timelineEmpty").hidden = bitacora.length > 0;
    $("#timeline").innerHTML = bitacora.map((b) => `
      <li class="entry"><div class="entry__box">
        ${b.ejemplo ? '<span class="ejemplo">EJEMPLO</span>' : ""}
        <p class="entry__date">${formatDate(b.fecha)}</p>
        <h3>${esc(b.titulo)}</h3>
        <p>${esc(b.descripcion)}</p>
        ${(b.fotos || []).length ? `<div class="entry__gallery">${b.fotos.map((f) => `<img src="${esc(urlSegura(f))}" alt="Evidencia: ${esc(b.titulo)}" loading="lazy">`).join("")}</div>` : ""}
        ${(b.constancias || []).length ? `<div class="entry__docs">${b.constancias.map((c) => `<a class="doc-link" href="${esc(urlSegura(c.url))}" target="_blank" rel="noopener noreferrer">Ver ${esc(c.nombre)}</a>`).join("")}</div>` : ""}
      </div></li>`).join("");
  }

  /* =======================================================
     TESTIMONIOS (Supabase)
     ======================================================= */
  const sb = D.supabase || {};
  const sbReady = Boolean(sb.url && sb.anonKey);
  const sbHeaders = { apikey: sb.anonKey, Authorization: "Bearer " + sb.anonKey, "Content-Type": "application/json" };
  const STAR = `<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" stroke="#16161A" stroke-width="1.8" stroke-linejoin="round"/>`;
  const stars = (n) => Array.from({ length: 5 }, (_, i) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="${i < n ? "#5E86BF" : "#FFFFFF"}">${STAR}</svg>`).join("");

  async function loadTestimonials() {
    if (!sbReady) return;
    try {
      const res = await fetch(`${sb.url}/rest/v1/testimonios?select=nombre,curso,calificacion,mensaje,creado&order=creado.desc&limit=50`, { headers: sbHeaders });
      if (!res.ok) throw new Error(res.status);
      // Seguridad: los datos de la base se tratan como no confiables.
      // calificacion se fuerza a número entero 1..5 antes de usarla en el HTML.
      const rows = (await res.json()).map((t) => ({ ...t, calificacion: Math.max(1, Math.min(5, Math.round(Number(t.calificacion)) || 1)) }));
      $("#testiEmpty").hidden = rows.length > 0;
      $("#testimonials").innerHTML = rows.map((t) => `
        <article class="testi">
          <p class="testi__line"><strong>${esc(t.nombre)}</strong> · ${esc(t.curso)}</p>
          <p>“${esc(t.mensaje)}”</p>
          <p class="testi__rating">Calificación: <span class="testi__stars" role="img" aria-label="${t.calificacion} de 5 estrellas">${stars(t.calificacion)}</span> <span class="testi__num">${t.calificacion} ${t.calificacion === 1 ? "estrella" : "estrellas"}</span></p>
        </article>`).join("");
      stats.testimonios = rows.length;
      if (rows.length) {
        const avg = rows.reduce((s, t) => s + t.calificacion, 0) / rows.length;
        const avgEl = $("#ratingAvg");
        avgEl.textContent = `${avg.toFixed(1)} de 5 · ${rows.length} ${rows.length === 1 ? "opinión" : "opiniones"}`;
        avgEl.hidden = false;
      }
      renderCounters();
    } catch (err) {
      console.warn("No se pudieron cargar los testimonios:", err);
    }
  }

  // El formulario de testimonios vive en curso-2d.html (js/curso.js)

  /* =======================================================
     PROFE, FAQ, CONTACTO, MENÚ
     ======================================================= */
  // Las fotos ya vienen en el HTML; solo se cambian si data/contenido.js indica otra
  const ponerFoto = (sel, src, alt) => {
    if (!src) return;
    const img = $(sel + " img");
    if (img) { if (img.getAttribute("src") !== src && urlSegura(src)) img.src = urlSegura(src); }
    else if (urlSegura(src)) $(sel).innerHTML = `<img src="${esc(urlSegura(src))}" alt="${esc(alt)}">`;
  };
  ponerFoto("#heroPerson", D.fotoPortada, "Estudiante señalando el título de la página");
  ponerFoto("#profePhoto", D.fotoProfe, "David A. García G., profe de disce");

  $("#faqList").innerHTML = (D.faq || []).map((q) => `<details><summary>${esc(q.p)}</summary><p>${esc(q.r)}</p></details>`).join("");

  // Lista de espera y botón flotante -> canal de WhatsApp; mientras no exista, chat directo
  const numero = contacto.whatsapp ? String(contacto.whatsapp).replace(/\D/g, "") : "";
  const chat = (texto) => (numero ? "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto) : "");
  // Solo enlaces https:// (p. ej. https://whatsapp.com/channel/...)
  const canalRaw = String(contacto.canal || contacto.comunidad || "").trim();
  const canal = /^https:\/\//i.test(canalRaw) ? canalRaw : "";
  const wa = canal || chat("Hola, quiero unirme a la lista de espera de disce.");
  const chatDirecto = chat("Hola, tengo una pregunta sobre los cursos de disce.");
  if (wa) document.querySelectorAll("[data-lista-espera]").forEach((a) => { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });
  if (wa) {
    $("#linkWhatsapp").href = wa; $("#linkWhatsapp").hidden = false;
    $("#waFloat").href = canal || chatDirecto || wa; $("#waFloat").hidden = false;
  }
  const correo = correoSeguro(contacto.email);
  if (correo) {
    $("#linkEmail").href = "mailto:" + correo; $("#linkEmail").hidden = false;
    $("#contactText").textContent = correo;
  }
  if (!wa && !correo) $("#contactText").textContent = "Muy pronto publicaremos nuestros canales de contacto.";

  document.querySelectorAll("[data-open]").forEach((b) => {
    b.addEventListener("click", () => { const d = document.getElementById(b.dataset.open); if (d) d.showModal(); });
  });

  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-close]")) m.close(); });
  });

  const toggle = $("#menuToggle"), nav = $("#nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); } });

  $("#year").textContent = new Date().getFullYear();

  initCarousel();
  renderCounters();
  if ($("#levels")) renderLevels();
  renderFree();
  if ($("#redesLista")) renderRedes();
  renderFilters();
  renderProjects();
  if ($("#timeline")) renderTimeline();
  loadTestimonials();

  /* ---------- Animación suave al hacer scroll ---------- */
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".section h2, .card, .why__block, .levels-panel, .spec, .free-card, .project, .entry, .testi-form, .faq details, .profe__photo")
      .forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }
})();
