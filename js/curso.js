/* =========================================================
   disce · páginas de curso (curso-2d.html y curso-3d.html)
   Cada página indica su curso con <body data-curso="2d|3d">.
   El contenido se cambia en data/contenido.js
   ========================================================= */

(function () {
  const D = window.DISCE || {};
  const contacto = D.contacto || {};
  const clave = document.body.dataset.curso === "3d" ? "3d" : "2d";
  const curso = D["curso" + clave] || {};
  const nombreCurso = clave === "3d" ? "Videojuegos en 3D con Unity" : "Videojuegos 2D con Unity";
  const bitacora = D.bitacora || [];
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const formatDate = (s) => {
    if (!/^\d{4}-\d{2}-\d{2}/.test(s || "")) return esc(s);
    const d = new Date(String(s).slice(0, 10) + "T12:00:00");
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  };

  /* ---------- Video introductorio ----------
     Seguridad: solo se insertan videos de YouTube (sin cookies), Vimeo y Google Drive.
     Antes cualquier dirección https:// terminaba dentro de un <iframe>; ahora se ignora
     (y la CSP de vercel.json tampoco dejaría cargar otros sitios en un iframe). */
  function embedUrl(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    let m = u.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,20})/);
    if (m) return "https://www.youtube-nocookie.com/embed/" + m[1];
    m = u.match(/^https:\/\/(?:www\.|player\.)?vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return "https://player.vimeo.com/video/" + m[1];
    m = u.match(/^https:\/\/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (m) return "https://drive.google.com/file/d/" + m[1] + "/preview";
    return "";
  }
  const src = embedUrl(curso.video);
  if (src) {
    $("#introVideo").innerHTML = `<iframe src="${esc(src)}" title="Video introductorio del curso ${esc(nombreCurso)}" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>`;
  }

  /* ---------- Ruta de niveles (cada nivel se despliega) ---------- */
  const niveles = (curso.niveles || []).map((n) => (typeof n === "string" ? { titulo: n } : n));

  /* ---------- Mini carrusel "Lo que verás" (debajo del video) ----------
     Ilustraciones: assets/img/nivel-<2d|3d>-<número>.webp (herramientas/arte_cursos.py) */
  const pista = $("#temasPista");
  if (pista && niveles.length) {
    pista.innerHTML = niveles.map((n, i) => `
      <li class="tema">
        <div class="tema__arte"><img src="assets/img/nivel-${clave}-${i + 1}.webp" alt="" width="720" height="450" loading="lazy"></div>
        <p class="tema__num">Nivel ${i + 1}</p>
        <h4>${esc(n.titulo)}</h4>
        ${n.construyes ? `<p class="tema__texto">${esc(n.construyes)}</p>` : ""}
      </li>`).join("");
    // Si falta una ilustración, queda el fondo azul sin ícono roto
    pista.querySelectorAll("img").forEach((img) => img.addEventListener("error", () => img.remove()));
    $("#temas").hidden = false;

    const botones = [...document.querySelectorAll(".temas__btn")];
    const marcar = () => {
      botones[0].disabled = pista.scrollLeft < 4;
      botones[1].disabled = pista.scrollLeft + pista.clientWidth > pista.scrollWidth - 4;
    };
    const calma = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    botones.forEach((b) => b.addEventListener("click", () => {
      const paso = pista.firstElementChild.getBoundingClientRect().width + 16;
      pista.scrollBy({ left: paso * Number(b.dataset.mover), behavior: calma ? "auto" : "smooth" });
    }));
    pista.addEventListener("scroll", marcar, { passive: true });
    window.addEventListener("resize", marcar);
    marcar();
  }
  const actual = clave === "2d" ? Math.max(0, Math.min(Number(D.progresoClase) || 0, niveles.length)) : 0;
  $("#levels").innerHTML = niveles.map((n, i) => {
    const num = i + 1;
    const cls = actual && num < actual ? "level--done" : actual === num ? "level--now" : "";
    const estado = actual && num < actual ? "Superado" : actual === num ? "En curso" : "";
    const aprendes = (n.aprendes || []).map((x) => `<li>${esc(x)}</li>`).join("");
    const cuerpo = aprendes || n.construyes
      ? `<div class="level__body">
           ${aprendes ? `<p class="level__sub">Lo que aprendes</p><ul>${aprendes}</ul>` : ""}
           ${n.construyes ? `<p class="level__build"><strong>En tu juego:</strong> ${esc(n.construyes)}</p>` : ""}
         </div>`
      : "";
    return `<li><details class="level ${cls}"${num === 1 ? " open" : ""}>
      <summary><span class="level__num">NIVEL ${num}</span><span class="level__name">${esc(n.titulo)}</span>${n.duracion ? `<span class="level__dur">${esc(n.duracion)}</span>` : ""}${estado ? `<span class="level__state">${estado}</span>` : ""}${cuerpo ? '<span class="level__chev" aria-hidden="true"></span>' : ""}</summary>
      ${cuerpo}
    </details></li>`;
  }).join("");
  document.querySelectorAll(".levels__count").forEach((el) => { el.textContent = niveles.length + " niveles"; });
  if (actual > 0 && niveles.length) {
    const pct = Math.round(((actual - 1) / niveles.length) * 100);
    $("#xp").hidden = false;
    $("#xpText").textContent = `Nivel ${actual} de ${niveles.length}`;
    const bar = $("#xpBar");
    bar.setAttribute("aria-valuemax", niveles.length);
    bar.setAttribute("aria-valuenow", actual);
    requestAnimationFrame(() => { $("#xpFill").style.width = Math.max(pct, 4) + "%"; });
  }

  /* ---------- Bitácora (oculta por ahora) ---------- */
  if ($("#timeline")) {
    $("#timelineEmpty").hidden = bitacora.length > 0;
    $("#timeline").innerHTML = bitacora.map((b) => `
      <li class="entry"><div class="entry__box">
        ${b.ejemplo ? '<span class="ejemplo">EJEMPLO</span>' : ""}
        <p class="entry__date">${formatDate(b.fecha)}</p>
        <h3>${esc(b.titulo)}</h3>
        <p>${esc(b.descripcion || "")}</p>
      </div></li>`).join("");
  }

  /* ---------- Formulario de testimonio (solo con cuenta) ---------- */
  const A = window.disceAuth;
  const form = $("#testiForm");
  if (form) {
  const gate = $("#testiGate");
  const msg = $("#tMsg");
  const say = (text, type) => { msg.textContent = text; msg.className = "form-msg " + (type || ""); };

  if (!A || !A.disponible) {
    $("#gateMsg").textContent = "Las cuentas no están disponibles en este momento. Inténtalo más tarde.";
    gate.querySelectorAll(".btn").forEach((b) => b.setAttribute("aria-disabled", "true"));
  } else {
    A.onChange((user) => {
      gate.hidden = Boolean(user);
      form.hidden = !user;
      if (user) {
        $("#tQuien").textContent = A.nombre();
        if (!$("#tNombre").value) $("#tNombre").value = A.nombre();
      }
    });
    $("#tSalir").addEventListener("click", () => A.salir());
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    if (f.get("sitio")) return; // spam
    const nombre = String(f.get("nombre") || "").trim();
    const mensaje = String(f.get("mensaje") || "").trim();
    const calificacion = Number(f.get("calificacion"));
    const cursoNombre = String(f.get("curso") || "");

    if (!A || !A.user) { form.hidden = true; gate.hidden = false; return; }
    if (nombre.length < 2) return say("Escribe tu nombre.", "err");
    if (!calificacion) return say("Elige una calificación de 1 a 5 estrellas.", "err");
    if (mensaje.length < 10) return say("Cuéntanos un poco más (mínimo 10 caracteres).", "err");
    // Mismos límites que la base de datos (setup.sql): evita enviar algo que igual sería rechazado
    if (nombre.length > 60) return say("Tu nombre puede tener máximo 60 caracteres.", "err");
    if (mensaje.length > 600) return say("Tu testimonio puede tener máximo 600 caracteres.", "err");
    if (!(calificacion >= 1 && calificacion <= 5)) return say("Elige una calificación de 1 a 5 estrellas.", "err");

    const btn = $("#tSubmit");
    btn.disabled = true; say("Enviando…", "");
    try {
      const { error } = await A.client.from("testimonios").insert({ nombre, curso: cursoNombre, calificacion, mensaje });
      if (error) {
        if (error.code === "23505") return say("Ya enviaste un testimonio para este curso. Si quieres cambiarlo, escríbenos por WhatsApp.", "err");
        if (error.code === "42501") return say("Tu sesión venció. Cierra sesión, vuelve a ingresar e inténtalo de nuevo.", "err");
        throw error;
      }
      form.reset();
      $("#tNombre").value = A.nombre();
      say("¡Gracias! Tu testimonio aparecerá en la página principal cuando el profe lo revise.", "ok");
    } catch (err) {
      console.warn("No se pudo enviar el testimonio:", err);
      say("No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.", "err");
    } finally {
      btn.disabled = false;
    }
  });

  } // fin del formulario de testimonio

  /* ---------- WhatsApp, menú, año ---------- */
  // Lista de espera y botón flotante -> canal de WhatsApp; mientras no exista, chat directo
  const numero = contacto.whatsapp ? String(contacto.whatsapp).replace(/\D/g, "") : "";
  const chat = (texto) => (numero ? "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto) : "");
  // Solo enlaces https:// (p. ej. https://whatsapp.com/channel/...)
  const canalRaw = String(contacto.canal || contacto.comunidad || "").trim();
  const canal = /^https:\/\//i.test(canalRaw) ? canalRaw : "";
  const wa = canal || chat("Hola, quiero unirme a la lista de espera de disce.");
  const chatDirecto = chat("Hola, tengo una pregunta sobre los cursos de disce.");
  if (wa) document.querySelectorAll("[data-lista-espera]").forEach((a) => { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });
  if (wa) { $("#waFloat").href = canal || chatDirecto || wa; $("#waFloat").hidden = false; }

  const toggle = $("#menuToggle"), nav = $("#nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
  }
  $("#year").textContent = new Date().getFullYear();

  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }), { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add("is-visible"));
})();
