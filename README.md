# Gallery

Mon portfolio de photographies de paysages, avec son espace d'administration. Je le fais par passion : rien n'y est à vendre.

- **Site public** : accueil avec galerie et filtre par catégorie, une page par photo, contact, à propos, mentions légales et droits d'utilisation.
- **Administration** (`/admin`, protégée par mot de passe) : ajouter, modifier, ranger et supprimer les photos et les catégories.

## Technologies

Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, GSAP, Lenis.
Base de données et stockage des photos : Neon. Hébergement : Vercel.

## Démarrer en local

Prérequis : Node.js 24 et pnpm.

```bash
pnpm install
cp .env.example .env.development.local   # puis remplir les valeurs (voir plus bas)
pnpm db:init                             # crée les tables dans la base de développement
pnpm dev                                 # http://localhost:3000
```

## Commandes

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` / `pnpm start` | Build et serveur de production |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm lint` | ESLint |
| `pnpm test` | Tests (`node:test`) : session, mot de passe, adresses de catégories |
| `pnpm db:init` | Applique `db/schema.sql` sur la base de développement |
| `pnpm db:init:prod` | Même chose sur la base de production (`.env.production.local`) |

`db/schema.sql` est écrit pour pouvoir être relancé sans risque. Il n'y a pas d'outil de migration : une évolution du schéma s'ajoute dans ce fichier, puis on relance la commande.

## Variables d'environnement

Le modèle est `.env.example`. Les fichiers `.env*.local` ne sont jamais commités.

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Base Neon (une branche par environnement) |
| `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET` | Bucket Neon (compatible S3) qui contient les photos |
| `ADMIN_PASSWORD` | Mot de passe de l'administration : long et aléatoire (20 caractères ou plus) |
| `SESSION_SECRET` | Secret de signature de la session, 32 caractères minimum |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site, sans `/` final : adresses canoniques, plan du site, aperçus de partage |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL` | Moyens de contact de la page Contact |
| `LEGAL_HOST_NAME`, `LEGAL_HOST_ADDRESS`, `LEGAL_HOST_PHONE` | Hébergeur affiché dans les mentions légales (section masquée si le nom est vide) |

## Organisation du code

```
app/            routes, volontairement fines : (site) public, admin, robots, sitemap, aperçu de partage
features/       une fonctionnalité par dossier : home, photo, photos, categories, admin, contact, about, legal
components/     layout, éléments partagés, composants shadcn/ui
lib/            base de données, session, stockage, métadonnées
db/             schema.sql
scripts/        db-init.mjs
```

## Fonctionnement

- **Photos** : réduites dans le navigateur avant l'envoi (2 000 px au plus), puis revérifiées et converties en WebP par le serveur (sharp), qui efface aussi les métadonnées, GPS compris. Le serveur refuse tout fichier de plus de 4 Mo : Vercel limite les requêtes à 4,5 Mo.
- **Stockage** : bucket privé. Les photos sont servies par des adresses signées (7 jours, arrondies au jour pour que le cache d'images reste efficace). Les fichiers sont rangés sous `prod/` ou `dev/` selon l'environnement.
- **Administration** : un seul administrateur, session signée dans un cookie. Chaque page et chaque action serveur revérifient la session, le `proxy` n'est qu'une première barrière. Les essais de connexion répétés sont limités, et le site envoie une politique de sécurité de contenu (CSP) ainsi que les en-têtes de sécurité usuels.
- **Référencement** : `robots.txt`, plan du site, adresses canoniques, données structurées, et une image d'aperçu de 1 200 × 630 pour chaque photo (`/photos/[id]/og`). L'administration est en `noindex`.

## Mise en ligne (Vercel)

1. Ajouter les variables d'environnement. `DATABASE_URL` pointe vers la branche Neon `production` pour l'environnement Production et vers la branche `dev` pour Preview, jamais vers la production.
2. Renseigner `NEXT_PUBLIC_SITE_URL` avec le vrai domaine.
3. Avant le premier chargement en production, et après chaque ajout au schéma : `pnpm db:init:prod`. Le build, lui, ne touche jamais à la base.
4. Une variable ajoutée ou modifiée demande un nouveau déploiement.

Les fonctions sont placées à Francfort (`vercel.json`, région `fra1`), comme la base et le bucket.

## Intégration continue

Un push sur `dev` ouvre automatiquement une pull request vers `main` (`.github/workflows/auto-pr-dev-to-main.yml`). Le réglage *Settings → Actions → General → Allow GitHub Actions to create and approve pull requests* doit être activé.

## À savoir

Les textes des mentions légales et des droits d'utilisation sont écrits de bonne foi, mais ils n'ont pas été relus par un juriste.
