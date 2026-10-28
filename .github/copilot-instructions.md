# MAJESTIOS — Copilot System Rules

Ces règles s'appliquent à tout travail généré par une IA dans ce dépôt. Elles ne remplacent pas les sources documentaires et ne confèrent aucune autorisation d'exécuter une décision métier.

## Règle 0 — Autorité documentaire

Ordre d'autorité :

1. `MAJ-00` — Doctrine Fondatrice
2. `MAJ-DOC-STRAT`
3. `MAJ-REG`
4. `MAJ-BUILD-001`
5. Code existant

En cas de conflit entre ces sources, arrêter le travail sur le périmètre concerné, signaler précisément le conflit et demander une **Validation Fondateur requise**. Ne jamais arbitrer silencieusement. Le code existant ne prévaut pas sur une source documentaire d'autorité supérieure.

`copilot/forbidden-assumptions.md` complète ces règles sans les remplacer. Ni ce fichier ni aucune instruction de génération ne peut prévaloir sur les sources documentaires d'autorité supérieure.

## Règle 1 — Séparation fondamentale

**FAIT ≠ HYPOTHÈSE ≠ DÉCISION**

- Ne jamais mélanger une donnée source, une interprétation de l'IA et un arbitrage humain.
- Ne jamais transformer automatiquement une hypothèse en décision ou en opportunité active.
- Chaque fait conserve sa provenance et son statut de qualification ; chaque hypothèse expose sa justification, son incertitude et sa fraîcheur ; chaque décision identifie l'humain habilité qui l'a prise.

## Règle 2 — Human Gate

Toute action engageante exige une validation humaine préalable, attribuable et auditable, notamment :

- accepter ou activer une opportunité ;
- lancer une mission ou campagne ;
- contacter un tiers ou envoyer un message ;
- créer ou partager un dossier de partenariat ;
- effectuer une mise en relation avec un investisseur ;
- partager, déposer ou publier un contenu généré.

L'IA ne valide jamais sa propre proposition. Une décision ne déclenche pas, à elle seule, un envoi externe : les permissions, le mandat et la confirmation de l'action restent nécessaires.

## Règle 3 — Architecture des données

Les domaines PostgreSQL de référence sont `staging`, `memory`, `analysis` et `ops_coach`.

Flux de travail :

```text
staging → qualification contrôlée → memory → analyse → décision humaine → ops_coach
```

- `staging → ops_coach` et `staging → opportunity` directement sont interdits.
- `analysis` peut produire une proposition ; il ne peut jamais créer une décision humaine.
- Une décision humaine peut examiner une hypothèse d'`analysis`, mais doit être enregistrée séparément dans le Human Gate.
- Les connecteurs ne peuvent pas écrire directement dans `memory`.
- Les sources d'origine restent traçables après qualification.

## Règle 4 — Multi-tenant

- Toute donnée métier privée porte un `tenant_id` obligatoire.
- Toute lecture, écriture, mise à jour ou relation doit être bornée par le tenant et validée par l'appartenance et le rôle côté serveur et base.
- Toute lecture ou écriture cross-tenant est interdite, y compris par jointure, export, endpoint ou tâche de fond.
- Ne jamais faire confiance au `tenant_id` envoyé par le navigateur comme preuve d'autorisation.
- Les catalogues et sources de plateforme qui ne sont pas des données métier tenant-scoped doivent être identifiés explicitement ; si leur statut ou leur partage est ambigu, arrêter et demander validation.

## Règle 5 — Rôles et identité

Rôles métier reconnus :

- `SUPER_ADMIN`
- `TENANT_ADMIN`
- `BUSINESS_DEVELOPER`
- `VALIDATOR`
- `COACH`
- `MEMBER`
- `SYSTEM`

N'accorder aucune permission implicite. `SYSTEM` désigne uniquement une identité technique non humaine ; elle ne peut jamais satisfaire un Human Gate. Un rôle plateforme n'accorde pas automatiquement la lecture des dossiers clients. Une permission doit être limitée par tenant, propriété et mandat.

## Règle 6 — Capacités et limites de l'IA

L'IA peut détecter, classifier, résumer, enrichir et proposer à partir d'entrées autorisées.

L'IA ne peut jamais décider, approuver, engager, attribuer un rôle ou déclencher une action externe. Toute donnée manquante, ambiguë, contradictoire ou non sourcée est signalée ; elle n'est pas complétée par invention.

## Règle 7 — Signaux officiels

Les codes de signaux autorisés sont :

