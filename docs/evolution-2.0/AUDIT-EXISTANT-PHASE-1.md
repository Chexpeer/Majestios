# MAJESTIOS — Audit de l'existant (Phase 1)

**Mise à jour documentaire :** 3 novembre 2026 — décisions complémentaires intégrées, sans modification du code.  
**Version :** 0.2 — mise à jour du 3 novembre 2026 après décisions du porteur du projet
**Branche :** `evolution-2.0`, à partir du commit `663829a`
**Date de l'audit :** 3 novembre 2026
**Périmètre :** dépôt `Chexpeer/Majestios`, tel qu'il se trouve sur cette branche
**Statut :** document de travail, à relire et à valider par le porteur du projet

Ce document applique la grille du cahier des charges fondateur (§ 9) : pour chaque point, il sépare ce qui est **constaté** dans le code, ce qui a été **vérifié** en l'exécutant, ce qui n'a **pas pu être vérifié**, puis les **lacunes** et les **propositions**. Aucune décision n'est prise ici : les propositions n'ont aucune valeur tant que le porteur du projet ne les a pas validées.

---

## 1. Résumé

1. **MajestiOS est aujourd'hui un prototype statique** (HTML, CSS, JavaScript natif), sans serveur applicatif, sans base de données, sans authentification et sans aucune persistance de données.
2. **Trois fonctions interrogent de vraies sources publiques** depuis le navigateur du visiteur : la recherche BOAMP, la recherche BODACC et la recherche d'entreprises par code APE/NAF et département. Les deux premières ont des tests automatisés qui passent avec des réponses simulées ; la troisième a des tests de logique qui passent. Les appels réels aux trois services n'ont **pas pu être vérifiés** depuis l'environnement d'audit (réseau restreint).
3. **Le CRM, la veille, la prospection active, l'espace membre, le corpus documentaire et le salon virtuel sont des pages de présentation.** Aucun de ces modules n'enregistre, ne transmet ni ne traite de données. Les pages le disent elles-mêmes.
4. **Le code ne correspond pas au cahier des charges sur les catégories de recherche** : le code contient 8 catégories publiques et 5 + 4 catégories privées, alors que le cahier prévoit 5 catégories publiques et 3 catégories BODACC, à définir par le porteur du projet. Ce point est à arbitrer (§ 6).
5. **Deux contrôles automatiques étaient en échec** (§ 7) : l'un à cause des documents Markdown ajoutés par cette branche, l'autre à cause d'une régression que j'ai introduite le 2 novembre dans l'harmonisation graphique. **Les deux sont corrigés le 3 novembre** après les décisions du porteur du projet ; tous les contrôles exécutables passent.
6. **Une documentation étendue existe sur d'autres branches** (33 documents) et a été restaurée dans `docs/historique/` (§ 11). Les premières versions de cet audit ne la mentionnaient pas.

---

## 2. Méthode et limites de l'audit

**Réalisé**
- Lecture du code source : tous les modules JavaScript, les feuilles de style de la charte, le catalogue, le schéma d'opportunité, les scripts de build et de contrôle, les workflows de CI, le README et les deux documents ajoutés par la branche.
- Exécution : `node build.js`, `node verify-site.js`, `node verify-architecture.js`, les trois tests Node de logique métier, les deux tests navigateur Playwright.
- Rendu des pages dans un navigateur (bureau et mobile) pour l'harmonisation graphique du 2 novembre.
- Recherche d'identifiants, clés ou secrets dans le dépôt : aucun trouvé.

**Non réalisé ou impossible**
- **Appels réels vers BOAMP, BODACC et l'API Recherche d'Entreprises.** Le réseau de l'environnement d'audit refuse ces domaines (échec de résolution de nom). Les tests `boamp-live-smoke.cjs` et `bodacc-live-smoke.cjs` ont donc échoué pour une raison d'environnement, qui ne dit rien de l'état des services. Le comportement réel des services, leurs quotas et leurs conditions d'utilisation restent à vérifier.
- Le déploiement Vercel, les réglages du projet Vercel et le domaine n'ont pas été examinés.
- Les autres branches du dépôt n'ont pas été examinées.
- Aucun test avec de vrais utilisateurs, aucune mesure de performance, aucun audit d'accessibilité complet.

---

## 3. Existant constaté

