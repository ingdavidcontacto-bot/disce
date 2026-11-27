// disce · escena 2D en pixel art del carrusel
// Uso: node herramientas/pixel_carrusel.js  →  assets/img/carrusel-pixel.svg
const fs = require("fs");
const path = require("path");

const W = 80, H = 64;
const px = Array.from({ length: H }, () => Array(W).fill(null));
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
[[27, 15], [34, 12], [41, 15]].forEach(([x, y]) => dibujo(x, y, moneda, P));

// Corazones de vida
const corazon = [".rr.rr.", "rbrrrrr", "rrrrrrr", ".rrrrr.", "..rrr..", "...r..."];
[3, 12, 21].forEach((x) => dibujo(x, 3, corazon, P));

// Nubes y estrellas
const nube = ["....bbbb......", "..bbbbbbbb.bb.", ".bbbbbbbbbbbbb", "bbbbbbbbbbbbbb"];
dibujo(58, 8, nube, P);
dibujo(2, 20, nube, { b: P.l });
[[52, 4], [74, 22], [20, 18], [50, 30], [39, 56]].forEach(([x, y]) => {
  punto(x, y, P.b); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([i, j]) => punto(x + i, y + j, P.c));
});

// SVG: un rectángulo por cada tira horizontal del mismo color
let rects = "";
px.forEach((fila, y) => {
  for (let x = 0; x < W; ) {
    const c = fila[x];
    let n = 1;
    while (x + n < W && fila[x + n] === c) n++;
    if (c) rects += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${c}"/>`;
    x += n;
  }
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="1100" height="880" shape-rendering="crispEdges">${rects}</svg>\n`;
fs.writeFileSync(path.join(__dirname, "..", "assets", "img", "carrusel-pixel.svg"), svg);
console.log("carrusel-pixel.svg", svg.length, "bytes");
