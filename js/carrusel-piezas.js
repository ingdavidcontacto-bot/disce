/* =========================================================
   disce · piezas del carrusel que se pueden agarrar
   Cada ".slide__stage" es la zona invisible: las piezas flotan, siguen un
   poco al cursor, se arrastran, giran al lanzarlas y rebotan en los bordes.
   Las posiciones salen de js/arte-piezas.js. Se llama desde main.js con
   window.disceEscenas.iniciar(carrusel, { alAgarrar, alSoltar }).

   Para que sea fluido: todo se pinta una vez por cuadro, solo con
   "transform", y los cálculos usan el tiempo real entre cuadros.
   ========================================================= */

(function () {
  const calma = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const limitar = (v, min, max) => Math.min(Math.max(v, min), max);
  // Acercamiento suave que no depende de los cuadros por segundo
  const suave = (actual, meta, rapidez, k) => actual + (meta - actual) * (1 - Math.pow(1 - rapidez, k));

  function iniciar(caja, avisos) {
    const escenas = [...caja.querySelectorAll(".slide__stage")].map(crear).filter(Boolean);
    if (!escenas.length) return;

    let visible = true, cuadro = 0, antes = 0;

    function paso(t) {
      cuadro = 0;
      if (!visible || document.hidden) { antes = 0; return; }
      // k = cuántos cuadros de 60 fps pasaron (1 en una pantalla normal)
      const k = antes ? Math.min((t - antes) / 16.67, 3) : 1;
      antes = t;
      const e = escenas.find((x) => x.slide.getAttribute("aria-hidden") !== "true");
      if (e) {
        const W = e.zona.clientWidth, H = e.zona.clientHeight;
        e.piezas.forEach((p) => mover(e, p, t, k, W, H));
      }
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
      let capa = 1;

      escena.piezas = nodos.map((n, i) => {
        // Posición y tamaño como fracción de la zona (así se adapta a cualquier pantalla)
        const p = { n, w: +n.dataset.w, h: +n.dataset.h, x0: +n.dataset.x, y0: +n.dataset.y,
          vx: 0, vy: 0, giro: 0, vg: 0, ix: 0, iy: 0, rx: 0, ry: 0, flota: 1, agarrada: false };
        p.x = p.mx = p.x0;
        p.y = p.my = p.y0;
        p.grande = p.w > 0.35;               // las piezas grandes giran poco
        p.fase = i * 1.7;
        p.hondo = p.grande ? 5 : 4 + (i % 4) * 3; // cuánto sigue al cursor, en píxeles
        n.style.left = p.x0 * 100 + "%";
        n.style.top = p.y0 * 100 + "%";
        n.style.width = p.w * 100 + "%";

        n.addEventListener("pointerdown", (ev) => {
          ev.preventDefault();
          const r = zona.getBoundingClientRect();
          p.agarrada = true;
          p.dx = (ev.clientX - r.left) / r.width - p.x;
          p.dy = (ev.clientY - r.top) / r.height - p.y;
          p.mx = p.x; p.my = p.y;
          p.vx = p.vy = p.vg = 0;
          n.classList.add("is-agarrada");
          n.style.zIndex = ++capa; // pasa al frente sin mover el elemento en el HTML
          n.setPointerCapture(ev.pointerId);
          avisos.alAgarrar();
        });

        // Mientras se arrastra solo se guarda a dónde ir; pintar lo hace el cuadro
        n.addEventListener("pointermove", (ev) => {
          if (!p.agarrada) return;
          const r = zona.getBoundingClientRect();
          p.mx = limitar((ev.clientX - r.left) / r.width - p.dx, 0, 1 - p.w);
          p.my = limitar((ev.clientY - r.top) / r.height - p.dy, 0, 1 - p.h);
          if (calma) { p.x = p.mx; p.y = p.my; pintar(p, 0, 0, r.width, r.height); }
        });

        const soltar = () => {
          if (!p.agarrada) return;
          p.agarrada = false;
          n.classList.remove("is-agarrada");
          avisos.alSoltar();
        };
        n.addEventListener("pointerup", soltar);
        n.addEventListener("pointercancel", soltar);
        n.addEventListener("lostpointercapture", soltar);

        // Doble clic: vuelve a su sitio
        n.addEventListener("dblclick", () => {
          p.x = p.mx = p.x0; p.y = p.my = p.y0;
          p.giro = p.vg = p.vx = p.vy = p.rx = p.ry = 0;
          pintar(p, 0, 0, zona.clientWidth, zona.clientHeight);
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

    function mover(escena, p, t, k, W, H) {
      if (calma) return;
      if (p.agarrada) {
        const x = suave(p.x, p.mx, 0.35, k), y = suave(p.y, p.my, 0.35, k);
        p.vx = suave(p.vx, (x - p.x) / k, 0.4, k);
        p.vy = suave(p.vy, (y - p.y) / k, 0.4, k);
        p.x = x; p.y = y;
      } else {
        // Inercia con rozamiento y rebote en los bordes
        p.x += p.vx * k; p.y += p.vy * k;
        if (p.x < 0 || p.x > 1 - p.w) { p.x = limitar(p.x, 0, 1 - p.w); p.vx *= -0.6; p.vg *= -0.6; }
        if (p.y < 0 || p.y > 1 - p.h) { p.y = limitar(p.y, 0, 1 - p.h); p.vy *= -0.6; }
        const roce = Math.pow(0.95, k);
        p.vx *= roce; p.vy *= roce;
      }
      // Giro: las piezas pequeñas ruedan; las grandes se ladean y se enderezan solas
      if (p.grande) {
        p.giro = suave(p.giro, limitar(p.vx * 500, -14, 14), 0.12, k);
      } else {
        p.vg = suave(p.vg, p.agarrada ? p.vx * 180 : p.vg * 0.7, 0.15, k);
        p.giro += p.vg * k;
      }
      const tope = p.grande ? 18 : 30;
      p.ry = suave(p.ry, limitar(p.vx * 900, -tope, tope), 0.18, k);
      p.rx = suave(p.rx, limitar(-p.vy * 900, -tope, tope), 0.18, k);
      p.ix = suave(p.ix, escena.px * p.hondo * 2, 0.06, k);
      p.iy = suave(p.iy, escena.py * p.hondo * 2, 0.06, k);
      p.flota = suave(p.flota, p.agarrada ? 0 : 1, 0.08, k); // dejar de flotar sin saltos
      pintar(p, p.ix, p.iy + Math.sin(t / 900 + p.fase) * 4 * p.flota, W, H);
    }
  }

  function pintar(p, dx, dy, W, H) {
    const x = (p.x - p.x0) * W + dx, y = (p.y - p.y0) * H + dy;
    p.n.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) perspective(700px) rotateX(${p.rx.toFixed(2)}deg) rotateY(${p.ry.toFixed(2)}deg) rotate(${p.giro.toFixed(2)}deg)`;
  }

  window.disceEscenas = { iniciar };
})();
