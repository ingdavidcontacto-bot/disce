# disce · portadas de los cursos y una ilustración por nivel (mini carrusel)
# Uso (desde la carpeta del proyecto):
#   & "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" -b -P herramientas/arte_cursos.py
# Genera assets/img/curso-*.webp y assets/img/nivel-*.webp con fondo transparente.
import bpy, math, os

AQUI = os.path.dirname(os.path.abspath(__file__))
# Reutiliza materiales, luces y figuras del script del carrusel (sin volver a generarlo)
fuente = open(os.path.join(AQUI, "arte_carrusel.py"), encoding="utf-8").read()
__file__ = os.path.join(AQUI, "arte_carrusel.py")
exec(fuente.split("\nnivel()\nmodelos()\ncontrol()")[0])

AMARILLO, VERDE = "#FFD466", "#7CE0B0"
R = math.radians


def foto(nombre, ancho_px=720, alto_px=450):
    s = bpy.context.scene
    s.render.resolution_x, s.render.resolution_y = ancho_px, alto_px
    s.cycles.samples = 64
    s.render.filepath = os.path.join(SALIDA, nombre + ".webp")
    bpy.ops.render.render(write_still=True)


def montar(ancho=7.0, camara=(5, -10, 6), objetivo=(0, 0, 0)):
    escena(camara, objetivo, ancho)


def bloque(pos, tam, base=HONDO, tapa=LILA):
    x, y, z = pos
    ax, ay, az = tam
    cubo((x, y, z), (ax, ay, az), base, bisel=0.1)
    cubo((x, y, z + az / 2 + 0.08), (ax + 0.06, ay + 0.06, 0.18), tapa, bisel=0.07)


def muneco(pos, t=1.0, color=AZUL):
    x, y, z = pos
    cubo((x, y, z), (0.8 * t, 0.8 * t, 0.9 * t), color, bisel=0.22 * t)
    for dx in (-0.17, 0.19):
        esfera((x + dx * t, y - 0.42 * t, z + 0.14 * t), 0.11 * t, BLANCO)
        esfera((x + (dx + 0.03) * t, y - 0.5 * t, z + 0.14 * t), 0.055 * t, NOCHE)


def triangulo(pos, radio, color, brillo=0.3):
    cilindro(pos, radio, 0.25, color, rot=(R(90), 0, R(0)), lados=3, bisel=0.05, brillo=brillo)


def arbol(pos, t=1.0):
    x, y, z = pos
    cilindro((x, y, z), 0.13 * t, 0.6 * t, HONDO)
    for i, r in enumerate((0.65, 0.5, 0.34)):
        bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=r * t, depth=0.65 * t, location=(x, y, z + (0.5 + i * 0.36) * t))
        terminar(bpy.context.object, VERDE, bisel=0.03, suave=False)


def pantalla(pos, ancho, alto, color=NOCHE, marco=LILA):
    x, y, z = pos
    cubo((x, y, z), (ancho + 0.2, 0.22, alto + 0.2), marco, bisel=0.09)
    cubo((x, y - 0.12, z), (ancho, 0.06, alto), color, bisel=0.02, rugoso=0.2)


# ---------- Portadas ----------
def portada_2d():
    montar(9.6, (0.5, -12, 2.2), (0.3, 0, 0.2))
    for x, z, a in ((-2.2, -1.5, 3.0), (1.2, -0.8, 2.2), (3.6, 0.1, 1.8)):
        bloque((x, 0, z), (a, 1.0, 0.8), tapa=CIAN)
    muneco((-2.3, 0, -0.35), 1.15)
    for p in ((-0.5, 0, 0.9), (0.2, 0, 1.3), (0.9, 0, 1.2)):
        moneda(p)
    muneco((3.7, 0, 1.0), 0.85, LILA)
    for i in range(3):
        esfera((-3.5 + i * 0.55, 0, 2.2), 0.19, ROSA, brillo=0.5)
    foto("curso-2d", 960, 600)


def portada_3d():
    montar(8.8, (8, -10, 7), (0.2, 0, 0.3))
    bloque((0, 0, -1.0), (5.0, 3.6, 0.7), tapa=LILA)
    arbol((-1.9, 0.9, -0.2), 1.25)
    arbol((-1.0, 1.3, -0.3), 0.85)
    bpy.ops.mesh.primitive_monkey_add(size=1.9, location=(0.9, 0.2, 0.55))
    bpy.context.object.rotation_euler = (R(-8), 0, R(28))
    terminar(bpy.context.object, AZUL, suave=False)
    muneco((-0.9, -0.9, 0.05), 0.9)
    toro((2.1, -0.9, 0.35), 0.45, 0.13, AMARILLO, rot=(R(80), 0, R(25)), brillo=0.3)
    cubo((2.5, 1.0, 1.7), (0.4, 0.4, 0.4), CIAN, rot=(0.5, 0.4, 0.6), brillo=0.4)
    foto("curso-3d", 960, 600)


