# Rapport d’audit MajestiOS — Lot 01
Date : 1er novembre 2026  
Branche d’origine de l’audit : `chantier-recherche-donnees-gardes-fous-2026-11-01`  
Branche de poursuite : `refonte-moteur-navigation-mobile-2026-11-01`

## Périmètre et preuve d’exécution

Le lot porte sur dix contrôles prioritaires autour de l’accueil, de la recherche, de la séparation des sources et des garde-fous. Le workflow GitHub Actions du commit `abf0b187c2a4df84d1519b9217614af94c6923c3` est terminé avec la conclusion **success**. Le job `verify-static-site` a validé la syntaxe JavaScript, le build, les contrôles statiques, les tests de connexion BOAMP/BODACC, la recherche dans Chromium et la zone industrielle dans Chromium.

Cette réussite décrit le commit testé. Toute nouvelle modification doit déclencher et réussir son propre contrôle avant de pouvoir être considérée comme validée.

## Les dix contrôles

| # | Contrôle | État | Observation / garde-fou |
|---|---|---|---|
| 1 | Accueil compact et présence du moteur | Vérifié par les contrôles statiques et le test navigateur | L’accueil conserve la zone immersive, le formulaire de recherche, la navigation discrète et le guide d’aide. Le flux supérieur indique explicitement qu’aucune annonce réelle n’est diffusée pour le moment. |
| 2 | Transmission des critères de recherche | Testé dans Chromium | Les critères mot-clé, catégorie, type de marché et région sont transmis dans l’URL vers la page de résultats appropriée. |
| 3 | Catégories et faux positifs | Testé dans Chromium | Le test vérifie que la catégorie Services numériques ne présente pas une annonce de plomberie comme résultat numérique. |
| 4 | Filtre géographique | Testé dans Chromium | Le test couvre la région Nouvelle-Aquitaine et vérifie l’application du filtre de département à la requête BOAMP. Les anciennes zones de démonstration ne doivent pas être proposées comme régions réelles disponibles. |
| 5 | Séparation des marchés publics | Testé par le smoke test API et le test navigateur | BOAMP est interrogé pour les appels d’offres publics ; la requête vérifiée limite la recherche aux avis d’appel d’offres. |
| 6 | Séparation des signaux privés | Testé par le smoke test API et le test navigateur | BODACC est utilisé pour les annonces légales et signaux commerciaux. Ces annonces ne sont pas qualifiées de marchés à remporter. |
| 7 | Recherche combinée public + privé | Testé dans Chromium | Les deux sources sont interrogées séparément et leurs résultats restent regroupés par provenance, sans fusion trompeuse. |
| 8 | Provenance, références et échéances | Couvert par les contrôles et tests existants | Les cartes affichent les éléments de provenance disponibles, les références utiles et un avertissement lorsque l’échéance BOAMP est absente. Chaque avis doit être confirmé sur sa publication officielle. |
| 9 | Absence de résultats inventés en cas de problème | Vérifié par les tests de recherche | Les états vides et erreurs indiquent qu’aucun résultat n’est inventé. Les filtres géographiques BODACC non pris en charge sont refusés explicitement au lieu de retourner des résultats non filtrés. |
| 10 | Zone immersive, veille emploi et formulaires | Zone testée ; limites fonctionnelles identifiées | Le test navigateur de la zone est réussi. La veille emploi reste absente des catégories publiques de recherche, mais « Emploi et recrutement » figure dans la taxonomie privée comme catégorie non connectée. La création de compte, l’envoi de candidature et les demandes de contact ne sont pas encore connectés à un backend : aucun envoi ni stockage réel ne doit être promis. |

## Points ouverts à traiter dans les lots suivants

1. **Formulaires et espace membre** : choisir et intégrer une destination réelle pour les demandes, avec validation serveur, consentement adapté, politique de conservation et retour d’erreur fiable. Jusqu’à cette intégration, conserver le libellé de démonstration.
2. **Qualification BODACC** : enrichir les règles par type d’annonce et distinguer clairement le fait publié, l’hypothèse commerciale et l’action proposée. Toute inférence doit être vérifiée par un humain avant prospection.
3. **Fraîcheur et dédoublonnage** : documenter la fenêtre temporelle, la clé de dédoublonnage et le comportement lors d’une indisponibilité de source.
4. **Veille emploi multisource** : maintenir le périmètre interne. Avant toute collecte planifiée, valider pour chaque source l’accès autorisé, les conditions d’utilisation, les limites, l’attribution, la fréquence et les données personnelles.
5. **Intégration Git** : ne pas fusionner en production sur la seule base de ce lot. Évaluer séparément l’écart d’historique de la branche de chantier avec la branche de référence et définir une stratégie d’intégration sûre.
6. **Déploiement** : aucune mise en production n’est déclenchée par ce rapport.

## Règle de validation

Une fonctionnalité n’est déclarée « opérationnelle » que si son parcours réel est testé et si sa dépendance externe est effectivement connectée. Les tests avec réponses simulées vérifient la logique applicative ; ils ne prouvent pas à eux seuls la disponibilité continue d’une source ni l’existence d’un traitement backend.


