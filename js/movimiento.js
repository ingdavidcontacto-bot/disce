/* =========================================================
   disce · detalles de movimiento (muy suaves)
   1) Las tarjetas de curso se inclinan siguiendo el cursor (solo con mouse).
   2) Los brillos del fondo se desplazan un poco al hacer scroll.
   Con "reducir movimiento" activado no se hace nada.
   ========================================================= */

(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 1) Inclinación
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const MAX = 4; // grados
    document.querySelectorAll(".course-card").forEach((t) => {
      t.addEventListener("pointermove", (e) => {
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = `perspective(900px) translateY(-5px) rotateX(${(-y * MAX).toFixed(2)}deg) rotateY(${(x * MAX).toFixed(2)}deg)`;
      });
      t.addEventListener("pointerleave", () => { t.style.transform = ""; });
    });
  }

  // 2) Brillos: cada sección sabe qué tan lejos está del centro de la pantalla
  const secciones = [...document.querySelectorAll(".hero, .sec--tint, .sec--glow")];
  if (!secciones.length) return;
  let pendiente = false;
  function actualizar() {
    pendiente = false;
    const alto = window.innerHeight;
    secciones.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > alto) return;
      // El hero parte de 0 (arriba del todo); las demás se centran en la pantalla
      const d = s.classList.contains("hero") ? -window.scrollY * 0.18 : (r.top + r.height / 2 - alto / 2) * 0.12;
      s.style.setProperty("--desliza", Math.max(-120, Math.min(120, d)).toFixed(1) + "px");
    });
  }
  window.addEventListener("scroll", () => { if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); } }, { passive: true });
  actualizar();
})();
