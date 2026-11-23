-- =========================================================
-- disce · ENDURECIMIENTO de la base de datos (Supabase)
-- Pega TODO este archivo en Supabase → SQL Editor → Run.
-- Orden: 1) setup.sql  2) admin.sql  3) seguridad.sql (este).
-- Se puede volver a ejecutar sin perder datos (todo es idempotente).
-- Si algún día vuelves a ejecutar setup.sql, ejecuta después admin.sql
-- y este archivo (este archivo también re-aplica los permisos del admin).
--
-- Qué hace:
--   1. Re-aplica los permisos del administrador si setup.sql los borró
--      (su "revoke all" quita los grants de admin.sql).
--   2. Trigger antes de insertar testimonios que, para peticiones que llegan
--      desde la página (roles anon / authenticated):
--        - fuerza aprobado = false, user_id = la cuenta que ingresó y creado = now();
--        - rechaza cuentas sin correo confirmado y sesiones anónimas;
--        - solo acepta los dos cursos reales (antes "curso" era texto libre,
--          así que una cuenta podía enviar testimonios ilimitados cambiando
--          el nombre del curso y saltándose "uno por cuenta y por curso");
--        - limpia espacios repetidos en nombre y mensaje.
--      Desde el SQL Editor (rol postgres) no aplica, para que puedas
--      corregir datos a mano.
--   3. Consultas de verificación.
-- =========================================================

-- ---------- 1. Permisos del administrador (idempotente) ----------
do $$
begin
  if to_regprocedure('public.es_admin()') is not null then
    grant select (aprobado) on public.testimonios to authenticated;
    grant update (aprobado) on public.testimonios to authenticated;
    grant delete on public.testimonios to authenticated;
  end if;
end
$$;

-- ---------- 2. Trigger de validación al insertar ----------
-- SECURITY DEFINER para poder leer auth.users (correo confirmado).
-- search_path vacío: todo va con su esquema.
create or replace function public.testimonios_antes_de_insertar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  rol text := coalesce(auth.jwt() ->> 'role', '');
  confirmado boolean;
begin
  -- Solo para lo que llega desde la página (API REST con la clave anon / sesión)
  if rol not in ('anon', 'authenticated') then
    return new;
  end if;

  -- Nunca se publica solo y nunca a nombre de otra cuenta
  new.aprobado := false;
  new.user_id  := auth.uid();
  new.creado   := now();

  if new.user_id is null then
    raise exception 'Necesitas una cuenta para enviar testimonios'
      using errcode = '42501';
  end if;

  -- Sesiones anónimas (si algún día se activan "Anonymous sign-ins") no cuentan
  if coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Las sesiones anónimas no pueden enviar testimonios'
      using errcode = '42501';
  end if;

  -- Correo confirmado (por si alguien desactiva "Confirm email" por error)
  select (u.email_confirmed_at is not null) into confirmado
  from auth.users u where u.id = new.user_id;
  if not coalesce(confirmado, false) then
    raise exception 'Confirma tu correo antes de enviar un testimonio'
      using errcode = '42501';
  end if;

  -- Solo los cursos que existen en la página (mismo texto que el formulario)
  if new.curso not in ('Videojuegos 2D con Unity', 'Videojuegos en 3D con Unity') then
    raise exception 'Curso no válido' using errcode = '23514';
  end if;

  -- Limpieza: espacios repetidos / al inicio y al final
  new.nombre  := btrim(regexp_replace(new.nombre, '[[:space:]]+', ' ', 'g'));
  new.mensaje := btrim(new.mensaje);

  return new;
end;
$$;

-- La función solo la usa el trigger: nadie la llama directamente por la API
revoke execute on function public.testimonios_antes_de_insertar() from public, anon, authenticated;

drop trigger if exists testimonios_antes_de_insertar on public.testimonios;
create trigger testimonios_antes_de_insertar
  before insert on public.testimonios
  for each row execute function public.testimonios_antes_de_insertar();

-- =========================================================
-- 3. Verificación (quita los "--" y ejecuta una por una)
-- =========================================================
-- ¿Todas las tablas de public tienen RLS activado? (rowsecurity debe ser true)
--   select tablename, rowsecurity from pg_tables where schemaname = 'public';
--
-- ¿Qué puede hacer anon en testimonios? (solo SELECT de columnas públicas)
--   select privilege_type, column_name from information_schema.column_privileges
--   where table_schema = 'public' and table_name = 'testimonios' and grantee = 'anon' order by 1, 2;
--
-- ¿anon o authenticated pueden leer public.admins? (deben salir false)
--   select has_table_privilege('anon', 'public.admins', 'select'),
--          has_table_privilege('authenticated', 'public.admins', 'select');
--
-- ¿Funciones SECURITY DEFINER en public y quién las puede ejecutar?
--   select p.proname, p.prosecdef,
--          has_function_privilege('anon', p.oid, 'execute') as anon,
--          has_function_privilege('authenticated', p.oid, 'execute') as authenticated
--   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--   where n.nspname = 'public';
--
-- Cursos que ya existen (si hay otros nombres, corrígelos a mano):
--   select curso, count(*) from public.testimonios group by curso;
--
-- =========================================================
-- Solicitud de SUPRESIÓN de un titular (Ley 1581): borrar sus testimonios
-- y luego su cuenta en Authentication → Users → (usuario) → Delete user.
--   delete from public.testimonios
--   where user_id = (select id from auth.users where lower(email) = 'correo@ejemplo.com');
-- =========================================================
