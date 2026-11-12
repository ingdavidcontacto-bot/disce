/* =========================================================
   disce · CONTENIDO DE LA PÁGINA
   ---------------------------------------------------------
   Este es el archivo que editas para cambiar el contenido.
   Para agregar algo: copia un bloque { ... }, pégalo debajo,
   cambia los datos y guarda.

   Imágenes  → carpeta assets/img/   (ej. "assets/img/juego1.jpg")
   Documentos → carpeta assets/docs/ (ej. "assets/docs/asistencia.pdf")
   Usa nombres sin espacios ni tildes.

   Los bloques con  ejemplo: true  son de muestra: bórralos
   cuando subas contenido real.
   ========================================================= */

window.DISCE = {

  /* ---------- Contacto y redes ---------- */
  contacto: {
    whatsapp: "573123771399",  // Solo números con código de país, ej: "573001234567"
    email: "",     // ej: "tucorreo@gmail.com"
    tiktok: ""     // ej: "https://www.tiktok.com/@disce"
  },

  /* ---------- Base de datos de testimonios (Supabase) ----------
     Pega aquí los datos de tu proyecto de Supabase
     (Project Settings → API). Ver README.md, paso a paso. */
  supabase: {
    url: "https://nwhupyzdmgglagyibsjb.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aHVweXpkbWdnbGFneWlic2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzNjg2NjcsImV4cCI6MjEwOTk0NDY2N30.VQFU9sgV7Sl6SAi2xeySpWRjo1e3cCzoxEK_VTlK1oA"  // clave "anon public" (pública)
  },

  /* ---------- Foto de la portada ----------
     Persona señalando hacia la derecha (hacia el título), SIN fondo (PNG). */
  fotoPortada: "",  // ej: "assets/img/portada-senalando.png"

  /* ---------- Foto del profe ---------- */
  fotoProfe: "",  // ej: "assets/img/david.jpg"

  /* ---------- Carrusel de la portada ----------
     "imagen": foto que ocupa toda la diapositiva.
     "logo":   logo que se muestra al lado del texto (en vez del ícono). */
  /* ---------- Página del curso 2D (curso-2d.html) ----------
     video: pega aquí el enlace del video introductorio (YouTube, por ejemplo
     "https://www.youtube.com/watch?v=XXXX" o "https://youtu.be/XXXX").
     Si lo dejas vacío, se muestra el aviso "muy pronto". */
  curso2d: { video: "" },

  carrusel: [
    { imagen: "", logo: "assets/img/Unity-logo.png",   captura: "assets/img/unity.jpg",   icono: "cubo",   color: "menta",   kicker: "Motor de juegos", titulo: "Unity",            texto: "Donde se construyen los juegos 2D del curso: escenas, físicas, animaciones y más." },
    { imagen: "", logo: "assets/img/blender_logo.png", captura: "assets/img/blender.jpg", icono: "esfera", color: "durazno", kicker: "Modelado 3D",     titulo: "Blender",          texto: "Para crear personajes y objetos en 3D cuando demos el salto al siguiente nivel." },
    { imagen: "", icono: "pixel",  color: "celeste", kicker: "Arte para juegos", titulo: "Pixel art",       texto: "Personajes, escenarios y objetos dibujados píxel a píxel." },
    { imagen: "", icono: "mando",  color: "lavanda", kicker: "Hecho en clase",  titulo: "Juegos de alumnos", texto: "Muy pronto: capturas reales de los juegos creados por los estudiantes." }
  ],

  /* ---------- Ruta de niveles del curso 2D ----------
     progresoClase: en qué nivel va el grupo actual (0 = no mostrar barra) */
  progresoClase: 0,
  niveles: [
    "Escenas y organización del proyecto",
    "Sonido y música",
    "Interfaz de usuario (UI)",
    "Tilemaps: construir niveles",
    "Físicas y colisiones",
    "Animaciones con Animator",
    "IA sencilla: enemigos que patrullan"
  ],

  /* ---------- Clases gratis (TikTok) ----------
     Cuando publiques un video, pega su link en "url". */
  clasesGratis: [
    { titulo: "Introducción básica al Unity 2D",  descripcion: "Conoce la interfaz, crea tu primer proyecto y arma tu primera escena.",        url: "" },
    { titulo: "Creación de Sprites en 2D y 3D",   descripcion: "Diseña tus propios sprites y aprende a llevarlos a tus juegos en 2D y 3D.", url: "" },
    { titulo: "Bienvenida al mundo 3D",           descripcion: "Tus primeros pasos en 3D: objetos, cámara y luz en una escena sencilla.",    url: "" }
  ],

  /* ---------- Proyectos de alumnos ---------- */
  proyectos: [
    {
      ejemplo: true,                       // ← bórralo en proyectos reales
      titulo: "Nombre del juego",
      alumno: "Nombre del alumno",
      genero: "Puzle",
      temas: ["Tilemaps", "UI", "Sonido"],
      descripcion: "Una o dos frases sobre de qué trata el juego y cómo se juega.",
      aprendizaje: "Lo que el alumno cuenta que aprendió, en sus propias palabras.",
      imagen: "",       // Portada:       "assets/img/juego1-portada.jpg"
      antes: "",        // Primer avance: "assets/img/juego1-antes.jpg"
      despues: "",      // Resultado:     "assets/img/juego1-final.jpg"
      video: "",        // YouTube: "https://www.youtube.com/embed/CODIGO"
      jugar: ""         // Link para jugarlo (itch.io, etc.)
    },
    {
      ejemplo: true,
      titulo: "Nombre del juego",
      alumno: "Nombre del alumno",
      genero: "Exploración",
      temas: ["Físicas y colisiones", "Animator"],
      descripcion: "Una o dos frases sobre de qué trata el juego y cómo se juega.",
      aprendizaje: "Lo que el alumno cuenta que aprendió, en sus propias palabras.",
      imagen: "", antes: "", despues: "", video: "", jugar: ""
    }
  ],

  /* ---------- Bitácora de clases ---------- */
  bitacora: [
    {
      ejemplo: true,
      fecha: "AAAA-MM-DD",
      titulo: "Tema de la clase",
      descripcion: "Qué se trabajó en la sesión y qué lograron los alumnos.",
      fotos: [],        // ["assets/img/clase1-a.jpg"]
      constancias: []   // [{ nombre: "Asistencia clase 1", url: "assets/docs/asistencia-1.pdf" }]
    }
  ],

  /* ---------- Preguntas frecuentes ---------- */
  faq: [
    { p: "¿Necesito saber programar?", r: "No. El curso empieza desde lo básico y cada nivel suma una habilidad nueva sobre tu propio juego." },
    { p: "¿El curso es presencial o virtual?", r: "El curso de Videojuegos 2D con Unity es virtual." },
    { p: "¿Hay cupos disponibles?", r: "En este momento no hay cupos. Escríbenos y te avisamos cuando se abra el próximo grupo." },
    { p: "¿Qué computador necesito?", r: "Uno que pueda ejecutar Unity. Puedes revisar los requisitos mínimos en la página oficial de Unity." },
    { p: "¿Las clases gratis tienen algún costo?", r: "No. Son videos cortos que publicamos en TikTok para que pruebes cómo enseñamos." }
  ]
};
