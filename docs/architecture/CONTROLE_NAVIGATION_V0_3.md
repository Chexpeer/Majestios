# Contrôle de navigation — MajestiOS v0.3
Date : 28 octobre 2026
Branche : `feat/homepage-depth-navigation`

## Objet
Conserver une trace du contrôle des routes de la vitrine après la mise en place du menu vertical et du carrefour interactif. Ce document est une checklist de validation, pas une certification de test navigateur.

## Points contrôlés par inspection du dépôt
- Le menu public référence des routes présentes : accueil, concept, hub opportunités, marchés publics, opportunités privées, emploi/missions, radar entreprises, Business, développement commercial, prospection, études de marché, e-réputation, réseaux professionnels, recrutement, FAQ et espace professionnel.
- Le carrefour interactif relie ses pôles à des rubriques existantes.
- `/intelligence-commerciale` est une route de compatibilité qui redirige vers `/developpement-commercial`. Ce comportement est intentionnel.
- `/faq` existe ; les liens FAQ n'ont donc pas besoin d'être remplacés par une ancienne route.
- Le hub `/opportunites` regroupe les principales familles et constitue le point d'entrée central.

## Validation visuelle et fonctionnelle encore requise
1. Ouvrir le déploiement Preview correspondant à la branche `feat/homepage-depth-navigation`.
2. Tester les liens du menu et les sept pôles du carrefour.
3. Tester l'affichage sur écran étroit et la navigation clavier.
4. Vérifier le mouvement des bandeaux : marchés publics de droite à gauche, marchés privés de droite à gauche, emploi/missions de gauche à droite.
5. Vérifier la recherche BOAMP en conditions réelles et le comportement en cas d'indisponibilité de la source.
6. Confirmer que les exemples fictifs sont clairement identifiés et qu'aucune donnée de démonstration n'est présentée comme une offre réelle.

## Règles de livraison
- Les intégrations SIRENE/BODACC et le catalogue privé ne doivent pas être annoncés comme opérationnels tant que leur raccordement n'a pas été vérifié.
- Les contrôles lint/build ne remplacent pas un test navigateur.
- Aucun merge vers la branche de production ni déploiement de production sans validation explicite du propriétaire du projet.
