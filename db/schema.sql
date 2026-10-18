-- Schéma de la base. Rejouable : pnpm db:init (ne supprime jamais de photo ni de catégorie).
-- Les photos s'ajoutent depuis /admin. Les catégories se gèrent depuis /admin/categories ;
-- les quatre catégories d'origine ne sont créées que si la table est vide.

-- id : identifiant stable, utilisé dans l'adresse (?categorie=…). Le nom (label) peut changer sans le casser.
create table if not exists categories (
  id text primary key,
  label text not null,
  position integer not null,
  created_at timestamptz not null default now()
);

insert into categories (id, label, position)
select * from (values
  ('collines', 'Collines', 1),
  ('cotes', 'Côtes', 2),
  ('couchers-de-soleil', 'Couchers de soleil', 3),
  ('ciels', 'Ciels', 4)
) as initial (id, label, position)
where not exists (select 1 from categories);

-- src : clé du fichier dans le bucket (ex. prod/photos/ab12….webp).
-- width / height : dimensions de la photo enregistrée (déjà redressée), pour afficher chaque carte à son vrai format.
create table if not exists photos (
  id text primary key,
  src text not null,
  title text not null,
  alt text not null,
  category text not null,
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

-- Bases créées avec la liste fixe de quatre catégories : cette contrainte est remplacée par la table categories.
alter table photos drop constraint if exists photos_category_check;

-- Une photo appartient toujours à une catégorie existante ; une catégorie qui contient des photos ne peut pas être supprimée.
alter table photos drop constraint if exists photos_category_fk;
alter table photos add constraint photos_category_fk foreign key (category) references categories (id) on update cascade on delete restrict;

create index if not exists photos_position_idx on photos (position);

-- Tentatives de connexion à /admin, par adresse : limite les essais répétés (voir features/admin/lib/login-limit.ts).
create table if not exists login_attempts (
  ip text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists login_attempts_ip_idx on login_attempts (ip, attempted_at);
