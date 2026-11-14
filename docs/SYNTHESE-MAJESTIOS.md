# MajestiOS — synthèse (point d'entrée unique)

**Mise à jour :** 14 novembre 2026 · **Statut :** document de travail validé par le porteur du projet sur les points marqués « décidé ».  
Cette page remplace la lecture préalable des dossiers Evolution-5.0 à 8, conservés comme archives.

## 1. Mission en une phrase

Relier **développement commercial, gestion quotidienne, facturation électronique et accompagnement intelligent** dans un environnement tout-en-un, modulaire et ouvert, pour les artisans, TPE et PME. Parcours : Détecter → Comprendre → Qualifier → Décider → Agir → Gérer → Facturer → Capitaliser. Ambition produit, pas état livré. MajestiOS n'est pas une plateforme agréée (PA).

## 2. Où en est le produit (vérifié)

| Domaine | État réel |
|---|---|
| Site public (39 pages, statique) | En ligne en prévisualisation sur la branche de test ; fonds par rubrique, menu à 6 entrées, liens harmonisés ; recette sur appareil réel non faite |
| Recherche BOAMP / BODACC | Moteurs côté navigateur ; résultats réels à recetter par le porteur |
| Espace membre | Connexion par code e-mail pour les membres habilités ; création de nouveaux espaces suspendue (AUTH-01) |
| CRM interne | Code et fondations Supabase présents ; recette multi-rôles non exécutée ; distinct du futur CRM client |
| Facturation électronique | Pages d'information et liens officiels ; aucun module, aucune PA |
| Cheexpeer | Assistant local de première génération sur le site ; API de missions et worker dans Git, déploiement et recette non démontrés |

## 3. Décisions validées (14 novembre 2026)

- **Menu :** 5 rubriques de contenu (Appels d'offres · Développement commercial · Réseau · Services · Assistant) + menu « Accéder à mon espace personnel » (espace, création, accès VIP). Une rubrique = une place. Remplace la décision Evolution-7.
- **Espace personnel :** libellé « Accéder à mon espace personnel » ; lien « Créer mon espace personnel » sans création réelle avant la recette d'authentification.
- **Fonds par rubrique** (13 WebP) et navigation discrète validés ; cube de l'accueil conservé.
- **BODACC :** annonces d'entreprises uniquement (créations, cessions, radiations, procédures).
- **Textes :** une ligne « En préparation. » au lieu des longs avertissements ; le détail des statuts vit ici et dans les registres.

## 4. Risques critiques et suite

Table tenue à jour dans [le dossier des anomalies critiques](CRITIQUES/README.md). Tout ce qui touche Supabase (migrations, policies, secrets, déploiement de fonctions) exige une **autorisation explicite** : le dépôt contient des correctifs préparés, rien n'est appliqué à distance.

## 5. Trajectoire

[Feuille de route stratégique](evolution-9/FEUILLE-DE-ROUTE-STRATEGIQUE-2026-11-14.md) : lots, prérequis, décisions à prendre, ce qui est déjà prêt. Références de fond : [vision 2026–2028](evolution-9/VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md), [plan de réalisation](evolution-9/PLAN-REALISATION-ET-MOYENS.md), [écart site / documentation](evolution-9/ETAT-REEL-SITE-ET-TRAJECTOIRE-2026-11-14.md).

## 6. Règles de vérité (inchangées)

Distinguer proposition, décision validée, code présent, build, déploiement et recette. Pas de promesse de capacité non déployée. CRM interne ≠ CRM client. Jamais de synchronisation automatique des deux projets Supabase. Pas de fusion, production ou PR sans décision du porteur. Détail : [AGENTS.md](../AGENTS.md).

## 7. Carte documentaire

| Niveau | Contenu | Usage |
|---|---|---|
| À lire | cette synthèse · [anomalies critiques](CRITIQUES/README.md) · [feuille de route](evolution-9/FEUILLE-DE-ROUTE-STRATEGIQUE-2026-11-14.md) | Toute intervention |
| Référence | `docs/evolution-9/` (registre, audits, spécifications Cheexpeer et facturation, vision, plan) | Sujet précis |
| Historique | [journaux](historique/JOURNAL-CRITIQUES-2026-11.md) · [Evolution-9 au 13/11](historique/JOURNAL-EVOLUTION-9-2026-11-13.md) · `docs/evolution-5.0` à `evolution-8` · `docs/historique` | Comprendre une décision ancienne ; jamais source d'état courant |
