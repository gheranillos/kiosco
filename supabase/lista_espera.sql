-- Unificacion en una sola tabla: public.registro_drop
-- Ejecuta este script en Supabase SQL Editor.
-- Esto evita tener una segunda tabla para lista de espera.

alter table public.registro_drop
  add column if not exists origen text;

update public.registro_drop
set origen = 'preregistro'
where origen is null;

-- Limpia duplicados por correo (mantiene el mas reciente por correo).
with ranked as (
  select
    id,
    row_number() over (
      partition by lower(trim(correo))
      order by created_at desc, id desc
    ) as rn
  from public.registro_drop
  where correo is not null and trim(correo) <> ''
)
delete from public.registro_drop r
using ranked d
where r.id = d.id
  and d.rn > 1;

create unique index if not exists registro_drop_correo_uidx
  on public.registro_drop (lower(trim(correo)))
  where correo is not null and trim(correo) <> '';
