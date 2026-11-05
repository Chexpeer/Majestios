# Lot 4 — Audit du moteur de recherche transversal

- **Date :** 4 novembre 2026
- **Branche examinée :** `evolution-5.0`
- **Commit de départ :** `2bc6efb`
- **Périmètre :** formulaire et catalogue partagés, filtres, routage, résultats BOAMP/BODACC, qualification d'entreprises, erreurs, tests présents et raccordement CRM.
- **Limite :** audit du prototype et de sources publiques à la date du contrôle ; ni exhaustivité métier, ni validation de production.

## 1. Synthèse

Le moteur est un **prototype partiellement opérationnel**, pas un service de recherche exhaustif ni un flux CRM. L'accueil et les rubriques utilisent le même catalogue et le même formulaire. Les requêtes d'appels d'offres et de signaux d'entreprises sont envoyées directement du navigateur aux API publiques BOAMP et BODACC ; la qualification d'entreprises appelle séparément l'API Recherche d'Entreprises de la DINUM.

Les catégories actives BOAMP et cinq familles BODACC possèdent un traitement réel. Les familles privées immobilier, emploi et sous-traitance restent explicitement non connectées. Les résultats sont affichés avec source et accès à la publication officielle, mais aucune recherche, annonce, qualification ou action n'est enregistrée au CRM.

Deux défauts simples ont été corrigés dans le cadre de l'audit : une catégorie publique inconnue n'est plus interprétée comme « toutes les catégories » ; le code postal ultramarin n'est plus réduit au seul préfixe `97` lors de la normalisation d'une entreprise.

## 2. Parcours et état des catégories

### Formulaire et navigation

- `catalogue-majestios.js` est la taxonomie partagée des marchés, catégories et départements ; `rubric-search.js` injecte le formulaire dans les pages configurées ; `app.js` restaure et transmet les critères.
- Une catégorie publique dotée d'une page dédiée va vers l'une des huit pages `categorie-*.html`. Les catégories sans page dédiée vont vers `resultats-recherche.html`.
- Les recherches privées et les recherches mixtes aboutissent à `resultats-recherche.html`. Le retour conserve les paramètres et le lien vers la recherche générale.
- Une requête « Publics et privés » sans catégorie spécifique interroge BOAMP et BODACC en parallèle, dans deux groupes séparés et jusqu'à cinq résultats chacun. Une catégorie propre à un seul marché avec le mode mixte est refusée plutôt que faussement appliquée aux deux sources.

### Catégories et sources

| Domaine | Catégories dans le catalogue | État observé du moteur |
|---|---|---|
| Marchés publics — BOAMP | 8 catégories routées vers une page dédiée ; « Nettoyage & propreté » sans page dédiée ; catégories futures marquées `planned` | Les catégories actives ont un filtrage textuel. `services` et `travaux` ajoutent aussi un type de marché BOAMP. Les catégories `planned` sont désactivées dans le formulaire et les familles non reconnues sont maintenant refusées. |
| Marchés privés — BODACC | Créations, cessions, modifications, procédures et radiations ; autres familles marquées `planned` | Les cinq familles actives sont filtrées à partir de la famille de l'annonce et de textes disponibles. Immobilier, emploi et sous-traitance affichent « source non connectée » et ne déclenchent pas de requête BODACC. |
| Qualification d'entreprises — API Recherche d'Entreprises | Codes APE/NAF et départements saisis ou suggérés lexicalement | Recherche DINUM distincte des annonces BOAMP/BODACC ; dédoublonnage et score indicatif. Elle ne prouve ni capacité ni éligibilité et ne complète pas automatiquement les données d'une annonce. |

## 3. Sources et logique réellement implémentées

