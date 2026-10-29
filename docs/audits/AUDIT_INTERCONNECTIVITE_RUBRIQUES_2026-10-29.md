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