# ---------- Niveles del curso 2D ----------
def n2d_1():  # escenas y organización
    montar(6.2, (3, -10, 3))
    for i, c in enumerate((HONDO, AZUL, LILA)):
        pantalla((-0.7 + i * 0.7, 0.9 - i * 0.9, 0.5 - i * 0.4), 2.6, 1.7, color=c, marco=BLANCO if i == 2 else LILA)
    triangulo((0.72, -1.15, -0.3), 0.45, BLANCO)


def n2d_2():  # sonido y música
    montar(6.0, (3, -10, 3), (0, 0, 0.3))
    for x, z in ((-1.1, -0.7), (0.9, -0.3)):
        esfera((x, 0, z), 0.55, LILA, escala=(1.15, 1, 0.8))
        cilindro((x + 0.5, 0, z + 1.1), 0.09, 2.2, BLANCO)
    cubo((0.4, 0, 1.75), (2.1, 0.2, 0.35), AZUL, rot=(0, R(-11), 0))
    for r, c in ((0.7, CIAN), (1.15, LILA)):
        toro((2.0, 0, 0.5), r * 0.7, 0.06, c, rot=(R(90), 0, 0), brillo=0.7)


def n2d_3():  # interfaz de usuario
    montar(6.2, (2, -10, 2.5))
    pantalla((0, 0, 0), 4.4, 2.7)
    cubo((0, -0.25, 0.1), (1.9, 0.12, 0.5), AZUL, bisel=0.06, brillo=0.3)
    cubo((0, -0.25, -0.6), (1.9, 0.12, 0.4), LILA, bisel=0.06)
    for i in range(3):
        esfera((-1.8 + i * 0.42, -0.25, 0.95), 0.16, ROSA, brillo=0.5)
    moneda((1.65, -0.3, 0.95))


def n2d_4():  # tilemaps
    montar(6.4, (6, -9, 8))
    colores = [[LILA, LILA, VERDE, VERDE], [LILA, CIAN, CIAN, VERDE], [HONDO, HONDO, CIAN, LILA], [HONDO, AZUL, AZUL, LILA]]
    for i in range(4):
        for j in range(4):
            if (i, j) != (3, 0):
                cubo((-1.5 + i * 1.0, -1.5 + j * 1.0, -0.4), (0.9, 0.9, 0.35), colores[j][i], bisel=0.07)
    cubo((1.5, -1.5, 0.7), (0.9, 0.9, 0.35), AMARILLO, bisel=0.07, rot=(R(15), R(-10), R(12)), brillo=0.4)


def n2d_5():  # físicas y colisiones
    montar(6.4, (3, -10, 3), (0, 0, 0.2))
    cubo((0, 0, -1.4), (5.0, 1.4, 0.4), LILA, bisel=0.1, rot=(0, R(9), 0))
    esfera((-1.5, 0, -0.4), 0.7, AZUL)
    cubo((0.8, 0, -0.65), (0.9, 0.9, 0.9), HONDO, rot=(0, R(9), 0))
    cubo((1.0, 0, 0.5), (0.8, 0.8, 0.8), CIAN, rot=(0, R(30), 0))
    for i, z in enumerate((0.6, 1.2, 1.7)):
        esfera((-1.5, 0, z), 0.17 - i * 0.04, BLANCO, brillo=0.4)


def n2d_6():  # animaciones
    montar(6.6, (2, -10, 3), (0, 0, 0.1))
    for i, (x, z, t) in enumerate(((-2.0, -0.6, 0.85), (0, 0.45, 1.05), (2.0, -0.6, 0.85))):
        muneco((x, 0, z), t, (HONDO, AZUL, LILA)[i])
    for i in range(7):
        a = R(180 - i * 30)
        esfera((2.0 * math.cos(a), 0.2, -0.3 + 1.9 * math.sin(a)), 0.07, CIAN, brillo=1.0)


def n2d_7():  # enemigos que patrullan
    montar(6.6, (3, -10, 4))
    cubo((0, 0, -1.1), (5.2, 1.4, 0.35), HONDO, bisel=0.1)
    muneco((0, 0, -0.4), 1.15, LILA)
    for x in (-0.28, 0.3):
        cubo((x, -0.52, 0.0), (0.34, 0.08, 0.09), NOCHE, rot=(0, R(22 if x < 0 else -22), 0), bisel=0.02)
    for x, giro in ((-2.0, -90), (2.0, 90)):
        cilindro((x, 0, -0.35), 0.45, 0.22, CIAN, rot=(R(90), R(giro), 0), lados=3, brillo=0.6)


