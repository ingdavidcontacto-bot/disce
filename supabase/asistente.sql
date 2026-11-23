-- =========================================================
-- disce · asistente de IA — límite de mensajes por persona y día
-- Ejecutar a mano en Supabase → SQL Editor (una sola vez).
-- La función "asistente" usa esto con la clave de servicio;
-- nadie desde el navegador puede leer ni escribir esta tabla.
-- =========================================================

create table if not exists public.asistente_uso (
  user_id  uuid not null references auth.users(id) on delete cascade,
  dia      date not null default (now() at time zone 'America/Bogota')::date,
  cantidad int  not null default 0,
  primary key (user_id, dia)
);

alter table public.asistente_uso enable row level security;
-- Sin políticas a propósito: con RLS activo y sin políticas, anon y authenticated no ven nada.
revoke all on public.asistente_uso from anon, authenticated;

-- Suma 1 al contador del día y devuelve true si todavía estaba dentro del límite.
create or replace function public.asistente_contar(p_user uuid, p_limite int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dia date := (now() at time zone 'America/Bogota')::date;
  v_ok  int;
begin
  insert into public.asistente_uso as u (user_id, dia, cantidad)
  values (p_user, v_dia, 1)
  on conflict (user_id, dia)
  do update set cantidad = u.cantidad + 1
    where u.cantidad < p_limite
  returning 1 into v_ok;
  return v_ok is not null;
end;
$$;

revoke all on function public.asistente_contar(uuid, int) from public, anon, authenticated;
grant execute on function public.asistente_contar(uuid, int) to service_role;