### 3.1 Technique
| Élément | Constat |
|---|---|
| Contenu | 72 fichiers suivis, dont 32 pages HTML, 52 ressources publiées par le build |
| Langages | HTML, CSS, JavaScript natif ; Node.js 22 pour le build et les tests |
| Serveur | Aucun. Le build copie les fichiers dans `dist/`, servis comme site statique |
| Base de données | Aucune |
| Persistance | Aucune : ni `localStorage`, ni cookies applicatifs, ni stockage serveur trouvés dans le code |
| Authentification | Aucune. Aucun mot de passe, compte ou session |
| Secrets | Aucun trouvé dans le dépôt |
| Hébergement | Vercel (`vercel.json`) : redirections et en-têtes de sécurité (HSTS, etc.) |
| Dépendances | Aucun `package.json` ; Playwright n'est utilisé que par les tests navigateur |
| Intégration continue | Deux workflows GitHub : `verify-site.yml` (tous les push, Node 22) et `majestios-anti-regression.yml` (branches nommées, Node 20) |

### 3.2 Sources de données réellement appelées par le code
| Source | Où | Ce que fait le code |
|---|---|---|
| BOAMP (DILA, via OpenDataSoft) | `opportunity-search.js` | Interroge l'API publique depuis le navigateur ; affiche au plus 10 annonces ; filtre par région (correspondance explicite région → départements) ; filtre les annonces échues |
| BODACC (DILA, via OpenDataSoft) | `opportunity-search.js` | Interroge l'API publique ; récupère les 100 annonces les plus récentes puis filtre par catégorie et mot-clé **dans le navigateur** |
| API Recherche d'Entreprises (DINUM) | `company-targeting.js` | Interroge par code APE/NAF et département, une requête à la fois, avec délai maximal ; dédoublonne par fiche |

Le code est prudent sur les erreurs : une source indisponible produit un message explicite et jamais un résultat fictif ; aucune entreprise ni annonce n'est inventée pour compléter une liste.

### 3.3 Inventaire fonctionnel

Légende : **Réel** = interroge une source réelle ; **Logique réelle** = traitement effectif mais sans données persistantes ; **Simulé** = illustration avec données fictives ; **Maquette** = page de présentation sans traitement ; **Inactif** = prévu, non connecté.

