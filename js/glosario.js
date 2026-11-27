/* =========================================================
   disce · palabras que se despliegan
   Busca en la página las palabras de DISCE.glosario (data/contenido.js),
   las subraya con puntos y al tocarlas muestra una explicación corta.
   Se carga al final, cuando la página ya pintó su contenido.
   Todo se inserta con textContent (nunca como HTML).
   ========================================================= */

(function () {
  const lista = ((window.DISCE || {}).glosario || []).filter((g) => g && g.palabras && g.texto);
  const main = document.querySelector("main");
  if (!lista.length || !main || !("showPopover" in HTMLElement.prototype)) return;

  // No se tocan enlaces, botones, títulos, formularios ni el carrusel
  const FUERA = "a, button, summary, h1, h2, h3, label, nav, select, textarea, script, .carousel, .badge, .termino";
  const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const tarjeta = document.createElement("div");
  tarjeta.className = "glosa";
  tarjeta.id = "glosa";
  tarjeta.setAttribute("popover", "manual");
  tarjeta.setAttribute("role", "status");
  const titulo = document.createElement("strong");
  const texto = document.createElement("p");
  const enlaces = document.createElement("div");
  tarjeta.append(titulo, texto, enlaces);
  document.body.append(tarjeta);

  let actual = null;

  function cerrar() {
    if (!actual) return;
    actual.setAttribute("aria-expanded", "false");
    actual = null;
    tarjeta.hidePopover();
  }

  function abrir(boton, g) {
    cerrar();
    titulo.textContent = g.titulo || boton.textContent;
    texto.textContent = g.texto;
    // Uno ("enlace") o varios ("enlaces": [[página, texto]]), solo páginas de disce
    enlaces.textContent = "";
    (g.enlaces || (g.enlace ? [[g.enlace, g.enlaceTexto]] : [])).forEach(([url, nombre]) => {
      if (!/^[a-z0-9-]+\.html(#[a-z0-9-]+)?$/i.test(url || "")) return;
      const a = document.createElement("a");
      a.href = url;
      a.textContent = nombre || "Leer más";
      enlaces.append(a);
    });
    tarjeta.showPopover();
    actual = boton;
    boton.setAttribute("aria-expanded", "true");
    // Debajo de la palabra; si no cabe, encima
    const r = boton.getBoundingClientRect();
    const ancho = tarjeta.offsetWidth, alto = tarjeta.offsetHeight;
    const izq = Math.min(Math.max(12, r.left + r.width / 2 - ancho / 2), window.innerWidth - ancho - 12);
    const arriba = r.bottom + 10 + alto > window.innerHeight ? Math.max(12, r.top - alto - 10) : r.bottom + 10;
    tarjeta.style.left = izq + "px";
    tarjeta.style.top = arriba + "px";
  }

  // Cada palabra se marca una sola vez por bloque (sección o pregunta)
  const marcadas = new WeakMap();
  lista.forEach((g) => {
    const patron = new RegExp("(?<![\\p{L}\\p{N}])(" + g.palabras.map(escapar).join("|") + ")(?![\\p{L}\\p{N}])", "iu");
    const recorrido = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    const nodos = [];
    while (recorrido.nextNode()) nodos.push(recorrido.currentNode);

    nodos.forEach((nodo) => {
      const padre = nodo.parentElement;
      if (!padre || padre.closest(FUERA)) return;
      const hallazgo = patron.exec(nodo.nodeValue);
      if (!hallazgo) return;
      const bloque = padre.closest("details, article, section") || main;
      const ya = marcadas.get(bloque) || new Set();
      if (ya.has(g)) return;
      marcadas.set(bloque, ya.add(g));

      const resto = nodo.splitText(hallazgo.index);
      resto.splitText(hallazgo[0].length);
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "termino";
      boton.textContent = resto.nodeValue;
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-controls", "glosa");
      boton.addEventListener("click", () => (actual === boton ? cerrar() : abrir(boton, g)));
      resto.replaceWith(boton);
    });
  });

  document.addEventListener("click", (e) => { if (actual && !e.target.closest(".termino, .glosa")) cerrar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && actual) { const b = actual; cerrar(); b.focus(); } });
  window.addEventListener("scroll", cerrar, { passive: true });
  window.addEventListener("resize", cerrar);
})();
