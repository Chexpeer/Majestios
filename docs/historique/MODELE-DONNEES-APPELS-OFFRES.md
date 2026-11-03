# Modèle de données — résultats et signaux d’opportunité MajestiOS

Version : 2026-11-01  
Branche de travail : `refonte-moteur-navigation-mobile-2026-11-01`

## Objectif

Définir les règles de provenance, de filtrage et de présentation des résultats de recherche MajestiOS. Le schéma machine partagé est défini dans `schemas/opportunite.schema.json`. Il couvre les huit catégories publiques et les neuf catégories privées, avec `recordType`, provenance, clé de dédoublonnage et métadonnées de qualification prévues pour la future alimentation CRM. Le moteur de recherche utilise actuellement les connecteurs BOAMP et BODACC ; immobilier, emploi et sous-traitance restent non connectés. Le contrat de données ne signifie pas que les résultats sont déjà persistés dans un CRM.

## Règle de routage du moteur

Le parcours de recherche est : **Type de marché → source(s) de données → catégorie → page de résultats → qualification commerciale/CRM**.

- **Marchés publics** : source BOAMP ; les catégories métier publiques actives sont les huit catégories listées ci-dessous.
- **Marchés privés** : source BODACC pour les cinq familles de signaux légaux ; les catégories immobilier professionnel, emploi, offres de sous-traitance et recherche de sous-traitants/partenaires sont prévues, mais leurs connecteurs ne sont pas encore actifs.
- **Tous types** : le moteur lance une recherche BOAMP et une recherche BODACC en parallèle, les résultats sont séparés par source et limités à cinq cartes par source, soit dix cartes maximum au total.
- Une catégorie publique active peut ouvrir sa page de catégorie dédiée. Les recherches privées et les recherches transversales ouvrent actuellement `resultats-recherche.html`, où le moteur doit conserver et appliquer les paramètres `q`, `categorie`, `marche` et `zone`.

Une catégorie non connectée ne doit jamais produire de fausses annonces ni afficher les résultats d’une autre source comme s’ils correspondaient à la sélection. L’interface doit expliquer explicitement que la source est à connecter.

## Règles de publication et de provenance

1. Une annonce présentée comme réelle doit provenir d’une source effectivement interrogée et identifiable.
2. Conserver le nom de la source, son URL, l’identifiant source lorsqu’il existe et la date de publication publiée par la source.
3. Distinguer la date de publication, la date limite de réponse et la date de récupération.
4. Ne pas inventer l’acheteur, les coordonnées, les lots, les échéances ou l’activité de l’entreprise.
5. Pour BOAMP, vérifier la date limite avant de qualifier un marché d’ouvert. Un avis de résultat ou d’attribution ne doit pas être présenté comme un appel d’offres ouvert.
6. Les annonces BODACC sont des **signaux légaux d’entreprise**, pas des appels d’offres. Elles peuvent motiver une qualification commerciale, mais ne prouvent pas une intention d’achat ni une volonté d’être contacté.
7. Si une source est inaccessible, afficher un état d’erreur et aucun résultat fictif.
8. Une réponse API réussie confirme l’accès technique à la source au moment du test ; elle ne garantit ni l’exhaustivité des résultats ni la disponibilité permanente du service.

## Champs essentiels du schéma normalisé

- `id` : identifiant interne stable.
- `sourceId` : identifiant d’origine, si fourni.
- `title`, `summary`, `description` : contenu de l’annonce ou du signal.
- `category` : catégorie fonctionnelle contrôlée.
- `marketType` : `public` ou `private`.
- `buyerName` : acheteur ou donneur d’ordre publié par la source, lorsqu’il existe.
- `location` : commune, département et région lorsqu’ils sont connus.
- `publishedAt`, `deadlineAt` : dates normalisées au format date-heure ISO 8601 lorsqu’elles sont disponibles.
- `source`, `sourceUrl`, `documentUrls` : traçabilité.
- `status` : `published`, `updated`, `closed`, `withdrawn` ou `to_verify`.
- `verifiedAt`, `lastSeenAt`, `provenance` : fraîcheur et auditabilité.
- `tags`, `lots` : recherche et granularité métier.

## Catégories publiques

