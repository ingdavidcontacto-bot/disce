/* =========================================================
   disce · panel de administración (admin.html)
   Moderar testimonios: aprobar, ocultar y eliminar.
   La seguridad real está en Supabase (supabase/admin.sql): aunque
   alguien abra esta página, la base de datos solo deja ver pendientes,
   cambiar o borrar a las cuentas que están en public.admins.
   ========================================================= */

(function () {
  const A = window.disceAuth;
  const $ = (s) => document.querySelector(s);
  const vistas = ["#vistaCargando", "#vistaSinSesion", "#vistaSinAcceso", "#vistaPanel"];
  const mostrar = (id) => vistas.forEach((v) => { $(v).hidden = v !== id; });
  const COLUMNAS = "id, nombre, curso, calificacion, mensaje, creado, aprobado";

  let filas = [];          // testimonios cargados
  let usuarioActual = "";  // id de la sesión pintada (para no repetir trabajo)
  let ocupado = false;

  /* ---------- Menú y año ---------- */
  const toggle = $("#menuToggle"), nav = $("#nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
  }
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Mensajes ---------- */
  function aviso(texto, tipo) {
    const el = $("#adAviso");
    el.textContent = texto || "";
    el.className = "form-msg admin__aviso " + (tipo || "");
  }

  // Traduce los errores de Supabase / red a mensajes en español
  function traducir(err) {
    const code = String((err && err.code) || "");
    const msg = String((err && err.message) || "").toLowerCase();
    const status = err && err.status;
    if (!navigator.onLine || msg.includes("failed to fetch") || msg.includes("network") || msg.includes("load failed")) {
      return { texto: "No hay conexión. Revisa tu internet e inténtalo de nuevo.", sesion: false };
    }
    if (code === "PGRST301" || code === "PGRST303" || status === 401 || msg.includes("jwt expired") || msg.includes("invalid jwt") || msg.includes("refresh token")) {
      return { texto: "Tu sesión venció. Vuelve a ingresar para seguir moderando.", sesion: true };
    }
    if (code === "42501" || status === 403 || msg.includes("permission denied")) {
      return { texto: "La base de datos no te dio permiso para esto. Revisa que admin.sql esté ejecutado en Supabase.", sesion: false };
    }
    return { texto: A && A.traducir ? A.traducir(err) : "Algo salió mal. Inténtalo de nuevo en un momento.", sesion: false };
  }

  function mostrarError(err) {
    console.warn("Panel de administración:", err);
    const t = traducir(err);
    if (t.sesion) {
      usuarioActual = "";
      mostrar("#vistaSinSesion");
      $("#adminTools").hidden = true;
    }
    aviso(t.texto, "err");
  }

  if (!A || !A.disponible) {
    mostrar("#vistaSinSesion");
    aviso("Las cuentas no están disponibles en este momento (sin conexión con la base de datos). Inténtalo más tarde.", "err");
    return;
  }
  const db = A.client;

  /* ---------- Dibujo de tarjetas (siempre con textContent) ---------- */
  const SVG = "http://www.w3.org/2000/svg";
  const STAR = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z";

  function estrellas(n) {
    const caja = document.createElement("span");
    caja.className = "testi__stars admin-card__stars";
    caja.setAttribute("role", "img");
    caja.setAttribute("aria-label", n + " de 5 estrellas");
    for (let i = 0; i < 5; i++) {
      const svg = document.createElementNS(SVG, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("class", i < n ? "on" : "off");
      const p = document.createElementNS(SVG, "path");
      p.setAttribute("d", STAR);
      svg.appendChild(p);
      caja.appendChild(svg);
    }
    return caja;
  }

  const formatoFecha = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" });
  function fecha(iso) {
    const d = new Date(iso);
    return isNaN(d) ? "" : formatoFecha.format(d);
  }

  function boton(texto, clase, accion, id) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn--sm " + clase;
    b.textContent = texto;
    b.dataset.accion = accion;
    b.dataset.id = String(id);
    return b;
  }

  function tarjeta(t) {
    const art = document.createElement("article");
    art.className = "testi admin-card" + (t.aprobado ? " is-publicado" : " is-pendiente");
    art.dataset.id = String(t.id);

    const cab = document.createElement("div");
    cab.className = "admin-card__top";
    const quien = document.createElement("p");
    quien.className = "testi__line admin-card__who";
    const nombre = document.createElement("strong");
    nombre.textContent = t.nombre || "";
    quien.append(nombre, document.createTextNode(" · " + (t.curso || "")));
    const estado = document.createElement("span");
    estado.className = t.aprobado ? "badge badge--lime" : "badge";
    estado.textContent = t.aprobado ? "Publicado" : "Pendiente";
    cab.append(quien, estado);

    const calif = Math.max(0, Math.min(5, Number(t.calificacion) || 0));
    const nota = document.createElement("p");
    nota.className = "testi__rating";
    const num = document.createElement("span");
    num.className = "testi__num";
    num.textContent = calif + (calif === 1 ? " estrella" : " estrellas");
    nota.append(estrellas(calif), num);

    const mensaje = document.createElement("p");
    mensaje.className = "admin-card__msg";
    mensaje.textContent = "“" + (t.mensaje || "") + "”";

    const pie = document.createElement("div");
    pie.className = "admin-card__foot";
    const cuando = document.createElement("time");
    cuando.className = "admin-card__date";
    cuando.dateTime = t.creado || "";
    cuando.textContent = fecha(t.creado);
    const acciones = document.createElement("div");
    acciones.className = "admin-card__actions";
    if (t.aprobado) acciones.append(boton("Ocultar", "btn--ghost", "ocultar", t.id));
    else acciones.append(boton("Aprobar", "btn--lime", "aprobar", t.id));
    acciones.append(boton("Eliminar", "admin-btn--danger-ghost", "eliminar", t.id));
    pie.append(cuando, acciones);

    art.append(cab, nota, mensaje, pie);
    return art;
  }

  function pintarListas() {
    const pend = filas.filter((t) => !t.aprobado);
    const publ = filas.filter((t) => t.aprobado);
    [["Pendientes", pend], ["Publicados", publ]].forEach(([k, lista]) => {
      const cont = $("#l" + k);
      cont.replaceChildren(...lista.map(tarjeta));
      $("#c" + k).textContent = String(lista.length);
      $("#c" + k).setAttribute("aria-label", lista.length + " " + k.toLowerCase());
      $("#v" + k).hidden = lista.length > 0;
    });
  }

  /* ---------- Cargar desde la base ---------- */
  async function cargar(silencioso) {
    if (ocupado) return;
    ocupado = true;
    const btn = $("#adActualizar");
    btn.disabled = true;
    if (!silencioso) aviso("Cargando testimonios…");
    try {
      const { data, error } = await db.from("testimonios").select(COLUMNAS).order("creado", { ascending: false });
      if (error) throw error;
      filas = Array.isArray(data) ? data : [];
      pintarListas();
      if (!silencioso) aviso("");
    } catch (err) {
      mostrarError(err);
    } finally {
      ocupado = false;
      btn.disabled = false;
    }
  }

  /* ---------- Acciones ---------- */
  async function cambiarEstado(id, aprobado, botonEl) {
    botonEl.disabled = true;
    aviso(aprobado ? "Publicando…" : "Ocultando…");
    try {
      // .select("id") devuelve las filas cambiadas: si viene vacío, la base no lo permitió
      const { data, error } = await db.from("testimonios").update({ aprobado }).eq("id", id).select("id");
      if (error) throw error;
      if (!data || !data.length) throw { code: "42501", message: "permission denied" };
      const fila = filas.find((t) => t.id === id);
      if (fila) fila.aprobado = aprobado;
      pintarListas();
      aviso(aprobado ? "Testimonio aprobado: ya se ve en la página." : "Testimonio oculto: ya no se ve en la página.", "ok");
    } catch (err) {
      botonEl.disabled = false;
      mostrarError(err);
    }
  }

  async function eliminar(id) {
    aviso("Eliminando…");
    try {
      const { data, error } = await db.from("testimonios").delete().eq("id", id).select("id");
      if (error) throw error;
      if (!data || !data.length) throw { code: "42501", message: "permission denied" };
      filas = filas.filter((t) => t.id !== id);
      pintarListas();
      aviso("Testimonio eliminado.", "ok");
    } catch (err) {
      mostrarError(err);
    }
  }

  /* ---------- Diálogo de confirmación ---------- */
  const dlg = $("#dlgBorrar");
  let pendienteBorrar = null;
  function confirmarBorrado(id) {
    const t = filas.find((f) => f.id === id);
    if (!t) return;
    pendienteBorrar = id;
    $("#dlgCita").textContent = (t.nombre || "") + " · " + (t.curso || "") + ": “" + String(t.mensaje || "").slice(0, 160) + (String(t.mensaje || "").length > 160 ? "…" : "") + "”";
    dlg.returnValue = "";
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
  }
  dlg.addEventListener("close", () => {
    const id = pendienteBorrar;
    pendienteBorrar = null;
    if (dlg.returnValue === "eliminar" && id !== null) eliminar(id);
  });
  // Clic fuera de la caja = cancelar
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close("cancelar"); });

  ["#lPendientes", "#lPublicados"].forEach((sel) => {
    $(sel).addEventListener("click", (e) => {
      const b = e.target.closest("button[data-accion]");
      if (!b) return;
      const id = Number(b.dataset.id);
      if (b.dataset.accion === "aprobar") cambiarEstado(id, true, b);
      else if (b.dataset.accion === "ocultar") cambiarEstado(id, false, b);
      else if (b.dataset.accion === "eliminar") confirmarBorrado(id);
    });
  });

  $("#adActualizar").addEventListener("click", () => cargar(false));
  $("#adReintentar").addEventListener("click", () => revisar(A.user));
  $("#adSalir").addEventListener("click", async () => {
    await A.salir();
    location.href = "cuenta.html?next=admin.html";
  });

  /* ---------- Sesión y permiso ---------- */
  async function revisar(user) {
    if (!user) {
      usuarioActual = "";
      filas = [];
      $("#adminTools").hidden = true;
      mostrar("#vistaSinSesion");
      return;
    }
    if (usuarioActual === user.id) return;   // misma sesión (p. ej. token renovado)
    usuarioActual = user.id;
    mostrar("#vistaCargando");
    $("#adCargandoTxt").textContent = "Revisando tu sesión…";
    $("#adReintentar").hidden = true;
    aviso("");
    try {
      const { data, error } = await db.rpc("es_admin");
      if (usuarioActual !== user.id) return; // cambió la sesión mientras esperaba
      if (error) throw error;
      if (data !== true) {
        $("#adCorreoNo").textContent = user.email || "";
        $("#adminTools").hidden = true;
        mostrar("#vistaSinAcceso");
        return;
      }
      $("#adCorreo").textContent = user.email || "";
      $("#adminTools").hidden = false;
      mostrar("#vistaPanel");
      cargar(false);
    } catch (err) {
      // No se pudo comprobar: no decir "sin acceso", ofrecer reintentar
      usuarioActual = "";
      $("#adCargandoTxt").textContent = "No se pudo comprobar tu acceso.";
      $("#adReintentar").hidden = false;
      mostrarError(err);
    }
  }

  A.onChange((user) => { revisar(user); });

  // Al volver la conexión, recargar en silencio
  window.addEventListener("online", () => { if (!$("#vistaPanel").hidden) cargar(true); });
})();
