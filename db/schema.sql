-- Schéma et données initiales. Rejouable : pnpm db:init (ne remplace jamais une photo existante).
-- src : chemin public (/photos/…) pour les photos d'origine, clé du bucket pour les ajouts du back-office.
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

insert into photos (id, src, title, alt, category, position) values
  ('p03', '/photos/p03.jpg', 'Coucher de soleil sur les collines', 'Soleil couchant derrière des collines', 'couchers-de-soleil', 0),
  ('p01', '/photos/p01.jpg', 'Rizières en vallée', 'Rizières au creux d''une vallée', 'collines', 1),
  ('p04', '/photos/p04.jpg', 'Palmier et mer au coucher', 'Palmier face à la mer au coucher du soleil', 'cotes', 2),
  ('p10', '/photos/p10.jpg', 'Nuage orange', 'Nuage orange dans le ciel du soir', 'ciels', 3),
  ('p07', '/photos/p07.jpg', 'Plage au bord de la mer', 'Plage et palmiers', 'cotes', 4),
  ('p02', '/photos/p02.jpg', 'Collines dorées', 'Collines éclairées par une lumière dorée', 'collines', 5),
  ('p12', '/photos/p12.jpg', 'Ciel rouge sur la ville', 'Ciel rouge au-dessus des toits', 'couchers-de-soleil', 6),
  ('p05', '/photos/p05.jpg', 'Mer au coucher', 'Horizon sur la mer au coucher du soleil', 'cotes', 7),
  ('p09', '/photos/p09.jpg', 'Ponton sur le lac', 'Ponton en bois au bord d''un lac calme', 'cotes', 8),
  ('p08', '/photos/p08.jpg', 'Plage sous ciel gris', 'Plage sous un ciel gris', 'cotes', 9),
  ('p14', '/photos/p14.jpg', 'Arbres au coucher du soleil', 'Rangée d''arbres devant le soleil couchant', 'couchers-de-soleil', 10),
  ('p06', '/photos/p06.jpg', 'Vagues et palmier', 'Vagues au pied d''un palmier', 'cotes', 11),
  ('p11', '/photos/p11.jpg', 'Ciel orange', 'Ciel orange après le coucher du soleil', 'ciels', 12),
  ('p13', '/photos/p13.jpg', 'Nuages bleus', 'Gros nuages bleus au crépuscule', 'ciels', 13)
on conflict (id) do nothing;
