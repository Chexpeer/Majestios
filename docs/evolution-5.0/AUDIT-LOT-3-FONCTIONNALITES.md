# Lot 3 — Audit fonctionnel des rubriques MajestiOS V5

- **Date :** 4 novembre 2026
- **Branche examinée :** `evolution-5.0`
- **Périmètre :** les 32 pages HTML racine, le catalogue partagé, les scripts de recherche et de qualification, les interactions déclarées et la référence fonctionnelle V5.
- **Principe :** une page descriptive, un lien ou une simulation ne prouve pas qu'un service connecté est opérationnel.

> **Actualisation de périmètre — 5 novembre 2026 :** cet audit décrit l'état observé le 4 novembre. Depuis, une fondation Supabase multi-tenant a été créée, six migrations ont été appliquées et le code d'authentification de l'espace membre a été raccordé. Le flux Auth n'a toutefois pas encore été validé de bout en bout et le CRM reste non opérationnel. Pour l'état courant du backend, consulter [État du backend Supabase](ETAT-BACKEND-SUPABASE.md). Les constats ci-dessous sur le prototype doivent être lus à la date de cet audit.

## 1. Synthèse

Le dépôt contient un prototype statique avec des fonctions effectivement exécutables : navigation, recherche à la demande dans BOAMP et BODACC, recherche d'entreprises via l'API Recherche d'Entreprises, qualification indicative et interactions de démonstration. Il ne contient pas de serveur métier ni de stockage persistant : CRM, comptes clients, communauté, BI, orchestration IA, mémoire, collecte SEO et automatisations ne sont pas opérationnels.

L'audit a trouvé un défaut fonctionnel simple dans le menu partagé : les pages CRM et MajestiOS V.5 associaient deux gestionnaires au même bouton, dont les inversions successives laissaient le menu fermé. Les pages légales employaient un contrôleur inline distinct. Ces pages utilisent maintenant le contrôleur commun `app.js`, et le test d'architecture exige un seul contrôleur commun sur les 32 pages.

## 2. Échelle de qualification

| Qualification | Sens dans cet audit |
|---|---|
| **Opérationnelle dans le prototype** | Une interaction réelle a été vérifiée dans le prototype ; cela ne signifie ni service de production ni persistance. |
| **Partiellement opérationnelle** | Une partie du parcours fonctionne, avec des sources, filtres, volumes ou étapes limités. |
| **Prototype** | Contenu ou interaction de démonstration ; la fonction métier connectée n'est pas activée. |
| **À développer** | La page ou la documentation exprime une cible, mais aucune fonction métier exécutable correspondante n'a été constatée. |

## 3. Matrice des rubriques et parcours

