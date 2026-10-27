# MajestiOS — vitrine publique et application professionnelle en construction

**Branche de travail :** `architecture-v0-1`  
**Statut :** prototype public statique + application Next.js en développement. Le SaaS n'est pas encore opérationnel.

## 1. Deux composants coexistent dans ce dépôt

### Site public statique historique
Fichiers principaux à la racine : `index.html`, `app.js`, `build.js` et ressources associées.

- Présente la proposition de valeur MajestiOS.
- Utilise des exemples fictifs pour le fil d'opportunités et la démonstration.
- Le formulaire est une prévisualisation : aucune demande n'est envoyée ni enregistrée.
- Aucun backend métier, compte client, connecteur, service de facturation ou stockage de demandes n'est implémenté dans ce prototype.

### Application professionnelle Next.js
Application en construction sous `src/app`, avec TypeScript et React.

- Les contrôles automatisés exécutent ESLint et `next build`.
- Les écrans actuels ne prouvent pas à eux seuls qu'une fonction métier est reliée à une base ou opérationnelle.
- La route `/api/health` est un indicateur de prototype ; elle renvoie explicitement `databaseConnected: false`.
- L'architecture cible et le modèle restent à valider avec les tomes de référence avant la création des migrations SQL.

## 2. Démarrer l'application Next.js localement

Prérequis : Node.js 20 ou version compatible avec les dépendances du projet.

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

Commandes disponibles :

```bash
npm run lint
npm run build
npm run start
```

Le fichier de verrouillage npm n'est pas encore versionné dans cette branche ; l'installation n'est donc pas encore figée à l'aide de `npm ci`. L'audit de dépendances doit être exécuté et ses résultats examinés avant de considérer la chaîne d'approvisionnement logicielle comme validée.

## 3. Déploiement : décision en attente

Le fichier `vercel.json` configure actuellement le build historique avec `node build.js` et le répertoire publié `dist`. Il ne correspond pas encore au build Next.js défini dans `package.json`.

Ne pas modifier la configuration de production avant d'avoir choisi et testé une stratégie :
1. conserver la vitrine dans son projet de déploiement actuel et créer un projet distinct pour l'application ; ou
2. effectuer une migration planifiée, testée et réversible.

Aucune des deux stratégies n'est déclarée validée par ce README. Les contrôles CI de Next.js ne prouvent pas que Vercel publie l'application Next.js.

## 4. Documentation de travail

Les documents d'architecture sous `docs/architecture` sont des brouillons de travail. Ils ne remplacent pas les tomes ni leurs arbitrages. Les fichiers suivants recensent les premiers constats :

- `ARCHITECTURE_CIBLE_V0.1.md` — architecture cible proposée, non validée.
- `FEUILLE_DE_ROUTE_MVP_V0.1.md` — phases et jalons de travail.
- `REGISTRE_ECARTS_ET_DECISIONS_V0.1.md` — écarts et décisions ouvertes.
- `MATRICE_CORRESPONDANCE_MODELE_V0.1.md` — correspondance préliminaire entre le modèle métier et l'architecture.

## 5. Garde-fous de développement

- Ne pas confondre le prototype d'interface avec un SaaS fonctionnel.
- Ne pas créer de migrations définitives avant validation du modèle de données et des règles d'accès.
- Lorsqu'un projet Supabase DEV sera approuvé, vérifier l'identité, le tenant, les permissions et le contexte métier côté serveur et en base.
- Ne jamais exposer de secrets dans le navigateur, dans les journaux ou dans le dépôt.
- Tester les refus d'accès inter-tenant, pas seulement les parcours autorisés.
- Ne pas déployer en production sans stratégie validée et approbation explicite.

---
