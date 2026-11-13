/* =========================================================
   disce · cuentas de usuario (Supabase Auth)
   Se carga en todas las páginas, después de data/contenido.js
   y de la librería supabase-js. Expone window.disceAuth.
   ========================================================= */

(function () {
  const D = window.DISCE || {};
  const sb = D.supabase || {};
  const lib = window.supabase;

  // Leer el enlace del correo ANTES de que Supabase limpie la URL
  const hash = new URLSearchParams(String(location.hash || "").replace(/^#/, ""));
  const query = new URLSearchParams(location.search);
  const esRecuperacion = hash.get("type") === "recovery";
  const vieneDeEnlace = hash.has("access_token");
  const errorEnlace = hash.get("error_code") || query.get("error_code") || "";

  const client = lib && sb.url && sb.anonKey
    ? lib.createClient(sb.url, sb.anonKey, {
        auth: { flowType: "implicit", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      })
    : null;

  let user = null;
  let listo = false;
  const oyentes = [];

  const nombreDe = (u) => {
    if (!u) return "";
    const n = String((u.user_metadata && u.user_metadata.nombre) || "").trim();
    return n || String(u.email || "").split("@")[0];
  };

  function pintarHeader() {
    document.querySelectorAll("[data-auth-link]").forEach((a) => {
      if (user) {
        a.textContent = "Mi cuenta";
        a.title = user.email || "";
      } else {
        a.textContent = "Ingresar";
        a.removeAttribute("title");
      }
      a.href = "cuenta.html";
    });
  }

  function avisar(evento) {
    pintarHeader();
    oyentes.forEach((fn) => { try { fn(user, evento); } catch (e) { console.error(e); } });
  }

  if (client) {
    client.auth.onAuthStateChange((evento, session) => {
      user = (session && session.user) || null;
      listo = true;
      // Fuera del callback, como recomienda Supabase
      setTimeout(() => avisar(evento), 0);
    });
  } else {
    listo = true;
    setTimeout(() => avisar("SIN_CONEXION"), 0);
  }

  // Mensajes de error en español
  function traducir(err) {
    const code = (err && err.code) || "";
    const msg = String((err && err.message) || "").toLowerCase();
    const status = err && err.status;
    if (code === "invalid_credentials" || msg.includes("invalid login")) return "Correo o contraseña incorrectos.";
    if (code === "email_not_confirmed" || msg.includes("not confirmed")) return "Aún no confirmas tu correo. Abre el enlace que te enviamos (revisa también spam).";
    if (code === "user_already_exists" || msg.includes("already registered")) return "Ya existe una cuenta con ese correo. Ingresa o recupera tu contraseña.";
    if (code === "weak_password" || msg.includes("password should")) return "La contraseña es muy débil. Usa al menos 8 caracteres.";
    if (code === "same_password") return "La nueva contraseña debe ser distinta a la anterior.";
    if (code === "email_address_invalid" || msg.includes("invalid format") || msg.includes("unable to validate email")) return "Ese correo no es válido.";
    if (code === "email_address_not_authorized") return "Por ahora no podemos enviar correos a esa dirección. Escríbenos por WhatsApp.";
    if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit" || status === 429 || msg.includes("rate limit")) return "Se hicieron demasiados intentos. Espera unos minutos y vuelve a intentarlo.";
    if (msg.includes("security purposes")) return "Por seguridad, espera un minuto antes de pedir otro correo.";
    if (code === "signup_disabled") return "El registro está cerrado por el momento.";
    if (msg.includes("failed to fetch") || msg.includes("network")) return "No hay conexión. Revisa tu internet e inténtalo de nuevo.";
    return "Algo salió mal. Inténtalo de nuevo en un momento.";
  }

  window.disceAuth = {
    client,
    disponible: Boolean(client),
    esRecuperacion,
    vieneDeEnlace,
    errorEnlace,
    get user() { return user; },
    nombre: () => nombreDe(user),
    onChange(fn) { oyentes.push(fn); if (listo) fn(user, "INITIAL_SESSION"); },
    async salir() { if (client) await client.auth.signOut(); },
    traducir
  };

  pintarHeader();
})();