| Fonction | Pages / modules | État | Constat |
|---|---|---|---|
| Recherche de marchés publics | `index`, `marches-publics`, `categorie-*`, `resultats-recherche` ; `opportunity-search.js` | **Réel** (non vérifié en direct) | BOAMP ; catégories reconnues par **mots-clés** dans l'objet de l'annonce, pas par nomenclature officielle |
| Signaux d'entreprises privées | `marches-prives`, `bodacc-veille-entreprises` ; `opportunity-search.js` | **Réel** (non vérifié en direct) | BODACC ; cinq familles ; l'Outre-mer n'est pas pris en charge |
| Immobilier, emploi externe, offres et recherche de sous-traitance | `rubric-search.js`, `opportunity-search.js` | **Inactif** | Sources à connecter, désactivées ; aucun résultat. La cible fonctionnelle a depuis été précisée : immobilier retiré du moteur ; emploi réservé aux annonces utilisateurs/équipe ; annonces externes d'emploi différées vers une éventuelle Veille future |
| Qualification d'entreprises | `qualification-entreprises` ; `company-targeting*.js`, `company-fit.js`, `naf-suggestions.js` | **Réel** (non vérifié en direct) | Recherche par APE/NAF + département ; suggestions de codes par règles fixes (une vingtaine de codes) ; score indicatif ; décision toujours « revue manuelle requise » |
| Démonstration du cycle (signal → hypothèse → action) | `index`, `app.js` | **Simulé** | Trois scénarios fictifs, explicitement signalés comme tels |
| Bandeau « flux de démonstration » | `index` | **Simulé** | Exemples fictifs signalés comme tels |
| Formulaire de demande (accompagnement, réception d'AO, contact) | `nous-rejoindre`, `app.js` | **Maquette** | Valide la saisie puis affiche « n'a pas été transmise » ; aucun envoi |
| Création d'espace personnel | `espace-membre`, `app.js` | **Maquette** | Fenêtre de formulaire ; message « aucune donnée envoyée ni enregistrée » |
| CRM | `crm` | **Maquette** | Six blocs décrits au futur ; la page indique qu'aucun CRM n'est opérationnel |
| Recherche documentaire (base de connaissances, chatbot) | `recherche-documentaire` | **Maquette** | Aucun corpus connecté ni moteur ; la page l'indique |
| Veille économique, prospection active, réseaux, suivi commercial, sous-traitance, accompagnement AO | pages de rubrique | **Maquette + recherche** | Contenu de présentation ; la carte de recherche partagée y est injectée par `rubric-search.js` |
| Salon virtuel | `salons-seminaires` | **Maquette** | Présentation, sans moteur de recherche |
| « Coup de pouce » | `index`, `app.js` | **Logique réelle** | Aide de navigation, pas un assistant conversationnel |
| Immeuble interactif | `index` | **Logique réelle** | Neuf zones polygonales cliquables (test navigateur réussi) |
| Blog des 100 blagues, FAQ, vision, mentions légales, confidentialité | pages éditoriales | **Contenu** | — |

### 3.4 Données et traçabilité
- Un **schéma d'opportunité** existe (`schemas/opportunite.schema.json`) : identifiant interne, identifiant source, type de marché, source, URL, dates, statut. Son en-tête précise qu'il prépare une alimentation future du CRM et ne signifie ni stockage ni connexion active.
- Rien ne l'utilise pour persister des données : il n'y a ni CRM, ni entreprise, ni contact, ni historique enregistrés nulle part.
- La source et l'URL officielle sont bien affichées sur les résultats ; la date de collecte est conservée dans les résultats de qualification d'entreprises.

---

## 4. Vérifications effectuées

| Contrôle | Résultat |
|---|---|
| `node build.js` | Réussi : 52 fichiers copiés, identiques aux sources |
| `node verify-site.js` | Réussi : 32 pages, 52 ressources, liens locaux et identifiants contrôlés |
| `node verify-architecture.js` | Échec le 3 novembre au matin (§ 7.1) ; **réussi** après correction le même jour |
| Tests Node : ciblage d'entreprises, qualification, suggestions NAF | Réussis |
| Test navigateur : immeuble interactif | Réussi |
| Test navigateur : recherche d'opportunités (réponses simulées) | Échec le 3 novembre au matin (§ 7.2) ; **réussi** après correction le même jour |
| Tests de connexion en direct BOAMP et BODACC | **Non exécutables** (réseau de l'environnement) |
| Appel de l'API Recherche d'Entreprises | **Non exécutable** (réseau de l'environnement) |

---

## 5. Lacunes constatées par rapport au cahier des charges

| Exigence du cahier | Constat |
|---|---|
| CRM, cœur de la plateforme (§ 3.2) | Absent : page de présentation uniquement |
| Circuits CRM, publication, veille (§ 4) | Absents : aucune collecte planifiée, aucun stockage, aucune transmission entre fonctions |
| Traçabilité, historique, déduplication à l'échelle de la plateforme | Absents ; seule la déduplication des fiches d'une recherche d'entreprises existe, en mémoire |
| Espaces clients cloisonnés (§ 3.5), droits d'accès | Absents : pas d'authentification ni de notion d'utilisateur |
| Clic sur une annonce → parcours de création d'espace (§ 3.1) | **Non observé dans le code** : les résultats renvoient vers la source officielle ; aucun parcours vers l'espace personnalisé n'est rattaché aux annonces. Une spécification existe dans la documentation historique (`SPEC-PARCOURS-DEPUIS-ANNONCE-MAJESTIOS.md`, statut « proposée — non intégrée ») |
| Pagination, 10 annonces par page (§ 3.1) | **Partiel** : limite de 10 annonces ; aucune pagination trouvée |
| « Je publie mon annonce » | Absente du code ; la catégorie « Offres de sous-traitance » existante ne couvre pas le besoin transversal (emploi, sous-traitance, demande, offre, autres) |
| Emploi MajestiOS | La cible validée réserve les offres d'emploi aux annonces utilisateurs et à celles de l'équipe ; ce circuit n'existe pas encore |
| Sources externes d'emploi | Cadremploi, France Travail et APEC : éventuelle consultation/cache et transmission à la Veille différées ; aucune intégration à développer dans la phase actuelle |
| Veille qualifiée : rapprochement automatique annonce → entreprises (scénario de référence, § 4) | Absente ; la qualification d'entreprises se lance à la main, sans lien conservé avec l'annonce déclenchante |
| Prospection : campagnes, relances, désinscription | Absentes |
| Sécurité, conformité, conditions d'utilisation des sources | Non traitées dans le code ; non documentées |
| Environnements développement / test / production | Un seul flux apparent : branches GitHub et déploiement Vercel ; la configuration Vercel n'a pas été examinée |

---

## 6. Écart sur les catégories de recherche (à arbitrer)

Le cahier prévoit que les catégories soient **définies par le porteur du projet** et que les intervenants techniques ne les inventent pas. Le code contient pourtant des catégories, probablement posées pour le prototype.

| | Cahier des charges | Code actuel |
|---|---|---|
| Recherche publique | 5 catégories à définir | 8 catégories actives (services numériques, travaux et aménagement, conseil et études, bâtiment et construction, rénovation, électricité, plomberie et chauffage, maintenance) ; 5 autres déclarées « prévues » dans le catalogue (fournitures, BTP lots techniques, transport, formation, communication) |
| Recherche privée BODACC | 3 catégories à définir | 5 familles : créations, ventes et cessions, modifications, procédures collectives, radiations |
| Autres privées | Immobilier ; emploi (Cadremploi + APEC) ; publier mon annonce | Immobilier ; emploi ; offres de sous-traitance ; recherche de sous-traitants et partenaires (toutes inactives) |

**Mise à jour du 3 novembre 2026.** La cible a été précisée par le porteur du projet : cinq catégories publiques parmi les plus importantes du BOAMP ; trois catégories BODACC (créations, ventes et cessions, modifications) ; immobilier retiré du moteur ; emploi alimenté uniquement par les annonces utilisateurs et l'équipe MajestiOS ; remplacement de l'entrée Immobilier par « Je publie mon annonce » (emploi, sous-traitance, demande, offre, autres). Cadremploi, France Travail et APEC ne sont pas des sources d'offres d'emploi affichées dans MajestiOS ; leur éventuelle consultation/cache et transmission à la Veille est différée. Le code actuel reste un état historique distinct de cette cible. Aucune modification du code n'est effectuée par cette mise à jour documentaire.

---

## 7. Défauts et risques constatés

### 7.1 `verify-architecture.js` échoue à cause des documents de la branche
- **Constat :** le contrôle refuse tout fichier Markdown autre que `README.md`. Il échoue donc sur `AGENTS.md`, sur le cahier des charges et sur le présent audit.
- **Conséquence :** le workflow `verify-site.yml` s'exécute à chaque push, toutes branches : la CI de `evolution-2.0` est en échec tant que le contrôle n'est pas adapté ou que les documents sont déplacés.
- **Origine :** la règle correspond à l'ancien objectif de la branche `chat-est-une-ordure-sans-docs`, qui voulait un dépôt sans documentation. Elle entre en conflit avec le cahier des charges, qui exige de documenter.
- **Résolu le 3 novembre 2026 :** le porteur du projet a demandé de rétablir la documentation. `verify-architecture.js` accepte désormais le Markdown dans `docs/`, avec `README.md` et `AGENTS.md` à la racine, et refuse qu'un fichier Markdown soit publié avec le site.

### 7.2 Régression que j'ai introduite le 2 novembre
- **Constat :** le test navigateur de recherche d'opportunités échoue : le premier texte d'une carte de résultat (le repère en capitales) s'affiche en 11 px alors que le test exige au moins 12 px.
- **Cause (confirmée) :** dans l'harmonisation graphique (commit `e62da5a`), j'ai ajouté dans `charte-majestios.css` un plancher de taille qui s'applique aussi aux repères des cartes de résultats et les fait passer de 12 px à 11 px.
- **Vérification :** sur une copie de travail, retirer `.eyebrow` du plancher général et limiter la règle aux repères directs de la page (`main.interior-page > .eyebrow`) fait passer le test. Cette correction **n'est pas appliquée** sur le dépôt.
- **Impact :** limité à la lisibilité de ces repères, mais il bloquait la CI.
- **Résolu le 3 novembre 2026 :** le porteur du projet tient à conserver l'harmonisation graphique. La correction retenue est plus ciblée que celle essayée sur copie : une règle supplémentaire redonne 12 px aux repères des cartes de résultats, sans toucher au reste de l'harmonisation. Le test navigateur passe.

### 7.3 Autres constats
1. **Polices non chargées.** Les feuilles de style désignent DM Sans, Manrope et Inter, mais aucune n'est chargée : le site s'affiche avec les polices système du visiteur, donc différemment selon l'appareil.
2. **Styles empilés.** `styles.css` (2 000 lignes environ) superpose plusieurs « chartes » successives corrigées par des règles `!important` ; `charte-majestios.css` les surcharge. La maintenance est coûteuse et le risque de régression visuelle est réel.
3. **Fichier orphelin.** `shared-search.css` n'est référencé nulle part et n'est pas publié par le build.
4. **Filtrage BODACC limité.** Seules les 100 annonces les plus récentes sont récupérées, puis filtrées dans le navigateur : une recherche sur un mot-clé rare ou une catégorie peu fréquente peut ne rien renvoyer alors que des annonces plus anciennes existent. Les messages ne signalent pas cette limite.
5. **Catégories publiques par mots-clés.** La reconnaissance des catégories BOAMP repose sur une liste de mots dans l'objet de l'annonce : approximative, sans nomenclature officielle.
6. **Appels depuis le navigateur du visiteur.** Les trois sources sont interrogées directement par le navigateur de chaque visiteur. Cela expose le site aux quotas et aux évolutions des services tiers, et ne permet ni cache, ni historisation, ni journalisation.
7. **Conditions d'utilisation des sources.** Elles ne sont documentées nulle part dans le dépôt (cahier § 5 et § 6).
8. **Incohérence de version Node.** Le README et `verify-site.yml` indiquent Node 22 ; `majestios-anti-regression.yml` utilise Node 20.
9. **CI de la branche.** Le workflow anti-régression ne cible que deux branches nommées, qui ne comprennent pas `evolution-2.0`.

---

## 8. Ce qui est solide et à préserver

- Une discipline de vérité déjà inscrite dans le code : aucun résultat fictif présenté comme réel, messages d'erreur explicites, mentions « démonstration » et « non transmis ».
- Une qualification d'entreprises qui rappelle systématiquement ses limites (un code APE/NAF ne prouve pas la compétence) et exige une vérification humaine, conformément au cahier (§ 3.3).
- Des tests de logique métier et des tests navigateur qui vérifient les garde-fous (pas de résultat inventé, séparation des sources, absence de débordement mobile).
- Un schéma d'opportunité normalisé, utilisable comme point de départ du modèle de données.
- Une identité visuelle commune bleu nuit et or, appliquée à toutes les pages.

---

## 9. Propositions (aucune n'est une décision)

1. **Arbitrer les catégories** (§ 6), puis consigner la décision dans le cahier fonctionnel (phase 2).
2. **Arbitrer la règle « pas de Markdown »** (§ 7.1) pour remettre la CI au vert sans perdre la documentation.
3. **Corriger la régression de lisibilité** (§ 7.2) : correction de deux lignes déjà testée sur copie, à appliquer sur autorisation explicite pour le code.
4. **Faire de l'audit des sources une première étape de la phase 4** : conditions d'utilisation, quotas, stabilité, coût, avant tout choix de collecte côté serveur.
5. **Traiter les polices et les styles empilés** (§ 7.3) dans une étape distincte, car « la transformation ne commence qu'une fois la plateforme définie » (cahier, principe final).
6. **Rédiger le modèle de données du CRM** (phase 2 puis 4) en partant du schéma d'opportunité existant et du scénario de référence du cahier.

## 10. Décisions et actions

**Décisions validées par le porteur du projet :** voir le cahier des charges, § 11 (décisions du 3 novembre 2026). Le présent audit n'en ajoute aucune.

**Actions réalisées le 3 novembre 2026, sur la branche `evolution-2.0` uniquement :** restauration de la documentation historique, création de l'index `docs/README.md`, adaptation du contrôle `verify-architecture.js`, correction de la régression de lisibilité. Aucune autre branche, aucun déploiement, aucune configuration de production n'a été touché. Le comportement du site n'a pas changé.

**Questions ouvertes pour le porteur du projet :**
1. Quelles sont les cinq catégories publiques retenues après mesure des volumes BOAMP ?
2. Quelles règles précises encadreront le dépôt, l'identification, la validation, la modération, l'expiration et le signalement des annonces utilisateurs ?
3. Quelles règles autoriseront, le cas échéant, l'exploitation interne des annonces dans le CRM, la Veille et la prospection ?
4. La fonctionnalité différée de consultation/cache des sources externes d'emploi et de transfert à la Veille sera réexaminée dans une phase ultérieure.

**Questions tranchées le 3 novembre 2026 :** règle Markdown (documentation rétablie), correction de la régression (faite), conservation de l'harmonisation graphique (conservée).

## 11. Documentation existante découverte pendant la mise à jour

- Deux branches portaient une documentation complète (33 fichiers Markdown chacune) : `chat-est-une-ordure` et `docs/cleanup-documentation-2026-11-02`. La branche de travail `chat-est-une-ordure-sans-docs` n'en avait aucune, d'où l'absence constatée au départ.
- La version restaurée vient de la seconde, plus récente et dotée d'un index de classement ; le dossier `referentiel-connaissances/` (2 fichiers) vient de la première.
- Contenu notable pour la suite : modèle commun de données CRM, modèle des appels d'offres, spécification du parcours depuis une annonce, traitement des signaux BODACC, registre des sources, matrice de traçabilité.
- Contradictions entre ces documents et le cahier 2.0 : voir `docs/README.md`, § 4. Elles sont signalées, non tranchées.
- L'addendum de la branche de nettoyage (2 novembre, 14 h 15 UTC) rappelait que les contrôles CI n'étaient pas tous verts à cette date. Cette mise à jour ne le remplace pas : l'état des contrôles est celui du § 4 ci-dessus.
