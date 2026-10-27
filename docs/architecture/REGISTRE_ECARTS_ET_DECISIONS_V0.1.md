# MajestiOS — Registre d'écarts techniques et décisions ouvertes V0.1

**Date :** 27 octobre 2026  
**Statut :** Audit initial — document de travail, non validé  
**Branche :** `architecture-v0-1`

## 1. Objet et limites

Ce registre consigne les écarts constatés entre l'état du dépôt `Chexpeer/Majestios`, l'architecture de travail et les exigences connues des référentiels MajestiOS. Il ne remplace aucun tome. Il ne constitue ni une validation fonctionnelle ni une autorisation de déploiement.

Les constats ci-dessous proviennent d'une inspection des fichiers présents dans la branche. Les tests automatisés attestent uniquement des contrôles effectivement exécutés ; ils ne prouvent pas qu'une fonctionnalité métier est opérationnelle.

## 2. État technique constaté

- Le dépôt contient une application Next.js dans `src/app`.
- `package.json` définit les commandes `next dev`, `next build`, `next start` et `eslint src eslint.config.mjs`.
- Le workflow GitHub Actions installe les dépendances, exécute ESLint et lance `next build`.
- Le contrôle GitHub Actions le plus récent inspecté, run `40484579182` sur le commit `a3b6e517d8c8cff2f6a113f41cbbd009dfb26fe3`, est terminé avec succès (ESLint et `next build`). Cela ne prouve pas le fonctionnement des parcours métier.
- `vercel.json` déclare actuellement `framework: "nextjs"`. Un aperçu Vercel lié à la branche, commit `60374f30d0dd5376c1d439561fd2928ec53c2622`, est marqué `READY` et sa page répond HTTP 200 lors du contrôle. Plusieurs autres projets Vercel liés au dépôt présentent néanmoins des déploiements en erreur ; leurs rôles respectifs restent à confirmer.
- Le README a été actualisé au commit `307f492c7530b97182f416292eb2fbfa24334db1` pour refléter ces constats et les limites fonctionnelles. Aucun fichier `package-lock.json` n'est présent dans l'arborescence inspectée : les dépendances ne sont donc pas verrouillées et le workflow utilise `npm install`.
- L'arborescence présente encore des fichiers racine liés au site statique, dont `app.js` et `build.js`. Leur suppression ou leur déplacement ne doit intervenir qu'après clarification de la stratégie de coexistence/migration.

## 3. Écarts et risques à traiter

| ID | Sujet | Constat | Risque | Traitement requis |
|---|---|---|---|---|
| EC-01 | Cartographie Vercel | `vercel.json` déclare Next.js et un aperçu est accessible, mais plusieurs projets liés au dépôt ont des déploiements en erreur | Risque de modifier le mauvais projet ou de perturber la vitrine | Identifier les projets, domaines, environnements et commits associés ; ne rien basculer avant validation explicite |
| EC-02 | README | Documentation actualisée au commit `307f492c7530b97182f416292eb2fbfa24334db1` ; coexistence des fichiers historiques encore à clarifier | Confusion possible sur les fichiers réellement déployés | Conserver les fichiers historiques jusqu'à cartographie complète des projets et de leurs usages |
| EC-03 | Dépendances | Un signalement antérieur d'installation annonçait 3 vulnérabilités (2 élevées, 1 critique) | Risque de sécurité non caractérisé | Récupérer un audit reproductible, identifier les paquets et versions affectés, appliquer des corrections ciblées, relancer tests |
| EC-04 | Modèle métier | Le document d'architecture V0.1 utilise des noms candidats comme `organizations`, `companies`, `opportunities` | Divergence potentielle avec le modèle métier canonique des tomes | Produire une matrice de correspondance avant toute migration SQL |
| EC-05 | Frontière de sécurité | Aucun backend métier ni politique RLS validée n'est attesté par ce contrôle de compilation | Aucune preuve d'isolation réelle des données à ce stade | Valider le modèle, puis créer un environnement DEV et des tests négatifs d'isolation |
| EC-06 | Fonctionnalités de l'interface | Les sections affichées ne démontrent pas la persistance des données, les connecteurs ni les activités réelles | Risque de confondre prototype d'interface et SaaS opérationnel | Marquer explicitement les fonctions de démonstration et tester chaque parcours métier |

## 4. Points de modèle à ne pas arbitrer implicitement

