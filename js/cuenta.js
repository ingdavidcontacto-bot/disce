/* =========================================================
   disce · página de cuenta (cuenta.html)
   Ingresar, crear cuenta, recuperar contraseña y cerrar sesión.
   ========================================================= */

(function () {
  const A = window.disceAuth;
  const $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(location.search);

  // A dónde volver después de ingresar (solo páginas de disce)
  const nextRaw = params.get("next") || "";
  const next = /^[\w-]+\.html(#[\w-]+)?$/.test(nextRaw) ? nextRaw : "";
  const urlRetorno = location.origin + location.pathname.replace(/[^/]*$/, "") + "cuenta.html" + (next ? "?next=" + encodeURIComponent(next) : "");

  const vistas = ["#vistaAcceso", "#formRecuperar", "#formNueva", "#vistaCorreo", "#vistaCuenta"];
  const mostrar = (id) => vistas.forEach((v) => { $(v).hidden = v !== id; });
  const aviso = (t, tipo) => { const el = $("#aviso"); el.textContent = t || ""; el.className = "form-msg auth__aviso " + (tipo || ""); };
  const msgDe = (form) => form.querySelector(".form-msg");
  const say = (form, t, tipo) => { const m = msgDe(form); m.textContent = t || ""; m.className = "form-msg " + (tipo || ""); };
  const correoOk = (c) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
  const ocupado = (form, si) => form.querySelectorAll("button, input").forEach((el) => { el.disabled = si; });

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

  /* ---------- Pestañas ---------- */
  function pestana(cual) {
    const reg = cual === "registro";
    $("#tabIngresar").setAttribute("aria-selected", String(!reg));
    $("#tabRegistro").setAttribute("aria-selected", String(reg));
    $("#formIngresar").hidden = reg;
    $("#formRegistro").hidden = !reg;
    $("#authTitulo").innerHTML = reg ? 'Crea tu <span class="hl">cuenta</span>' : 'Entra a tu <span class="hl">cuenta</span>';
  }
  $("#tabIngresar").addEventListener("click", () => pestana("ingresar"));
  $("#tabRegistro").addEventListener("click", () => pestana("registro"));
  $("#irRecuperar").addEventListener("click", () => {
    $("#reqCorreo").value = $("#inCorreo").value;
    mostrar("#formRecuperar");
    $("#reqCorreo").focus();
  });
  document.querySelectorAll("[data-volver]").forEach((b) => b.addEventListener("click", () => { mostrar("#vistaAcceso"); pestana("ingresar"); }));
  document.querySelectorAll("[data-ver]").forEach((b) => b.addEventListener("click", () => {
    const inp = document.getElementById(b.dataset.ver);
    const ver = inp.type === "password";
    inp.type = ver ? "text" : "password";
    b.textContent = ver ? "Ocultar" : "Ver";
    b.setAttribute("aria-label", ver ? "Ocultar contraseña" : "Mostrar contraseña");
  }));

  if (!A || !A.disponible) {
    mostrar("#vistaAcceso");
    aviso("Las cuentas no están disponibles en este momento. Inténtalo más tarde.", "err");
    document.querySelectorAll("#vistaAcceso button[type=submit]").forEach((b) => { b.disabled = true; });
    return;
  }
  const auth = A.client.auth;

  /* ---------- Ingresar ---------- */
  $("#formIngresar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const correo = form.correo.value.trim().toLowerCase();
    const clave = form.clave.value;
    if (!correoOk(correo)) return say(form, "Escribe un correo válido.", "err");
    if (!clave) return say(form, "Escribe tu contraseña.", "err");
    ocupado(form, true); say(form, "Ingresando…");
    const { error } = await auth.signInWithPassword({ email: correo, password: clave });
    ocupado(form, false);
    if (error) return say(form, A.traducir(error), "err");
    say(form, "");
    if (next) location.href = next;   // volver a donde estaba
  });

  /* ---------- Crear cuenta ---------- */
  $("#formRegistro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = form.nombre.value.trim().replace(/\s+/g, " ");
    const correo = form.correo.value.trim().toLowerCase();
    const clave = form.clave.value;
    if (nombre.length < 2) return say(form, "Escribe tu nombre.", "err");
    if (!correoOk(correo)) return say(form, "Escribe un correo válido.", "err");
    if (clave.length < 8) return say(form, "La contraseña debe tener al menos 8 caracteres.", "err");
    if (!form.acepto.checked) return say(form, "Debes aceptar el uso de tus datos para crear la cuenta.", "err");
    ocupado(form, true); say(form, "Creando tu cuenta…");
    const { data, error } = await auth.signUp({
      email: correo,
      password: clave,
      options: { data: { nombre }, emailRedirectTo: urlRetorno }
    });
    ocupado(form, false);
    if (error) return say(form, A.traducir(error), "err");
    // Si el correo ya existía, Supabase responde sin error pero sin identidades
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return say(form, "Ya existe una cuenta con ese correo. Ingresa o recupera tu contraseña.", "err");
    }
    say(form, "");
    if (!data.session) {           // Confirmación por correo activada
      $("#correoEnviado").textContent = correo;
      mostrar("#vistaCorreo");
    }                               // Si no, onChange muestra la cuenta
  });

  /* ---------- Recuperar contraseña ---------- */
  $("#formRecuperar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const correo = form.correo.value.trim().toLowerCase();
    if (!correoOk(correo)) return say(form, "Escribe un correo válido.", "err");
    ocupado(form, true); say(form, "Enviando…");
    const { error } = await auth.resetPasswordForEmail(correo, { redirectTo: urlRetorno });
    ocupado(form, false);
    if (error) return say(form, A.traducir(error), "err");
    say(form, "Listo. Si ese correo tiene cuenta, te llegará un enlace en unos minutos (revisa spam).", "ok");
  });

  /* ---------- Nueva contraseña ---------- */
  let recuperando = A.esRecuperacion;
  $("#formNueva").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const clave = form.clave.value;
    if (clave.length < 8) return say(form, "La contraseña debe tener al menos 8 caracteres.", "err");
    ocupado(form, true); say(form, "Guardando…");
    const { error } = await auth.updateUser({ password: clave });
    ocupado(form, false);
    if (error) return say(form, A.traducir(error), "err");
    recuperando = false;
    aviso("Tu contraseña quedó guardada.", "ok");
    pintar(A.user);
  });

  /* ---------- Cerrar sesión ---------- */
  $("#cuSalir").addEventListener("click", async () => {
    await A.salir();
    aviso("Cerraste sesión.", "ok");
  });

  /* ---------- Estado de la sesión ---------- */
  function pintar(user) {
    if (user && recuperando) { mostrar("#formNueva"); $("#nuClave").focus(); return; }
    if (user) {
      $("#cuNombre").textContent = A.nombre();
      $("#cuCorreo").textContent = user.email || "";
      if (next) {
        $("#cuSeguir").href = next;
        $("#cuSeguir").textContent = "Continuar";
      }
      mostrar("#vistaCuenta");
      $("#authTitulo").innerHTML = 'Tu <span class="hl">cuenta</span>';
      return;
    }
    const visible = vistas.find((v) => !$(v).hidden);
    if (visible === "#vistaCorreo" || visible === "#formRecuperar") return;
    mostrar("#vistaAcceso");
  }

  if (A.errorEnlace) {
    aviso(A.errorEnlace === "otp_expired"
      ? "El enlace del correo venció o ya se usó. Ingresa o pide uno nuevo."
      : "No se pudo abrir el enlace del correo. Inténtalo de nuevo.", "err");
  }
  pestana(params.get("modo") === "registro" ? "registro" : "ingresar");

  let yaRedirigio = false;
  A.onChange((user, evento) => {
    if (evento === "PASSWORD_RECOVERY") recuperando = true;
    // Viene del enlace de confirmación del correo: volver a donde estaba
    if (user && next && A.vieneDeEnlace && !recuperando && !yaRedirigio) {
      yaRedirigio = true;
      location.href = next;
      return;
    }
    pintar(user);
  });

})();
