/* Tema antes de pintar, para evitar parpadeo.
   Antes estaba en línea dentro del <head>; se movió a este archivo para que
   la Content-Security-Policy (vercel.json) no necesite 'unsafe-inline'.
   Se carga sin defer/async a propósito: debe correr antes de pintar. */
try{var t=localStorage.getItem("disce-tema");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}
