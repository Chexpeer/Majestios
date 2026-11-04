# Filiation documentaire MajestiOS — V2, V3, V4 et V5

**Rectificatif et référence de filiation — 5 novembre 2026**  
**Branche de rédaction :** `evolution-5.0`  
**Périmètre :** documentation uniquement. Aucun fichier du site, aucune ressource visuelle, aucun script, aucune fonctionnalité et aucun déploiement ne sont concernés.

## 1. Objet et règle de versionnement

Ce document rétablit la chronologie documentaire du projet. Les versions V2, V3 et V4 sont des étapes historiques distinctes. Leurs documents sources restent sur leurs branches respectives ; ils ne doivent pas être recopiés dans le dossier documentaire V5.

La documentation V5 est autonome. Elle s'appuie sur les enseignements et décisions encore pertinents des versions antérieures, mais elle ne constitue ni une copie, ni une fusion de leurs dossiers.

**Règle impérative :**
- V2 reste sur `evolution-2.0`.
- V3 reste sur `evolution-3.0`.
- V4 reste sur `evolution-4.0`.
- V5 possède son propre référentiel sous `docs/evolution-5.0/`.
- Les branches historiques ne sont ni supprimées, ni réécrites, ni fusionnées par ce nettoyage documentaire.

## 2. Sources Git vérifiées

| Version | Branche | Commit observé au 5 novembre 2026 | Emplacement documentaire source |
|---|---|---|---|
| V2 | `evolution-2.0` | `6a609b3b83904032fee1c0bacb254529658520f5` | `docs/evolution-2.0/` |
| V3 | `evolution-3.0` | `05f2435af0d926b3ed24471065cf9d43b7adab88` | `docs/evolution-3.0/` |
| V4 | `evolution-4.0` | `9f7bd53018f30210e2b4ffabd2153b14835c3068` | `docs/evolution-4.0/` |
| V5 | `evolution-5.0` | `2c0c7f3c26379d1dd2600bccf23d6e5ff66e80e4` avant le présent rectificatif | `docs/evolution-5.0/` |

La branche V4 existe bien. Son dossier documentaire contient sept fichiers. L'affirmation antérieure selon laquelle V4 était absente du dépôt était erronée : la vérification avait été limitée à l'arbre de la branche V5, sans recherche suffisante dans les autres branches. Cette erreur est reconnue et corrigée ici.

## 3. Contenu et apport de chaque version

### V2 — Fondations métier et gouvernance

Sources principales :
- `AUDIT-EXISTANT-PHASE-1.md`
- `CAHIER-DES-CHARGES-FONDATEUR.md`
- `CARTOGRAPHIE-FONCTIONNELLE-FLUX.md`
- `GOUVERNANCE-INTERVENTIONS.md`

Apports structurants : vision de développement commercial, détection d'opportunités, marchés publics et privés, qualification, CRM, publication, veille, prospection, séparation des flux et gouvernance des interventions.

La V2 constitue le socle métier historique. Elle ne doit pas être présentée comme la spécification actuelle complète : plusieurs décisions et périmètres ont évolué depuis.

### V3 — Structuration fonctionnelle et technique

Sources principales :
- `MIGRATION-EVOLUTION-3.0.md`
- `ARCHITECTURE-API-CIBLE.md`
- `ETAPE-A-ARCHITECTURE-FONCTIONNELLE.md`
- `ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md`
- `ETAPE-C-CONTRATS-API-EVENEMENTS.md`
- `AUDIT-COMPARATIF-TECHNIQUE.md`
- `CAHIER-DES-CHARGES-FONCTIONNEL-REVISION-2026-11-03.md`
- `REGISTRE-ARBITRAGES-SECURITE-B-01-B-10.md`

La V3 formalise les frontières fonctionnelles, les modèles conceptuels de données, le cloisonnement des espaces, les permissions, les contrats API, les événements et les options techniques. Ces documents distinguent des propositions et des arbitrages ; ils ne prouvent pas que le backend, la base de données, l'authentification ou le CRM persistant ont été implémentés.

### V4 — Audit, élargissement de la vision et pilotage assisté

Les sept documents présents sur `evolution-4.0` sont :
- `AUDIT-MAJESTIOS-3.0.md`
- Document historique consacré à l'intégration de l'API IA et à l'espace d'administration (intitulé de fichier historique conservé uniquement sur la branche source).
- `MISSION-CONTRE-AUDIT-IA.md`
- `README.md`
- `REGISTRE-OBSERVATIONS-TECHNIQUES-4.0.md`
- Feuille de route V4 consacrée à l'intelligence, à l'administration et aux phases de réalisation (intitulé de fichier historique conservé uniquement sur la branche source).
- `VISION-ET-ARCHITECTURE-MAJESTIOS-4.0.md`

La V4 apporte notamment un audit plus large de la V3, une vision de pilotage depuis l'administration, une intelligence assistée, des niveaux d'autonomie, la surveillance, les rapports, l'atelier d'évolution, le suivi qualité, le SEO continu, ainsi que des exigences de sécurité et de maîtrise des coûts API.

