# disce · Web estudiantil

Página de cursos de videojuegos 2D y 3D de David A. García G.
Hecha con **HTML, CSS y JavaScript puro** (sin frameworks, no hay que instalar nada).
Los testimonios se guardan en **Supabase** (base de datos gratuita).

## Estructura

```
index.html             → la página
css/styles.css         → colores y diseño
js/main.js             → lógica (no hace falta tocarlo)
data/contenido.js      → AQUÍ editas todo el contenido
supabase/setup.sql     → crea la tabla de testimonios
assets/favicon.svg     → ícono de la pestaña
assets/img/            → fotos y capturas (créala)
assets/docs/           → constancias en PDF (créala)
```

## Editar en Visual Studio Code

1. Abre VS Code → **Archivo → Abrir carpeta** → elige la carpeta `disce`.
2. Instala la extensión **Live Server** y haz clic derecho en `index.html` → *Open with Live Server*.
   Así ves los cambios al instante en el navegador.
3. Todo el contenido se cambia en `data/contenido.js`.

## Activar los testimonios (Supabase) — 10 minutos

1. Crea una cuenta gratis en supabase.com → **New project** (región: South America - São Paulo).
2. Ve a **SQL Editor**, pega todo `supabase/setup.sql` y pulsa **Run**.
3. Ve a **Project Settings → API** y copia:
   - *Project URL* → pégalo en `supabase.url` de `data/contenido.js`
   - *anon public key* → pégalo en `supabase.anonKey`
   (La clave *anon* es pública y segura de poner en la página. **Nunca** pongas la *service_role*.)
4. Listo: el formulario ya guarda testimonios.

### Aprobar testimonios
Los testimonios llegan **sin publicar** para evitar spam y mensajes falsos.
En Supabase → **Table Editor → testimonios**, cambia `aprobado` a `true` en los que sean de tus alumnos.
Aparecen en la página al recargarla.

## Agregar un proyecto o una clase

1. Guarda las imágenes en `assets/img/` (ej. `juan-portada.jpg`). Comprímelas en squoosh.app (máx. ~300 KB).
2. En `data/contenido.js`, copia un bloque de `proyectos` o `bitacora`, pégalo y cambia los datos.
3. Borra los bloques con `ejemplo: true`.

## Publicar en GitHub + Vercel

1. Crea un repositorio en GitHub (ej. `disce`) y sube todos estos archivos.
2. En vercel.com → inicia sesión con GitHub → **Add New → Project** → elige `disce` → **Deploy**.
3. Cada vez que subas cambios a GitHub, Vercel actualiza la página sola.