- `LOST_TENDER_DEVELOPMENT_NEED`
- `WON_TENDER_SUPPLY_NEED`
- `TRIPLE_RH_EXPANSION_SIGNAL`
- `SECTORIAL_RH_THERMOMETER`
- `PARTNER_MATCH`
- `INVESTOR_MATCH`

Ne pas créer de nouveau code métier sans validation documentaire explicite. Un AO gagné/perdu ou un signal RH est une source ou un indice, pas une preuve automatique d'un besoin commercial.

## Règle 8 — Vérification du Build Master

Avant de créer ou modifier une table, une API, un écran ou un workflow :

1. consulter `docs/MAJ-BUILD-001.md` ;
2. vérifier que le périmètre et les statuts y sont spécifiés ;
3. rechercher les règles existantes et les tests concernés ;
4. si le détail requis manque ou se contredit, arrêter ce périmètre et consigner une **Validation Fondateur requise**.

Ne pas fabriquer une spécification manquante sous prétexte de faciliter l'implémentation.

## Règle 9 — SQL et sécurité

- Toute table métier tenant-scoped comprend `id`, `tenant_id`, `created_at` et `updated_at`.
- Une table append-only conserve ses horodatages et ne doit pas être rendue modifiable uniquement pour actualiser `updated_at`. Si la règle d'horodatage et l'immutabilité entrent en conflit, demander validation avant de modifier le modèle.
- RLS est obligatoire sur toute table métier exposée ; les politiques doivent valider les anciennes et nouvelles valeurs et l'appartenance tenant.
- Les privilèges SQL, contraintes de clés étrangères tenant-scoped et tests RLS complètent les politiques ; `authenticated` seul n'est pas une autorisation.
- Secrets et clés privilégiées ne sont jamais intégrés au navigateur, au dépôt ou aux journaux.

## Règle 10 — Frontend

Stack obligatoire pour les nouvelles interfaces : **Next.js, TypeScript, Tailwind CSS et shadcn/ui**. Ne pas introduire de framework UI alternatif.

Le site public destiné aux visiteurs, prospects et clients est distinct de l'application métier authentifiée. La page publique d'accueil n'est pas un dashboard interne. Utiliser des routes dédiées pour les rubriques ; ne pas simuler une arborescence avec des ancres vers une seule page. Le flux d'annonces est un flux de données et ne doit pas être remplacé par un défilement automatique de page.

La migration du site statique existant vers cette stack doit être traitée explicitement ; cette règle ne signifie pas que l'authentification ou un backend existent déjà.

## Règle 11 — API

Toute API métier doit :

- valider ses entrées avec Zod ;
- contrôler la session, le tenant, le rôle, la propriété et le mandat côté serveur ;
- journaliser les opérations sensibles sans exposer de données excessives ;
- rendre les erreurs explicites ;
- assurer l'idempotence des écritures rejouables ;
- empêcher une action externe sans Human Gate.

Aucune exception implicite pour les routes de tâche de fond ou les connecteurs.

## Règle 12 — Journalisation

Tracer au minimum les qualifications, rejets, décisions Human Gate, changements de statut, interactions IA et actions externes tentées. Les journaux sont protégés, minimisés et ne contiennent ni secret ni charge utile inutile.

## Règle 13 — Double Dossier

Toujours séparer :

- le **dossier officiel**, fidèle aux pièces et exigences sources ;
- le **dossier miroir**, consacré à la préparation opérationnelle.

Ne jamais fusionner ni modifier les pièces officielles avec du contenu généré. Tout contenu généré reste un brouillon jusqu'à validation humaine.

## Règle 14 — Priorité MVP

Ordre de construction cible :

1. Auth
2. Tenant
3. Organisation
4. Contact
5. Activité
6. Opportunity
7. Human Gate
8. Dashboard authentifié
9. Signals
10. Analysis
11. Coach
12. Partners
13. Investors

Cette séquence n'autorise pas à activer une opportunité avant le Human Gate. Avant que le Gate soit implémenté et testé, une opportunité peut uniquement exister comme donnée de démonstration explicitement marquée ou comme proposition non activée. Le dashboard est une page de l'espace authentifié, jamais l'accueil du site public.

## Règle 15 — Doute et arrêt

Si une règle métier, un statut, une permission ou une source est ambiguë :

1. ne pas inventer ;
2. identifier la question et le périmètre bloqué ;
3. demander une **Validation Fondateur requise** ;
4. ne pas implémenter la transition ou l'action concernée avant réponse.

Les travaux indépendants et non bloqués peuvent continuer sans contourner la décision requise.