Les constats du contre-audit et les recommandations techniques restent des éléments à évaluer : ils ne deviennent pas automatiquement des décisions produit ou des faits établis.

### V5 — Référentiel autonome et doctrine actuelle

La V5 reformule la vision et l'organisation du produit autour de MajestiOS comme **intelligence centrale de la plateforme**. MajestiOS V.5 est le cerveau du site : il coordonne les fonctionnalités, les analyses, les interactions et les automatisations autorisées.

Le composant d'intelligence distinct envisagé dans les documents V4 a été remplacé. Il n'existe pas de système autonome parallèle dans la doctrine V5. Les capacités utiles décrites auparavant — pilotage, mémoire, administration, SEO, supervision, assistance, automatisation et suivi qualité — sont à réexaminer et à rattacher à MajestiOS V.5, avec des permissions et validations explicites.

La V5 possède également sa propre organisation fonctionnelle, son immeuble interactif, ses huit destinations, ses capacités transversales et ses audits de réalisation. La référence canonique est `MAJESTIOS-V5-REFERENCE.md`.

## 4. Matrice de continuité et d'évolution

| Sujet | Héritage | Traitement dans la doctrine V5 |
|---|---|---|
| Développement commercial et chaîne Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser | V2, V3, V4 | Conservé comme finalité centrale et séquence métier |
| CRM interne distinct des espaces clients | V2, V3, V4 | Conservé comme principe de séparation ; socle persistant encore à construire |
| Provenance, finalité, autorisations et traçabilité des données | V2, V3, V4 | Conservés et renforcés ; exigences de conception, non preuve d'implémentation |
| Architecture API, modèle de données et événements | V3, V4 | Sources de réflexion ; choix techniques à réévaluer, aucune adoption automatique |
| Marchés publics, BOAMP, marchés privés et BODACC | V2, V3, V4 | Conservés, avec taxonomies et sources à vérifier selon le moteur V5 actuel |
| Réputation virtuelle et présence locale | V4 | Conservées comme domaine V5 ; intégrations externes, droits et conformité à vérifier |
| Administration et cockpit de pilotage | V4 | Capacités à rattacher à l'administration de MajestiOS V.5 |
| Mémoire, assistants, analyse et automatisations | V4 | Capacités transversales de MajestiOS V.5 ; pas de système indépendant |
| SEO et maintien de la visibilité | V4 | Conservés comme capacité transversale d'audit, de veille et de recommandations, avec validation des changements |
| Autonomie de l'IA | V4 | Réévaluée selon les permissions, la réversibilité et l'approbation humaine ; aucune autonomie générale présumée |
| Immeuble interactif et arborescence | V2 à V5 | Réorganisés selon la doctrine V5 ; le schéma doit refléter l'arborescence réelle |
| Expérience immersive et panorama | V5 | Évolution propre à la V5 ; ne pas confondre cible immersive et prototype 2D existant |

## 5. Décisions de versionnement et nettoyage appliqué

1. Les dossiers `docs/evolution-2.0/` et `docs/evolution-3.0/` ne font plus partie de l'arborescence documentaire V5. Les sources originales restent consultables sur leurs branches.
2. Aucun dossier `docs/evolution-4.0/` n'était présent dans l'arbre V5 examiné ; les sources V4 restent sur la branche `evolution-4.0` et ne sont pas copiées dans V5.
3. Les documents propres à V5 restent dans `docs/evolution-5.0/`.
4. Le dossier `docs/historique/` ne conserve que huit documents après comparaison : 27 copies strictement identiques aux sources historiques ont été retirées de V5. Les six versions modifiées et les deux ressources sans équivalent sont isolées comme archives, non comme doctrine active. Voir `NETTOYAGE-ARCHIVES-HISTORIQUES-2026-11-05.md`.
5. Les index, consignes et références V5 doivent pointer vers ce document de filiation plutôt que vers des copies locales des dossiers antérieurs.
6. Ce nettoyage ne modifie aucun fichier du site ni aucune branche historique.

## 6. Règle pour les prochains agents et contributeurs

Avant toute intervention sur V5, lire :
1. `AGENTS.md` ;
2. `docs/README.md` ;
3. `docs/evolution-5.0/README.md` ;
4. `docs/evolution-5.0/MAJESTIOS-V5-REFERENCE.md` ;
5. le présent document de filiation ;
6. les audits V5 utiles au lot concerné.

Si un détail historique est nécessaire, consulter directement la branche source correspondante. Ne pas recopier un dossier ancien dans V5, ne pas présenter une proposition historique comme une décision actuelle et ne pas réintroduire une architecture remplacée.

## 7. Limites de cette consolidation

Cette matrice constitue une synthèse de filiation documentaire, pas une validation ligne à ligne de chaque exigence historique. Les points métier qui influencent les fonctionnalités actuelles doivent être rapprochés de la doctrine V5 et arbitrés lorsqu'une contradiction subsiste. Les audits techniques et juridiques externes doivent être évalués sur leurs preuves, leur date et leur périmètre avant d'être adoptés.
