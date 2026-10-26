# MajestiOS

**Plateforme professionnelle d'intelligence commerciale assistée par IA.**

MajestiOS aide les professionnels à détecter, qualifier et transformer des signaux économiques en opportunités concrètes, puis à capitaliser les informations utiles dans une mémoire d'entreprise.

## Cycle opérationnel

**Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser**

Le modèle métier relie trois niveaux : **Entreprise → Interlocuteur → Décideur**.

Une annonce est une source parmi d'autres : les opportunités peuvent également provenir de marchés publics, de signaux économiques, de recherches documentaires, de sources externes et des interactions avec les utilisateurs.

## Principes structurants

- **ACT — Activity Engine** : historique des appels, rendez-vous, tâches, notes, courriels et actions.
- **KNB — Knowledge Base / Mémoire d'entreprise** : informations qualifiées et réutilisables.
- **PIP — Pipeline** : suivi de la progression des opportunités commerciales.
- **DMH — Décideurs et interlocuteurs** : personnes, fonctions et relations avec les organisations.
- **Staging** : données externes brutes, avec provenance et date de collecte.
- **Analysis** : hypothèses, corrélations et scores, clairement distingués des faits vérifiés.

Les données brutes ne sont pas automatiquement promues dans la mémoire validée. La provenance, la qualité et le statut des informations doivent rester explicites.

## Stack technique cible

- Next.js 15 (App Router), React 19 et TypeScript
- Tailwind CSS et shadcn/ui
- Supabase / PostgreSQL / Auth / Row Level Security
- Vercel
- Zustand lorsque l'état client le justifie
- Zod pour la validation des données

## Modules visés

Tableau de bord, opportunités, entreprises, interlocuteurs et décideurs, CRM/pipeline, réseau professionnel, coach IA, ambassadeurs, analyses, paramètres et administration.

Cette liste décrit la cible fonctionnelle ; elle ne signifie pas que ces modules sont déjà implémentés.

## État du projet

Le dépôt constitue le point de départ de la reconstruction de MajestiOS à partir du cahier des charges. Les fonctionnalités, migrations, permissions, tests et déploiements ne seront déclarés opérationnels qu'après leur implémentation et leur vérification.

Ne jamais committer de clés API, secrets ou fichiers `.env.local`.