| Valeur interne | Libellé | Page dédiée |
| --- | --- | --- |
| `services` | Services numériques | `categorie-services-numeriques.html` |
| `travaux` | Travaux & aménagement | `categorie-travaux-amenagement.html` |
| `conseil` | Conseil & études | `categorie-conseil-etudes.html` |
| `batiment` | Bâtiment & construction | `categorie-batiment.html` |
| `renovation` | Rénovation énergétique et générale | `categorie-renovation.html` |
| `electricite` | Électricité | `categorie-electricite.html` |
| `plomberie` | Plomberie & chauffage | `categorie-plomberie-chauffage.html` |
| `maintenance` | Maintenance & exploitation | `categorie-maintenance.html` |

## Catégories privées et état des connecteurs

| Valeur interne | Libellé | Source / état |
| --- | --- | --- |
| `bodacc-creations` | Créations et implantations | BODACC connecté |
| `bodacc-cessions` | Ventes, cessions et reprises | BODACC connecté |
| `bodacc-modifications` | Modifications d’entreprises | BODACC connecté |
| `bodacc-procedures` | Difficultés et procédures collectives | BODACC connecté |
| `bodacc-radiations` | Radiations et cessations | BODACC connecté |
| `immobilier` | Immobilier professionnel | À connecter |
| `emploi` | Emploi et recrutement | À connecter |
| `sous-traitance-offres` | Offres de sous-traitance | À connecter |
| `sous-traitance-recherche` | Recherche de sous-traitants et partenaires | À connecter |

Les familles BODACC sont filtrées à partir des champs textuels de l’annonce (famille, acte, jugement, modifications et autres détails disponibles). Les catégories privées non connectées sont bloquées avant l’interrogation d’une source afin d’éviter d’afficher des résultats hors sujet.

## Règles de filtrage

- Les mots-clés sont comparés sans distinction de casse ni d’accents.
- La catégorie et le type de marché doivent correspondre à la sélection de l’utilisateur.
- Pour BOAMP, le filtre régional est converti en codes départementaux et porte sur le département de prestation ou, à défaut, celui de l’acheteur.
- Pour BODACC, le filtre régional s’appuie sur le champ régional de la source. La zone « Outre-mer » est refusée tant qu’une correspondance fiable n’est pas disponible ; aucun résultat non filtré ne doit être présenté comme territorial.
- Le moteur mixte est plafonné à dix cartes maximum : cinq BOAMP et cinq BODACC.
- Les erreurs réseau, catégories non reconnues et catégories non connectées doivent produire un message explicite et ne jamais déclencher de résultats fictifs.

## Limites et prochaines étapes

Les connecteurs BOAMP et BODACC sont interrogés à la demande depuis le navigateur. Les autres sources privées ne sont pas encore connectées. Le moteur de recherche en direct ne constitue pas à lui seul un CRM : le schéma commun prépare la normalisation, la provenance, la qualification et le lien futur vers les objets CRM, mais l’adaptateur BOAMP/BODACC, la validation systématique du schéma, la déduplication persistante, le stockage, le suivi des interactions, l’historique et les règles de conservation restent à développer.

Prochaines étapes :
1. renforcer les tests de correspondance de chaque catégorie BODACC sur des exemples de champs réels ;
2. vérifier les filtres combinés de catégorie, mot-clé et région ;
3. harmoniser la présentation des résultats entre la page générale et les huit pages publiques ;
4. connecter progressivement les sources immobilier professionnel, emploi et sous-traitance après validation des conditions d’accès ;
5. définir le passage d’un signal qualifié vers le CRM, avec provenance, date de consultation et décision humaine.

Aucun scraping ni collecte de coordonnées non publiées n’est autorisé par ce document. Toute évolution de source doit respecter ses conditions d’accès et la réglementation applicable.


## Précision de statut — 2 novembre 2026

Les mentions « BODACC connecté » dans les tableaux désignent la présence du connecteur dans le prototype, et non une chaîne métier complète. Les contrôles API BOAMP/BODACC ont réussi dans le workflow du 2 novembre ; le test navigateur de recherche a néanmoins échoué. Le stockage CRM, la validation systématique du schéma en production, la déduplication persistante et le suivi des interactions ne sont pas établis. [Résultat CI](https://github.com/Chexpeer/Majestios/actions/runs/41460016382).
