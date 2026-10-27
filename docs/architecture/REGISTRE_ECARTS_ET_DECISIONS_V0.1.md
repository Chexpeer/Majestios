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

