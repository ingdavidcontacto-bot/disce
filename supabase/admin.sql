-- =========================================================
-- disce · ADMINISTRADOR de testimonios (Supabase)
-- Pega TODO este archivo en Supabase → SQL Editor → Run
-- (ejecuta antes supabase/setup.sql). Se puede volver a ejecutar
-- sin perder datos: todo es "if not exists" / "drop ... if exists".
--
-- Qué hace:
--   1. Crea la lista privada de correos administradores (public.admins).
--   2. Crea la función public.es_admin(), que la página usa para saber
--      si la persona que ingresó es administradora.
--   3. Permite SOLO a los administradores ver los testimonios pendientes,
--      aprobarlos / ocultarlos y borrarlos desde admin.html.
--
-- IMPORTANTE: en Authentication → Sign In / Providers → Email deja
-- activado "Confirm email". La función exige que el correo esté
-- confirmado, así nadie puede crear la cuenta del admin con un correo
-- que no es suyo.
-- =========================================================

-- ---------- 1. Lista de administradores ----------
create table if not exists public.admins (
  email  text        primary key check (email = lower(email)),
  creado timestamptz not null default now()
);

-- RLS activado y SIN políticas: nadie la puede leer ni cambiar desde la página.
-- Solo se edita aquí, en el SQL Editor.
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

insert into public.admins (email)
values ('disce.academia@gmail.com')
on conflict (email) do nothing;

-- ---------- 2. ¿La persona que ingresó es administradora? ----------
-- SECURITY DEFINER: se ejecuta con los permisos del dueño de la función,
-- así puede leer public.admins aunque la persona no tenga acceso a la tabla.
-- search_path vacío: todo va con su esquema (public., auth.) para que nadie
-- pueda "colar" otra tabla con el mismo nombre.
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins a
    join auth.users u on u.id = (select auth.uid())
    where a.email = lower(auth.jwt() ->> 'email')
      and lower(u.email) = a.email            -- el correo de la cuenta sigue siendo ese
      and u.email_confirmed_at is not null    -- y está confirmado
  );
$$;

revoke execute on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;

-- ---------- 3. Políticas del administrador en testimonios ----------
-- Se suman a las de setup.sql ("leer aprobados" y "registrados envian sin aprobar").
-- (select ...) hace que Postgres evalúe la función una vez por consulta, no por fila.

drop policy if exists "admin lee todos" on public.testimonios;
create policy "admin lee todos"
  on public.testimonios for select
  to authenticated
  using ((select public.es_admin()));

drop policy if exists "admin modera" on public.testimonios;
create policy "admin modera"
  on public.testimonios for update
  to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

drop policy if exists "admin borra" on public.testimonios;
create policy "admin borra"
  on public.testimonios for delete
  to authenticated
  using ((select public.es_admin()));

-- ---------- 4. Permisos por columna ----------
-- setup.sql da a authenticated: select (id, nombre, curso, calificacion, mensaje, creado)
-- e insert (nombre, curso, calificacion, mensaje). Aquí se agrega lo mínimo para moderar.
-- Las políticas de arriba impiden que alguien que no sea admin vea pendientes,
-- actualice o borre. La columna user_id sigue sin exponerse a nadie.
grant select (aprobado) on public.testimonios to authenticated;
grant update (aprobado) on public.testimonios to authenticated;
grant delete on public.testimonios to authenticated;

-- =========================================================
-- Verificación (quita los "--" y ejecuta una por una)
-- =========================================================
-- Administradores registrados:
--   select * from public.admins;
--
-- Políticas de testimonios:
--   select policyname, cmd, roles, qual, with_check
--   from pg_policies where schemaname = 'public' and tablename = 'testimonios';
--
-- Permisos por columna de authenticated (user_id NO debe aparecer):
--   select privilege_type, column_name
--   from information_schema.column_privileges
--   where table_schema = 'public' and table_name = 'testimonios' and grantee = 'authenticated'
--   order by 1, 2;
--
-- La función no debe poder ejecutarla anon (debe salir false):
--   select has_function_privilege('anon', 'public.es_admin()', 'execute');
--
-- ¿La cuenta del admin ya existe y está confirmada?
--   select email, email_confirmed_at from auth.users where lower(email) = 'disce.academia@gmail.com';
--
-- Agregar otro administrador (debe tener cuenta confirmada en disce):
--   insert into public.admins (email) values ('otro.correo@gmail.com') on conflict do nothing;
-- Quitar un administrador:
--   delete from public.admins where email = 'otro.correo@gmail.com';