# ---------- Niveles del curso 3D ----------
def n3d_1():  # primeros pasos: ejes y cubo
    montar(6.0, (7, -9, 6), (0, 0, 0.2))
    cubo((0, 0, 0), (1.5, 1.5, 1.5), LILA, bisel=0.12)
    for eje, color in (((1, 0, 0), ROSA), ((0, 1, 0), VERDE), ((0, 0, 1), CIAN)):
        pos = tuple(v * 1.45 for v in eje)
        rot = (0, R(90), 0) if eje[0] else ((R(-90), 0, 0) if eje[1] else (0, 0, 0))
        cilindro(pos, 0.07, 1.4, color, rot=rot, brillo=0.5)
        bpy.ops.mesh.primitive_cone_add(radius1=0.22, depth=0.45, location=tuple(v * 2.3 for v in eje), rotation=rot)
        terminar(bpy.context.object, color, brillo=0.5)


def n3d_2():  # modelado en Blender
    montar(6.0, (4, -10, 5))
    bpy.ops.mesh.primitive_monkey_add(size=3.0, location=(0, 0, 0))
    bpy.context.object.rotation_euler = (R(-8), 0, R(15))
    terminar(bpy.context.object, AZUL, suave=False)
    for p in ((-2.2, 0, 1.0), (2.2, 0, 0.7), (1.8, 0, -1.2)):
        esfera(p, 0.13, AMARILLO, brillo=1.0)


def n3d_3():  # materiales
    montar(6.4, (3, -10, 4))
    esfera((-1.9, 0, 0), 0.85, AZUL, rugoso=0.9)
    esfera((0, 0, 0), 0.85, AMARILLO, rugoso=0.18, metal=0.9)
    esfera((1.9, 0, 0), 0.85, CIAN, rugoso=0.05, brillo=0.35)
    cilindro((0, 0, -1.15), 3.0, 0.2, HONDO)


def n3d_4():  # físicas 3D
    montar(6.6, (7, -9, 6), (0, 0, 0.1))
    cubo((0, 0, -1.4), (4.2, 3.0, 0.35), HONDO, bisel=0.1)
    for p, g, c in (((-0.9, 0, -0.75), 0, AZUL), ((0.15, 0, -0.75), 8, LILA), ((-0.35, 0, 0.2), -12, CIAN), ((0.5, -0.2, 1.4), 35, ROSA)):
        cubo(p, (0.9, 0.9, 0.9), c, rot=(R(g), R(g), R(g * 2)))
    esfera((1.5, -0.8, -0.65), 0.55, AMARILLO)


def n3d_5():  # personaje y cámara
    montar(7.0, (7, -9, 6), (0.2, 0, 0.1))
    cilindro((-0.8, 0, -1.25), 1.5, 0.3, HONDO)
    muneco((-0.8, 0, -0.45), 1.25)
    cubo((1.9, 0.3, 0.9), (1.0, 0.8, 0.75), LILA, bisel=0.12, rot=(0, 0, R(20)))
    cilindro((1.3, 0.08, 0.9), 0.28, 0.45, NOCHE, rot=(0, R(90), R(20)))
    for x in (1.7, 2.2):
        cilindro((x, 0.35, 1.5), 0.27, 0.18, CIAN, rot=(R(90), 0, R(20)))


def n3d_6():  # animaciones 3D
    montar(6.4, (4, -10, 4), (0, 0, 0.2))
    for i in range(5):
        t = 0.45 + i * 0.14
        muneco((-2.2 + i * 1.1, 0, -0.7 + math.sin(i / 4 * math.pi) * 1.3), t * 0.9, (HONDO, HONDO, AZUL, AZUL, LILA)[i])
    toro((0, 0.6, -1.2), 2.2, 0.05, CIAN, brillo=1.0)


def n3d_7():  # proyecto final
    montar(6.4, (3, -10, 4), (0, 0, 0.2))
    cilindro((0, 0, -1.4), 1.2, 0.35, HONDO)
    cilindro((0, 0, -0.95), 0.22, 0.7, AMARILLO, metal=0.6)
    bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=0.35, radius2=1.15, depth=1.5, location=(0, 0, 0.1))
    terminar(bpy.context.object, AMARILLO, bisel=0.06, metal=0.6, rugoso=0.25)
    for x in (-1.15, 1.15):
        toro((x, 0, 0.35), 0.45, 0.1, AMARILLO, rot=(R(90), 0, 0), metal=0.6)
    for p, c in (((-2.1, 0, 1.4), CIAN), ((2.1, 0, 1.6), ROSA), ((1.9, 0, -0.5), LILA), ((-1.9, 0, -0.4), AZUL)):
        cubo(p, (0.28, 0.28, 0.28), c, rot=(0.5, 0.6, 0.4), brillo=0.5)


portada_2d()
portada_3d()
for curso, funciones in (("2d", (n2d_1, n2d_2, n2d_3, n2d_4, n2d_5, n2d_6, n2d_7)),
                         ("3d", (n3d_1, n3d_2, n3d_3, n3d_4, n3d_5, n3d_6, n3d_7))):
    for i, dibujar in enumerate(funciones, 1):
        dibujar()
        foto(f"nivel-{curso}-{i}")