Le Tome 5 documentaire distingue notamment :

- **Tenant** : espace client et frontière de sécurité ;
- **User** : compte global ;
- **Membership** : appartenance et rôle d'un utilisateur dans un tenant ;
- **Organization** : entreprise référencée dans le domaine commercial ;
- **Contact** : interlocuteur professionnel ;
- **OpportunityCase** : dossier commercial ;
- **CaseActor** : acteur associé au dossier dans un rôle contextuel ;
- **Mission** : travail opérationnel rattaché au dossier.

Les termes simplifiés du document d'architecture (`organizations`, `memberships`, `companies`, `contacts`, `opportunities`, `tasks`) ne doivent donc pas être transformés automatiquement en tables SQL sans tableau de correspondance, validation des cardinalités et règles d'accès.

Les piliers ACT, KNB, PIP et DMH sont à conserver comme repères logiques métier ; ils ne doivent pas être convertis mécaniquement en applications séparées ni remplacer le modèle relationnel canonique.

## 5. Décisions ouvertes avant le prochain jalon

1. **Déploiement** : conserver le site public sur son projet Vercel actuel et créer un projet distinct pour l'application, ou planifier une migration contrôlée. Aucune modification de production sans approbation explicite.
2. **Référentiel documentaire** : confirmer quelles versions des tomes et annexes font autorité, notamment en cas de versions de travail plus récentes que les versions dites officielles.
3. **MVP métier** : valider les parcours prioritaires et leurs critères d'acceptation.
4. **Modèle relationnel** : établir la matrice exigences → objets métier → relations → règles d'accès → tests.
5. **Sécurité** : confirmer le choix de Supabase et préparer un projet DEV distinct avant toute migration ou donnée réelle.
6. **Dépendances** : obtenir la sortie actuelle de l'audit des dépendances et traiter les alertes vérifiées.

## 6. Ordre de travail recommandé

1. Confirmer les tomes de référence : ils ne sont pas identifiés dans l'arborescence inspectée de cette branche.
2. Ajouter un verrouillage des dépendances, exécuter l'audit et traiter les alertes vérifiées.
3. Cartographier les projets Vercel et leurs domaines sans toucher à la production.
4. Confronter les tomes et annexes à l'architecture V0.1 ; consigner les conflits sans les résoudre arbitrairement.
5. Valider les parcours MVP, le modèle et les critères d'acceptation.
6. Seulement ensuite, concevoir les migrations et les tests RLS en DEV.

## 7. Critères de clôture de cet audit initial

Cet audit ne sera considéré comme clôturé que lorsque :

- la stratégie de déploiement est documentée et testée sans risque pour la vitrine ;
- l'audit des dépendances est reproductible et les alertes critiques sont traitées ou explicitement acceptées ;
- les écarts avec les référentiels sont reliés à des passages précis des documents ;
- les décisions structurantes sont arbitrées ou marquées comme reportées ;
- aucun schéma SQL définitif n'est produit avant validation du modèle et de ses règles d'accès.

---
**Fin du registre — V0.1**

## 8. Back-office, CRM et intégrations — cadrage ajouté

Le document `docs/architecture/BACK_OFFICE_CRM_ADMIN_V0.1.md` propose une séparation logique entre :
- l'espace professionnel/CRM de l'organisation cliente ;
- l'administration de l'organisation cliente ;
- l'administration interne de la plateforme MajestiOS.

Il prévoit une architecture extensible pour les intégrations externes, dont Google Drive, Sheets, Calendar, Maps et Google Business Profile, sans présumer que ces intégrations sont déjà autorisées ou opérationnelles. Le document reste une proposition à confronter aux tomes et ne justifie aucune création de table ou migration avant validation.

Décisions toujours ouvertes :
- parcours et indicateurs exacts du tableau de bord ;
- rôles, permissions et frontière entre administration cliente et administration plateforme ;
- périmètre CRM minimal ;
- services Google réellement requis pour le MVP ;
- correspondance du CRM avec les objets canoniques du Tome 5 (Tenant, User, Membership, Organization, Contact, OpportunityCase, CaseActor, Mission).



## 9. Cartographie Vercel — relevé du 27 octobre 2026

La lecture des six projets associés au dépôt `Chexpeer/Majestios` dans l'équipe Vercel `Majestic` donne le relevé suivant. Les projets indiqués avec `live: false` ne sont pas identifiés comme projets actuellement « live » par cette réponse API ; cela ne suffit pas, à lui seul, à déterminer quel domaine l'utilisateur considère comme production.

