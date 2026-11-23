# disce · instrucciones para Claude Code

disce es la academia de videojuegos de David A. García G. (Cúcuta): cursos de
videojuegos 2D con Unity y 3D con Blender + Unity, para universitarios de 18 a 21 años.
Sitio publicado en https://disce-two.vercel.app (repo `ingdavidcontacto-bot/disce`).

## Cómo trabajar con David
- Habla siempre en español, claro y sin tecnicismos innecesarios.
- No le pidas permiso para cada cambio: trabaja directo y al final resume qué cambió.
- Nunca escribas contraseñas, claves de aplicación ni códigos de verificación: eso lo hace él.
- No toques el logo (cubo lima + wordmark con píxel en la "i") hasta que David mande el final.
- No le gustan los bloques rosados ni los recuadros con bordes gruesos.
- Textos amigables y elegantes a la vez, como un sitio serio. No prometer cupos, fechas,
  certificados ni alianzas con universidades.

## Tecnología
- HTML, CSS y JavaScript puro. Sin frameworks, sin build, sin Tailwind.
- Todo el contenido editable vive en `data/contenido.js` (contacto, redes, cursos, FAQ, precios).
- Supabase (proyecto `nwhupyzdmgglagyibsjb`) para cuentas y testimonios, con RLS.
  Los scripts SQL están en `supabase/` y se ejecutan a mano en el panel de Supabase.
- Publicar = `git commit` + `git push` a `main`; Vercel despliega solo en ~45 s.

## Reglas que no se rompen
- **CSP estricta** en `vercel.json`: nada de `<script>` ni `style=""` en línea ni `onclick=`.
  Todo JS va en archivos de `js/`. Si agregas un servicio externo, actualiza la CSP.
- Los textos que vengan de usuarios o de `contenido.js` se insertan escapados (`esc()`),
  y los enlaces pasan por `urlSegura()`.
- Contraseñas: mínimo 10 caracteres con letras y números (igual que en Supabase).
- Modo oscuro: `html[data-theme="dark"]`. Todo componente nuevo debe verse bien en claro y oscuro.
- Diseño responsive: revisar a 390 px (celular) y 1280 px (escritorio).
- Imágenes en WebP, con `width`/`height` y `loading="lazy"` cuando no estén arriba del todo.

## Diseño
- Paleta: #F2E6EE, #FFCCF2, #977DFF, #0033FF, #0600AB, #00033D (variables en `css/styles.css`).
  El lima #C6F432 es solo del logo.
- Fuente: Space Grotesk. Estilo medio futurista con brillos azules y tarjetas tipo vidrio.
- Si usas la skill ui-ux-pro-max o taste-skill, adapta sus resultados a CSS normal y a esta paleta.

## Subagentes
- `revisor-ui` (en `.claude/agents/`): revisa diseño, celular, modo oscuro y accesibilidad
  después de cada cambio visual. Úsalo antes de hacer push de cambios de diseño.
