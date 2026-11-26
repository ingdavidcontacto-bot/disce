# disce · guía para cualquier asistente (Cursor, Codex, Claude Code)

**Antes de cambiar algo, lee [CLAUDE.md](CLAUDE.md).** Allí están las reglas del proyecto
(idioma, diseño, CSP, accesibilidad y publicación) y valen igual para todos los asistentes.
No las copies aquí: se editan en un solo lugar.

## Cómo trabajar en equipo sin pisarse
- **Un solo asistente edita a la vez.** Antes de empezar, `git status` debe estar limpio
  y hay que traer lo último con `git pull --rebase`.
- Si hay cambios sin guardar que no hiciste tú, no los borres ni los reviertas: pregunta a David.
- Al terminar una tarea, haz un commit pequeño y claro en español, para que el siguiente la vea.
- Publicar (`git push` a `main`) despliega el sitio de inmediato.
- Para repartir trabajo en paralelo, cada asistente usa su propia rama y se unen al final.

## Estado actual
- El asistente de IA de la página (`js/asistente.js`) ya está publicado, pero falta desplegar la
  función `supabase/functions/asistente` en Supabase con el secreto `GROQ_API_KEY`.
- Las claves y contraseñas las escribe David; nunca van en el código.
