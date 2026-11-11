# Evolution-9 — consolidation stratégique et assainissement MajestiOS

**Branche active :** `Evolution-9`  
**Branche de départ :** `Evolution-8`  
**Commit de départ :** `53a780e7f8c3817197611c4cb9948b3c544a90a5`  
**Date :** 11 novembre 2026  
**Mission :** corriger les régressions vérifiables, prévenir les erreurs récurrentes, consolider la documentation et transformer la vision MajestiOS en trajectoire de réalisation mesurable.

## 1. Intention

Evolution-9 ne doit pas être une nouvelle refonte graphique isolée. Elle doit rendre le projet plus cohérent, plus fiable et plus lisible pour le porteur du projet, les développeurs, les partenaires et les futurs utilisateurs.

L'ambition produit est : **MajestiOS — le CRM tout-en-un pour développer, gérer et faire grandir son entreprise.**  
La formule « le premier vrai CRM tout-en-un » exprime une ambition de différenciation ; elle ne doit pas être présentée comme une supériorité concurrentielle démontrée.

Le parcours de valeur devient :

**Détecter → Comprendre → Qualifier → Décider → Agir → Gérer → Facturer → Capitaliser.**

## 2. Références canoniques Evolution-9

Lire dans cet ordre :
1. [Vision stratégique MajestiOS 2026–2028](VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md)
2. [Plan de réalisation et moyens](PLAN-REALISATION-ET-MOYENS.md)
3. [Plan de synthèse documentaire](PLAN-SYNTHESE-DOCUMENTAIRE.md)
4. [Spécification cible CRM, facturation et facturation électronique](SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md)
5. [Cartographie fonctionnelle transversale de Cheexpeer](CARTOGRAPHIE-FONCTIONNELLE-TRANSVERSALE-CHEEXPEER.md)
6. [Audit des interfaces et capacités Cheexpeer](AUDIT-INTERFACES-CHEEXPEER-2026-11-11.md)
7. [Registre des anomalies Evolution-9](REGISTRE-ANOMALIES-EVOLUTION-9.md)
8. [Architecture cible CRM tout-en-un Evolution-8](../evolution-8/ARCHITECTURE-CIBLE-CRM-TOUT-EN-UN.md)
9. [Audit de l'existant établi sur Evolution-7](../evolution-7/AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md)

Les documents datés Evolution-5 à Evolution-8 restent des preuves historiques et des sources de détail. Ils ne doivent pas être supprimés ni considérés automatiquement comme des décisions actuelles.

## 3. Règles de branche et de sécurité

- Travailler exclusivement sur `Evolution-9`.
- Préserver `Evolution-8`, `Evolution-7`, `main` et les branches historiques.
- Ne pas fusionner, rebaser, supprimer ou promouvoir une branche sans autorisation explicite.
- Ne pas modifier Supabase distant, ses migrations appliquées, ses politiques RLS, ses paramètres Auth, ses données ou ses secrets dans ce chantier documentaire et de fiabilisation sans validation spécifique.
- Ne pas déployer en production. Les déploiements autorisés pour Evolution-9 sont des prévisualisations.
- Ne jamais confondre code présent, code déployé, fonction connectée et parcours recetté.
- Ne jamais annoncer une fonction CRM client, facturation, PA ou autonomie Cheexpeer comme opérationnelle sans preuve de bout en bout.

## 4. Boucle obligatoire

**Détecter → Qualifier → Corriger → Tester → Comparer → Documenter → Enregistrer.**

Chaque anomalie doit avoir :
- un identifiant stable ;
- une description reproductible ;
- sa gravité et son périmètre d'impact ;
- une cause racine ou une hypothèse clairement identifiée ;
- une correction minimale et réversible ;
- un test de non-régression ;
- une vérification des liens locaux des documents canoniques via `node verify-doc-links.js` ;
- une preuve de commit et de résultat ;
- un statut honnête : ouvert, corrigé dans le code, déployé, recetté ou bloqué.

Une correction de code n'est pas une clôture. Un build Vercel réussi ne prouve ni les tests GitHub Actions, ni le rendu navigateur, ni la sécurité multi-tenant.

## 5. Lots de travail

| Lot | Objet | Livrable / critère |
|---|---|---|
| E9-00 | Reprise des anomalies | Revue du registre Evolution-7/8, tri des doublons, causes racines et priorités |
| E9-01 | Fiabilisation CI et build | Contrats alignés, fichiers de tests présents, vérifications de manifeste et de routes cohérentes |
| E9-02 | Audit transversal du site | Navigation, liens, formulaires, recherche, responsive, accessibilité et SEO |
| E9-03 | Audit CRM et Supabase | Parité des environnements, migrations, RLS, Auth, RPC, stockage, sauvegarde ; sans changement distant non autorisé |
| E9-04 | Audit Cheexpeer | Worker, outils, permissions, coûts, validations, mémoire gouvernée et limites réelles |
| E9-05 | Synthèse documentaire | Index court, vision canonique, architecture, feuille de route et archives reliées |
| E9-06 | Traduction en plan produit | Priorités, dépendances, critères d'acceptation, coûts et indicateurs |
| E9-07 | Prévisualisation et recette | Tests statiques, CI, navigateur, mobile/desktop et rapport des écarts |

## 6. État initial connu

- Evolution-8 a construit une première vitrine et une page d'information sur la facturation électronique.
- Le menu contient 20 entrées secondaires et 18 destinations uniques.
- L'anomalie NAV-01, qui laissait le vérificateur d'architecture sur les anciens nombres 18/17, a été corrigée sur Evolution-8 dans le commit `4f471c06e7bf5dbbf9c88339a2ea0ed23d2f03c8`.
- La correction a été documentée ; le build Vercel de prévisualisation du commit `53a780e7f8c3817197611c4cb9948b3c544a90a5` est READY et copie 81 fichiers.
- Ce build ne vaut pas preuve d'exécution des tests CI ou des tests navigateur.
- Les anomalies Supabase, Auth, multi-tenant et Cheexpeer listées dans les registres antérieurs restent ouvertes tant qu'elles n'ont pas reçu leurs preuves de clôture.
- Le projet Vercel actuellement relié au dépôt dans l'équipe consultée est `majestios`. Les anciens statuts de projets ou contextes ne doivent pas être confondus avec une connexion active.

## 7. Définition de terminé

Evolution-9 est prête à être évaluée lorsque :
1. les erreurs prioritaires ont été corrigées ou explicitement bloquées avec une raison ;
2. les contrôles automatisés pertinents sont verts, ou leurs limites sont expliquées ;
3. le site n'a pas perdu de routes, de fonctions ni de contenus utiles ;
4. les risques Supabase et Cheexpeer sont classés avec des plans de recette ;
5. la documentation stratégique est cohérente, concise et reliée aux spécifications détaillées ;
6. chaque promesse publique correspond à une capacité disponible ou est clairement présentée comme une ambition ;
7. aucune production ni donnée réelle n'a été modifiée par inadvertance.


## 8. Avancement documentaire — 11 novembre 2026

- Branche `Evolution-9` créée depuis le commit exact `53a780e7f8c3817197611c4cb9948b3c544a90a5` d'Evolution-8.
- Vision stratégique 2026–2028, plan de réalisation, plan de synthèse documentaire et registre d'anomalies créés.
- `docs/README.md` raccourci et réorganisé autour des références canoniques Evolution-9 ; les documents historiques restent conservés.
- `AGENTS.md` et le dossier central des anomalies critiques pointent désormais vers la branche active.
- Script `verify-doc-links.js` ajouté ; le workflow `verify-site.yml` l'exécute après les contrôles de site. Son exécution a réussi dans la suite GitHub Actions du commit `2438d8fd96f8e1d10676b8d193a5e99247096c67`.
- Aucun document historique n'a été supprimé ni déplacé.


## 11. Épuration éditoriale du site — 11 novembre 2026

- [Première passe](EPURATION-EDITORIALE-SITE-2026-11-11.md) : pages d'accueil, développement commercial, appels d'offres, contact et FAQ.
- [Deuxième passe](EPURATION-EDITORIALE-PASSE-2-2026-11-11.md) : réseau, veille, intelligence économique, sous-traitance, suivi commercial et salons.
- [Troisième passe](EPURATION-EDITORIALE-PASSE-3-2026-11-11.md) : retrait d'un vestige de l'ancienne représentation en étages sur la page Développement commercial.

Les modifications éditoriales conservent les limites de disponibilité et les validations humaines. Les fonctions, routes et parcours ne sont pas retirés au seul motif de raccourcir les textes.

## 10. Prévisualisation Evolution-9

**URL de prévisualisation de branche :** https://majestios-git-evolution-9-majistr.vercel.app

**Déploiement READY du commit testé :** https://majestios-l9b0ne1i9-majistr.vercel.app

Le déploiement de prévisualisation Vercel du commit `f87cc16fa9c4c155b73483e2059a72c9f487ef31` est `READY`. Le build confirme 81 fichiers copiés depuis `site-files.json` sans différence avec les sources. Le projet Vercel utilisé est `majestios`, seul projet relié au dépôt dans l'équipe consultée.

Cette prévisualisation confirme le build du site sur son commit source. La suite GitHub Actions a également réussi sur ce même commit `f87cc16fa9c4c155b73483e2059a72c9f487ef31`. Aucune promotion en production n'a été effectuée.


## 11. Audit CRM et Supabase — 11 novembre 2026

Le contrôle en lecture seule des deux projets Supabase, de la configuration frontend, des migrations, des tables/RLS, des fonctions Edge et des RPC est consigné dans [AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md](AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md). Le site pointe actuellement vers `majestios-crm` (22 migrations), tandis que `MajestiOS-Test` en possède 39 ; les environnements ne sont pas synchronisés. Aucun changement distant n'a été effectué.

**CI Evolution-9 :** run [43011364291](https://github.com/Chexpeer/Majestios/actions/runs/43011364291), commit `0c919df639cef0849508445e63c1f6aa6eb78f83`, conclusion `success`.


## 12. Clarification des environnements Supabase — 11 novembre 2026

`MajestiOS-Test` est l'environnement de test/recette et `majestios-crm` est le projet actuellement ciblé par le frontend. Leurs 39 et 22 migrations reflètent des périmètres différents ; cet écart n'est pas à corriger par synchronisation automatique. Le CRM du projet principal reste verrouillé VIP owner/admin ; le socle multi-tenant et le worker Cheexpeer en mode `readiness_probe` sont sur le projet de test. Voir l'addendum du rapport d'audit pour les droits RPC et les limites précises. Aucune écriture distante n'a été effectuée.

## 13. Points bloquants CRM confirmés — 11 novembre 2026

Le contrôle SQL des privilèges et triggers précise deux écarts sur le projet actuellement utilisé par le site (majestios-crm) : les droits UPDATE du rôle authenticated restent larges sur les colonnes des tables entreprises, contacts et opportunités ; les triggers d'historisation des modifications CRM ne sont pas présents. Les migrations de restriction des colonnes et d'historisation atomique sont donc à valider sur MajestiOS-Test avant toute promotion contrôlée. Ne pas les appliquer directement au projet principal sans revue, sauvegarde et autorisation.


## 14. Facturation intégrée au CRM — cadrage phase 2

La facturation est un domaine métier constitutif du CRM tout-en-un, préparé dès maintenant mais développé dans la deuxième phase. Le parcours cible relie devis, commande/prestation, facture, transmission électronique via PA partenaire, statuts/rejets, règlement et archivage.

Trois modes doivent être prévus : CRM natif MajestiOS, CRM/logiciel externe conservé par le client, ou mode hybride. Une source de référence est définie pour chaque catégorie de données afin d'éviter les doubles factures et les divergences. Le moteur de facturation reste indépendant de l'écran CRM et de tout partenaire PA particulier.

Référence fonctionnelle : [Spécification cible CRM, facturation et facturation électronique](SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md). Cette cible n'est pas une capacité opérationnelle actuelle : aucun module de facturation connecté à une PA n'a été démontré lors de l'audit.

## 15. Protocole de recette CRM — préparé, non exécuté

Le protocole [PROTOCOLE-RECETTE-CRM-MAJESTIOS-TEST.md](PROTOCOLE-RECETTE-CRM-MAJESTIOS-TEST.md) définit les scénarios de recette sur `MajestiOS-Test` : rôles, création et relations CRM, historisation, relances, permissions SQL et isolation entre deux organisations. Il sépare les tests du CRM interne VIP de ceux du futur CRM client multi-tenant.

**Statut : préparé / NOT RUN.** Aucune donnée distante n'a été créée et aucune migration n'a été appliquée. L'exécution nécessite des identités synthétiques, la vérification préalable des objets réellement déployés et une validation explicite du plan d'écriture et de nettoyage.

## 16. Provisionnement des identités de recette CRM

La procédure [PROVISIONNEMENT-IDENTITES-RECETTE-CRM.md](PROVISIONNEMENT-IDENTITES-RECETTE-CRM.md) décrit la création Auth, les memberships administratifs et les garde-fous. L'intégration actuelle ne disposant pas d'une action Auth Admin, aucune identité n'est créée automatiquement et aucun contournement SQL de `auth.users` n'est admis.


## 17. Audit de non-régression Evolution-7

La référence fonctionnelle et visuelle reste Evolution-7. L'audit [AUDIT-NON-REGRESSION-FONCTIONNELLE-EVOLUTION-7.md](AUDIT-NON-REGRESSION-FONCTIONNELLE-EVOLUTION-7.md) documente la comparaison des fichiers, la restauration de l'accueil centré sur la recherche, l'harmonisation des menus, la matrice de conservation des rubriques et les preuves CI. La facturation électronique s'ajoute sans remplacer le socle existant. La recette visuelle page par page et la recette CRM multi-identités restent des conditions de clôture.


## 18. Exigence de navigation commune — NAV-04

La barre de navigation publique doit être identique sur toutes les pages publiques publiées : mêmes familles, intitulés, ordre, liens, géométrie, styles, sous-menus et comportements desktop/mobile. L'entrée VIP doit rester intégrée à la charte MajestiOS. Le CRM et les cockpits privés conservent leurs navigations métier dédiées, mais leur cohérence avec le langage visuel commun et leurs exceptions doivent être contrôlées explicitement.

Le test navigateur compare désormais la structure de navigation sur chaque page HTML publique du manifeste. **Statut : test ajouté, exécution CI et recette visuelle non encore confirmées.** Voir NAV-04 dans le registre des anomalies.


## 19. Identité graphique commune — UX-02

Toutes les pages MajestiOS, publiques comme privées, doivent partager une même grammaire visuelle : bleu nuit, or et chrome/acier, typographies, hiérarchie, composants, états et responsive cohérents. Les surfaces peuvent varier selon leur usage (ex. cockpit sombre et formulaires clairs), mais ne doivent jamais sembler provenir d'une autre marque. L'espace VIP, le CRM, l'administration et l'espace collaborateurs sont inclus. La feuille `charte-majestios.css` existe déjà, mais sa présence partielle ne prouve pas l'harmonisation de toutes les interfaces.

**Statut : exigence documentée, audit visuel et corrections non réalisés à ce stade.** Voir UX-02 dans le registre des anomalies. Préserver toutes les fonctions et les contrastes ; ne pas confondre uniformité de marque et fond sombre obligatoire.


## 21. Source unique de la charte graphique — 11 novembre 2026

Les valeurs fondamentales (bleu nuit, or, acier/chrome, typographie, rayons, ombres et focus) sont centralisées dans `charte-majestios-tokens.css`. La feuille publique `charte-majestios.css` et la couche des espaces privés `charte-majestios-espaces.css` consomment cette source commune. Cela évite de recopier les valeurs dans les interfaces et permet de garder des surfaces claires ou sombres selon le métier.

La recette navigateur a révélé que certaines pages historiques utilisent la classe `.menu-toggle` sans identifiant `menu-toggle`. Le script partagé accepte les deux formes ; le test a été aligné sur ce contrat au lieu d'imposer une modification inutile des pages. **Statut :** code intégré ; validation CI et revue visuelle restent nécessaires.


## 22. Fiabilisation des tests de navigation — 11 novembre 2026

La recette mobile compare désormais les pages publiques avec le sélecteur commun `.menu-toggle`, compatible avec le script de tiroirs qui accepte classe ou identifiant. La passerelle `espace-prive.html`, autonome et `noindex`, reste hors de la comparaison publique. Une assertion d'URL de l'espace Assistant a été corrigée après constat que la navigation ouvrait la bonne page mais que la regex du test la rejetait.

**Statut :** correctifs de test intégrés ; run CI complet encore attendu. Ne pas considérer NAV-04 comme clôturée avant le succès du navigateur et les captures visuelles.


## 23. Recette CI complète — 11 novembre 2026

La suite GitHub Actions a réussi sur le commit `92344c68f075c5631493f451123959dc850f78f3` : [run 43042242471](https://github.com/Chexpeer/Majestios/actions/runs/43042242471). Résultats vérifiés : build de 86 ressources, architecture de 39 pages HTML, liens locaux et identifiants, 14 documents canoniques, tests navigateur Prospection, BOAMP et BODACC, navigation publique desktop/mobile, moteur de recherche, Réputation virtuelle, formulaire de contact sans transmission et verrouillage du cockpit sans session.

**Limites restantes :** la réussite CI ne vaut pas recette visuelle multi-pages. Les captures avant/après et l'inspection réelle des espaces CRM, VIP, administration et collaborateurs restent à réaliser. La branche Evolution-9 n'a pas de protection de branche activée ; aucune modification de cette règle n'a été effectuée. Aucun déploiement ni changement Supabase distant n'a été déclenché.


## 24. Prévisualisation de recette — 11 novembre 2026

La prévisualisation Vercel de la branche Evolution-9 est **READY** sur le commit `2c2bc988c71f3178b3ea33ab1bebcde725dba5cf`, également validé par la CI complète :

- URL directe : https://majestios-q75r1hk52-majistr.vercel.app
- Alias de branche : https://majestios-git-evolution-9-majistr.vercel.app
- Projet Vercel unique : `majestios`.

La protection SSO du projet reste active. Le rendu n'a pas pu être inspecté automatiquement sans authentification ; les captures comparatives et la recette visuelle restent donc ouvertes. Aucun déploiement production ni changement Supabase distant n'a été effectué.


## 25. Prévention des régressions de charte — 11 novembre 2026

Le vérificateur d'architecture contrôle maintenant que les tokens sont déclarés une seule fois, importés par les feuilles publiques et privées, publiés dans le manifeste et chargés sur les quatre espaces privés de référence. Ce contrôle empêche le retour de variables graphiques privées non raccordées à la charte commune.

**Limite :** le contrôle est structurel ; il ne certifie pas le contraste ni la qualité du rendu visuel. La recette par captures reste nécessaire.


## 26. Reprise de l'audit CRM — état vérifié au 11 novembre 2026, 15:00

La CI Evolution-9 est verte sur le HEAD `905041b6c736a1c66adade91561beb623c67a1fe` ([run 43042947816](https://github.com/Chexpeer/Majestios/actions/runs/43042947816)). Le contrôle comprend les tests statiques CRM, les parcours navigateur desktop/mobile et les vérifications d'architecture.

La reprise de l'audit CRM confirme que le CRM interne actuel couvre entreprises, contacts, opportunités, activités et relances persistantes. Il ne comporte pas de facturation opérationnelle. La facturation électronique reste une phase 2, cadrée comme un domaine distinct (MajestiOS Facturation + MajestiOS Connect), et non comme une simple extension de tables CRM.

Les points bloquants restent distants : privilèges UPDATE trop larges et historisation incomplète sur `majestios-crm`, ainsi que l'absence de recette multi-rôle/inter-organisation exécutée sur `MajestiOS-Test`. Les migrations correctives présentes dans Git ne sont pas appliquées à distance. **Aucune écriture Supabase ni aucun déploiement de production n'a été réalisé.**


## 27. Audit Cheexpeer — première passe worker — 11 novembre 2026

L'audit du code du worker et du pont serveur confirme un socle d'exécution sécurisé en mode bootstrap, mais pas encore un agent métier opérationnel : seul le type `readiness_probe` à autonomie 0 est exécuté ; les autres types sont refusés en l'absence de handler revu. Le pont impose un secret serveur indépendant, une liste blanche d'actions RPC et des limites de taille/format.

Une anomalie de CI a été corrigée : le workflow spécialisé worker n'était pas déclenché sur les pushes Evolution-9. La branche active est maintenant incluse et un test de contrat protège ce déclenchement. **Résultat du run spécialisé après correction : en attente.**

Le renouvellement de bail existe côté pont/RPC mais n'est pas encore appelé par le worker. C'est acceptable pour le probe court actuel, mais doit être traité avant toute mission longue. Le déploiement actuel du pont et le raccordement distant n'ont pas été revérifiés dans cette passe ; aucun changement Supabase n'a été effectué.

Voir CHX-05 à CHX-08 dans le [registre des anomalies](REGISTRE-ANOMALIES-EVOLUTION-9.md). Prochaine étape : contrôler la nouvelle CI, puis préparer la recette du worker sur `MajestiOS-Test` sans écrire sur l'environnement avant autorisation ciblée.


**Mise à jour CI worker :** le workflow spécialisé a réussi sur le commit `e401eb13be6ad395d4f63a596f2761efd07aefe5` (run [43044831310](https://github.com/Chexpeer/Majestios/actions/runs/43044831310)) : syntaxe Node/Edge et tests de politique/contrat validés. La CI globale du site sur le HEAD documentaire suivant est encore en cours de vérification. Cette réussite ne constitue pas une recette distante.


## 28. Assistant actuel et périmètre réel de Cheexpeer

Le widget « Parler à MajestiOS » est un guide local à mots-clés, sans appel IA, mémoire persistante, mission ni action métier. La page Assistant indique elle-même que l'IA reste à raccorder : **ce guide n'est pas Cheexpeer**.

La brique Réputation virtuelle possède une collecte automatique limitée au contexte administratif officiel et aux annonces BODACC ; Google Web/Maps restent manuels et les plateformes sociales sont planifiées. L'analyse IA dépend d'une configuration serveur effective et peut légitimement retourner une collecte seule. La vision Cheexpeer community manager LinkedIn est spécifiée, mais aucun connecteur de compte, calendrier, publication, interactions ou analytics n'a été identifié dans le périmètre de code consulté. Drive et veille SEO restent également des objectifs à construire.

La maturité détaillée et les conditions d'activation figurent dans CHX-09 à CHX-12 du registre. Prochaine étape technique recommandée : concevoir un premier parcours de mission non sensible, avec worker/bridge déployés sur le seul environnement de test après autorisation, puis une recette complète avant d'ouvrir les connecteurs engageants.


**Garde-fou d'approbation :** la RPC privée d'approbation reçoit un identifiant d'acteur en paramètre et vérifie son rôle dans l'organisation ; toute future API devra dériver cet identifiant côté serveur depuis une session vérifiée, jamais depuis une valeur libre envoyée par le navigateur. Le pont worker ne propose actuellement pas cette action. Voir CHX-13.


## 29. Première mission Cheexpeer — diagnostic contrôlé

La première mission technique préparée est worker_self_check : diagnostic A0 du worker, sans accès aux données métier ni effet externe. Le handler vérifie la version Node, l'identité worker, le format de l'endpoint Supabase et la validité du bail. Il renouvelle le bail avant de finaliser.

Le code worker Evolution-9 contient deux handlers de diagnostic sans effet métier : bootstrap et worker_self_check ; les autres missions sont refusées en l'absence d'un exécuteur revu. Le dernier audit distant disponible décrivait le worker déployé sur MajestiOS-Test comme limité à readiness_probe : la version réellement déployée doit être recontrôlée. **Ce n'est pas encore un parcours opérationnel complet** : il manque l'API utilisateur authentifiée pour soumettre, approuver et consulter les missions, ainsi que le raccordement et la recette de bout en bout sur MajestiOS-Test.

Référence de travail : [Spécification de la première mission Cheexpeer](SPECIFICATION-PREMIERE-MISSION-CHEEXPEER.md). Voir CHX-14 à CHX-17 dans le registre. Aucune migration distante, activation de tool, mission réelle ou configuration Supabase n'a été effectuée.


## 9. Correctifs de non-régression visuelle — 11 novembre 2026

Après la première prévisualisation Vercel d'Evolution-9, une vérification utilisateur a révélé quatre régressions visibles : moteur Google Web/Maps masqué dans Réputation virtuelle, barre de navigation incohérente selon les pages, accès VIP non harmonisé et accueil insuffisamment contrasté. Ces points avaient déjà été demandés et ne doivent pas être requalifiés en nouvelles préférences.

Correctifs appliqués dans le code :
- restauration visible des formulaires Google Web et Google Maps dans Réputation virtuelle ; le dossier d'audit reste masqué tant que l'utilisateur ne le demande pas ;
- chargement des composants de navigation tiroir sur la page Réputation virtuelle et ajout de son accès VIP via le menu « Espaces privés » ;
- couche corrective commune pour uniformiser le bandeau en bleu nuit/or, le tiroir et son bouton mobile ;
- couche de contraste renforcée sur l'accueil afin que l'image décorative ne blanchisse plus la zone héro.

**État :** correctifs commités sur Evolution-9 ; tests navigateur et nouvelle prévisualisation à exécuter. Aucun changement Supabase et aucune promotion en production.

## 30. Reprise de l'audit CRM — ciblage entreprises — 11 novembre 2026

La revue du formulaire de ciblage a identifié puis corrigé une validation APE/NAF et département qui rejetait les formats usuels à cause d'antislashs doublés dans les regex JavaScript. Des assertions de non-régression ont été ajoutées. La correction est intégrée au code Evolution-9 ; la CI du commit correctif reste à confirmer.

Le ciblage actuel ne parcourt qu'une page de l'API publique et ne peut donc pas être qualifié d'exhaustif. Les anomalies distantes CRM-06 (droits UPDATE et historisation sur majestios-crm) et CRM-07 (recette multi-tenant non exécutée sur MajestiOS-Test) restent ouvertes. Aucun changement Supabase n'a été effectué.


## 31. État de la CI et reprise des anomalies — 11 novembre 2026, 19:04 UTC

Le HEAD vérifié de `Evolution-9` est `0606808e48e5b8d4e36dfbb731420b051c42c0ce`. Le workflow [43083493088](https://github.com/Chexpeer/Majestios/actions/runs/43083493088), déclenché par push sur cette branche et associé exactement à ce SHA, est terminé avec la conclusion **success**. Le job `verify-static-site` est lui aussi en succès ; toutes les étapes rapportées sont terminées avec succès, y compris les tests navigateur de navigation classique, recherche, Réputation virtuelle, menus desktop/mobile, contact et verrouillage du poste de commande sans session.

Le comparatif depuis le commit `3b9c432dd7ba9048819a5f19f2a143843aa66902` indique trois commits d'avance, zéro de retard et trois fichiers modifiés, tous documentaires ou éditoriaux : audit Cheexpeer/facturation, registre d'anomalies et page d'information facturation. Aucun changement applicatif n'apparaît dans ce lot.

**Limites :** cette CI verte prouve le passage des contrôles automatisés présents dans le workflow, pas une recette visuelle exhaustive, une recette CRM multi-identités, la résolution des anomalies P0/P1, un déploiement ou une recette de production. Les anomalies CHX-API-01 et CHX-SEC-03 restent bloquantes avant activation métier de Cheexpeer ; les anomalies CRM-05 et CRM-16 restent ouvertes avant pilote multi-tenant. Les contrôles Supabase demeurent en lecture seule.

**Prochaine étape :** traiter le socle d'API utilisateur Cheexpeer et la vérification d'identité de l'acteur d'approbation côté serveur, puis préparer les tests multi-tenant CRM sur environnement de test uniquement, après validation explicite de toute écriture nécessaire. Aucun changement de branche, merge, rebase, déploiement production ou changement Supabase n'a été effectué dans cette passe.


## 12. Première passe d'épuration éditoriale — 11 novembre 2026

Les textes de l'accueil, du développement commercial, des marchés publics et privés, de l'accompagnement, du contact et de la FAQ ont été raccourcis selon la ligne « clair, court, courtois, concis ». Les avertissements sur les limites réelles des services et les formulaires en prévisualisation ont été conservés. Voir [le rapport d'épuration éditoriale](EPURATION-EDITORIALE-SITE-2026-11-11.md) et le point UX-EDITORIAL-01 du [registre d'anomalies](REGISTRE-ANOMALIES-EVOLUTION-9.md).


## 13. Deuxième passe d'épuration éditoriale — 11 novembre 2026

Sept pages de l'écosystème ont été simplifiées. Voir le [rapport de la deuxième passe](EPURATION-EDITORIALE-PASSE-2-2026-11-11.md) et l'anomalie UX-EDITORIAL-02 du registre.


## 14. Troisième passe d'épuration éditoriale — 11 novembre 2026

Sept pages ont été simplifiées ou alignées : Développement commercial, Réputation virtuelle, Nous rejoindre, Prospection, FAQ, Qualification des entreprises et Facturation électronique. Les repères obsolètes de l'ancienne représentation en étages et du schéma interactif ont été retirés ; les limites fonctionnelles, avertissements, liens et parcours existants sont conservés. Voir le [rapport de la troisième passe](EPURATION-EDITORIALE-PASSE-3-2026-11-11.md) et les anomalies UX-EDITORIAL-03 à UX-EDITORIAL-09 du [registre](REGISTRE-ANOMALIES-EVOLUTION-9.md).


La troisième passe a également aligné la FAQ sur la navigation classique, simplifié l'introduction de la qualification des entreprises et repositionné l'introduction de la facturation électronique dans une carte. Voir UX-EDITORIAL-07 à UX-EDITORIAL-09 dans le [registre des anomalies](REGISTRE-ANOMALIES-EVOLUTION-9.md).
