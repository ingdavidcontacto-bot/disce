/* =========================================================
   disce · piezas del carrusel que se pueden agarrar
   Cada ".slide__stage" es la zona invisible: las piezas flotan, siguen un
   poco al cursor, se arrastran, giran al lanzarlas y rebotan en los bordes.
   Las posiciones salen de js/arte-piezas.js. Se llama desde main.js con
   window.disceEscenas.iniciar(carrusel, { alAgarrar, alSoltar }).
   ========================================================= */

(function () {
  const calma = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function iniciar(caja, avisos) {
    const escenas = [...caja.querySelectorAll(".slide__stage")].map(crear).filter(Boolean);
    if (!escenas.length) return;

    let visible = true, cuadro = 0;
    const activa = () => escenas.find((e) => e.slide.getAttribute("aria-hidden") !== "true");

    function paso(t) {
      cuadro = 0;
      if (!visible || document.hidden) return;
      const e = activa();
      if (e) e.piezas.forEach((p, i) => mover(e, p, i, t));
      cuadro = requestAnimationFrame(paso);
    }
    const arrancar = () => { if (!cuadro) cuadro = requestAnimationFrame(paso); };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((v) => { visible = v[0].isIntersecting; if (visible) arrancar(); }).observe(caja);
    }
    document.addEventListener("visibilitychange", arrancar);
    arrancar();

    function crear(zona) {
      const nodos = [...zona.querySelectorAll(".pieza")];
      if (!nodos.length) return null;
      const escena = { zona, slide: zona.closest(".slide"), px: 0, py: 0 };

      escena.piezas = nodos.map((n, i) => {
        // Posición y tamaño como fracción de la zona (así se adapta a cualquier pantalla)
        const p = { n, x: +n.dataset.x, y: +n.dataset.y, w: +n.dataset.w, h: +n.dataset.h,
          vx: 0, vy: 0, giro: 0, vg: 0, ix: 0, iy: 0, agarrada: false };
        n.style.left = p.x * 100 + "%";
        n.style.top = p.y * 100 + "%";
        n.style.width = p.w * 100 + "%";
        p.x0 = p.x; p.y0 = p.y;
        p.fase = i * 1.7;
        p.hondo = 4 + (i % 4) * 3; // cuánto sigue al cursor, en píxeles

        n.addEventListener("pointerdown", (ev) => {
          ev.preventDefault();
          n.setPointerCapture(ev.pointerId);
          const r = zona.getBoundingClientRect();
          p.agarrada = true;
          p.dx = (ev.clientX - r.left) / r.width - p.x;
          p.dy = (ev.clientY - r.top) / r.height - p.y;
          p.vx = p.vy = p.vg = 0;
          n.classList.add("is-agarrada");
          zona.appendChild(n); // pasa al frente
          n.setPointerCapture(ev.pointerId);
          avisos.alAgarrar();
        });

        n.addEventListener("pointermove", (ev) => {
          if (!p.agarrada) return;
          const r = zona.getBoundingClientRect();
          const x = limitar((ev.clientX - r.left) / r.width - p.dx, 1 - p.w);
          const y = limitar((ev.clientY - r.top) / r.height - p.dy, 1 - p.h);
          p.vx = x - p.x;
          p.vy = y - p.y;
          p.vg = p.vx * 220; // gira según qué tan rápido se mueve de lado
          p.x = x; p.y = y;
          colocar(p);
          if (calma) pintar(p, 0, 0);
        });

        const soltar = () => {
          if (!p.agarrada) return;
          p.agarrada = false;
          n.classList.remove("is-agarrada");
          if (calma) p.vx = p.vy = p.vg = 0;
          avisos.alSoltar();
        };
        n.addEventListener("pointerup", soltar);
        n.addEventListener("pointercancel", soltar);

        // Doble clic: vuelve a su sitio
        n.addEventListener("dblclick", () => {
          p.x = p.x0; p.y = p.y0; p.giro = p.vg = p.vx = p.vy = 0;
          colocar(p);
          pintar(p, 0, 0);
        });
        return p;
      });

      zona.addEventListener("pointermove", (ev) => {
        const r = zona.getBoundingClientRect();
        escena.px = (ev.clientX - r.left) / r.width - 0.5;
        escena.py = (ev.clientY - r.top) / r.height - 0.5;
      });
      zona.addEventListener("pointerleave", () => { escena.px = escena.py = 0; });
      return escena;
    }

    function mover(escena, p, i, t) {
      if (calma) return;
      if (!p.agarrada) {
        // Inercia con rozamiento y rebote en los bordes
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1 - p.w) { p.x = limitar(p.x, 1 - p.w); p.vx *= -0.7; p.vg *= -0.7; }
        if (p.y < 0 || p.y > 1 - p.h) { p.y = limitar(p.y, 1 - p.h); p.vy *= -0.7; }
        p.vx *= 0.95; p.vy *= 0.95;
        colocar(p);
      }
      p.giro += p.vg;
      p.vg *= 0.96;
      p.ix += (escena.px * p.hondo * 2 - p.ix) * 0.06;
      p.iy += (escena.py * p.hondo * 2 - p.iy) * 0.06;
      const flota = p.agarrada ? 0 : Math.sin(t / 900 + p.fase) * 4;
      pintar(p, p.ix, p.iy + flota);
    }
  }

  const limitar = (v, max) => Math.min(Math.max(v, 0), max);
  function colocar(p) { p.n.style.left = p.x * 100 + "%"; p.n.style.top = p.y * 100 + "%"; }
  function pintar(p, dx, dy) {
    // Inclinación según la velocidad, para dar sensación de volumen
    const ry = Math.max(-35, Math.min(35, p.vx * 1200));
    const rx = Math.max(-35, Math.min(35, -p.vy * 1200));
    p.n.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) perspective(600px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) rotate(${p.giro.toFixed(1)}deg)`;
  }

  window.disceEscenas = { iniciar };
})();
