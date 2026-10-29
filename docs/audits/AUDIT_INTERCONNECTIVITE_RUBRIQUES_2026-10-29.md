# Audit d’interconnectivité des rubriques — 29 octobre 2026

## Périmètre de ce lot

Branche de travail : `fix/homepage-structure-opportunity-flow`.

Ce lot porte sur la cohérence des pages générées à partir de l’arborescence centrale, la profondeur des sous-rubriques et les liens entre rubriques. Il ne constitue pas une validation visuelle du site dans un navigateur.

## Contrôles et corrections réalisés

- L’arborescence centrale `src/data/site-tree.ts` reste la source de référence des rubriques et sous-rubriques.
- Le gabarit `SiteHub` conserve le fil d’Ariane, la carte interactive contextuelle, les ressources, les liens associés et le pied de page.
- Les sous-rubriques majeures des opportunités ont reçu un contenu métier distinct : catégories de marchés publics, territoire, annonces privées, salons, offres et missions, métiers, dépôt d’offre et radar entreprises.
- Les parcours Business (achat, vente, évaluation, diagnostic), études de marché, e-réputation et Comprendre ont également reçu des contenus dédiés.
- Les 52 rubriques de l’arborescence gérées par `SiteHub` disposent maintenant d’une entrée éditoriale dédiée ; les trois routes hors de ce périmètre sont des pages spécifiques (accueil, Nous rejoindre, Mentions légales).
- Un test vérifie cette couverture éditoriale pour éviter qu’une nouvelle rubrique soit ajoutée sans contenu dédié.
- La page `/opportunites` dispose d’une introduction propre au rôle de point d’entrée commun des opportunités.
- Le contenu rappelle la distinction entre faits vérifiés, hypothèses commerciales et fonctionnalités qui ne sont pas encore actives.
- Les pages Confidentialité et Espace professionnel peuvent masquer la carte de navigation générale et les ressources sans rapport direct, afin de ne pas distraire l’utilisateur sur ces parcours sensibles.
- Les pages légales et de service ont été reliées entre elles par des liens de pied de page, dont un retour explicite depuis les mentions légales vers la confidentialité et l’accueil.
- Les liens FAQ des pages Études de marché et Prospection pointent maintenant vers la rubrique canonique `/comprendre/faq`, sans ancres non prises en charge par le gabarit. Ces pages se relient aussi au radar entreprises et entre elles.
- Le ciblage des ressources a été corrigé : la page Opportunités reçoit sa sélection propre, les pages Salons leur sélection dédiée, et Réseaux n’est plus confondu avec les événements.
- Les parcours d’accompagnement aux appels d’offres et d’e-réputation utilisent désormais les routes canoniques pour les marchés publics, les marchés privés et la FAQ ; les anciennes ancres FAQ ont été retirées car le gabarit n’expose pas ces identifiants.
- Le filtre « avis encore ouverts uniquement » est maintenant préservé entre la recherche publique, la fiche détaillée et le parcours de préparation d’une demande, afin que le retour ne perde pas ce critère.
- Le test `src/lib/site-navigation.test.ts` vérifie les URL uniques, la résolution des routes de l’arborescence, les destinations de redirection, les liens internes littéraux, la couverture éditoriale, la cohérence parent-enfant, l’interconnectivité contextuelle dans les deux sens, le ciblage des ressources, les liens entre études de marché et prospection, les routes canoniques de l’accompagnement et de l’e-réputation, et la conservation des filtres dans le parcours de consultation d’un marché public, ainsi que l’accès aux liens légaux depuis les parcours de recherche et de demande.

## Règles d’interconnexion retenues

1. Une rubrique enfant doit conserver une relation d’URL cohérente avec son parent.
2. Chaque page de rubrique doit permettre de revenir à l’accueil et à ses ancêtres via le fil d’Ariane.
3. La carte interactive doit conduire à des destinations internes existantes.
4. Les pages doivent proposer des liens latéraux pertinents, sans remplacer leur contenu par une page unique interminable.
5. Les ressources et annonces ne doivent pas être présentées comme dynamiques ou opérationnelles sans intégration réelle.
6. Les pages génériques restantes doivent être approfondies progressivement par contenu métier propre, plutôt que par duplication aveugle.

## Limites restant à traiter

- La résolution technique d’une route ne garantit pas encore une profondeur éditoriale équivalente à une page métier finalisée.
- Les cartes de ressources sont actuellement une sélection interne statique, et non une bibliothèque alimentée automatiquement.
- Les parcours de compte, transmission sécurisée de pièces et stockage ne sont pas activés.
- Les flux publics, privés, salons et entreprises ne sont pas tous raccordés à des sources en direct.
- Aucun contrôle visuel desktop/mobile n’a été effectué dans ce lot. Le contrôle doit être fait séparément avant de considérer l’ergonomie comme validée.
- Les contrôles CI disponibles doivent être relancés et vérifiés sur le dernier commit. Pour ce lot, aucun résultat GitHub Actions n’a été retourné sur le dernier commit ; les seuls statuts observés sont des échecs Vercel explicitement liés à la limite de builds. Ils ne prouvent ni la réussite ni l’échec du build Next.js de ce lot.

## Suite de l’audit

Poursuivre par domaines, dans cet ordre : Opportunités (public, privé, salons, emploi, radar entreprises), Business et transmission, Développement commercial, Réseaux, Comprendre, puis parcours d’espace professionnel et pages légales. Pour chaque domaine : contenu spécifique, cohérence des liens entrants/sortants, états vides, libellés, accessibilité et affichage mobile.


