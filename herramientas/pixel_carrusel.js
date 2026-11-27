// disce · escena 2D en pixel art del carrusel
// Uso: node herramientas/pixel_carrusel.js (después del script de Blender)  →  assets/img/carrusel-pixel-*.svg
const fs = require("fs");
const path = require("path");

const W = 80, H = 64;
const capas = {};
const nueva = () => Array.from({ length: H }, () => Array(W).fill(null));
let px = (capas.fondo = nueva());
const pieza = (nombre) => { px = capas[nombre] || (capas[nombre] = nueva()); };
const punto = (x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < H) px[y][x] = c; };
const caja = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) punto(x + i, y + j, c); };
const dibujo = (x, y, filas, paleta) =>
  filas.forEach((f, j) => [...f].forEach((k, i) => { if (paleta[k]) punto(x + i, y + j, paleta[k]); }));

const P = { n: "#00033D", h: "#0600AB", a: "#0033FF", l: "#977DFF", r: "#FFCCF2", b: "#F4F1FF", c: "#6FE3FF", o: "#FFD466", s: "#D99A2B" };

// Plataformas: borde claro arriba y tierra con textura
function plataforma(x, y, w, h) {
  caja(x, y, w, 2, P.c);
  caja(x, y + 2, w, 2, P.l);
  caja(x, y + 4, w, h - 4, P.h);
  for (let j = y + 5; j < y + h - 1; j += 3)
    for (let i = x + 2 + ((j % 2) * 3); i < x + w - 2; i += 6) caja(i, j, 2, 1, P.a);
  caja(x, y + h - 1, w, 1, P.n);
}
plataforma(2, 50, 34, 12);
plataforma(44, 43, 34, 12);
plataforma(27, 26, 20, 7);

// Personaje
pieza("heroe");
dibujo(10, 34, [
  "....nnnnnn....",
  "...nrrrrrrn...",
  "..nrrrrrrrrn..",
  "..nnnnnnnnnnn.",
  "..nbbbbbbbbn..",
  "..nbbnbbbnbn..",
  "..nbbnbbbnbn..",
  "..nbbbbbbbbn..",
  "...nnbbbbnn...",
  "..naaaaaaaan..",
  ".nbnaaooaanbn.",
  ".nn.naaaan.nn.",
  "....nhhhhn....",
  "...nhhnnhhn...",
  "...nnn..nnn...",
  "..nnnn..nnnn..",
], P);

// Enemigo saltarín
pieza("enemigo");
dibujo(58, 33, [
  "....nnnn....",
  "..nnllllnn..",
  ".nllllllllln",
  ".nlbbllbblln",
  "nllbnllbnlll",
  "nllllllllllln",
  "nllnnnnnnllln",
  "nlllllllllln.",
  ".nnnnnnnnnnn.",
  "..nn....nn...",
], P);

// Monedas
const moneda = ["..nnn..", ".noosn.", "noboosn", "noboosn", "noboosn", ".noosn.", "..nnn.."];
[[27, 15], [34, 12], [41, 15]].forEach(([x, y], i) => { pieza("moneda" + i); dibujo(x, y, moneda, P); });

// Corazones de vida
const corazon = [".rr.rr.", "rbrrrrr", "rrrrrrr", ".rrrrr.", "..rrr..", "...r..."];
[3, 12, 21].forEach((x, i) => { pieza("corazon" + i); dibujo(x, 3, corazon, P); });

// Nubes y estrellas
pieza("fondo");
const nube = ["....bbbb......", "..bbbbbbbb.bb.", ".bbbbbbbbbbbbb", "bbbbbbbbbbbbbb"];
dibujo(58, 8, nube, P);
dibujo(2, 20, nube, { b: P.l });
[[52, 4], [74, 22], [20, 18], [50, 30], [39, 56]].forEach(([x, y]) => {
  punto(x, y, P.b); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([i, j]) => punto(x + i, y + j, P.c));
});

// Un SVG por capa: el fondo completo y cada pieza recortada a su tamaño
const IMG = path.join(__dirname, "..", "assets", "img");
const datos = { fondo: "", piezas: [] };
for (const [nombre, m] of Object.entries(capas)) {
  let x0 = W, x1 = 0, y0 = H, y1 = 0, rects = "";
  m.forEach((fila, y) => fila.forEach((c, x) => { if (c) { x0 = Math.min(x0, x); x1 = Math.max(x1, x + 1); y0 = Math.min(y0, y); y1 = Math.max(y1, y + 1); } }));
  if (nombre === "fondo") { x0 = 0; y0 = 0; x1 = W; y1 = H; }
  m.forEach((fila, y) => {
    for (let x = 0; x < W; ) {
      const c = fila[x];
      let n = 1;
      while (x + n < W && fila[x + n] === c) n++;
      if (c) rects += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${c}"/>`;
      x += n;
    }
  });
  const archivo = `carrusel-pixel-${nombre}.svg`;
  fs.writeFileSync(path.join(IMG, archivo), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}" width="${(x1 - x0) * 14}" height="${(y1 - y0) * 14}" shape-rendering="crispEdges">${rects}</svg>\n`);
  if (nombre === "fondo") datos.fondo = "assets/img/" + archivo;
  else datos.piezas.push({ src: "assets/img/" + archivo, x: x0 / W, y: y0 / H, w: (x1 - x0) / W, h: (y1 - y0) / H });
}
// Se agrega (o reemplaza) la línea del pixel art en el manifiesto que crea el script de Blender
const destino = path.join(__dirname, "..", "js", "arte-piezas.js");
const previo = fs.existsSync(destino) ? fs.readFileSync(destino, "utf8") : "window.DISCE_ARTE = {};\n";
const limpio = previo.split("\n").filter((l) => l && !l.startsWith("window.DISCE_ARTE.pixel")).join("\n");
fs.writeFileSync(destino, limpio + "\nwindow.DISCE_ARTE.pixel = " + JSON.stringify(datos) + ";\n");
console.log("pixel:", datos.piezas.length, "piezas");
