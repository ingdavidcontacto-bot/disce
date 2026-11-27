# disce · arte 3D del carrusel de la portada
# Uso (desde la carpeta del proyecto):
#   & "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" -b -P herramientas/arte_carrusel.py
# Genera assets/img/carrusel-*.webp con fondo transparente.
import bpy, math, os
from mathutils import Vector

SALIDA = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "img"))

LILA, AZUL, HONDO, NOCHE = "#977DFF", "#0033FF", "#0600AB", "#00033D"
BLANCO, ROSA, CIAN = "#F4F1FF", "#FFCCF2", "#6FE3FF"


def lineal(hexa):
    def c(v):
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return tuple(c(int(hexa[i:i + 2], 16) / 255) for i in (1, 3, 5)) + (1.0,)


_mats = {}


def mat(color, brillo=0.0, rugoso=0.38, metal=0.0):
    clave = (color, brillo, rugoso, metal)
    if clave not in _mats:
        m = bpy.data.materials.new(color)
        m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = lineal(color)
        b.inputs["Roughness"].default_value = rugoso
        b.inputs["Metallic"].default_value = metal
        if brillo:
            b.inputs["Emission Color"].default_value = lineal(color)
            b.inputs["Emission Strength"].default_value = brillo
        _mats[clave] = m
    return _mats[clave]


def terminar(o, color, bisel=0.0, suave=True, **kw):
    o.data.materials.append(mat(color, **kw))
    if bisel:
        mod = o.modifiers.new("bisel", "BEVEL")
        mod.width = bisel
        mod.segments = 4
    if suave:
        for p in o.data.polygons:
            p.use_smooth = True
    return o


def cubo(pos, tam, color, bisel=0.08, rot=(0, 0, 0), **kw):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos, rotation=rot)
    o = bpy.context.object
    o.scale = tam
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return terminar(o, color, bisel=bisel, suave=bool(bisel), **kw)


def cilindro(pos, radio, alto, color, rot=(0, 0, 0), lados=64, bisel=0.04, **kw):
    bpy.ops.mesh.primitive_cylinder_add(vertices=lados, radius=radio, depth=alto, location=pos, rotation=rot)
    return terminar(bpy.context.object, color, bisel=bisel, **kw)


def esfera(pos, radio, color, escala=(1, 1, 1), **kw):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=radio, location=pos)
    o = bpy.context.object
    o.scale = escala
    return terminar(o, color, **kw)


def toro(pos, mayor, menor, color, rot=(0, 0, 0), **kw):
    bpy.ops.mesh.primitive_torus_add(location=pos, rotation=rot, major_radius=mayor, minor_radius=menor,
                                     major_segments=72, minor_segments=24)
    return terminar(bpy.context.object, color, **kw)


def mirar(o, objetivo):
    o.rotation_euler = (Vector(objetivo) - o.location).to_track_quat("-Z", "Y").to_euler()


def escena(camara, objetivo, ancho):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _mats.clear()
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.samples = 96
    s.cycles.use_denoising = True
    s.render.film_transparent = True
    s.render.resolution_x, s.render.resolution_y = 1100, 880
    s.render.image_settings.file_format = "WEBP"
    s.render.image_settings.color_mode = "RGBA"
    s.render.image_settings.quality = 90
    s.view_settings.view_transform = "Standard"

    mundo = bpy.data.worlds.new("mundo")
    s.world = mundo
    mundo.use_nodes = True
    fondo = mundo.node_tree.nodes["Background"]
    fondo.inputs["Color"].default_value = lineal("#5A55B0")
    fondo.inputs["Strength"].default_value = 0.55

    cam = bpy.data.cameras.new("cam")
    cam.type = "ORTHO"
    cam.ortho_scale = ancho
    co = bpy.data.objects.new("cam", cam)
    s.collection.objects.link(co)
    co.location = camara
    mirar(co, objetivo)
    s.camera = co

    for pos, color, fuerza, tam in (((-5, -6, 8), "#FFFFFF", 700, 5), ((7, -1, 3), LILA, 500, 4), ((1, 6, 5), CIAN, 600, 3)):
        luz = bpy.data.lights.new("luz", "AREA")
        luz.energy, luz.size, luz.color = fuerza, tam, lineal(color)[:3]
        o = bpy.data.objects.new("luz", luz)
        s.collection.objects.link(o)
        o.location = pos
        mirar(o, objetivo)


def guardar(nombre):
    bpy.context.scene.render.filepath = os.path.join(SALIDA, nombre + ".webp")
    bpy.ops.render.render(write_still=True)


def moneda(pos):
    cilindro(pos, 0.28, 0.09, "#FFD466", rot=(math.radians(90), 0, math.radians(25)), metal=0.4, brillo=0.25)


