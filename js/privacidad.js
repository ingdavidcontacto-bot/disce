/* =========================================================
   disce · página de política de datos (privacidad.html)
   Solo menú, año y enlaces de lista de espera.
   ========================================================= */

(function () {
  const D = window.DISCE || {};
  const contacto = D.contacto || {};
  const $ = (s) => document.querySelector(s);

  // Lista de espera -> canal de WhatsApp (solo https://); si no hay, chat directo
  const numero = contacto.whatsapp ? String(contacto.whatsapp).replace(/\D/g, "") : "";
  const canalRaw = String(contacto.canal || contacto.comunidad || "").trim();
  const canal = /^https:\/\//i.test(canalRaw) ? canalRaw : "";
  const wa = canal || (numero ? "https://wa.me/" + numero + "?text=" + encodeURIComponent("Hola, quiero unirme a la lista de espera de disce.") : "");
  if (wa) document.querySelectorAll("[data-lista-espera]").forEach((a) => { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });

  const toggle = $("#menuToggle"), nav = $("#nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
  }
  $("#year").textContent = new Date().getFullYear();
})();
