-- =========================================================
-- disce · base de datos de testimonios (Supabase)
-- Pega TODO este archivo en Supabase → SQL Editor → Run
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

-- Seguridad: activar reglas por fila
alter table public.testimonios enable row level security;

-- Cualquier visitante puede LEER solo los testimonios aprobados
drop policy if exists "leer aprobados" on public.testimonios;
create policy "leer aprobados"
  on public.testimonios for select
  to anon, authenticated
  using (aprobado = true);

-- Cualquier visitante puede ENVIAR un testimonio, pero siempre llega sin aprobar
drop policy if exists "enviar sin aprobar" on public.testimonios;
create policy "enviar sin aprobar"
  on public.testimonios for insert
  to anon, authenticated
  with check (aprobado = false);

-- Permisos mínimos: leer y crear. Nadie desde la página puede editar ni borrar.
revoke all on public.testimonios from anon, authenticated;
grant select, insert (nombre, curso, calificacion, mensaje) on public.testimonios to anon, authenticated;
