# Plan de migration de l'arborescence — evolution-10 → evolution-11 → evolution-12

**Date :** 21 novembre 2026 (méthode révisée le même jour). **Décision du propriétaire :** sauvegarder `evolution-10`, commencer la migration sur `evolution-11`, la terminer sur `evolution-12`, **sans rien perdre de l'acquis**. Les pages d'espaces privés restent en place sur `evolution-11` et sont rangées sur `evolution-12`.

**Objectifs :** (1) réduire le nombre de pages à la racine du dépôt ; (2) alléger la navigation ; (3) préparer les prochaines extensions.

## 1. Sauvegardes (faites)

- Branche de secours `backup-evolution-10-2026-11-21` = `evolution-10` au commit `dbbb828` (copie exacte, jamais modifiée). Les étiquettes Git (tags) sont refusées par le dépôt distant ; la branche de secours les remplace.
- `evolution-11` créée à l'identique depuis `evolution-10`. La base Supabase n'est pas touchée. Rien n'est fusionné ni en production.

## 2. Méthode retenue : ranger les sources, garder les adresses publiées

**Constat.** Toutes les références des pages sont relatives (`styles.css`, `espace-membre.html`) et ~280 liens sont construits dans le code. Changer les adresses publiées (`/marches/x.html`) obligerait à réécrire environ 1 000 liens, à poser des redirections, et ferait peser un risque sur la connexion (Google, LinkedIn, lien e-mail, fonction d'invitation déployée).

**Méthode.** Les pages sont rangées **en dossiers dans le dépôt** (`pages/<famille>/`) ; le build les publie **à plat, à la même adresse qu'avant**. La règle unique de correspondance est dans `chemins-site.cjs` (build, gardes et tests la partagent).

**Garanties.**
- Le site publié est **identique à l'octet près** avant et après chaque étape (comparaison de `dist/` à la référence de `evolution-10`).
- Le test `tests/adresses-publiees.test.cjs` vérifie que les 146 adresses publiées au 21/11/2026 (liste `ADRESSES-PUBLIEES-REFERENCE-2026-11-21.txt`) restent toutes publiées, sans doublon, en CI.
- Aucun lien, aucune connexion, aucun e-mail, aucun référencement ne peut changer. Aucune redirection nécessaire.
- Aucune modification de Supabase, des secrets, des comptes, des rôles ni des migrations.

Des adresses publiques en dossiers (`/marches/…`) restent possibles plus tard, dans un lot séparé, avec redirections, si le propriétaire le souhaite.

## 3. Structure cible des sources

**Reste à la racine** : `index.html` et `resultats-recherche.html`. Les pages d'espaces privés et d'authentification restent aussi à la racine sur `evolution-11` (décision du propriétaire), puis sont rangées sur `evolution-12` (§6) : `espace-membre`, `accepter-invitation`, `espace-interne`, `espace-prive`, `administration`, `crm`, `admin-annonces`, `admin-cheexpeer`, `admin-recherches`, `admin-utilisateurs`.

| Dossier source | Pages |
|---|---|
| `pages/rubriques/` (8) | les huit `categorie-*` — **fait (pilote)** |
| `pages/marches/` (8) | marches-publics, marches-prives, marches-attribues, veille-marches, accompagnement-appels-offres, bodacc-veille-entreprises, annonces, sous-traitance |
| `pages/developpement/` (5) | developpement-commercial, prospection-active, qualification-entreprises, suivi-commercial, intelligence-economique |
| `pages/reseau/` (2) | reseaux-synergies, nous-rejoindre |
| `pages/solutions/` (3) | facturation-electronique, reputation-virtuelle, assistant-majestios |
| `pages/infos/` (6) | faq, contact, vision-majestios, mentions-legales, politique-confidentialite, majestios-v5 |
| `pages/espaces/` (10) | les pages privées et d'authentification (evolution-12) |

Résultat : **44 → 2 pages à la racine** à la fin de evolution-12 (index et résultats de recherche).

## 4. Navigation allégée (evolution-12, à valider avec le propriétaire)

Menu aligné sur les familles : **Marchés · Développement · Réseau · Solutions · Mon espace**, au lieu des tiroirs actuels (jusqu'à 20 entrées dans « Développement commercial »). Une page d'accueil par famille prépare les extensions. Les intitulés seront soumis au propriétaire avant la modification.

## 5. Garde-fous (à chaque étape)

1. Une étape = un commit (retour arrière simple) ; la CI GitHub doit rester verte.
2. `node build.js` puis comparaison de `dist/` à la référence : identique.
3. Gardes `verify-site`, `verify-architecture`, `verify-liens-site`, tests unitaires (154) et navigateur (16) inchangés dans leurs exigences.
4. Contrôle de la page de test Vercel de la branche : les adresses des pages déplacées répondent comme avant.
5. Documentation et `AGENTS.md` mis à jour.

## 6. Étapes

**evolution-11**
- É0 ✔ : `chemins-site.cjs`, build à correspondance source → adresse publiée, gardes adaptés, test des adresses.
- É1 ✔ : pilote — 8 rubriques rangées dans `pages/rubriques/`, site publié identique.
- É2 ✔ : `pages/marches/` (8 pages) et `pages/developpement/` (5 pages) rangées, site publié identique (146 adresses, 155 tests + 16 tests navigateur, guides verts).

**evolution-12** (créée après sauvegarde de la fin d'evolution-11)
- É3 ✔ (évolution-12) : `pages/reseau/` (2), `pages/solutions/` (3), `pages/infos/` (6) rangées, site publié identique.
- É4 ✔ (évolution-12) : 10 pages privées et de connexion rangées dans `pages/espaces/`, adresses publiées inchangées (liens de retour de connexion et invitations intacts).
- É5 : navigation allégée et pages d'accueil de familles.
- É6 : contrôle complet, documentation, sauvegarde finale. La fusion éventuelle reste une décision du propriétaire.

**Option séparée, plus tard :** ranger les 36 JS et 30 CSS dans `assets/` ; adresses publiques en dossiers avec redirections.

## 7. Risques

| Risque | Parade |
|---|---|
| Une page rangée mais oubliée du manifeste | Test des adresses publiées + garde du manifeste |
| Outil de contrôle qui ne voit plus une page rangée | `listPages` / `resolveFile` partagés ; gardes et tests adaptés ; compte de pages contrôlé (44) |
| Adresse publiée modifiée par erreur | Comparaison `dist/` identique + test des 146 adresses de référence |
| Erreur irréversible | Sauvegarde `backup-evolution-10-2026-11-21`, commits atomiques, rien fusionné |
