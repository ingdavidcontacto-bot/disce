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
    // Enlace de invitación a la comunidad/grupo de WhatsApp de disce (lista de espera).
    // Cuando lo tengas, pégalo aquí, ej: "https://chat.whatsapp.com/XXXXXXXX".
    // Mientras esté vacío, los botones abren tu chat con un mensaje listo.
    comunidad: "",
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
  fotoPortada: "assets/img/portada-senalando.webp",

  /* ---------- Foto del profe ---------- */
  fotoProfe: "assets/img/profe-david.webp",

  /* ---------- Carrusel de la portada ----------
     "imagen": foto que ocupa toda la diapositiva.
     "logo":   logo que se muestra al lado del texto (en vez del ícono). */
  /* ---------- Página del curso 2D (curso-2d.html) ----------
     video: pega aquí el enlace del video introductorio (YouTube, por ejemplo
     "https://www.youtube.com/watch?v=XXXX" o "https://youtu.be/XXXX").
     Si lo dejas vacío, se muestra el aviso "muy pronto". */

  carrusel: [
    { imagen: "", logo: "assets/img/Unity-logo.png",   captura: "assets/img/unity-escena.webp",   icono: "cubo",   color: "menta",   kicker: "Motor de juegos", titulo: "Unity",            texto: "Aquí construyes los juegos del curso: escenas, físicas, animaciones y más." },
    { imagen: "", logo: "assets/img/blender_logo.png", captura: "assets/img/blender-disce.webp", icono: "esfera", color: "durazno", kicker: "Modelado 3D",     titulo: "Blender",          texto: "Para modelar personajes y objetos cuando des el salto al 3D." },
    { imagen: "", captura: "assets/img/pixel-disce.webp", icono: "pixel",  color: "celeste", kicker: "Arte para juegos", titulo: "Pixel art",       texto: "Personajes, escenarios y objetos dibujados píxel a píxel." },
    { imagen: "", icono: "mando",  color: "lavanda", kicker: "Hecho en clase",  titulo: "Juegos de alumnos", texto: "Muy pronto: capturas de los juegos creados por los estudiantes." }
  ],

  /* ---------- Cursos: video introductorio y ruta de niveles ----------
     video: enlace de YouTube, Vimeo o Google Drive (vacío = "muy pronto").
     Cada nivel: titulo, aprendes (lista corta) y construyes (lo que queda en tu juego).
     progresoClase: en qué nivel va el grupo actual del curso 2D (0 = no mostrar barra) */
  progresoClase: 0,

  curso2d: {
    video: "",
    niveles: [
      { titulo: "Escenas y organización del proyecto",
        aprendes: ["Crear un proyecto 2D y moverte por la interfaz de Unity", "Organizar carpetas, escenas y prefabs", "Cambiar de escena con un botón o al llegar a una meta"],
        construyes: "La estructura de tu juego: menú, primer nivel y pantalla final." },
      { titulo: "Sonido y música",
        aprendes: ["Poner música de fondo con Audio Source", "Agregar efectos al saltar, recoger objetos o chocar", "Controlar el volumen de la música y los efectos"],
        construyes: "Tu juego con música y efectos en las acciones principales." },
      { titulo: "Interfaz de usuario (UI)",
        aprendes: ["Canvas, textos, imágenes y botones", "Marcador de puntos, vidas o tiempo", "Menú de inicio y menú de pausa"],
        construyes: "El menú y el marcador de tu juego." },
      { titulo: "Tilemaps: construir niveles",
        aprendes: ["Cortar un tileset con el Sprite Editor", "Pintar el escenario con la Tile Palette", "Separar fondo, suelo y decoración en capas"],
        construyes: "El primer nivel de tu juego, pintado con tiles." },
      { titulo: "Físicas y colisiones",
        aprendes: ["Rigidbody 2D y colliders", "Mover al personaje y hacerlo saltar", "Detectar choques y zonas: recoger objetos, llegar a la meta o caer en un peligro"],
        construyes: "Un personaje que se mueve, salta e interactúa con el mundo." },
      { titulo: "Animaciones con Animator",
        aprendes: ["Animar sprites cuadro a cuadro", "Estados y transiciones: quieto, caminar y saltar", "Cambiar de animación desde el código"],
        construyes: "Tu personaje con animaciones de quieto, caminar y saltar." },
      { titulo: "IA sencilla: enemigos que patrullan",
        aprendes: ["Hacer que un enemigo patrulle entre dos puntos", "Detectar al jugador y reaccionar", "Daño, vidas y reinicio del nivel"],
        construyes: "Un enemigo que patrulla (o un obstáculo, si tu juego es de puzles) para darle reto a tu juego." }
    ]
  },

  curso3d: {
    video: "",
    niveles: [
      { titulo: "Primeros pasos en 3D",
        aprendes: ["Moverte por una escena 3D: mover, rotar y escalar", "Cámara, luces y cielo (skybox)", "Objetos básicos y prefabs"],
        construyes: "Tu primera escena 3D iluminada." },
      { titulo: "Modelado básico en Blender",
        aprendes: ["La interfaz de Blender y sus atajos esenciales", "Modelar objetos low poly a partir de formas simples", "Ordenar y nombrar tus modelos"],
        construyes: "Los objetos de tu escenario, modelados por ti." },
      { titulo: "Materiales y paso a Unity",
        aprendes: ["Materiales y colores en Blender", "Exportar en FBX con la escala correcta", "Importar los modelos y ajustar sus materiales en Unity"],
        construyes: "Tus modelos de Blender funcionando dentro de Unity." },
      { titulo: "Físicas y colisiones en 3D",
        aprendes: ["Rigidbody y colliders 3D", "Zonas para recoger objetos o llegar a la meta", "Gravedad, fuerzas y rebotes"],
        construyes: "Un escenario que reacciona: cosas que caen, chocan y se recogen." },
      { titulo: "Personaje y cámara en tercera persona",
        aprendes: ["Mover un personaje con Character Controller", "Una cámara que lo sigue en tercera persona", "Saltar y moverse con teclado o control"],
        construyes: "Un personaje que puedes manejar por tu escenario." },
      { titulo: "Animaciones 3D",
        aprendes: ["Importar personajes y animaciones (por ejemplo, desde Mixamo)", "Animator 3D: caminar, correr y saltar", "Mezclar animaciones con Blend Trees"],
        construyes: "Tu personaje animado en 3D." },
      { titulo: "Proyecto final: tu juego 3D",
        aprendes: ["Unir escenario, personaje, sonido e interfaz", "Probar, corregir errores y pulir detalles", "Exportar tu juego para compartirlo"],
        construyes: "Tu primer juego 3D jugable." }
    ]
  },

  /* ---------- Clases gratis (TikTok) ----------
     Cuando publiques un video, pega su link en "url". */
  clasesGratis: [
    { titulo: "Introducción a Unity 2D",  descripcion: "Conoce la interfaz, crea tu primer proyecto y arma tu primera escena.",        url: "" },
    { titulo: "Creación de sprites",   descripcion: "Diseña tus propios sprites y aprende a llevarlos a tus juegos.", url: "" },
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
      descripcion: "Una o dos frases sobre qué trata el juego y cómo se juega.",
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
      descripcion: "Una o dos frases sobre qué trata el juego y cómo se juega.",
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
    { p: "¿Necesito saber programar?", r: "No. El curso empieza desde cero y cada nivel suma una habilidad nueva a tu propio juego." },
    { p: "¿El curso es presencial o virtual?", r: "El curso Videojuegos 2D con Unity es virtual." },
    { p: "¿Cuánto cuesta?", r: "El curso Videojuegos 2D con Unity completo (7 niveles) cuesta $150.000 COP y puedes pagarlo en 3 cuotas de $50.000. Si eres estudiante universitario y lo demuestras con tu carné o certificado de estudios vigente, pagas $120.000." },
    { p: "¿Hay cupos disponibles?", r: "En este momento no hay cupos. Únete a la lista de espera en WhatsApp y te avisamos cuando se abra el próximo grupo." },
    { p: "¿Qué computador necesito?", r: "Uno que pueda ejecutar Unity. Revisa los requisitos mínimos en la página oficial de Unity." },
    { p: "¿Cómo funcionan las clases gratis?", r: "Muy pronto publicaremos videos cortos y sin costo en nuestras redes para que conozcas cómo enseñamos. Además, si eres estudiante universitario y lo demuestras con tu carné o certificado de estudios vigente, tu primera clase es gratis: escríbenos por WhatsApp para agendarla." }
  ]
};
