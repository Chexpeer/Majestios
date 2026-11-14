# État réel du site et trajectoire vers la cible documentaire — 14 novembre 2026

**Branche :** `test-ecriture-claude` (copie de travail d'`Evolution-9`, laissée intacte).  
**Statut :** document de travail à valider par le porteur du projet. Aucune fusion, aucune PR, aucune action Supabase ou production.  
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
| Menu principal | **5 rubriques, 17 entrées, 17 destinations** (voir §3) | `48c4c5e` |
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

**Écarts à faire arbitrer** (ils contredisent une décision écrite) :
1. « Accès VIP · Administration » n'est plus dans la barre ; il est en bas de `espace-prive.html`. `verify-site.js` a été adapté en conséquence. Le lien reste un simple accès : il ne remplace aucun contrôle d'accès.
2. « Réputation virtuelle » n'est plus une rubrique principale mais une entrée de « Services ». Le libellé « Réputation virtuelle » reste employé dans l'interface, conformément à `ARBORESCENCE-CIBLE-V5.md`.
3. Le contrat de `verify-architecture.js` passe de 21/19 à 17/17 et de sept à cinq rubriques.

## 4. Point de vigilance : le bouton « Créer mon espace personnel »

`espace-membre.html` et `contact.html` indiquent que la création de nouveaux espaces est **temporairement suspendue**. Le bouton mène donc à une page qui précise qu'on ne peut pas s'inscrire. Tant que l'AUTH-01 n'est pas levé (provisionnement OTP non démontré de bout en bout, recette absente), une des deux options s'impose :
- conserver le libellé et ouvrir réellement la création après recette AUTH-01 ;
- ou afficher « Accéder à mon espace personnel » jusqu'à cette recette.

Décision attendue du porteur du projet. Aucune promesse de création ne doit être faite sur le site avant la recette (règle de vérité du README documentaire).

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
| API authentifiée de création, d'approbation et de consultation | **Absente** | spécification §6 A–C |
| Migration `20261111160000…` sur `MajestiOS-Test` | **Non appliquée** | spécification §9 |
| Interface « centre de commande » reliée aux missions | Absente | spécification §5 |
| Recette owner/admin/member/inter-organisations | Non exécutée | spécification §8 |

Le site de la branche de test ne contient aucune clé, aucun appel au pont worker et aucun libellé annonçant Cheexpeer comme actif. L'assistant du site reste un guide local de première génération. **Le câblage de l'API Cheexpeer n'est pas réalisé** ; il exige les trois API serveur ci-dessus et une autorisation ciblée sur `MajestiOS-Test`. Une clé exposée dans l'historique de la conversation doit être révoquée par son propriétaire avant tout câblage.

## 8. Feuille de route proposée (dans l'ordre du plan de réalisation)

1. **Valider** les décisions du §3 (menu) et du §4 (libellé du bouton) → mise à jour du contrat et des registres.
2. **Recette réelle** des moteurs BODACC / BOAMP et des 13 pages à fonds, sur desktop et mobile (non exécutée à ce jour sur appareil réel).
3. **Poursuivre l'épuration** du texte sur Salons & séminaires, Réputation virtuelle, Sous-traitance, Veille des marchés et Accompagnement (en attente d'accord).
4. **Étape B** (socle) : parité Supabase, OTP, RLS ; préalable à tout bouton d'inscription réel.
5. **Étape H** (Cheexpeer) : API d'orchestration → approbation → consultation → recette `worker_self_check`.
6. **Étapes D–F** : CRM client minimal, noyau de facturation, choix d'une PA (conditionnelles).

## 9. Limites de vérification

- Vérificateurs du dépôt (`verify-architecture`, `verify-site`, `verify-doc-links`) et build : réussis sur le commit `48c4c5e` en local.
- Test navigateur automatisé desktop 1440 px et largeur mobile 390 px (absence de défilement horizontal) : réalisés ; **aucune recette visuelle sur appareil réel**.
- Déploiement Vercel de prévisualisation lancé manuellement (les commits signés « Claude » ne déclenchent pas de déploiement automatique) ; page protégée par l'authentification Vercel.
- Les suites CI GitHub de la branche de test ne sont pas démontrées comme exécutées sur ce commit.