| Source | Requête observée dans le code | Présentation et limites |
|---|---|---|
| **BOAMP / DILA** | Endpoint OpenDataSoft du jeu `boamp`, tri des avis par `dateparution`, filtre sur `nature = APPEL_OFFRE`, mot-clé transmis à l'API, filtre de département sur le département de prestation ou celui associé à l'acheteur. | 100 enregistrements au plus récupérés pour une recherche ; catégorie, mots-clés et avis expirés filtrés côté navigateur ; 10 résultats au plus affichés. Pas de pagination des pages suivantes. La catégorie métier est une correspondance textuelle, pas une classification exhaustive. Les liens d'avis sont limités à `boamp.fr` ou renvoient à une recherche officielle par identifiant. |
| **BODACC / DILA** | Endpoint OpenDataSoft du jeu `annonces-commerciales`, 100 annonces au plus, triées par date de parution, champs choisis, mot-clé et égalité avec le nom officiel du département. | Famille, mots-clés et localisation sont filtrés dans le navigateur ; 10 signaux au plus sont affichés. Aucune pagination du lot récupéré. Les liens vers `bodacc.fr` sont privilégiés ; les signaux ne sont pas assimilés à des marchés ou à des besoins commerciaux confirmés. |
| **Recherche d'Entreprises / DINUM** | Endpoint public `recherche-entreprises.api.gouv.fr/search`, avec code APE/NAF, département, `per_page` jusqu'à 25 et pages bornées par l'appelant. Le formulaire actuel demande une page maximum. | Résultats dédoublonnés et ordonnés à partir d'un score métier. Pas de transfert vers le CRM ; le nombre de candidats reçus et la date de collecte sont affichés. |

Les trois intégrations sont appelées depuis le navigateur, sans backend MajestiOS constaté. Le code rend les erreurs de requête visibles et ne fabrique pas d'annonce. Pour BOAMP/BODACC, un délai de 12 secondes annule la requête ; les erreurs réseau, HTTP et délai aboutissent à un message générique d'indisponibilité. Les réponses sans résultat et les résultats éliminés par les filtres ont des messages distincts. Aucun mécanisme de reprise automatique n'est présent.

## 4. Filtres géographiques : constats

- Le catalogue du moteur commun expose les départements métropolitains `01`–`95`, la Corse `2A`/`2B`, et `971`, `972`, `973`, `974`, `976`.
- La validation BOAMP indépendante n'accepte que son ensemble explicite, qui omet notamment `975`. Le formulaire ne propose pas `975`, `977`, `978`, `986`, `987` ou `988`.
- Le formulaire de qualification d'entreprises accepte en saisie libre davantage de codes, dont `975`, `977` et `978`, que la liste du moteur commun. Cela n'établit pas à lui seul la couverture ou le support de chaque valeur par les sources.
- Pour BOAMP, la recherche d'un département peut retourner un avis concernant plusieurs départements ; les codes associés sont affichés dans la carte. La sélection représente une correspondance avec le département, pas nécessairement une consultation limitée à ce seul territoire.
- Pour BODACC, le filtre départemental emploie le nom officiel fourni par le catalogue. Le navigateur a renvoyé dix créations pour Paris pendant la vérification en direct.
- Pour le ciblage d'entreprises, un champ `departement` fourni par la source est prioritaire. En absence de ce champ, le code postal ultramarin était ramené à deux chiffres ; il est maintenant normalisé sur trois chiffres pour les codes commençant par `97`.

**À arbitrer avant extension :** la liste géographique officielle à supporter par domaine et la couverture effective de chaque source, particulièrement pour les collectivités et territoires non proposés dans le moteur commun. L'audit n'ajoute pas ces territoires au catalogue.

## 5. Pertinence, destination et préparation CRM

### Pertinence et fiabilité des résultats

- Les mots-clés sont transmis aux sources et les enregistrements récupérés sont également filtrés côté navigateur.
- Les catégories BOAMP sont des ensembles de termes associés à des champs de titre, descripteur et type de marché ; les catégories privées reposent sur les familles et le texte des annonces.
- Les résultats expirés BOAMP dont la date limite est passée sont exclus ; une échéance absente ou illisible reste présentée comme « à vérifier ».
- Le plafonnement au premier lot de 100 annonces avant filtrage local signifie qu'une annonce correspondante plus ancienne dans le tri peut ne pas être récupérée. Zéro résultat ne signifie donc pas qu'aucune annonce pertinente n'existe.
- Le code APE/NAF, le statut administratif et le score sont des indices. Ils ne démontrent ni les compétences, ni les moyens, ni l'éligibilité au marché.

### Destinations

- Les huit catégories publiques routées ont des pages dédiées ; les résultats utilisent leur catégorie et leur marché pour interroger BOAMP.
- « Nettoyage & propreté » n'a pas de page dédiée ; il reste filtré sur la page générale des résultats.
- Les familles BODACC et les recherches mixtes utilisent la page générale des résultats, qui conserve les filtres au retour et sépare les sources.
- Les destinations publiques pointent vers le BOAMP officiel ; les signaux privés vers le BODACC officiel.
- L'interface de résultats ne contient pas d'action d'ajout, de sauvegarde ou de transfert CRM.

### Préparation au CRM

