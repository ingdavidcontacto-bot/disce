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
    // Enlace del CANAL de WhatsApp de disce (lista de espera y anuncios).
    // Cuando lo tengas, pégalo aquí, ej: "https://whatsapp.com/channel/XXXXXXXX".
    // Mientras esté vacío, "Lista de espera" abre tu chat con un mensaje listo.
    // El botón flotante de WhatsApp también lleva al canal.
    canal: "https://whatsapp.com/channel/0029VbEWshW4NVisSrwOcd1M",
    email: "disce.academia@gmail.com",
    // Redes sociales: pega el enlace completo del perfil (https://...).
    // Mientras esté vacío, la tarjeta sale como "Muy pronto".
    instagram: "https://www.instagram.com/disce.academy/",
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

  /* ---------- Página del curso 2D (curso-2d.html) ----------
     video: pega aquí el enlace del video introductorio (YouTube, por ejemplo
     "https://www.youtube.com/watch?v=XXXX" o "https://youtu.be/XXXX").
     Si lo dejas vacío, se muestra el aviso "muy pronto". */

  /* ---------- Carrusel de la portada ----------
     "escena": ilustración con piezas que se pueden agarrar: "nivel", "modelos",
               "pixel" o "control" (se crean con los scripts de herramientas/).
     "alt": descripción de la ilustración.
     "logo": logo pequeño junto al subtítulo.
     "imagen": si la pones, la foto ocupa toda la diapositiva. */
  carrusel: [
    { escena: "nivel",   alt: "Nivel de videojuego en 3D con un personaje, monedas y una meta", logo: "assets/img/Unity-logo.png",  kicker: "Motor de juegos",  titulo: "Unity",             texto: "Aquí construyes los juegos del curso: escenas, físicas, animaciones y más." },
    { escena: "modelos", alt: "Figuras 3D modeladas en Blender sobre una base iluminada",       logo: "assets/img/blender_logo.png", kicker: "Modelado 3D",      titulo: "Blender",           texto: "Para modelar personajes y objetos cuando des el salto al 3D." },
    { escena: "pixel",   alt: "Escena de plataformas en pixel art",                             pixelado: true,                    kicker: "Arte para juegos", titulo: "Pixel art",         texto: "Personajes, escenarios y objetos dibujados píxel a píxel." },
    { escena: "control", alt: "Control de videojuegos en 3D",                                                                      kicker: "Hecho en clase",   titulo: "Juegos de alumnos", texto: "Muy pronto: capturas de los juegos creados por los estudiantes." }
  ],

  /* ---------- Cursos: video introductorio y ruta de niveles ----------
     video: enlace de YouTube, Vimeo o Google Drive (vacío = "muy pronto").
     Cada nivel: titulo, aprendes (lista corta) y construyes (lo que queda en tu juego).
     progresoClase: en qué nivel va el grupo actual del curso 2D (0 = no mostrar barra) */
  progresoClase: 0,

  curso2d: {
    video: "",
    niveles: [
      { duracion: "2 sesiones", titulo: "Escenas y organización del proyecto",
        aprendes: ["Crear un proyecto 2D y moverte por la interfaz de Unity", "Organizar carpetas, escenas y prefabs", "Cambiar de escena con un botón o al llegar a una meta"],
        construyes: "La estructura de tu juego: menú, primer nivel y pantalla final." },
      { duracion: "1 sesión", titulo: "Sonido y música",
        aprendes: ["Poner música de fondo con Audio Source", "Efectos de sonido en los botones y en eventos sencillos", "Un gestor de sonido listo para las acciones de los siguientes niveles"],
        construyes: "Tu menú con música y efectos, y un gestor de sonido que usarás al saltar, recoger o chocar." },
      { duracion: "2 sesiones", titulo: "Interfaz de usuario (UI)",
        aprendes: ["Canvas, textos, imágenes y botones", "Marcador de puntos, vidas o tiempo", "Menú de inicio y menú de pausa"],
        construyes: "El menú y el marcador de tu juego." },
      { duracion: "2 sesiones", titulo: "Tilemaps: construir niveles",
        aprendes: ["Cortar un tileset con el Sprite Editor", "Pintar el escenario con la Tile Palette", "Separar fondo, suelo y decoración en capas"],
        construyes: "El primer nivel de tu juego, pintado con tiles." },
      { duracion: "3 sesiones", titulo: "Físicas y colisiones",
        aprendes: ["Rigidbody 2D y colliders", "Mover al personaje y hacerlo saltar", "Detectar choques y zonas: recoger objetos, llegar a la meta o caer en un peligro"],
        construyes: "Un personaje que se mueve, salta e interactúa con el mundo." },
      { duracion: "2 sesiones", titulo: "Animaciones con Animator",
        aprendes: ["Animar sprites cuadro a cuadro", "Estados y transiciones: quieto, caminar y saltar", "Cambiar de animación desde el código"],
        construyes: "Tu personaje con animaciones de quieto, caminar y saltar." },
      { duracion: "2 sesiones", titulo: "IA sencilla: enemigos que patrullan",
        aprendes: ["Hacer que un enemigo patrulle entre dos puntos", "Detectar al jugador y reaccionar", "Daño, vidas y reinicio del nivel"],
        construyes: "Un enemigo que patrulla (o un obstáculo, si tu juego es de puzles) para darle reto a tu juego." }
    ]
  },

  curso3d: {
    video: "",
    niveles: [
      { duracion: "2 sesiones", titulo: "Primeros pasos en 3D",
        aprendes: ["Moverte por una escena 3D: mover, rotar y escalar", "Cámara, luces y cielo (skybox)", "Objetos básicos y prefabs"],
        construyes: "Tu primera escena 3D iluminada." },
      { duracion: "4 sesiones", titulo: "Modelado básico en Blender",
        aprendes: ["La interfaz de Blender y sus atajos esenciales", "Modelar objetos low poly a partir de formas simples", "Ordenar y nombrar tus modelos"],
        construyes: "Los objetos de tu escenario, modelados por ti." },
      { duracion: "2 sesiones", titulo: "Materiales y paso a Unity",
        aprendes: ["Materiales y colores en Blender", "Exportar en FBX con la escala correcta", "Importar los modelos y ajustar sus materiales en Unity"],
        construyes: "Tus modelos de Blender funcionando dentro de Unity." },
      { duracion: "3 sesiones", titulo: "Físicas y colisiones en 3D",
        aprendes: ["Rigidbody y colliders 3D", "Zonas para recoger objetos o llegar a la meta", "Gravedad, fuerzas y rebotes"],
        construyes: "Un escenario que reacciona: cosas que caen, chocan y se recogen." },
      { duracion: "3 sesiones", titulo: "Personaje y cámara en tercera persona",
        aprendes: ["Mover un personaje con Character Controller", "Una cámara que lo sigue en tercera persona", "Saltar y moverse con teclado o control"],
        construyes: "Un personaje que puedes manejar por tu escenario." },
      { duracion: "3 sesiones", titulo: "Animaciones 3D",
        aprendes: ["Importar personajes y animaciones (por ejemplo, desde Mixamo)", "Animator 3D: caminar, correr y saltar", "Mezclar animaciones con Blend Trees"],
        construyes: "Tu personaje animado en 3D." },
      { duracion: "3 sesiones", titulo: "Proyecto final: tu juego 3D",
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

  /* ---------- "Pregúntame": respuestas preparadas ----------
     "detonantes": palabras que activan la respuesta (sin importar tildes o mayúsculas).
                   Basta el comienzo: "busc" sirve para buscar y búsqueda.
     "enlace": "whatsapp", "canal", una página ("curso-2d.html") o una sección ("#ruta"). */
  respuestas: [
    { pregunta: "¿Dónde encuentro los cursos?", detonantes: ["curso", "busc", "busqueda", "encontr", "donde veo", "temario", "programa"],
      respuesta: "En la sección Cursos están Videojuegos 2D con Unity y Videojuegos en 3D con Unity. Entra a cada uno para ver su ruta de niveles.", enlace: "#ruta", enlaceTexto: "Ver cursos" },
    { pregunta: "¿Cuánto cuesta?", detonantes: ["precio", "cuesta", "cuanto cuesta", "valor", "vale", "pagar", "pago", "cuota", "descuento", "plata"],
      respuesta: "Curso 2D: $150.000 COP (3 cuotas de $50.000). Universitarios verificados: $120.000. Curso 3D: costará $220.000 COP (4 cuotas de $55.000) y $180.000 para universitarios verificados.", enlace: "whatsapp", enlaceTexto: "Preguntar por WhatsApp" },
    { pregunta: "¿Cómo me inscribo?", detonantes: ["inscri", "matricul", "entrar", "unirme", "apuntar", "registr", "como me inscribo"],
      respuesta: "La inscripción se acuerda por WhatsApp. Ahora no hay cupos: únete a la lista de espera y te avisamos cuando se abra un grupo.", enlace: "canal", enlaceTexto: "Lista de espera" },
    { pregunta: "¿Hay cupos?", detonantes: ["cupo", "disponib", "cuando empieza", "cuando inicia", "fecha", "proximo grupo", "lista de espera"],
      respuesta: "En este momento no hay cupos. Únete a la lista de espera y te avisamos cuando se abra el próximo grupo.", enlace: "canal", enlaceTexto: "Lista de espera" },
    { pregunta: "¿Necesito saber programar?", detonantes: ["programa", "programar", "saber", "experiencia", "desde cero", "principiante", "nunca he", "dificil"],
      respuesta: "No. El curso empieza desde cero y cada nivel suma una habilidad nueva a tu propio juego." },
    { pregunta: "¿Qué computador necesito?", detonantes: ["computador", "compu", "portatil", "pc", "requisito", "ram", "mac", "windows", "linux", "tablet", "celular"],
      respuesta: "Un computador de escritorio o portátil (no tablet ni Chromebook) con Windows 10/11, macOS 13 o Ubuntu 22.04/24.04, mínimo 8 GB de RAM y mouse. Para el 3D recomendamos 16 GB." },
    { pregunta: "¿Las clases son virtuales?", detonantes: ["virtual", "presencial", "online", "en linea", "internet", "ciudad", "cucuta", "donde son"],
      respuesta: "Sí, el curso Videojuegos 2D con Unity es virtual." },
    { pregunta: "¿Cuánto dura?", detonantes: ["dura", "duracion", "tiempo", "sesion", "semana", "mes", "horario", "hora"],
      respuesta: "Curso 2D: 8 semanas, 16 sesiones de 2 horas, sábados de 9:00 a. m. a 1:00 p. m. Curso 3D: 10 semanas, 20 sesiones, sábados de 2:00 a 6:00 p. m. (hora de Colombia).", enlace: "#ruta", enlaceTexto: "Ver cursos" },
    { pregunta: "¿Hay clase gratis?", detonantes: ["gratis", "prueba", "clase gratis", "sin costo", "muestra", "universitario"],
      respuesta: "Si eres estudiante universitario y lo demuestras con carné o certificado de estudios vigente, tu primera clase es gratis. Escríbenos para agendarla.", enlace: "whatsapp", enlaceTexto: "Agendar por WhatsApp" },
    { pregunta: "¿Entregan certificado?", detonantes: ["certificado del curso", "certificado", "diploma", "constancia"],
      respuesta: "En la página no anunciamos certificado. Si lo necesitas, pregúntanos por WhatsApp antes de inscribirte.", enlace: "whatsapp", enlaceTexto: "Preguntar por WhatsApp" },
    { pregunta: "¿Qué programas se usan?", detonantes: ["unity", "blender", "herramienta", "software", "que programa", "instalar", "motor"],
      respuesta: "Unity 6.3 LTS para los juegos y Blender 5.2 LTS para modelar en 3D. Ambos se pueden usar gratis para aprender." },
    { pregunta: "¿Puedo pedir reembolso?", detonantes: ["reembolso", "devol", "devuelv", "devuelven la plata", "retir", "retract", "cancel", "aplaz", "arrepent"],
      respuesta: "Puedes retractarte en 5 días hábiles si las clases no han empezado. Si te retiras después, pagas solo hasta donde llegaste.", enlace: "terminos.html#reembolsos", enlaceTexto: "Ver las condiciones" },
    { pregunta: "¿Cómo los contacto?", detonantes: ["contact", "whatsapp", "correo", "email", "telefono", "numero", "hablar", "instagram", "redes"],
      respuesta: "Escríbenos por WhatsApp o al correo disce.academia@gmail.com.", enlace: "whatsapp", enlaceTexto: "Escribir por WhatsApp" }
  ],

  /* ---------- Palabras que se despliegan ----------
     "palabras": cómo puede aparecer escrita en la página.
     "titulo" y "texto": lo que se muestra al tocarla.
     "enlace" (opcional): una página de disce, ej: "terminos.html#reembolsos". */
  glosario: [
    { palabras: ["políticas de disce"], titulo: "Políticas de disce", texto: "Cómo cuidamos tus datos y cuáles son las reglas de los cursos, pagos y devoluciones.", enlaces: [["privacidad.html", "Datos personales"], ["terminos.html", "Términos y reembolsos"]] },
    { palabras: ["nivel por nivel"], titulo: "Nivel por nivel", texto: "Cada curso es una ruta: en cada nivel aprendes algo y lo agregas a tu propio juego." },
    { palabras: ["estudiante a estudiante"], titulo: "De estudiante a estudiante", texto: "Quien enseña también está estudiando, así que explica con palabras cercanas lo que aprendió hace poco." },
    { palabras: ["Unity 2D", "Unity"], titulo: "Unity", texto: "El motor de videojuegos del curso: ahí armas escenas, físicas, animaciones y exportas tu juego." },
    { palabras: ["Blender"], titulo: "Blender", texto: "Un programa libre y gratuito para modelar y animar objetos y personajes en 3D." },
    { palabras: ["pixel art"], titulo: "Pixel art", texto: "Dibujo hecho píxel a píxel, el estilo de muchos juegos clásicos e independientes." },
    { palabras: ["evidencias"], titulo: "Evidencias", texto: "Capturas, videos y resultados que muestran lo que se hizo en cada clase." },
    { palabras: ["juego propio"], titulo: "Tu juego propio", texto: "Al final del curso tienes un juego hecho por ti, que puedes mostrar." },
    { palabras: ["ficha técnica"], titulo: "Ficha técnica", texto: "El resumen del curso: modalidad, herramientas, requisitos del computador y precio." },
    { palabras: ["certificado de estudios"], titulo: "Certificado de estudios", texto: "El documento de tu universidad que demuestra que estás estudiando. También sirve el carné vigente." },
    { palabras: ["Tilemaps", "Tilemap"], titulo: "Tilemap", texto: "Una forma de armar niveles 2D pintando piezas pequeñas sobre una cuadrícula, como un mosaico." },
    { palabras: ["Animator"], titulo: "Animator", texto: "La herramienta de Unity que decide qué animación se ve en cada momento: quieto, caminando o saltando." },
    { palabras: ["Rigidbody 2D", "Rigidbody"], titulo: "Rigidbody", texto: "El componente que hace que un objeto obedezca la física: gravedad, empujes y choques." },
    { palabras: ["colliders", "collider"], titulo: "Collider", texto: "La forma invisible que usa Unity para saber cuándo dos objetos se tocan." },
    { palabras: ["prefabs", "prefab"], titulo: "Prefab", texto: "Un objeto guardado como molde para usarlo muchas veces. Si cambias el molde, cambian las copias." },
    { palabras: ["Sprite Editor"], titulo: "Sprite Editor", texto: "El editor de Unity para recortar una imagen en piezas que puedes usar en tu juego." },
    { palabras: ["low poly"], titulo: "Low poly", texto: "Modelos 3D con pocas caras. Se ven con un estilo facetado y son ligeros para el computador." },
    { palabras: ["FBX"], titulo: "FBX", texto: "Un formato de archivo para llevar modelos y animaciones 3D de Blender a Unity." },
    { palabras: ["Blend Trees"], titulo: "Blend Tree", texto: "Una forma de mezclar animaciones suavemente, por ejemplo entre caminar y correr." },
    { palabras: ["universitarios verificados", "estudiante universitario"], titulo: "Universitario verificado", texto: "Estudiante que lo demuestra con su carné o certificado de estudios vigente." },
    { palabras: ["derecho de retracto", "retractarte"], titulo: "Derecho de retracto", texto: "Puedes arrepentirte de la inscripción en los primeros 5 días hábiles, si las clases no han empezado.", enlace: "terminos.html#reembolsos", enlaceTexto: "Ver reembolsos" },
    { palabras: ["lista de espera"], titulo: "Lista de espera", texto: "El canal de WhatsApp de disce donde avisamos cuando se abra un nuevo grupo." }
  ],

  /* ---------- Preguntas frecuentes ---------- */
  faq: [
    { p: "¿Necesito saber programar?", r: "No. El curso empieza desde cero y cada nivel suma una habilidad nueva a tu propio juego." },
    { p: "¿El curso es presencial o virtual?", r: "El curso Videojuegos 2D con Unity es virtual." },
    { p: "¿Cuánto cuesta?", r: "El curso Videojuegos 2D con Unity completo (7 niveles) cuesta $150.000 COP y puedes pagarlo en 3 cuotas de $50.000. Si eres estudiante universitario y lo demuestras con tu carné o certificado de estudios vigente, pagas $120.000. El curso Videojuegos en 3D con Unity costará $220.000 COP (o 4 cuotas de $55.000) y $180.000 para universitarios verificados." },
    { p: "¿Hay cupos disponibles?", r: "En este momento no hay cupos. Únete a la lista de espera en WhatsApp y te avisamos cuando se abra el próximo grupo." },
    { p: "¿Qué computador necesito?", r: "Un computador de escritorio o portátil (no tablet ni Chromebook) con Windows 10/11, macOS 13 o Ubuntu 22.04/24.04, al menos 8 GB de RAM y mouse. Para el curso 3D recomendamos 16 GB de RAM porque usamos Unity y Blender. Trabajamos con Unity 6.3 LTS y Blender 5.2 LTS, ambos gratis." },
    { p: "¿Cómo funcionan las clases gratis?", r: "Muy pronto publicaremos videos cortos y sin costo en nuestras redes para que conozcas cómo enseñamos. Además, si eres estudiante universitario y lo demuestras con tu carné o certificado de estudios vigente, tu primera clase es gratis: escríbenos por WhatsApp para agendarla." }
  ]
};
