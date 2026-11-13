-- =========================================================
-- disce · base de datos de testimonios (Supabase)
-- Pega TODO este archivo en Supabase → SQL Editor → Run
-- Se puede volver a ejecutar sin perder los testimonios que ya existen.
--
-- Desde la versión con cuentas: SOLO las personas registradas en disce
-- (Supabase Auth, con correo) pueden enviar testimonios.
-- =========================================================

create table if not exists public.testimonios (
  id           bigint generated always as identity primary key,
  nombre       text        not null check (char_length(nombre) between 2 and 60),
  curso        text        not null check (char_length(curso) between 2 and 80),
  calificacion smallint    not null check (calificacion between 1 and 5),
  mensaje      text        not null check (char_length(mensaje) between 10 and 600),
  aprobado     boolean     not null default false,   -- tú decides qué se publica
  creado       timestamptz not null default now()
);

-- Cuenta que escribió el testimonio (se llena sola con el usuario que ingresó)
alter table public.testimonios
  add column if not exists user_id uuid default auth.uid()
  references auth.users (id) on delete set null;

-- Un testimonio por cuenta y por curso (los antiguos, sin cuenta, no cuentan)
create unique index if not exists testimonios_uno_por_cuenta
  on public.testimonios (user_id, curso)
  where user_id is not null;

-- Seguridad: activar reglas por fila
alter table public.testimonios enable row level security;

-- Cualquier visitante puede LEER solo los testimonios aprobados
drop policy if exists "leer aprobados" on public.testimonios;
create policy "leer aprobados"
  on public.testimonios for select
  to anon, authenticated
  using (aprobado = true);

-- Regla antigua (cualquier visitante podía enviar): se elimina
drop policy if exists "enviar sin aprobar" on public.testimonios;

-- Solo personas con cuenta pueden ENVIAR, a su nombre y siempre sin aprobar
drop policy if exists "registrados envian sin aprobar" on public.testimonios;
create policy "registrados envian sin aprobar"
  on public.testimonios for insert
  to authenticated
  with check (aprobado = false and user_id = (select auth.uid()));

-- Permisos mínimos. Nadie desde la página puede editar ni borrar,
-- y la columna user_id nunca se muestra al público.
revoke all on public.testimonios from anon, authenticated;
grant select (id, nombre, curso, calificacion, mensaje, creado) on public.testimonios to anon, authenticated;
grant insert (nombre, curso, calificacion, mensaje) on public.testimonios to authenticated;