| Domaine et pages examinées | État honnête | Fonction constatée et limites |
|---|---|---|
| **Accueil** — `index.html` | **Partiellement opérationnelle** | Le formulaire construit des critères et route vers les pages de catégorie ou de résultats. L'immeuble propose huit liens de navigation et l'ascenseur pilote l'étage. La recherche appelle des sources externes dans le navigateur ; elle n'enregistre pas les pistes et le guide d'accueil n'est pas un assistant conversationnel. |
| **Espace privé** — `espace-membre.html` | **Prototype** | Le dialogue valide des coordonnées et affiche un aperçu sans créer de compte, transmettre ni enregistrer les valeurs. Dossiers, activité et échanges sont des cartes de présentation. Aucun authentifiant, compte, espace client ou cloisonnement serveur n'est présent. |
| **Réseau** — `reseaux-synergies.html`, `salons-seminaires.html`, `sous-traitance.html` | **Prototype** | Les pages présentent les synergies et conduisent à des parcours associés. Les cartes de showroom/survol sont explicitement en conception ou à prototyper. Aucun annuaire connecté, mise en relation, gestion d'événement ou échange communautaire n'a été constaté. |
| **Développement commercial** — `developpement-commercial.html`, `suivi-commercial.html`, `qualification-entreprises.html` | **Partiellement opérationnelle** | La recherche et la qualification d'entreprises sont utilisables séparément. Le suivi commercial et la capitalisation restent descriptifs : pas de pipeline persistant, activité enregistrée ou tâche de relance. La qualification ne transmet pas les résultats au CRM. |
| **Prospection** — `prospection-active.html` | **Prototype** | La page expose le parcours cible « détecter, identifier, contacter », la recherche partagée et des éléments visuels interactifs. Aucun envoi de message, ciblage automatisé ni suivi de contact n'est implémenté. |
| **Marchés publics** — `marches-publics.html`, `veille-marches.html`, `accompagnement-appels-offres.html` et les huit pages `categorie-*.html` | **Partiellement opérationnelle** | Le moteur interroge BOAMP et les catégories dédiées affichent les annonces récupérées. L'accompagnement, l'analyse de dossier, la préparation de réponse et le dépôt d'une demande ne sont pas connectés. Les catégories partagent un filtrage textuel sur un lot limité de résultats, pas un référentiel métier exhaustif ni une évaluation d'éligibilité. |
| **Marchés privés** — `marches-prives.html`, `bodacc-veille-entreprises.html` | **Partiellement opérationnelle** | Les cinq familles BODACC actives interrogent la source d'annonces. Les catégories immobilier, emploi et sous-traitance sont marquées comme prévues, désactivées et sans source. Les signaux publiés ne sont ni opportunités qualifiées ni appels d'offres. |
| **Réputation virtuelle** — `reputation-virtuelle.html` | **À développer** | La page décrit visibilité locale, avis et SEO et précise que les diagnostics ne sont pas réalisés automatiquement. Aucune API de cartes/avis, collecte de réputation, audit SEO ni publication de réponse n'a été constatée. |
| **Résultats et recherche transversale** — `resultats-recherche.html` et formulaires communs | **Partiellement opérationnelle** | Les filtres, critères, sources BOAMP/BODACC et liens officiels sont raccordés. La recherche mixte présente les sources séparément ; une catégorie spécifique ne peut pas être appliquée aux deux marchés. Les appels sont directs depuis le navigateur, dépendent des APIs et n'alimentent pas le CRM. |
| **Qualification d'entreprises** — `qualification-entreprises.html` | **Partiellement opérationnelle** | Recherche via l'API publique DINUM avec codes APE/NAF et départements, dédoublonnage, suggestions lexicales et score indicatif. Une seule page de résultats source est demandée (`maxPages: 1`). Les suggestions et scores ne prouvent ni capacité, ni compétence, ni éligibilité ; une vérification humaine est nécessaire. |
| **CRM interne** — `crm.html` | **À développer** | Page de périmètre et de présentation uniquement. Aucun stockage de contacts, pipeline, journal d'activité, authentification ou cloisonnement de tenant. |
| **Business Intelligence** — `intelligence-economique.html` | **À développer** | Présentation d'analyses et de signaux ; aucun entrepôt, tableau de bord connecté, calcul décisionnel ou flux de données BI n'a été constaté. |
| **Intelligence centrale MajestiOS V.5** — `majestios-v5.html` | **Prototype** | La page décrit l'orchestration et la mémoire cibles et indique qu'aucun orchestrateur, mémoire persistante ou service IA de production n'est activé. |
| **Information, recrutement et gouvernance** — `vision-majestios.html`, `faq.html`, `nous-rejoindre.html`, `mentions-legales.html`, `politique-confidentialite.html` | **Partiellement opérationnelle / à compléter** | Les pages d'information et leurs navigations existent. La candidature ne transmet pas de demande ; les mentions légales et la politique de confidentialité sont des gabarits incomplets qui doivent être validés avant mise en production ou toute collecte réelle. |

## 4. Fonctions transversales et connexions

