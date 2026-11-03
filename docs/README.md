# Documentation MajestiOS

**Index — 3 novembre 2026** · Branche `evolution-2.0`

Ce dossier réunit toute la documentation du projet. Elle est lue par des personnes et par des assistants IA : le porteur du projet reste seul à valider les décisions.

## 1. Documents actifs (font autorité sur cette branche)

| Document | Rôle |
|---|---|
| [`AGENTS.md`](../AGENTS.md) | Règles de travail pour tout assistant ou agent intervenant dans le dépôt |
| [`evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md`](evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md) | Vision, principes, socle fonctionnel, feuille de route, décisions validées (§ 11) |
| [`evolution-2.0/AUDIT-EXISTANT-PHASE-1.md`](evolution-2.0/AUDIT-EXISTANT-PHASE-1.md) | État réel du prototype, écarts avec le cahier, risques, questions ouvertes |

## 2. Documentation historique (restaurée, non validée)

Les documents du 1er et du 2 novembre 2026 avaient été retirés du dépôt pour l'alléger. Ils sont restaurés **à l'identique** dans [`historique/`](historique/), sans aucune modification de contenu, à partir de la branche `docs/cleanup-documentation-2026-11-02` (commit `c9e2c99`), la plus récente et la plus soignée. Les deux fichiers du dossier `BrainIOS/` viennent de la branche `chat-est-une-ordure` (commit `b17ddf1`).

L'ancien index, avec son classement par thème, est conservé : [`historique/docs/README.md`](historique/docs/README.md).

**Statut de cette documentation.** Elle décrit le prototype tel qu'il était pensé avant l'évolution 2.0. Ses propres en-têtes la qualifient de « cadrage à valider » ou de « proposition ». Elle est précieuse comme **matière première** (modèle de données CRM, parcours depuis une annonce, traitement des signaux BODACC, registre des sources, spécification fonctionnelle) mais elle ne fait pas autorité.

| Sujet | Documents historiques utiles |
|---|---|
| Vision et exigences | `CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md`, `SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md`, `DOCUMENTATION-REPRISE-IA-MAJESTIOS.md` |
| Parcours depuis une annonce | `SPEC-PARCOURS-DEPUIS-ANNONCE-MAJESTIOS.md` |
| Signaux, veille et collecte | `TRAITEMENT-OPPORTUNITES-MAJESTIOS.md`, `BODACC-TRAITEMENT-SIGNAUX-COMMERCIAUX.md`, `CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md` |
| Données et CRM | `MODELE-COMMUN-DONNEES-CRM-MAJESTIOS.md`, `MODELE-DONNEES-APPELS-OFFRES.md`, `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md`, `PLAN-CHANTIER-RECHERCHE-DONNEES-CRM.md`, `SPEC-SUIVI-DYNAMIQUE-ECONOMIQUE-ENTREPRISES-MAJESTIOS.md` |
| Statistiques et valorisation | `CARTOGRAPHIE-DONNEES-STATISTIQUES-MAJESTIOS.md`, `PLAN-PILOTE-STATISTIQUES-MAJESTIOS.md`, `MODELE-VALORISATION-DONNEES-ET-ETUDES-COMMERCIALES-MAJESTIOS.md` |
| Structure du site | `ARBORESCENCE-MAJESTIOS.md`, `DOSSIERS-MAJESTIOS.md`, dossier `dossiers/` |
| Traçabilité et audits datés | `MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md`, `RAPPORT-AUDIT-LOT-01-2026-11-01.md` |
| Base de connaissances | dossier `BrainIOS/` |

Les liens relatifs internes à cette documentation ont été vérifiés : 44 liens, aucun cassé.

## 3. Règles de lecture

1. **Hiérarchie.** Une décision validée du porteur du projet prime sur tout document. Entre le cahier de la branche `evolution-2.0` et la documentation historique, le cahier prévaut.
2. **Contradictions.** Quand deux documents se contredisent, on le signale et on demande l'arbitrage au porteur du projet ; on ne choisit pas arbitrairement.
3. **Rapports datés.** Un audit décrit un instant précis. Les statuts « à tester » ou « à réaliser » de la documentation historique peuvent être dépassés.
4. **Ne pas fusionner aveuglément.** Les documents historiques se recoupent. Avant toute reprise de contenu dans un document actif, comparer et faire valider.

## 4. Contradictions connues à arbitrer

| Sujet | Documentation historique | Cahier 2.0 / décision du 3 novembre 2026 |
|---|---|---|
| Catégories publiques | Huit catégories métier (cahier maître) | Cinq catégories parmi les plus importantes du BOAMP |
| Catégories BODACC | Cinq familles, plus quatre autres catégories privées désactivées | Trois catégories parmi les sources du BODACC |
| Emploi | Le cahier maître en fait une catégorie de « Marchés privés » ; la spécification fonctionnelle écrit que la veille emploi n'est pas une catégorie du moteur principal | Catégorie des marchés privés (Cadremploi et APEC regroupés), plus des annonces internes déposées par les visiteurs |
| Déploiement | Documents rédigés pour un prototype statique | Plateforme centrée sur le CRM, avec espaces clients cloisonnés |

La liste exacte des catégories reste à faire valider par le porteur du projet (cahier, § 11).

## 5. Règle technique associée

Le contrôle `verify-architecture.js` n'accepte du Markdown que dans `docs/`, avec `README.md` et `AGENTS.md` à la racine, et refuse qu'un fichier Markdown figure dans le manifeste de publication du site. La documentation ne fait donc jamais partie du site déployé.