# 1) Unity: un nivel de juego flotante con personaje y monedas
def nivel():
    escena((9, -11, 8), (0.2, 0, 0.1), 9.2)
    for x, y, z, ax, ay in ((-1.7, 0, -0.6, 2.6, 2.4), (1.5, 0.2, 0.2, 2.0, 2.0), (2.5, -1.2, -1.4, 1.2, 1.2)):
        cubo((x, y, z), (ax, ay, 0.7), HONDO, bisel=0.12)
        cubo((x, y, z + 0.43), (ax + 0.08, ay + 0.08, 0.22), LILA, bisel=0.09)
    # personaje
    cubo((-1.8, -0.1, 0.78), (0.82, 0.82, 0.9), AZUL, bisel=0.22)
    for dx in (-0.17, 0.2):
        esfera((-1.8 + dx, -0.53, 0.95), 0.11, BLANCO)
        esfera((-1.8 + dx + 0.03, -0.62, 0.95), 0.055, NOCHE)
    for p in ((-0.35, 0, 1.7), (0.35, 0.05, 2.05), (1.05, 0.1, 2.05)):
        moneda(p)
    # bandera de meta
    cilindro((2.0, 0.6, 1.5), 0.05, 1.8, BLANCO)
    cubo((1.62, 0.6, 2.15), (0.75, 0.07, 0.45), ROSA, bisel=0.03, brillo=0.2)
    for p, t in (((-2.9, 1.3, 0.6), 0.34), ((0.4, -1.4, -1.0), 0.22)):
        cubo(p, (t, t, t), CIAN, bisel=0.05, rot=(0.5, 0.3, 0.7), brillo=0.3)
    guardar("carrusel-nivel")


# 2) Blender: modelos low poly sobre una base
def modelos():
    escena((6, -11, 6), (0, 0, 0.5), 7.6)
    cilindro((0, 0, -1.35), 2.7, 0.35, HONDO, bisel=0.1)
    toro((0, 0, -1.15), 2.72, 0.045, CIAN, brillo=2.0)
    bpy.ops.mesh.primitive_monkey_add(size=2.5, location=(0, -0.1, 0.55))
    m = bpy.context.object
    m.rotation_euler = (math.radians(-8), 0, math.radians(14))
    terminar(m, LILA, suave=False, rugoso=0.3)
    cubo((-2.1, 0.2, -0.55), (1.05, 1.05, 1.05), AZUL, bisel=0.1, rot=(0, 0, 0.5))
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.7, location=(2.15, 0.1, -0.45))
    terminar(bpy.context.object, ROSA, suave=False)
    toro((2.0, 0, 1.75), 0.55, 0.2, AZUL, rot=(1.1, 0.4, 0))
    bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.55, depth=1.1, location=(-2.1, 0, 1.55), rotation=(0.3, -0.35, 0))
    terminar(bpy.context.object, CIAN, bisel=0.04, suave=False)
    guardar("carrusel-modelos")


# 4) Juegos de alumnos: un control de juego
def control():
    escena((2.5, -9, 8), (0, 0, 0), 7.2)
    r = (0, 0, math.radians(-8))
    cubo((0, 0, 0), (3.6, 2.0, 0.75), LILA, bisel=0.36, rot=r)
    for lado in (-1, 1):
        cilindro((lado * 1.75, -0.4 - lado * 0.24, 0), 1.02, 0.74, LILA, bisel=0.3)
    # cruceta
    cubo((-1.55, 0.1, 0.46), (0.9, 0.3, 0.2), NOCHE, bisel=0.06, rot=r)
    cubo((-1.55, 0.1, 0.46), (0.3, 0.9, 0.2), NOCHE, bisel=0.06, rot=r)
    for dx, dy, color in ((0, 0.38, CIAN), (0, -0.38, ROSA), (-0.38, 0, AZUL), (0.38, 0, BLANCO)):
        cilindro((1.6 + dx, -0.12 + dy, 0.46), 0.19, 0.2, color, brillo=0.25)
    for x, y in ((-0.6, -0.55), (0.6, -0.68)):
        cilindro((x, y, 0.45), 0.34, 0.16, HONDO)
        esfera((x, y, 0.6), 0.27, NOCHE, escala=(1, 1, 0.55))
    cubo((0, 0.35, 0.42), (0.9, 0.42, 0.08), CIAN, bisel=0.03, rot=r, brillo=1.2)
    for p, t in (((-2.9, 1.3, 0.5), 0.36), ((2.9, 1.2, 0.8), 0.26), ((2.6, -1.9, 0.2), 0.2)):
        cubo(p, (t, t, t), AZUL, bisel=0.05, rot=(0.6, 0.4, 0.5), brillo=0.3)
    guardar("carrusel-control")


nivel()
modelos()
control()