| Fonction | État | Écart entre cible et dépôt |
|---|---|---|
| **Moteur de recherche** | **Partiellement opérationnel** | `catalogue-majestios.js`, `rubric-search.js`, `app.js`, `category-results.js` et `search-results.js` raccordent les formulaires. Seules BOAMP et BODACC sont connectées pour les annonces ; toutes les familles privées ne sont pas alimentées. Pas de sauvegarde de recherche ni d'écriture CRM. |
| **Sources officielles** | **Partiellement opérationnelles** | Les appels BOAMP, BODACC et Recherche d'Entreprises sont exécutés côté navigateur. Ils dépendent du réseau, des quotas, CORS et des formats externes ; aucun backend MajestiOS ne les relaie. Les résultats doivent être contrôlés sur le site source. |
| **CRM ↔ recherche / qualification** | **Non connecté** | Les pages parlent d'alimentation CRM future ; aucun transfert, stockage ni consentement de transfert n'est implémenté. |
| **Business Intelligence** | **À développer** | Aucune source consolidée, métrique persistée ni interface de pilotage constatée. |
| **MajestiOS V.5, assistants, IA et orchestration** | **Prototype / à développer** | Pas de service IA, d'orchestrateur, de mémoire persistante ou d'action automatisée opérationnelle constaté. |
| **SEO et réputation** | **À développer** | Le site contient du HTML et des métadonnées statiques ; cela ne constitue pas un outil de suivi des moteurs, de mesure des avis ou de recommandation automatisée. |
| **Automatisations et capitalisation** | **À développer** | Les décisions, relances et enseignements ne sont pas conservés ni déclenchés dans un service persistant. |

## 5. Anomalies et corrections

| Priorité | État avant | Conséquence | Correction / recommandation |
|---|---|---|---|
| **P2 — menu CRM et V5** | `crm.html` et `majestios-v5.html` chargeaient `app.js` et un second écouteur inline sur `.menu-toggle`. Chaque clic inversait deux fois l'état et refermait le menu. Le navigateur a reproduit le menu fermé avant correction. | Les liens principaux étaient inaccessibles via le bouton menu sur ces pages. | Retrait des écouteurs inline ; le bouton utilise uniquement le contrôleur partagé `app.js`. Après correction, le navigateur ouvre le menu, affiche les sept liens et annonce « Fermer le menu ». |
| **P2 — contrôleur des pages légales** | `mentions-legales.html` et `politique-confidentialite.html` avaient un contrôleur inline dédié et ne chargeaient pas le contrôleur partagé. | Comportement du menu divergent et modification du menu à maintenir séparément. | Ajout de `app.js` différé et suppression des contrôleurs inline. La vérification d'architecture impose maintenant `app.js` et interdit le contrôleur inline sur toute page HTML. |
| **P2 — raccourci de l'espace privé** | Le bouton « Besoin d’un coup de pouce ? » (`#open-personal-space-shortcut`) n'était pas lié au dialogue ; seul le bouton principal l'ouvrait. | Une seconde entrée de parcours semblait interactive, mais ne faisait rien au clic. | Les deux boutons ouvrent maintenant le même dialogue de préparation ; le test d'architecture vérifie le sélecteur commun. Le formulaire demeure une simulation sans envoi ni sauvegarde. |
| **P1 avant collecte ou ouverture publique — information légale** | Les deux pages légales indiquent elles-mêmes que les informations requises sont à confirmer ou à compléter. | Ne pas traiter ces gabarits comme les notices finales d'un service public ou d'un traitement réel. | Faire vérifier et compléter les informations par les responsables compétents avant publication définitive ou collecte. Aucune collecte réelle n'a été mise en place dans ce lot. |
| **P2 — couverture des sources et des résultats** | Taxonomie plus large que les flux raccordés ; seules certaines familles sont actives. Les recherches BOAMP prennent un lot limité et appliquent une partie des catégories par correspondance textuelle côté client. | Résultats partiels possibles ; absence de résultat ne prouve pas absence d'opportunité. | Conserver les états « connecté / prévu / non connecté » visibles ; définir couverture, pagination, fraîcheur et règles de catégorisation avant de présenter la recherche comme exhaustive. Aucun faux résultat ni nouvelle intégration n'a été ajouté. |
| **P2 — continuité vers le CRM** | Le parcours s'arrête après affichage ou qualification ; rien ne persiste. | L'utilisateur peut croire qu'une piste, un contact ou un suivi sera conservé si l'interface le suggère. | Maintenir l'avertissement de non-enregistrement. Concevoir stockage, autorisation et transfert avant de connecter le CRM ; cela requiert des décisions d'architecture et n'est pas une correction simple. |

