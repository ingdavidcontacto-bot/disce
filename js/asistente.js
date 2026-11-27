/* =========================================================
   disce · asistente de IA
   Botón flotante (abajo a la izquierda) con un chat. Solo funciona con
   sesión iniciada: la validación real la hace la función de Supabase
   "asistente" (supabase/functions/asistente). Se carga después de auth.js.
   Los mensajes se pintan con textContent (nunca como HTML).
   ========================================================= */

(function () {
  const auth = window.disceAuth;
  if (!auth || !auth.disponible) return;

  const MAX = 500;
  const historial = [];
  let abierto = false;
  let enviando = false;

  const el = (tag, clase, texto) => {
    const n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto) n.textContent = texto;
    return n;
  };

  // ---------- Estructura ----------
  const boton = el("button", "asist-btn");
  boton.type = "button";
  boton.setAttribute("aria-expanded", "false");
  boton.setAttribute("aria-controls", "asistPanel");
  boton.append(el("span", "asist-btn__spark", "✦"), el("span", "asist-btn__txt", "Pregúntame"));

  const panel = el("section", "asist-panel");
  panel.id = "asistPanel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Asistente de disce");

  const cabecera = el("header", "asist-head");
  const titulos = el("div");
  titulos.append(el("strong", "", "Asistente disce"), el("small", "", "Resuelve tus dudas al instante"));
  const cerrar = el("button", "asist-close", "×");
  cerrar.type = "button";
  cerrar.setAttribute("aria-label", "Cerrar asistente");
  cabecera.append(titulos, cerrar);

  const log = el("div", "asist-log");
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");

  const form = el("form", "asist-form");
  const campo = el("textarea", "asist-input");
  campo.rows = 1;
  campo.maxLength = MAX;
  campo.placeholder = "Escribe tu pregunta…";
  campo.setAttribute("aria-label", "Tu pregunta");
  const enviar = el("button", "asist-send", "Enviar");
  enviar.type = "submit";
  form.append(campo, enviar);

  const nota = el("p", "asist-note", "Es una IA y puede equivocarse; no escribas datos personales. Para inscripción y pagos, usa WhatsApp.");

  const login = el("div", "asist-login");
  login.append(
    el("p", "", "Para usar el asistente necesitas una cuenta. Es gratis y toma un minuto."),
  );
  const enlace = el("a", "btn btn--lime", "Ingresar o crear cuenta");
  enlace.href = "cuenta.html";
  login.append(enlace);

  panel.append(cabecera, log, form, login, nota);
  document.body.append(boton, panel);

  // ---------- Mensajes ----------
  function burbuja(rol, texto) {
    const b = el("div", "asist-msg asist-msg--" + rol, texto);
    log.append(b);
    log.scrollTop = log.scrollHeight;
    return b;
  }

  function saludo() {
    log.textContent = "";
    const n = auth.nombre ? auth.nombre().split(/\s+/)[0] : "";
    burbuja("bot", "¡Hola" + (n ? ", " + n : "") + "! Soy el asistente de disce. Pregúntame por los cursos, precios, el computador que necesitas o cómo empezar.");
  }

  function pintarEstado() {
    const sesion = Boolean(auth.user);
    form.hidden = !sesion;
    login.hidden = sesion;
    log.hidden = !sesion;
    if (sesion && !log.childElementCount) saludo();
    if (!sesion) { historial.length = 0; log.textContent = ""; }
  }

  async function mensajeDeError(err) {
    try {
      const r = err && err.context;
      if (r && typeof r.json === "function") {
        const j = await r.json();
        if (j && j.error) return String(j.error);
      }
    } catch (_) { /* usa el mensaje genérico */ }
    return "No pude conectarme. Revisa tu internet e inténtalo de nuevo.";
  }

  async function preguntar(texto) {
    enviando = true;
    enviar.disabled = true;
    burbuja("user", texto);
    historial.push({ role: "user", content: texto });
    const espera = burbuja("bot", "Escribiendo…");
    espera.classList.add("is-wait");
    try {
      const { data, error } = await auth.client.functions.invoke("asistente", { body: { messages: historial.slice(-10) } });
      if (error) throw error;
      const respuesta = String((data && data.reply) || "").trim();
      if (!respuesta) throw new Error("vacío");
      espera.classList.remove("is-wait");
      espera.textContent = respuesta;
      historial.push({ role: "assistant", content: respuesta });
    } catch (e) {
      espera.classList.remove("is-wait");
      espera.classList.add("is-error");
      espera.textContent = await mensajeDeError(e);
      historial.pop(); // la pregunta que falló no queda en el historial
    }
    log.scrollTop = log.scrollHeight;
    enviando = false;
    enviar.disabled = false;
    campo.focus();
  }

  // ---------- Eventos ----------
  function alternar(abrir) {
    abierto = abrir;
    panel.hidden = !abrir;
    boton.setAttribute("aria-expanded", String(abrir));
    boton.classList.toggle("is-open", abrir);
    if (abrir) { pintarEstado(); (auth.user ? campo : enlace).focus(); }
    else boton.focus();
  }

  boton.addEventListener("click", () => alternar(!abierto));
  cerrar.addEventListener("click", () => alternar(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && abierto) alternar(false); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = campo.value.trim();
    if (!texto || enviando) return;
    campo.value = "";
    campo.style.height = "";
    preguntar(texto);
  });

  campo.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });
  campo.addEventListener("input", () => {
    campo.style.height = "auto";
    campo.style.height = Math.min(campo.scrollHeight, 110) + "px";
  });

  auth.onChange(() => { if (abierto) pintarEstado(); else { if (!auth.user) { historial.length = 0; log.textContent = ""; } } });
})();
