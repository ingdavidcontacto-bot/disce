/* =========================================================
   disce · página del curso 2D (curso-2d.html)
   El contenido se cambia en data/contenido.js
   ========================================================= */

(function () {
  const D = window.DISCE || {};
  const contacto = D.contacto || {};
  const curso = D.curso2d || {};
  const bitacora = D.bitacora || [];
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const formatDate = (s) => {
    if (!/^\d{4}-\d{2}-\d{2}/.test(s || "")) return esc(s);
    const d = new Date(String(s).slice(0, 10) + "T12:00:00");
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  };

  /* ---------- Video introductorio ---------- */
  function embedUrl(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    let m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    if (m) return "https://www.youtube-nocookie.com/embed/" + m[1];
    m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return "https://player.vimeo.com/video/" + m[1];
    m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (m) return "https://drive.google.com/file/d/" + m[1] + "/preview";
    return /^https:\/\//.test(u) ? u : "";
  }
  const src = embedUrl(curso.video);
  if (src) {
    $("#introVideo").innerHTML = `<iframe src="${esc(src)}" title="Video introductorio del curso Videojuegos 2D con Unity" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
  }

  /* ---------- Ruta de niveles ---------- */
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
      say("¡Gracias! Tu testimonio aparecerá en la página principal cuando el profe lo verifique.", "ok");
    } catch (err) {
      console.warn("No se pudo enviar el testimonio:", err);
      say("No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.", "err");
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- WhatsApp, menú, año ---------- */
  const wa = contacto.whatsapp ? "https://wa.me/" + String(contacto.whatsapp).replace(/\D/g, "") : "";
  if (wa) { $("#waFloat").href = wa; $("#waFloat").hidden = false; }

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