## 6. Bilan avant / après

| Contrôle | Avant | Après |
|---|---|---|
| Menu sur CRM et MajestiOS V.5 | Deux gestionnaires ; le clic observé laissait le menu fermé | Contrôleur partagé unique ; clic observé ouvrant les sept destinations |
| Menu des pages légales | Gestionnaire inline distinct, sans `app.js` | `app.js` chargé en différé ; contrôleur inline retiré |
| Boutons d'ouverture du dialogue privé | Bouton de raccourci non raccordé | Bouton principal et raccourci partagent le même gestionnaire |
| Détection d'une régression de menu | Le test d'architecture ne détectait pas le contrôleur inline abrégé | `verify-architecture.js` exige `app.js` sur les 32 pages et refuse `querySelector(".menu-toggle")` dans les pages |
| État fonctionnel des rubriques | Risque de confondre pages et fonctions cibles | Matrice ci-dessus distinguant les parties opérationnelles, les prototypes et les éléments à développer |
| CRM, espace client, BI et IA | Cibles décrites dans le dépôt | Qualification explicite comme non connectés / non opérationnels ; aucune fonctionnalité fictive présentée comme livrée |

## 7. Contrôles et limites

**Contrôles effectués**

- Lecture de la référence canonique V5, de l'arborescence et des rapports des lots précédents.
- Inspection des 32 pages HTML, des formulaires déclarés, des scripts communs, du catalogue, des gestionnaires de recherche et de qualification.
- Parcours navigateur sur la page CRM avant/après la correction du menu ; après correction, clic d'ouverture et présence des sept liens observés.
- Parcours navigateur sur `espace-membre.html` : le bouton « Besoin d’un coup de pouce ? » ouvre maintenant le dialogue et ses quatre champs ; l'interface indique explicitement qu'aucune donnée n'est transmise ni enregistrée.
- Vérification statique des 32 pages : `app.js` chargé et aucun contrôleur inline de menu ; manifeste UTF-8 : 52/52 ressources présentes.
- Relecture statique des avertissements de prototype et des états `active` / `planned` de la taxonomie.
- `git diff --check`.

**Contrôles non exécutés**

- `verify-site.js`, `verify-architecture.js`, build, tests unitaires et Playwright : non exécutés, car Node.js n'est pas disponible dans l'environnement.
- Vérification navigateur de chaque formulaire et de chaque page, tests multi-navigateurs, mobile, clavier et technologies d'assistance : non exhaustifs.
- Disponibilité exhaustive des APIs, exactitude de toutes les annonces, pagination et exhaustivité des sources : non garanties par les tests précédents ou la seule inspection du code.
- Validation juridique des gabarits et vérification des conditions d'utilisation des sources : hors de ce contrôle technique.
- Aucun déploiement n'a été lancé ; aucune modification n'a été faite à `evolution-3.0`.

## 8. Travaux restants

1. Rendre disponibles Node.js et l'environnement de test, puis exécuter build, vérifications d'architecture, tests unitaires et Playwright.
2. Recetter les recherches et les erreurs réseau sur l'artefact construit, avec critères connus, et vérifier leurs sources officielles.
3. Définir les sources et la couverture attendue pour les familles non connectées, sans les présenter comme actives.
4. Décider l'architecture et la gouvernance avant toute persistance, compte client, CRM ou traitement de données réelles.
5. Développer séparément réseau/événements, accompagnement AO, suivi commercial, BI, réputation/SEO et IA, après critères fonctionnels et autorisations.
6. Faire valider les pages légales avant toute mise en production ou activation d'une collecte.

**Fichiers modifiés pour ce lot :** `app.js`, `crm.html`, `majestios-v5.html`, `mentions-legales.html`, `politique-confidentialite.html`, `verify-architecture.js`, les deux index documentaires et ce rapport.