**État vérifié : aucun raccordement CRM.** Les paramètres de recherche sont transportés dans l'URL et les annonces sont rendues dans la page. Ni fiche d'opportunité normalisée, ni stockage, ni export ou transfert au CRM n'est constaté. Les alertes et pages de qualification indiquent que les critères ou résultats ne sont pas persistés. Ne pas saisir de données confidentielles dans les mots-clés : ceux-ci sont transmis aux services externes concernés.

Pour une évolution future, la référence V5 requiert provenance, date, finalité, autorisation et destination, distinction entre faits et hypothèses, contrôle humain et cloisonnement. Aucun choix de modèle CRM, backend ou mécanisme de transfert n'est arrêté par cet audit.

## 6. Anomalies, corrections et recommandations

| Priorité | Anomalie ou risque | Conséquence | Traitement |
|---|---|---|---|
| **P2 — catégorie publique inconnue** | Avant correction, `categoryMatches` renvoyait `true` quand aucun filtre de catégorie n'était défini pour la valeur reçue. Une URL avec catégorie publique inconnue pouvait donc afficher des résultats non filtrés tout en montrant cette catégorie comme critère. | Résultats trompeurs en cas de lien ou d'URL invalide. | Corrigé : le moteur refuse une catégorie publique non présente dans les catégories traitées et affiche un statut explicite avant tout appel à BOAMP. Test navigateur ajouté, non exécutable sans Node/Playwright. |
| **P2 — code postal ultramarin en repli** | En absence de département explicite de la source, `97100` et `97620` étaient normalisés à `97`. | Dégradation du score géographique et du regroupement par département pour ces fiches. | Corrigé : les codes postaux `97xxx` produisent un département à trois chiffres ; tests unitaires ajoutés pour `971` et `976`, non exécutés faute de Node. |
| **P2 — limites de couverture après filtrage** | Le moteur récupère un lot récent de 100 résultats avant certains filtres locaux ; aucune pagination vers les lots suivants. | Faux négatifs possibles pour des catégories ou mots-clés peu fréquents, et couverture non exhaustive. | Recommandation : mesurer les volumes par source et préciser les bornes, puis décider pagination ou autre mécanisme. Aucun changement de source ou de plafond décidé ici. |
| **P2 — périmètres géographiques différents selon le parcours** | Le catalogue commun et la validation BOAMP sont alignés sur 101 codes ; le formulaire distinct de ciblage d'entreprises accepte davantage de codes en saisie libre. | Un code peut être accepté par le ciblage sans être proposé par le moteur d'annonces. Cette différence ne prouve pas la couverture effective des sources. | À arbitrer à partir des exigences métier et de la couverture source ; ne pas étendre silencieusement la liste. |
| **P1 avant usage de critères confidentiels** | Les appels aux API tierces sont directs depuis le navigateur et incluent les mots-clés/départements dans les requêtes. | Les critères sont transmis aux services externes ; le prototype n'offre pas de contrôle serveur ou de confidentialité des recherches. | Garder une consigne de non-saisie de données confidentielles ; décider finalité, droits et architecture avant tout usage de données privées ou transfert CRM. |
| **P2 — traitement des erreurs** | Les délais, erreurs réseau et erreurs HTTP sont présentés par un message générique ; aucune reprise automatique. | L'utilisateur sait que la source est indisponible, mais pas si la panne vient du délai, du réseau, du statut serveur ou d'un quota. | Recommandation : conserver une erreur visible, distinguer les causes quand elles sont fiables et offrir une reprise manuelle ; éviter de transformer l'erreur en zéro résultat. |
| **P2 — CRM non préparé sous forme structurée** | Le moteur ne produit aucun objet d'opportunité enregistré ou transférable. | Pas de continuité du parcours « détecter → qualifier → identifier → contacter → transformer → capitaliser ». | Rester explicite sur l'absence de persistance ; spécifier provenance, permissions, contrôle humain, déduplication et modèle avant tout raccordement. Ce n'est pas une correction locale. |

## 7. Vérifications exécutées et tests disponibles

**Tests navigateur exécutés directement**

- Recherche BODACC en direct : `marche=private`, créations, département 75 ; dix annonces ont été affichées à la date du test, catégorie, source, liens officiels et retour des filtres visibles.
- Recherche BOAMP en direct : `marche=public`, nettoyage, département 75 ; un avis multi-départements contenant Paris a été rendu avec date limite future et lien BOAMP.
- Famille privée « emploi » : message indiquant que la source n'est pas connectée ; aucune annonce fictive présentée.
- Catégorie publique inconnue : après correction, message de catégorie non reconnue.
- Mot-clé volontairement improbable : message « aucun résultat ... parmi les annonces récentes récupérées », distinct d'une indisponibilité de source.
- Normalisation via le module chargé dans le navigateur : `97100 → 971` et `97620 → 976`.

