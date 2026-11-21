# Plan de migration de l'arborescence — evolution-10 → evolution-11 → evolution-12

**Date :** 21 novembre 2026. **Décision du propriétaire :** sauvegarder `evolution-10`, commencer la migration sur `evolution-11`, la terminer sur `evolution-12`. **Règle absolue :** ne rien perdre de l'acquis.

**Objectifs :** (1) réduire le nombre de pages à la racine ; (2) alléger la navigation ; (3) préparer les prochaines extensions.
**Statut :** plan à valider. Aucune page n'a été déplacée.

## 1. Sauvegardes (faites)

- Branche de secours `backup-evolution-10-2026-11-21` = `evolution-10` au commit `dbbb828` (copie exacte, jamais modifiée).
- `evolution-11` créée à l'identique depuis `evolution-10`. `evolution-10` n'est plus modifiée.
- Base Supabase Test : non touchée par cette migration. Rien n'est fusionné ni en production.
- Les étiquettes Git (tags) sont refusées par le dépôt distant ; la branche de secours remplace l'étiquette.

## 2. Constat (vérifié dans le code)

- 44 pages HTML à la racine, 162 éléments au total (36 JS, 30 CSS, 15 modules, 17 images dans `visuels/`).
- **Toutes les références sont relatives** (`styles.css`, `espace-membre.html`, `./annonces-config.mjs`). Une page déplacée dans un dossier perdrait ses styles, ses scripts et ses liens. Il faut donc d'abord rendre ces références absolues (`/styles.css`).
- Des liens sont aussi construits dans le code (menu `navigation-tiroirs.js`, assistant `app.js`, `catalogue-majestios.js`, parcours, sitemap) et lus par les tests et gardes (`verify-site`, `verify-architecture`, `verify-liens-site`, 28 tests).
- **Authentification :** `espace-membre.html` sert de retour à Google, à LinkedIn et au lien reçu par e-mail ; `accepter-invitation.html` est écrit dans la fonction serveur d'invitation ; `espace-interne` et les pages `admin-*` reconstruisent leur adresse de retour. La liste « Redirect URLs » de Supabase Test autorise l'adresse du site avec `/**`.
- Le dépôt a déjà des redirections Vercel (2) ; ce mécanisme sert aux anciennes adresses.

## 3. Structure cible proposée (à valider)

**Reste à la racine (12 pages)** : `index.html`, `resultats-recherche.html`, et les pages d'espaces privés et d'authentification, **gelées** : `espace-membre`, `accepter-invitation`, `espace-interne`, `espace-prive`, `administration`, `crm`, `admin-annonces`, `admin-cheexpeer`, `admin-recherches`, `admin-utilisateurs`.

| Dossier | Pages (32 déplacées) |
|---|---|
| `/marches/` (8) | marches-publics, marches-prives, **marches-attribues**, veille-marches, accompagnement-appels-offres, bodacc-veille-entreprises, annonces, sous-traitance |
| `/developpement/` (5) | developpement-commercial, prospection-active, qualification-entreprises, suivi-commercial, intelligence-economique |
| `/rubriques/` (8) | les huit `categorie-*` (préfixe `categorie-` retiré) |
| `/reseau/` (2) | reseaux-synergies, nous-rejoindre |
| `/solutions/` (3) | facturation-electronique, reputation-virtuelle, assistant-majestios |
| `/infos/` (6) | faq, contact, vision-majestios, mentions-legales, politique-confidentialite, majestios-v5 |

Résultat : **44 → 12 pages à la racine**. Les pages d'espaces privés pourront être regroupées plus tard, dans un lot séparé, après vérification de la configuration d'authentification distante.

## 4. Navigation allégée (étape finale, à valider avec le propriétaire)

Menu aligné sur les dossiers : **Marchés · Développement · Réseau · Solutions · Mon espace**, au lieu des tiroirs actuels (jusqu'à 20 entrées dans « Développement commercial »). Les sous-entrées restent accessibles ; seules l'organisation et les intitulés changent. Une page d'accueil de chaque dossier sert d'index et prépare les extensions futures.

## 5. Méthode et garde-fous

1. **Un script unique et rejouable** (`scripts/migrer-arborescence.js`) lit une carte `ancienne adresse → nouvelle adresse`, déplace avec `git mv` (l'historique est conservé), réécrit les références, met à jour manifeste, sitemap et gardes. Mode « simulation » obligatoire avant chaque exécution.
2. **Redirections 301/308 Vercel** de chaque ancienne adresse vers la nouvelle, générées depuis la même carte. Aucun lien, favori ni référencement n'est cassé.
3. **Nouveaux tests** : chaque ancienne adresse a une redirection vers un fichier existant ; aucun lien interne cassé ; aucune ressource introuvable ; les pages gelées n'ont pas bougé.
4. Les contrôles actuels (154 tests, `verify-site`, CI GitHub) restent verts à chaque étape. Une étape = un commit, donc un retour arrière simple.
5. Contrôle sur la page de test Vercel de la branche (ancienne adresse → redirection ; nouvelle adresse → 200 ; connexion Google/LinkedIn et lien e-mail inchangés).
6. **Aucune modification de Supabase, des secrets, des comptes, des rôles ni des migrations.** Les pages d'authentification ne bougent pas dans ce chantier.
7. Documentation mise à jour à chaque étape (index, synthèse, AGENTS.md).

## 6. Étapes

**evolution-11 (fondations et pilote)**
- É0 : références absolues partout et carte des adresses centralisée, sans aucun déplacement (aucun changement visible).
- É1 : pilote avec `/rubriques/` (8 pages) + redirections + tests + contrôle en ligne.
- É2 : `/marches/` et `/developpement/`.

**evolution-12 (fin)**
- É3 : `/reseau/`, `/solutions/`, `/infos/`.
- É4 : navigation allégée et pages d'accueil de dossiers.
- É5 : contrôle complet, mise à jour documentaire, sauvegarde finale. La fusion éventuelle reste une décision du propriétaire.

**Option, plus tard, séparément :** ranger les 36 JS et 30 CSS dans `assets/`, et regrouper les espaces privés.

## 7. Décisions à confirmer par le propriétaire

1. Structure et noms des dossiers (§3).
2. Les espaces privés et d'authentification restent à la racine pour ce chantier.
3. Les intitulés du menu (§4), à valider avant l'étape É4.

## 8. Risques identifiés

| Risque | Parade |
|---|---|
| Styles, scripts et liens relatifs cassés après déplacement | É0 : références absolues avant tout déplacement ; test de ressources |
| Liens construits dans le code (menu, assistant, catalogue, sitemap) | Carte unique ; recherche exhaustive ; test des liens |
| Connexion Google/LinkedIn ou e-mail cassée | Pages d'authentification gelées ; contrôle en ligne à chaque étape |
| Perte de référencement et de favoris | Redirections permanentes de toutes les anciennes adresses |
| Tests et gardes liés aux noms de fichiers | Adaptés dans la même étape ; mêmes contrôles qu'avant |
| Erreur irréversible | Sauvegarde `backup-evolution-10-2026-11-21`, commits atomiques, rien fusionné |
