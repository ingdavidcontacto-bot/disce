/* =========================================================
   disce · ajustes (engranaje del encabezado)
   Tema claro/oscuro guardado en este navegador.
   Idioma: por ahora solo español (inglés próximamente).
   ========================================================= */

(function () {
  const raiz = document.documentElement;
  const btn = document.getElementById("ajustesBtn");
  const panel = document.getElementById("ajustesPanel");
  if (!btn || !panel) return;

  const botonesTema = panel.querySelectorAll("[data-tema]");

  function pintar(tema) {
    botonesTema.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.tema === tema)));
  }

  function aplicar(tema, guardar) {
    raiz.setAttribute("data-theme", tema);
    pintar(tema);
    if (guardar) { try { localStorage.setItem("disce-tema", tema); } catch (e) { /* sin almacenamiento */ } }
  }

  pintar(raiz.getAttribute("data-theme") === "dark" ? "dark" : "light");
  botonesTema.forEach((b) => b.addEventListener("click", () => aplicar(b.dataset.tema, true)));

  // Si la persona no ha elegido, seguir el tema del dispositivo
  try {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", (e) => {
      let elegido = null;
      try { elegido = localStorage.getItem("disce-tema"); } catch (err) { /* nada */ }
      if (!elegido) aplicar(e.matches ? "dark" : "light", false);
    });
  } catch (e) { /* navegadores antiguos */ }

  // Abrir / cerrar el panel
  function abrir(si) {
    panel.hidden = !si;
    btn.setAttribute("aria-expanded", String(si));
    if (si) (panel.querySelector('[aria-checked="true"]:not([disabled])') || panel.querySelector("button")).focus();
  }
  btn.addEventListener("click", (e) => { e.stopPropagation(); abrir(panel.hidden); });
  document.addEventListener("click", (e) => { if (!panel.hidden && !panel.contains(e.target)) abrir(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) { abrir(false); btn.focus(); }
  });
})();
