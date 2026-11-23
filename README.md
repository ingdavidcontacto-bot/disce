# disce · Web estudiantil

Página de cursos de videojuegos 2D y 3D de David A. García G.
Hecha con **HTML, CSS y JavaScript puro** (sin frameworks, no hay que instalar nada).
Los testimonios se guardan en **Supabase** (base de datos gratuita).

## Estructura

```
index.html             → la página principal
curso-2d.html          → página del curso 2D (formulario de testimonio)
cuenta.html            → ingresar / crear cuenta / recuperar contraseña
admin.html             → panel para moderar testimonios (solo administradores)
privacidad.html        → política de tratamiento de datos (Ley 1581 de 2012)
vercel.json            → encabezados de seguridad (CSP, anti-clickjacking, HSTS…)
css/styles.css         → colores y diseño
js/main.js             → lógica de la página principal
js/curso.js            → lógica del curso 2D
js/auth.js             → sesión de usuario (Supabase Auth), en todas las páginas
js/cuenta.js           → lógica de cuenta.html
js/admin.js            → lógica de admin.html
js/privacidad.js       → lógica de privacidad.html
js/tema.js             → tema claro/oscuro antes de pintar (va en el <head>)
data/contenido.js      → AQUÍ editas todo el contenido
supabase/setup.sql     → crea la tabla de testimonios
supabase/admin.sql     → administradores y permisos para moderar
supabase/seguridad.sql → validaciones extra al guardar testimonios
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

## Cuentas con correo (Supabase Auth)

Solo las personas con cuenta en disce pueden enviar testimonios.
Las cuentas se crean en `cuenta.html` con nombre, correo y contraseña.

Configuración en Supabase (una sola vez):
1. **Authentication → Sign In / Providers → Email**: activado, con *Confirm email* activado.
2. **Authentication → URL Configuration**:
   - *Site URL*: `https://disce-two.vercel.app`
   - *Redirect URLs*: `https://disce-two.vercel.app/**` (y `http://127.0.0.1:5500/**` para probar con Live Server)
3. **Authentication → Emails → SMTP Settings**: activa *custom SMTP* (por ejemplo Gmail con
   contraseña de aplicación: host `smtp.gmail.com`, puerto `587`). Sin esto, Supabase solo envía
   correos a los miembros de tu equipo y máximo 2 por hora.
4. **Authentication → Emails → Templates**: traduce al español *Confirm signup* y *Reset password*.
5. Ejecuta en el SQL Editor, **en este orden**: `supabase/setup.sql`, `supabase/admin.sql` y
   `supabase/seguridad.sql`. Si algún día vuelves a ejecutar `setup.sql`, ejecuta otra vez los otros
   dos (el `revoke all` de `setup.sql` borra los permisos del administrador).

Las cuentas creadas se ven en **Authentication → Users**. Cada testimonio guarda el `user_id`
de quien lo escribió (nunca se muestra en la página). Máximo un testimonio por cuenta y por curso.

## Agregar un proyecto o una clase

1. Guarda las imágenes en `assets/img/` (ej. `juan-portada.jpg`). Comprímelas en squoosh.app (máx. ~300 KB).
2. En `data/contenido.js`, copia un bloque de `proyectos` o `bitacora`, pégalo y cambia los datos.
3. Borra los bloques con `ejemplo: true`.

## Publicar en GitHub + Vercel

1. Crea un repositorio en GitHub (ej. `disce`) y sube todos estos archivos.
2. En vercel.com → inicia sesión con GitHub → **Add New → Project** → elige `disce` → **Deploy**.
3. Cada vez que subas cambios a GitHub, Vercel actualiza la página sola.

## Seguridad (léelo antes de cambiar algo)

- **vercel.json** define una *Content-Security-Policy*: la página solo puede cargar scripts propios
  y supabase-js desde jsDelivr, estilos propios y de Google Fonts, conectarse a TU proyecto de
  Supabase y mostrar videos de YouTube, Vimeo o Google Drive.
  - **No pongas `<script>` ni `style="..."` dentro del HTML**: la CSP los bloquea. Usa archivos en `js/` y clases en `css/styles.css`.
  - Si cambias de proyecto de Supabase, cambia la URL también en `connect-src` de `vercel.json`.
  - Si agregas otro servicio (analítica, otro reproductor de video…), hay que agregarlo a la CSP.
- **supabase-js tiene versión fija** (`@2.119`, la última versión 2.119.x) en todas las páginas. Para actualizar, cambia el
  número en los 6 HTML y prueba. Para mayor seguridad agrega SRI (ver `informe-seguridad.md`).
- En `data/contenido.js`, los enlaces deben empezar por `https://` (o ser rutas como `assets/...`);
  los demás se ignoran. Los videos solo pueden ser de YouTube, Vimeo o Google Drive.
- La clave `anonKey` es pública; **nunca** pongas la `service_role` en la página ni en GitHub.