## Addendum — Audit des parcours de recherche et des formulaires
Date : 1er novembre 2026  
Branche de poursuite : `refonte-moteur-navigation-mobile-2026-11-01`

### Constats vérifiés dans le code

| Parcours | État constaté | Conséquence / prochaine action |
|---|---|---|
| Résultats BOAMP | Les cartes proposent un lien direct vers l’avis officiel. | Le lien source est utile et doit être conservé ; il n’ouvre pas de formulaire de demande MajestiOS. |
| Résultats BODACC | Les cartes affichent un signal légal et proposent un lien vers l’annonce officielle. | Ne pas présenter ce signal comme un appel d’offres. Aucun parcours de contact MajestiOS n’est déclenché depuis la carte. |
| Formulaire « Créer mon espace personnel » | Le formulaire contrôle les champs côté navigateur puis affiche un message indiquant qu’aucune donnée n’est transmise ni enregistrée. | Prototype honnête, mais ce n’est pas une création de compte opérationnelle. |
| Formulaire de demande / accompagnement | Le code de prévisualisation de `app.js` ne s’active que si le formulaire `#lead-form` est présent. Les pages principales inspectées ne démontrent pas un parcours complet connecté. | Vérifier l’emplacement et le parcours cible avant de le déclarer disponible. Ne pas brancher de transmission ou de CRM dans ce lot. |
| Confirmation et retour à l’accueil | Aucun parcours complet de confirmation après envoi réel n’est démontré par les pages et scripts inspectés. | À spécifier avec le futur traitement serveur : confirmation seulement après acceptation réelle de la demande, puis retour temporisé à l’accueil si c’est le parcours retenu. |
| Catégories privées non connectées | Immobilier professionnel, emploi et recrutement, offres de sous-traitance, recherche de sous-traitants et partenaires affichent un état non connecté sans inventer de résultats. | Comportement attendu ; chaque connecteur doit être validé séparément avant activation. |
| Préparation CRM | Les résultats de recherche sont affichés dans le navigateur ; aucune écriture CRM n’a été observée dans ce parcours. | Conserver uniquement la préparation documentaire et du modèle de données. Aucune persistance ni alimentation CRM ne doit être activée à ce stade. |

### Décision de périmètre

Le prochain lot doit d’abord **spécifier le parcours de demande à partir d’une annonce** (consulter la source officielle, demander à recevoir l’offre, préparer une candidature ou créer un espace personnel), en séparant nettement les intentions et en indiquant l’état réel de chaque action. Il ne faut pas prétendre envoyer un e-mail, transmettre une candidature, créer un compte ou enregistrer une fiche tant qu’un traitement serveur réel et ses tests ne sont pas en place.

Les changements de ce lot sont documentaires : ils ne connectent aucun backend, ne déclenchent aucun envoi et n’activent pas le CRM.


## Addendum — Contrôle des destinations et des filtres dans les pages métier

Contrôle réalisé le 1er novembre 2026 sur la branche `refonte-moteur-navigation-mobile-2026-11-01`.

### Vérifications statiques

- Les douze liens de bâtiments présents sur l’accueil pointent vers douze pages HTML existantes dans le dépôt.
- Les liens de navigation principaux observés sur l’accueil et la page générale de résultats pointent vers des pages existantes.
- Les huit pages de résultats par catégorie sont présentes et restent distinctes des douze pages métier.
- Le formulaire principal respecte la logique Type → Catégorie : le choix du type détermine les catégories affichées ; les recherches privées et transversales utilisent la page générale, tandis que les huit catégories publiques actives disposent de leurs destinations dédiées.

### Défaut constaté et correction engagée

Le formulaire de recherche injecté dans les pages métier par `rubric-search.js` réutilisait auparavant les catégories publiques du catalogue sans tenir compte de la rubrique. Une page « Marchés privés » pouvait donc proposer « Services numériques » ou d’autres catégories BOAMP. De plus, sur les pages transversales dont le type par défaut était « Tous types », le sélecteur de catégorie permettait une combinaison ambiguë que le moteur de résultats refuse à juste titre.

Correction dans le commit `ef973f4534462ea1d32d002b2db62cbe1140f6e2` :
- les pages à source privée proposent les cinq familles BODACC et les quatre catégories privées à connecter ;
- les pages à source publique proposent les huit catégories publiques actives ;
- les pages transversales désactivent le sélecteur de catégorie tant que l’utilisateur n’a pas choisi « Marchés publics » ou « Marchés privés » ;
- le changement de type reconstruit les options, sans mélanger BOAMP et BODACC ;
- les quatre catégories privées non connectées portent une mention explicite « à connecter » ;
- les critères déjà présents dans l’URL sont préremplis quand ils sont valides.

Des assertions navigateur ont été ajoutées dans `tests/opportunity-search.browser.cjs` (commit `6d21a85c482cb62bdf0a3293a49486f8672e7b89`) pour contrôler ces comportements sur les pages « Marchés privés » et « Développement commercial ».

### Statut

Cette correction est poussée sur la branche de travail. **La validation GitHub Actions du commit de tests doit encore être confirmée** avant de déclarer le lot validé. Aucun déploiement de production, aucune fusion dans `main` et aucune intégration CRM n’ont été effectués.