| Projet | Framework détecté | Dernier déploiement consulté | État | Domaines déclarés | Conclusion prudente |
|---|---|---|---|---|---|
| `majestios-7vbs` | Next.js | `dpl_A82yE34H1dnxWbgEQgcir9QaeL83` | READY | `majestios-7vbs.vercel.app`, `majestios-7vbs-majistr.vercel.app`, alias de branche main | Candidat technique Next.js ; rôle métier à confirmer |
| `majestios-jc8g` | Non défini dans les métadonnées projet | `dpl_5ctrWUHXb5wjmPEEkrYnmEihKec3` | READY | `majestios-jc8g.vercel.app`, `majestios-jc8g-majistr.vercel.app`, alias de branche main | Aperçu consulté, page HTTP 200 ; framework projet à clarifier |
| `majestios-gvuv` | Non défini | `dpl_7BybfNw9h8Fup9pMjtj7xcrjy2Nt` | ERROR | domaine projet et alias architecture-v0-1 | Échec à diagnostiquer avant réutilisation |
| `majestiosabc` | Non défini | `dpl_Da1eb2qDc9irL2bSnYZ3R3Xi3FAK` | ERROR | domaine projet et alias architecture-v0-1 | Échec à diagnostiquer avant réutilisation |
| `majestios-3xsq` | Non défini | `dpl_AHnWrYLynrG5Tf5rbkDgcWCS8Ehh` | ERROR | domaine projet et alias architecture-v0-1 | Échec à diagnostiquer avant réutilisation |
| `majestios` | Non défini | `dpl_FcJinpiAecPEpmfD8ncLe9dDbcap` | ERROR | `majestios.vercel.app` | Domaine connu, état de déploiement à diagnostiquer ; ne pas modifier |

**À retenir :** les noms et les domaines ne suffisent pas à attribuer avec certitude la vitrine et l'application. Avant toute action, confirmer le domaine que l'utilisateur veut conserver, vérifier les paramètres de build et les journaux des déploiements en erreur, puis choisir un seul projet de préproduction. Aucun projet, domaine ou paramètre n'a été modifié pendant cet audit.



## 10. Veille des dépendances

Le fichier `.github/dependabot.yml` a été ajouté sur la branche `architecture-v0-1` au commit `72eccb75c4b9968978bc81477967936cc2957bfb`. Il configure une vérification hebdomadaire des dépendances npm et GitHub Actions, avec des propositions de mise à jour sous forme de pull requests. Cela n'installe pas automatiquement les mises à jour et ne remplace pas l'audit de sécurité ni les contrôles CI.

Le dépôt ne comporte toujours pas de fichier de verrouillage npm dans l'arborescence vérifiée. La prochaine étape technique reste de produire un `package-lock.json` cohérent avec `package.json`, puis de valider l'installation reproductible et l'audit avant de remplacer `npm install` par `npm ci` dans le workflow principal. Cette étape doit se faire sur la branche de travail et être vérifiée par CI.


## 11. Extension fonctionnelle — « Nous rejoindre » et annonces dynamiques

À la demande du porteur de projet (27 octobre 2026), le cadrage du back-office a été complété au commit `e84bbea1c1b0c4086f705d9b7d5a8cf903edeb2f` par une section dédiée à un espace public « Nous rejoindre » et aux annonces de missions freelance/emploi.

Principes retenus :
- priorité aux freelances spécialisés en appels d'offres et en développement commercial ;
- annonces MajestiOS et annonces externes clairement différenciées ;
- liens partageables vers les annonces MajestiOS et diffusion LinkedIn envisagée, manuelle au départ ;
- intégration des offres de missions et de recrutement au moteur central d'opportunités, avec catégorisation, provenance, fraîcheur et dédoublonnage ;
- distinction stricte entre emploi salarié, mission freelance et collaboration commerciale ;
- pas de promesse de collecte externe, de candidature persistante ou de publication automatisée tant que ces fonctions ne sont pas développées et testées.

**Portée de la modification :** documentation uniquement. Aucun fichier applicatif, schéma SQL, projet Supabase, configuration Vercel, domaine ou production n'a été modifié. La prochaine étape est de confronter ce cadrage aux tomes de référence, puis de définir les critères d'acceptation avant de toucher au code.
