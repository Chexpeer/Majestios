# MajestiOS

**Plateforme professionnelle d’intelligence commerciale assistée par IA.**

MajestiOS aide les professionnels à détecter, qualifier et transformer des signaux économiques en opportunités concrètes, puis à capitaliser les informations utiles dans une mémoire d’entreprise.

## Cycle opérationnel

**Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser**

Le modèle métier relie trois niveaux : **Entreprise → Interlocuteur → Décideur**.

Une annonce est une source parmi d’autres : les opportunités peuvent également provenir de marchés publics, de signaux économiques, de recherches documentaires, de sources externes et des interactions avec les utilisateurs.

## Principes structurants

- **ACT — Activity Engine** : historique des appels, rendez-vous, tâches, notes, courriels et actions.
- **KNB — Knowledge Base / Mémoire d’entreprise** : informations qualifiées et réutilisables.
- **PIP — Pipeline** : suivi de la progression des opportunités commerciales.
- **DMH — Décideurs et interlocuteurs** : personnes, fonctions et relations avec les organisations.
- **Staging** : données externes brutes, avec provenance et date de collecte.
- **Analysis** : hypothèses, corrélations et scores, clairement distingués des faits vérifiés.

Les données brutes ne sont pas automatiquement promues dans la mémoire validée. La provenance, la qualité et le statut des informations doivent rester explicites.

## Stack

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS 4, lucide-react
- Supabase / PostgreSQL / Auth / Row Level Security
- Vercel
- Zustand et Zod

## Démarrer en local

Prérequis : Node.js 20 ou supérieur.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Puis ouvrir `http://localhost:3000`. Les pages d’interface utilisent actuellement des données de démonstration. Les variables Supabase peuvent rester vides pour afficher la maquette ; les fonctionnalités qui nécessitent une connexion réelle ne sont pas encore actives.

## Supabase — base de développement

1. Créer un projet Supabase de développement.
2. Dans **SQL Editor**, exécuter uniquement `supabase/migrations/0001_initial_schema.sql`.
3. Renseigner `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`.
4. Tester l’isolation multi-tenant avant d’utiliser des données réelles.

La migration est enregistrée dans GitHub mais n’a pas encore été exécutée sur une base distante. Les schémas métier ne sont pas exposés automatiquement à la Data API ; les permissions doivent être configurées et vérifiées avant de les utiliser depuis l’application.

## État réel au 26 octobre 2026

### Présent dans le dépôt
- Base technique Next.js et configuration TypeScript/Tailwind.
- Navigation principale et tableau de bord de démonstration.
- Pages initiales des modules Opportunités, Entreprises, Décideurs, Activités commerciales, Pipeline, Analyses, Coach IA et Paramètres.
- Première migration SQL multi-tenant avec RLS.
- Variables d’environnement d’exemple.

### Pas encore connecté ou vérifié
- Authentification complète et onboarding utilisateur/organisation.
- Lecture et écriture des données réelles Supabase depuis les pages.
- Fournisseur IA et clés API.
- Téléphonie, e-mail, connecteurs et recherche web automatisée.
- Tests SQL sur une instance Supabase réelle.
- Build de production et déploiement Vercel validés.

Les exemples et chiffres visibles dans l’interface sont fictifs. Ne pas les interpréter comme des données réelles. Ne jamais committer de secrets, de clés API ou de fichier `.env.local`.

## Direction produit

MajestiOS est un outil d’**Opportunity Intelligence** et de développement commercial : il ne se limite ni à un CRM traditionnel, ni à un annuaire, ni à un site de petites annonces. L’objectif est de relier les signaux de marché, les entreprises, les interlocuteurs, les décideurs et les actions commerciales dans un même flux de travail.