Ces nombres de résultats sont des observations datées, variables selon la disponibilité et l'évolution des sources ; ils ne sont pas des garanties d'exhaustivité.

**Tests présents dans le dépôt — statut au moment de l'audit initial**

- `tests/opportunity-search.browser.cjs` : filtres, provenance séparée, catégories BOAMP/BODACC, catégories non connectées, départements, résultats expirés, retours, vue mixte et affichage mobile à l'aide de réponses simulées.
- `tests/boamp-live-smoke.cjs` et `tests/bodacc-live-smoke.cjs` : smoke tests réseau des sources.
- `tests/company-targeting.test.cjs`, `tests/company-fit.test.cjs`, `tests/naf-suggestions.test.cjs`, `tests/mesure-boamp.test.cjs` : ciblage, rapprochement, suggestions et mesures.
- `verify-site.js` et `verify-architecture.js` : liens locaux, manifeste et invariants d'architecture.

À la date de rédaction de cet audit initial, Node.js n'était pas disponible dans l'environnement de revue ; ces suites, le build et Playwright n'avaient donc pas été lancés localement. Les appels live avaient été effectués dans le navigateur intégré, sans remplacer les tests automatisés.

## 8. Pistes d'évolution vers MajestiOS V.5

Ce sont des exigences à instruire, pas des fonctionnalités à considérer comme décidées ou développées :

1. Rechercher une annonce et son détail en préservant source, date et URL officielle.
2. Qualifier l'opportunité en séparant données source, calcul, hypothèse et décision humaine.
3. Relier une entreprise uniquement après vérification de la fiche et de la pertinence métier.
4. Préparer une action sans contacter ni publier automatiquement.
5. Avant toute sauvegarde CRM, décider rôles, finalité, provenance, consentement/autorisation, rétention, déduplication, séparation client/interne et traçabilité.
6. Faire de MajestiOS V.5 une couche d'orchestration éventuellement assistée par IA, mais avec sources visibles, incertitude explicite et validation humaine ; aucun modèle, fournisseur ou automatisme n'est choisi ici.

## 9. Fichiers et suites

**Modifiés pour ce lot :** `opportunity-search.js`, `company-targeting.js`, `tests/opportunity-search.browser.cjs`, `tests/company-targeting.test.cjs`, ce rapport et les index documentaires.

**Sans modification :** aucun connecteur ou endpoint ajouté ; aucune destination ni règle de sélection métier élargie ; aucune branche source touchée ; aucun déploiement.

**À faire ensuite :** exécuter les tests automatisés dans l'environnement Node 22, arbitrer le périmètre territorial, mesurer les limites de pagination/couverture, puis spécifier la préparation CRM avant toute connexion.


## 10. Validation automatisée ultérieure — branche de revue V5

