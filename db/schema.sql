-- Schéma de la base. Rejouable : pnpm db:init (ne touche jamais aux données existantes).
-- Aucune donnée n'est insérée : les photos s'ajoutent depuis /admin.
-- src : clé du fichier dans le bucket (ex. prod/photos/ab12….jpg).
create table if not exists photos (
  id text primary key,
  src text not null,
  title text not null,
  alt text not null,
  category text not null check (category in ('collines', 'cotes', 'couchers-de-soleil', 'ciels')),
  place text,
  year integer check (year between 1800 and 2200),
  position integer not null,
  created_at timestamptz not null default now()
);

create index if not exists photos_position_idx on photos (position);
