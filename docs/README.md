# Documentation MajestiOS

**Index — 3 novembre 2026** · Branche de travail : `evolution-3.0`

La branche `evolution-2.0` est conservée comme sauvegarde de référence. Les évolutions critiques sont préparées et réalisées sur `evolution-3.0`.

## Documents actifs — Évolution 3.0

| Document | Rôle |
|---|---|
| [Instructions agents](../AGENTS.md) | Source canonique des règles de travail |
| [README Évolution 3.0](evolution-3.0/README.md) | Entrée documentaire de la branche active |
| [Dossier de migration 3.0](evolution-3.0/MIGRATION-EVOLUTION-3.0.md) | Audit préalable, périmètre migré, décisions et arbitrages |
| [Architecture API cible](evolution-3.0/ARCHITECTURE-API-CIBLE.md) | Architecture logique, modèle de données, API, événements, sécurité et migration technique |

## Références fonctionnelles héritées — Évolution 2.0

| Document | Rôle |
|---|---|
| [Gouvernance des interventions](evolution-2.0/GOUVERNANCE-INTERVENTIONS.md) | Méthode, autorisations, préservation et gestion des versions |
| [Cahier des charges fondateur](evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md) | Vision, besoins et décisions fonctionnelles validées |
| [Audit de l'existant — phase 1](evolution-2.0/AUDIT-EXISTANT-PHASE-1.md) | État constaté du prototype, écarts et risques datés |
| [Cartographie fonctionnelle des flux](evolution-2.0/CARTOGRAPHIE-FONCTIONNELLE-FLUX.md) | Responsabilités fonctionnelles, flux et règles de séparation |

## Hiérarchie documentaire

1. Les décisions explicites et les validations récentes du porteur du projet prévalent.
2. Les documents 3.0 définissent la cible technique de cette étape ; les documents 2.0 restent la base fonctionnelle héritée.
3. Les audits décrivent un état daté et doivent être revalidés avant intervention.
4. Les propositions d'architecture ne sont pas des choix techniques validés.
5. Les archives historiques sont consultatives et ne réintroduisent pas d'anciennes orientations sans arbitrage.
6. Toute contradiction est signalée ; aucune IA ne tranche par supposition.

## Points restant à arbitrer

- Les cinq catégories BOAMP après mesure des volumes.
- Les règles de dépôt, identification, modération, signalement, expiration et retrait des annonces.
- Les règles de transmission des annonces au CRM, à la Veille et à la Prospection.
- Le backend, la base de données, l'identité, la stratégie multi-tenant, le stockage et l'orchestration événementielle.
- Les conditions d'utilisation, quotas, cache et coûts des sources externes.
- Les bases et règles applicables à la prospection, les durées et la gestion des oppositions.

## Documentation historique

Les fichiers de `historique/` sont conservés comme archives de travail. Ils peuvent contenir des propositions anciennes ou contradictoires et ne constituent pas des décisions actives.