Le constat historique de non-exécution des tests ci-dessus a été réévalué sur la branche `evolution-5.0-clean-preview`. Sur le HEAD `7016db884e7d32da0436526c2189127ae723d460), le workflow PR « Vérification du site MajestiOS » (run `42087422030`) a terminé avec succès toutes les étapes suivantes : syntaxe JavaScript, ciblage et qualification d'entreprises, suggestions APE/NAF, build, architecture/routes, liens et identifiants, installation Playwright/Chromium, smoke tests réels BOAMP/BODACC, tests navigateur de l'immeuble interactif, du moteur de recherche, des menus mobile/ordinateur et du formulaire Contact.

Le workflow « Vérification anti-régression MajestiOS » (run `42087421995`) a également réussi : tests ciblés, build statique, références internes et contrôle des dix dossiers et de leurs accès.

Ces résultats sont des preuves CI sur le HEAD indiqué ; ils ne prouvent ni l'exhaustivité des sources ni la recette des comptes Auth, de la collecte des formulaires ou du CRM. Le prototype conserve les limites de couverture, de pagination et de persistance décrites dans ce rapport.


## 11. Catégorie de repli « Autre » — implémentation et validation

La catégorie de repli demandée est implémentée sur les deux marchés, sans confusion de provenance :

- BOAMP : « Autre marché public · recherche par mot-clé » ;
- BODACC : « Autre signal BODACC · recherche par mot-clé ».

Un mot-clé est obligatoire. Sans mot-clé, le moteur affiche un message de validation et n'appelle pas l'API. Avec un mot-clé, le moteur exécute une recherche textuelle sur la seule source du marché choisi. Les résultats conservent leur libellé réel de source/famille ; MajestiOS ne les requalifie pas artificiellement comme une catégorie métier.

Les tests navigateur couvrent le parcours public et privé, l'obligation du mot-clé, l'absence d'appel réseau sans mot-clé, la présence de résultats simulés correspondant au terme et le libellé de filtre. Les catégories inconnues dans une URL restent rejetées : « Autre » est une option explicite de recherche libre, pas un mécanisme qui masque une URL invalide.

Validation sur le HEAD `368496d8b1bd0fa574056af8ade9507d1d1fd85f` : le workflow push `42088662858` a réussi, y compris le test navigateur du moteur de recherche. Le workflow anti-régression `42088673618` a également réussi.


## 12. Reprise de l'audit — harmonisation du formulaire et du routage (5 novembre 2026)

**Branche :** `evolution-5.0-clean-preview`  
**Commit applicatif vérifié :** `656a0cfd47b06b6df1fddeb1a88aaf608c5cf0d5`  
**Déploiement Vercel Preview :** `majestios-jc8g-ftx2j0ytg-majistr.vercel.app` — état `READY`.

### Corrections apportées

1. **Suppression du double pilotage sur l'accueil.** Le formulaire est généré par `rubric-search.js` et ses interactions sont pilotées par `app.js`. Le script inline de `index.html`, qui réinstallait des écouteurs `focus/change` concurrents, a été supprimé.
2. **Mode « Publics et privés » rendu accessible.** L'option `all` existait dans le catalogue et dans le moteur de résultats, mais n'était pas proposée par le formulaire partagé. Elle est maintenant présente sur l'accueil et les rubriques.
3. **Critères mixtes préservés.** Le mode `all` sélectionne automatiquement « Toutes les catégories » et le paramètre `marche=all` est conservé dans l'URL jusqu'à la page de résultats. Une catégorie propre à un seul marché n'est pas appliquée au mode mixte.
4. **Taxonomies privées non connectées toujours signalées honnêtement.** Immobilier professionnel, emploi/recrutement et sous-traitance restent visibles comme catégories prévues mais désactivées. Aucune annonce n'est simulée pour ces sources absentes.

### Vérifications exécutées

- Les pages métier examinées chargent toutes le même triplet `catalogue-majestios.js`, `rubric-search.js`, `app.js` ; les pages de résultats utilisent ensuite le même moteur `opportunity-search.js`.
- Comparaison des départements : 101 codes dans le catalogue et 101 dans l'ensemble BOAMP ; aucune différence entre ces deux listes.
- Analyse syntaxique JavaScript réussie pour `app.js`, `rubric-search.js`, `opportunity-search.js` et `catalogue-majestios.js`.
- Contrôles statiques : une seule source de balisage du formulaire partagé ; écouteurs de recherche inline supprimés de l'accueil ; option mixte visible dans le balisage commun ; paramètre `marche=all` conservé à la soumission.
- Le build Vercel a terminé en `READY` et a confirmé la copie de 53 fichiers depuis `site-files.json`, sans différence avec les sources.

Un test navigateur supplémentaire a été ajouté dans `tests/opportunity-search.browser.cjs` : il vérifie que le mode mixte sélectionne « Toutes les catégories », conserve `marche=all` dans l'URL et affiche deux groupes de résultats distincts BOAMP/BODACC. **Ce nouveau test n'a pas encore été exécuté dans cette reprise** ; il doit être validé par le workflow CI avant de considérer le lot comme entièrement vérifié.

### Limites qui restent ouvertes

- Les sources Immobilier, Emploi et Sous-traitance ne sont pas raccordées ; leurs catégories restent désactivées.
- Les résultats ne sont toujours pas persistés ni transmis au CRM.
- Les limites de pagination et de couverture des lots BOAMP/BODACC restent celles décrites plus haut.
- Les pages de catégories publiques et la page générale ont des adaptateurs de présentation distincts, mais appellent le même moteur de collecte et de filtrage. Une unification visuelle/UX plus profonde reste à évaluer sans casser les pages dédiées.
- Aucun contrôle visuel navigateur n'a été réalisé dans cette reprise ; `READY` confirme le déploiement, pas la recette graphique ni le comportement interactif en navigateur.
