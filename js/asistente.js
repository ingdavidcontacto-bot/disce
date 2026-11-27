/* =========================================================
   disce · "Pregúntame": respuestas preparadas (sin IA)
   Botón flotante con un chat. Busca en lo que escribe la persona las
   palabras "detonantes" de cada respuesta (DISCE.respuestas, en
   data/contenido.js) y muestra la que más coincide. Todo pasa en el
   navegador: no se envía nada a ningún servidor.
   ========================================================= */

(function () {
  const D = window.DISCE || {};
  const temas = (D.respuestas || []).filter((t) => t && t.pregunta && t.respuesta && t.detonantes);
  if (!temas.length) return;

  const MAX = 200;
  const el = (tag, clase, texto) => {
    const n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto) n.textContent = texto;
    return n;
  };

  // ---------- Buscar la respuesta ----------
  // Sin tildes, sin signos y en minúsculas
  const limpiar = (s) => " " + String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]+/g, " ").trim() + " ";

  // Un detonante coincide si alguna palabra empieza igual ("busc" -> buscar, búsqueda).
  // Las frases ("cuanto cuesta") valen más que una palabra suelta.
  function buscar(texto) {
    const t = limpiar(texto);
    return temas
      .map((tema) => ({
        tema,
        puntos: tema.detonantes.reduce((n, d) => {
          const clave = limpiar(d).trim();
          return n + (t.includes(" " + clave) ? (clave.includes(" ") ? 3 : clave.length > 3 ? 2 : 1) : 0);
        }, 0)
      }))
      .filter((r) => r.puntos > 0)
      .sort((a, b) => b.puntos - a.puntos);
  }

  // ---------- Estructura ----------
  const boton = el("button", "asist-btn");
  boton.type = "button";
  boton.setAttribute("aria-expanded", "false");
  boton.setAttribute("aria-controls", "asistPanel");
  boton.append(el("span", "asist-btn__spark", "?"), el("span", "asist-btn__txt", "Pregúntame"));

  const panel = el("section", "asist-panel");
  panel.id = "asistPanel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Preguntas sobre disce");

  const cabecera = el("header", "asist-head");
  const titulos = el("div");
  titulos.append(el("strong", "", "Pregúntame"), el("small", "", "Respuestas al instante"));
  const cerrar = el("button", "asist-close", "×");
  cerrar.type = "button";
  cerrar.setAttribute("aria-label", "Cerrar");
  cabecera.append(titulos, cerrar);

  const log = el("div", "asist-log");
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");

  const form = el("form", "asist-form");
  const campo = el("input", "asist-input");
  campo.type = "text";
  campo.maxLength = MAX;
  campo.autocomplete = "off";
  campo.placeholder = "Escribe tu pregunta…";
  campo.setAttribute("aria-label", "Tu pregunta");
  const enviar = el("button", "asist-send", "Enviar");
  enviar.type = "submit";
  form.append(campo, enviar);

  const nota = el("p", "asist-note", "Son respuestas preparadas. Para inscripción y pagos, escríbenos por WhatsApp.");

  panel.append(cabecera, log, form, nota);
  document.body.append(boton, panel);

  // ---------- Conversación ----------
  const abajo = () => { log.scrollTop = log.scrollHeight; };

  function burbuja(rol, texto) {
    const b = el("div", "asist-msg asist-msg--" + rol, texto);
    log.append(b);
    return b;
  }

  function sugerencias(lista) {
    const caja = el("div", "asist-chips");
    lista.forEach((tema) => {
      const c = el("button", "asist-chip", tema.pregunta);
      c.type = "button";
      c.addEventListener("click", () => { burbuja("user", tema.pregunta); responder(tema); });
      caja.append(c);
    });
    log.append(caja);
  }

  function enlazar(bocadillo, url, texto) {
    const canal = (D.contacto || {}).canal || "";
    const numero = String((D.contacto || {}).whatsapp || "").replace(/\D/g, "");
    let destino = "";
    if (url === "whatsapp") destino = numero ? "https://wa.me/" + numero : "";
    else if (url === "canal") destino = /^https:\/\//i.test(canal) ? canal : "";
    else if (/^[a-z0-9-]+\.html(#[a-z0-9-]+)?$|^#[a-z0-9-]+$/i.test(url || "")) destino = url;
    if (!destino) return;
    const a = el("a", "asist-link", texto || "Ver más");
    a.href = destino;
    if (/^https:/.test(destino)) { a.target = "_blank"; a.rel = "noopener"; }
    else a.addEventListener("click", () => alternar(false));
    bocadillo.append(a);
  }

  function responder(tema, relacionados) {
    const b = burbuja("bot", tema.respuesta);
    enlazar(b, tema.enlace, tema.enlaceTexto);
    const otros = (relacionados || []).concat(temas).filter((t, i, a) => t !== tema && a.indexOf(t) === i);
    sugerencias(otros.slice(0, 3));
    // Deja a la vista la pregunta y el comienzo de la respuesta
    log.scrollTop = Math.max(0, b.offsetTop - log.offsetTop - 60);
  }

  function preguntar(texto) {
    burbuja("user", texto);
    const hallazgos = buscar(texto);
    if (hallazgos.length) return responder(hallazgos[0].tema, hallazgos.slice(1).map((h) => h.tema));
    const b = burbuja("bot", "No tengo una respuesta preparada para eso. Prueba con una de estas o escríbenos por WhatsApp.");
    enlazar(b, "whatsapp", "Escribir por WhatsApp");
    sugerencias(temas.slice(0, 4));
    abajo();
  }

  function saludo() {
    burbuja("bot", "¡Hola! Pregúntame por los cursos, precios, el computador que necesitas o cómo inscribirte.");
    sugerencias(temas.slice(0, 4));
  }

  // ---------- Eventos ----------
  let abierto = false;
  function alternar(abrir) {
    abierto = abrir;
    panel.hidden = !abrir;
    boton.setAttribute("aria-expanded", String(abrir));
    boton.classList.toggle("is-open", abrir);
    if (abrir) {
      if (!log.childElementCount) saludo();
      // En celular no se abre el teclado solo
      if (window.matchMedia("(pointer: fine)").matches) campo.focus();
      else cerrar.focus();
    } else boton.focus();
  }

  boton.addEventListener("click", () => alternar(!abierto));
  cerrar.addEventListener("click", () => alternar(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && abierto) alternar(false); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = campo.value.trim().slice(0, MAX);
    if (!texto) return;
    campo.value = "";
    preguntar(texto);
  });
})();
