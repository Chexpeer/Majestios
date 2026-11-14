# État réel du site et trajectoire vers la cible documentaire — 14 novembre 2026

**Branche :** `test-ecriture-claude` (copie de travail d'`Evolution-9`, laissée intacte).  
**Statut :** menu à 5 rubriques **validé par le porteur du projet le 14 novembre 2026** ; libellé de l'espace personnel arrêté (§4). Aucune fusion, aucune PR, aucune action Supabase ou production.  
**Rôle :** consigner ce qui a changé dans le site par rapport à la documentation, dire où la documentation devient inexacte, et préparer le chemin vers ce que la documentation attend.

## 1. Pourquoi ce document

Le mandat du 13 novembre (`AGENTS.md` §0 bis) interdisait toute modification visuelle, éditoriale ou de navigation. Le porteur du projet a ensuite autorisé explicitement, **sur la branche de test uniquement**, des évolutions du site. La documentation canonique décrit donc encore un état antérieur. Ce document est la passerelle : il liste les écarts, ne réécrit pas l'historique et ne présente aucune recette non exécutée comme validée.

## 2. Ce qui a changé dans le site (preuves : commits de la branche)

| Sujet | État réel | Commit |
|---|---|---|
| Fonds d'écran par rubrique | 13 fonds originaux WebP (`visuels/fonds/`), posés sur un calque fixe composité ; validés par le porteur ; la page d'accueil et le cube interactif ne sont pas touchés | `6072e60`, `084f866` |
| Barre de navigation | Relief 3D discret, hauteur réduite (40 px), délai de fermeture des sous-menus de 600 ms | `6072e60`, `81b101e` |
| Performance du défilement | `background-attachment: fixed` remplacé par un calque `position: fixed` ; médiane mesurée 330 → 16,7 ms par image (test automatisé sans GPU, non équivalent à une mesure sur appareil réel) | `084f866` |
| BODACC | Le moteur de la page `bodacc-veille-entreprises.html` est limité aux annonces d'entreprises (créations, cessions, radiations, procédures) ; il n'affiche plus de catégories d'appels d'offres | `1dcadb8` |
| Cohérence des rubriques | Doublons de cartes retirés sur Facturation électronique et Suivi commercial ; carte Contact reformulée | `577cb67`, `c855601` |
| Menu principal | **5 rubriques de contenu + le menu d'espace personnel (6 menus), 19 entrées, 19 destinations** (voir §3) | `48c4c5e` |
| Renvoi vers l'espace personnel | Bouton « Créer mon espace personnel » dans la barre ; bandeau de fin de page injecté par `navigation-tiroirs.js` sur les pages de rubrique | `48c4c5e` |
| Textes d'attente | Longs paragraphes « évolution en préparation » remplacés par « En préparation. » sur cinq rubriques | `48c4c5e` |

## 3. Menu : décision documentée vs réalité

**Décision antérieure** (Evolution-7, `REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md` et cahier des charges fonctionnel) : sept rubriques (Appels d'offres, Développement commercial, Réseau, Réputation virtuelle, Espaces privés, Explorer davantage, Assistant), 21 entrées, 19 destinations, lien « Accès VIP · Administration » conservé dans « Espaces privés ».

**Réalité sur la branche de test :**

| Rubrique | Entrées |
|---|---|
| Appels d'offres | Appels d'offres publics · Marchés privés · Accompagnement appels d'offres · Veille des marchés · Sous-traitance |
| Développement commercial | Vue d'ensemble · Prospection · Qualification des entreprises · Veille BODACC · Intelligence économique · Suivi commercial |
| Réseau | Réseau et synergies · Salons & séminaires · Nous rejoindre |
| Services | Réputation virtuelle · Facturation électronique |
| Assistant | Assistant MajestiOS |

Principes appliqués : une rubrique = une seule place (plus de doublon Facturation / Accompagnement entre menus) ; BODACC et Intelligence économique relèvent du développement commercial, pas des appels d'offres.

**Décision du 14 novembre 2026 : le menu à 5 rubriques est conservé.** Il remplace, pour la branche de test, la décision Evolution-7. Écarts correspondants :
1. « Accès VIP · Administration » est une entrée du menu déroulant **« Accéder à mon espace personnel »** (à droite de la barre), avec « Mon espace personnel » et « Créer mon espace personnel » ; la barre n'est pas surchargée. Le lien figure aussi en bas de `espace-membre.html` et `espace-prive.html`. `verify-site.js` vérifie le lien sur `espace-prive.html`.
2. « Réputation virtuelle » n'est plus une rubrique principale mais une entrée de « Services ». Le libellé « Réputation virtuelle » reste employé dans l'interface, conformément à `ARBORESCENCE-CIBLE-V5.md`.
3. Le contrat de `verify-architecture.js` passe de 21/19 à 19/19 et de sept à six menus (cinq rubriques de contenu et le menu d'espace personnel).

## 4. Espace personnel : libellé arrêté le 14 novembre 2026

Décision du porteur : le menu déroulant de la barre et le bouton du bandeau de fin de page s'intitulent **« Accéder à mon espace personnel »**. **Sous** le bandeau figure : « Pas encore d'espace ? **Créer mon espace personnel** », qui renvoie à la section `#creation` de `espace-membre.html`.

Tant que l'AUTH-01 n'est pas recetté (provisionnement OTP non démontré de bout en bout), cette section ne crée rien : elle indique que la création ouvrira après la validation de la connexion sécurisée et propose « Être prévenu de l'ouverture » (page Contact). La connexion reste réservée aux membres déjà habilités (`shouldCreateUser: false`, vérifié par `tests/auth-espace-membre-otp.test.cjs`).

**Rouverture de la création — conditions :** recette AUTH-01 exécutée (déploiement du provisionnement, redirections, e-mails, anti-abus, parcours complet) ; puis seulement remplacement du message de la section `#creation` par le formulaire de création et mise à jour du test de contrat. Aucune promesse de création immédiate ne doit apparaître avant.

## 5. Contrat de cohérence à respecter désormais

- Une rubrique n'apparaît qu'à **une seule place** du menu ; une page ne propose que ce qui relève de sa rubrique (ex. : BODACC → annonces d'entreprises uniquement).
- Les paragraphes d'attente sont limités à une ligne ; le détail des statuts vit dans la documentation, pas dans les pages.
- Le bandeau « Créer mon espace personnel » est injecté par `navigation-tiroirs.js` ; les pages exclues sont : `espace-*`, `crm`, `admin`, `contact`, `nous-rejoindre`, `assistant`, pages légales, `faq`.
- Toute évolution du menu met à jour ensemble `navigation-tiroirs.js`, `verify-architecture.js`, `verify-site.js` et ce document.
- Une capacité décrite n'est pas une capacité déployée : aucun texte public ne doit annoncer Cheexpeer, une PA ou un CRM client comme disponibles.

## 6. Ce que la documentation attend — et où en est le site

Parcours cible : Détecter → Comprendre → Qualifier → Décider → Agir → Gérer → Facturer → Capitaliser.

| Mouvement | Où il vit dans le site | État réel | Prochain pas |
|---|---|---|---|
| Détecter | Appels d'offres publics (BOAMP), marchés privés et BODACC, veille | Moteurs côté navigateur ; résultats réels **non vérifiés depuis l'environnement de travail** (API non joignables) | Recette réelle par le porteur sur le site déployé ; consigner le résultat |
| Comprendre | Accompagnement appels d'offres, intelligence économique | Pages d'information, services « en préparation » | Cheexpeer (lecture de dossiers) — phase H |
| Qualifier | Qualification des entreprises, Prospection | Recherche annuaire public fonctionnelle côté site | Garder « un code APE/NAF n'est pas une preuve de compétence » |
| Décider / Agir | Prospection, Suivi commercial | Parcours d'information | CRM client minimal — phase D |
| Gérer | Espace client, CRM interne | CRM interne ≠ CRM client ; OTP non recetté | AUTH-01, recette multi-rôles — phase B |
| Facturer | Facturation électronique | Page d'information et liens officiels ; aucun module PA | Phase E/F, après noyau de facturation |
| Capitaliser | Suivi commercial, Cheexpeer | Non démontré | Journal de missions Cheexpeer |

## 7. Terrain préparé pour Cheexpeer (première mission)

Selon `SPECIFICATION-PREMIERE-MISSION-CHEEXPEER.md`, la première mission est **`worker_self_check`** (autonomie A0, aucun effet métier, approbation humaine obligatoire). Le site n'a besoin d'aucune promesse nouvelle pour l'accueillir ; ce qui est préparé et ce qui reste bloquant :

| Élément | État | Source |
|---|---|---|
| Handler de diagnostic, tests unitaires, migration d'enregistrement (outil désactivé) | Dans Git | spécification §5 |
| API authentifiée de création, d'approbation et de consultation | **Sources présentes dans Git** (`cheexpeer-mission-submit`, `cheexpeer-approval-decision`, `cheexpeer-mission-read`, 45–55 lignes chacune) ; **déploiement et recette non démontrés** ; la spécification du 11 novembre les décrivait encore comme absentes : à réconcilier |
| Migration `20261111160000…` sur `MajestiOS-Test` | **Non appliquée** | spécification §9 |
| Interface « centre de commande » reliée aux missions | Absente | spécification §5 |
| Recette owner/admin/member/inter-organisations | Non exécutée | spécification §8 |

Le site de la branche de test ne contient aucune clé, aucun appel au pont worker et aucun libellé annonçant Cheexpeer comme actif. L'assistant du site reste un guide local de première génération. **Le câblage de l'API Cheexpeer n'est pas réalisé** ; il exige le déploiement et la recette des trois API serveur ci-dessus (sources déjà dans Git) et une autorisation ciblée sur `MajestiOS-Test`. Une clé exposée dans l'historique de la conversation doit être révoquée par son propriétaire avant tout câblage.

## 8. Feuille de route proposée (dans l'ordre du plan de réalisation)

1. ~~Valider le menu et le libellé~~ — fait le 14 novembre (§3, §4).
2. **Recette réelle** des moteurs BODACC / BOAMP (conduite par le porteur du projet) et des 13 pages à fonds, sur desktop et mobile (non exécutée à ce jour sur appareil réel).
3. **Poursuivre l'épuration** du texte sur Salons & séminaires, Réputation virtuelle, Sous-traitance, Veille des marchés et Accompagnement (en attente d'accord).
4. **Étape B** (socle) : parité Supabase, OTP, RLS ; préalable à tout bouton d'inscription réel.
5. **Étape H** (Cheexpeer) : API d'orchestration → approbation → consultation → recette `worker_self_check`.
6. **Étapes D–F** : CRM client minimal, noyau de facturation, choix d'une PA (conditionnelles).

## 9. Limites de vérification

- Vérificateurs du dépôt (`verify-architecture`, `verify-site`, `verify-doc-links`) et build : réussis sur le commit `48c4c5e` en local.
- Test navigateur automatisé desktop 1440 px et largeur mobile 390 px (absence de défilement horizontal) : réalisés ; **aucune recette visuelle sur appareil réel**.
- Déploiement Vercel de prévisualisation lancé manuellement (les commits signés « Claude » ne déclenchent pas de déploiement automatique) ; page protégée par l'authentification Vercel.
- Les suites CI GitHub de la branche de test ne sont pas démontrées comme exécutées sur ce commit.

## 10. Procédure : créer une API fournisseur et l'attribuer à Cheexpeer

Cheexpeer utilise un fournisseur d'IA **compatible OpenAI** (Chat Completions, sortie JSON Schema stricte) appelé **côté serveur** par une fonction Edge. Rien ne se configure dans le navigateur ni dans Git.

1. **Choisir** fournisseur, modèle (doit gérer la sortie JSON Schema stricte), budget, conservation des données et conditions contractuelles : décision à valider avant toute clé (`LOT-CHEEXPEER-INTEGRATION-2026-11-09.md` §3).
2. **Créer la clé** sur la console du fournisseur : un projet dédié, une clé nommée « cheexpeer-test », un plafond de dépense mensuel, aucune réutilisation d'une clé existante.
3. **Enregistrer trois secrets** dans Supabase (Edge Functions → Secrets), d'abord sur `MajestiOS-Test` : `CHEEXPEER_AI_API_KEY` (la clé), `CHEEXPEER_AI_MODEL` (identifiant exact du modèle), `CHEEXPEER_AI_BASE_URL` (facultatif, HTTPS ; défaut : endpoint OpenAI). Jamais dans `supabase-config.js`, dans un script du site ou dans Git.
4. **Déployer** la fonction `reputation-audit-context` sur le projet de test, après comparaison avec les sources Git (`supabase/functions/README.md`). Sans secrets, elle répond explicitement `collection_only` et ne simule aucun rapport.
5. **Tester** avec un compte de test (quota journalier SQL à vérifier) : une réponse valide, une clé invalide, un modèle incompatible, un fournisseur indisponible. Chaque erreur doit être contrôlée (`CHEEXPEER_AI_*`).
6. **Pour les missions du worker** (autre canal) : secrets distincts `CHEEXPEER_WORKER_ID` et `CHEEXPEER_WORKER_SECRET` pour le pont serveur-à-serveur, jamais réutilisés comme authentification d'un utilisateur (`SPECIFICATION-PREMIERE-MISSION-CHEEXPEER.md` §6).
7. **Documenter** fournisseur, modèle, date, coût et propriétaire de la clé dans le registre ; **faire tourner** la clé à chaque changement de prestataire ; **ne promouvoir** vers `majestios-crm` qu'après revue de sécurité et autorisation explicite.

Aucune de ces étapes n'est exécutée à ce jour : aucun fournisseur, aucun secret et aucun déploiement n'ont été activés.
