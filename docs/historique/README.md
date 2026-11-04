# Archives documentaires thématiques — MajestiOS

**État au 5 novembre 2026 — branche `evolution-5.0`.**

Ce dossier n'est pas le référentiel actif du produit. La doctrine et les décisions courantes sont centralisées dans [la référence MajestiOS V.5](../evolution-5.0/MAJESTIOS-V5-REFERENCE.md).

## Pourquoi certains documents sont conservés

Après comparaison des empreintes Git de 35 fichiers de l'ancien dossier `docs/historique/` avec les branches sources V2, V3 et V4 :

- **27 fichiers identiques octet pour octet** à une source historique ont été retirés de V5. Leurs originaux restent accessibles sur les branches V2, V3 ou V4.
- **6 fichiers modifiés** par rapport aux sources historiques sont conservés provisoirement. Ils doivent être rapprochés de la doctrine V5 avant toute réutilisation.
- **2 fichiers propres à ce dossier** sont conservés comme ressources historiques : le référentiel de connaissances et les consignes d'assistants IA.

Les branches sources ne sont pas modifiées.

## Documents conservés — à traiter comme archives, pas comme décisions actives

- `DOCUMENTATION-REPRISE-IA-MAJESTIOS.md`
- `DOSSIERS-MAJESTIOS.md`
- `MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md`
- `PLAN-CHANTIER-RECHERCHE-DONNEES-CRM.md`
- `SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md`
- `dossiers/10-business-intelligence/README.md`
- `referentiel-connaissances/CONSIGNES-ASSISTANTS-IA.md`
- `referentiel-connaissances/README.md`

Certains de ces textes reflètent des termes, hypothèses, branches ou architectures antérieurs. Ils ne doivent pas être copiés tels quels dans la documentation active. En particulier, les références à des concepts remplacés ne décrivent pas l'architecture actuelle.

## Règle de reprise

Pour une décision actuelle, consulter d'abord `docs/evolution-5.0/`. Pour retrouver une formulation ou une exigence d'origine, utiliser ces archives avec prudence, puis vérifier la source de version sur sa branche historique. Toute exigence encore pertinente doit être intégrée à une référence V5 avant de supprimer son dernier exemplaire local.
