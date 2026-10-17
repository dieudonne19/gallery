-- Schéma de la base. Rejouable : pnpm db:init (ne touche jamais aux données existantes).
-- Aucune donnée n'est insérée : les photos s'ajoutent depuis /admin.
-- src : clé du fichier dans le bucket (ex. prod/photos/ab12….webp).
-- width / height : dimensions de la photo enregistrée (déjà redressée), pour afficher chaque carte à son vrai format.
create table if not exists photos (
  id text primary key,
  src text not null,
  title text not null,
  alt text not null,
  category text not null check (category in ('collines', 'cotes', 'couchers-de-soleil', 'ciels')),
  place text,
  year integer check (year between 1800 and 2200),
  position integer not null,
  width integer not null default 3 check (width > 0),
  height integer not null default 2 check (height > 0),
  created_at timestamptz not null default now()
);

-- Bases créées avant l'ajout des dimensions.
alter table photos add column if not exists width integer not null default 3 check (width > 0);
alter table photos add column if not exists height integer not null default 2 check (height > 0);

create index if not exists photos_position_idx on photos (position);