## Mise à jour UX — navigation, flocon, flux et formulaires (29/10/2026)

### Modifications apportées sur la branche de travail
- Navigation latérale commune réutilisée par le gabarit public et la page d’accueil ; état actif calculé depuis l’URL. La navigation présente un accueil identifiable et un contraste sombre/or avec relief visuel.
- Flux commun déplacé dans le composant d’en-tête partagé : même sélection d’annonces sur les pages qui utilisent ce gabarit, défilement de droite à gauche, traitement visuel compact sans bandeau large.
- Flux débarrassé des trois variantes distinctes affichées sur la page d’accueil ; les composants de recherche publique/privée et le gabarit SiteHub ne montent plus de flux concurrent.
- Sur l’accueil, le flocon interactif est placé avant le moteur de recherche et bénéficie d’une surface visuelle plus grande. Le moteur de recherche est volontairement plus compact.
- Les annonces du flux mènent au formulaire de parcours, avec choix « recevoir par e-mail », « créer mon espace personnel » et « postuler / me positionner ».
- La page de remerciement propose un retour immédiat et une redirection automatique vers l’accueil après sept secondes.
- Les cartes documentaires portent explicitement la mention « Article en construction » et pointent vers une page commune dont le contenu reste à définir.
- Le parcours de formulaire reste une maquette : les données et pièces jointes ne sont pas envoyées ni stockées. La page de remerciement le précise pour éviter toute fausse confirmation de réception.

### Validation
- Les fichiers modifiés ont été relus via GitHub après écriture.
- Vérification de cohérence complémentaire : le composant de navigation latérale doit être explicitement client pour utiliser `usePathname`; le flux global n’a pas besoin de variantes par rubrique.
- La suite Vitest, ESLint, TypeScript et le build Next.js n’ont pas été exécutés dans cet environnement sur le dernier état. Ne pas considérer le lot comme techniquement validé tant que ces contrôles n’ont pas réussi.
- Aucun déploiement Vercel n’a été déclenché volontairement.


### Lot Business et signaux d’entreprise
- Clarification des textes : une publication BODACC est un signal à vérifier, pas une preuve qu’une entreprise est à vendre ni qu’elle a un besoin commercial.
- Le lien présenté comme accès à la recherche BODACC pointe désormais vers la rubrique dédiée « Radar BODACC », sans prétendre qu’un moteur live est déjà connecté.
- Ajout de liens croisés vers achat/cession, radar entreprises, étude de marché, prospection et réseaux.
- Le lien FAQ utilise la route canonique `/comprendre/faq`; les liens de confidentialité et mentions légales sont accessibles depuis le pied de page.
- Un test de régression vérifie les liens et l’absence de l’ancienne route FAQ dans ce parcours.

- Navigation étendue à la coquille racine Next.js : le menu latéral et le flux sont montés une seule fois au niveau global. Les anciens appels à `PublicHeader` dans les pages sont neutralisés par un contexte, pour éviter les doublons tout en couvrant les routes qui n’utilisaient pas encore l’en-tête partagé.
- Le contenu global réserve la largeur de la navigation sur ordinateur et repasse à une disposition sans colonne latérale sur mobile.
- Test statique ajouté pour vérifier le montage global et la neutralisation des en-têtes redondants.

- Simplification éditoriale du parcours Business : le terme « signal » est expliqué comme un indice à vérifier et le sigle BODACC est développé lors de sa première présentation dans le parcours.

- Harmonisation des cartes documentaires : retrait du macaron CSS qui doublonnait le libellé déjà présent dans les cartes ; simplification de plusieurs textes contenant « veille » ou des formulations abstraites.

- Contrôle du flux commun : les liens des annonces conservent explicitement leur capacité de clic malgré le conteneur visuel discret. Test statique ajouté pour éviter une régression d’interactivité.
- Nettoyage du formulaire de préparation : suppression d’un état d’écran intermédiaire devenu inaccessible, puisque la soumission redirige directement vers la page de remerciement.

- Langage des cartes : remplacement de plusieurs occurrences de « veille » par des formulations directes (« recherche », « sources », « suivre les événements »). Le parcours des cartes reste centralisé vers la page commune « Article en construction ».
- Test statique ajouté pour préserver ce comportement pendant la consolidation éditoriale.

- Décision éditoriale du 29 octobre : suppression de la destination générique obligatoire pour les cartes. Chaque carte utilise désormais son champ `href` et son action déclarée. Les ressources futures pourront viser une page interne, un logiciel, une vidéo, un tutoriel ou une documentation, avec identification claire du type et de la source. La page « Article en construction » reste disponible uniquement pour les contenus qui le nécessitent réellement.

### Principe d’architecture confirmé — profondeur progressive (29/10/2026)

La profondeur et la complexité maîtrisées sont désormais un critère d’architecture transversal : MajestiOS doit rester immédiatement compréhensible à l’entrée, tout en permettant d’approfondir progressivement l’exploration, la qualification, l’action et, à terme, la capitalisation.

Les mentions antérieures de destinations communes « Article en construction » dans cet audit décrivent un état historique et ne constituent plus une consigne actuelle. La règle actuelle est qu’une carte doit mener à une destination pertinente et existante ; une page générique n’est jamais le substitut par défaut à une ressource ou à un parcours métier.

Prochain contrôle associé : auditer les cartes non seulement sur la validité de leurs URL, mais aussi sur l’adéquation entre le titre, la promesse, le libellé d’action et le contenu réellement accessible. Des cartes différentes peuvent partager une destination si cela est justifié, mais pas par simple facilité technique.

