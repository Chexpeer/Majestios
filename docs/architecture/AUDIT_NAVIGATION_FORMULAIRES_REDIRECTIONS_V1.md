# Audit navigation, formulaires et redirections — 28 octobre 2026

## Périmètre
Audit statique sur la branche de travail `feat/opportunity-search-conversion`. Il ne remplace pas un test navigateur ni un test de bout en bout sur une preview.

## Corrections réalisées
- Harmonisation du logo et du symbole central : M doré et couronne.
- Moteur d'accueil compact avec filtres avancés repliables ; recherche des marchés publics toujours reliée à l'API BOAMP existante.
- Transmission du terme de recherche vers les rubriques spécialisées. Les pages Business et Marchés publics préremplissent le champ via `q` ; la page Marchés publics lance maintenant aussi la recherche à l’arrivée lorsqu’un terme est transmis.
- Ajout d'une action « Me positionner / créer mon espace » aux résultats BODACC et BOAMP, en conservant la source officielle comme lien secondaire.
- L'espace professionnel restitue le contexte de l'arrivée (CV, collaboration ou opportunité) et précise que le compte et l'enregistrement ne sont pas encore activés.
- La rubrique Emploi propose un point d'entrée de recherche et un accès au parcours CV, tout en indiquant que les connecteurs d'offres externes ne sont pas encore actifs.
- Après une recherche BOAMP sans résultat, des alternatives orientent vers les opportunités privées, les emplois/missions et la préparation d'une publication gratuite ; le message précise que rien n'est encore enregistré.
- Ajout de repères visuels explicites : bleu + libellé « PUBLIC » pour les avis publics ; vert + libellé « PRIVÉ » pour les opportunités privées.
- Ajout sur la page Opportunités privées d'un accès à la préparation d'une publication gratuite, avec mention visible de la fonctionnalité encore inactive.
- Vérification statique de l'existence des routes principales utilisées par la recherche transversale (public, privé, emploi, espace professionnel, Business/BODACC, entreprises, réseaux et veille).

## Corrections complémentaires — 28 octobre 2026
- Le paramètre `q` entrant dans la page Marchés publics déclenche désormais une recherche, au lieu de seulement préremplir le champ.
- Le paramètre `q` entrant dans la page Business/BODACC déclenche désormais lui aussi la recherche automatiquement ; le parcours depuis la recherche centrale est ainsi cohérent avec celui des marchés publics.
- Les métadonnées SEO de la rubrique Emploi ont été déplacées dans un layout serveur, afin de ne pas les exporter depuis un composant client.
- La page de demande liée à un avis public n’effectue plus de double décodage de l’identifiant de route ; suppression d’une fonction auxiliaire inutilisée.
- La navigation expose maintenant `aria-current="page"` sur la rubrique active, y compris lorsque l’utilisateur se trouve dans une sous-page.
- Le texte d’aide sous la recherche centrale varie maintenant selon la rubrique sélectionnée ; il ne présente plus le BOAMP comme source active lorsque l’utilisateur choisit BODACC, emploi, entreprises, opportunités privées, réseaux ou veille.
- Le lien de retour de l’espace professionnel choisit maintenant une rubrique de recherche cohérente avec la source indiquée dans l’URL. Les alias `recherche-privee` et `opportunites-privees` reviennent eux aussi aux opportunités privées ; `boamp` revient explicitement aux marchés publics. Les autres sources reviennent aux marchés publics par défaut.

## Contrôle complémentaire — 28 octobre 2026
- Correction du lien depuis l’espace professionnel : le bouton qui ouvrait `/offres-emploi?intention=cv` affichait une intention CV que la page Emploi ne lisait pas. Il mène maintenant simplement à `/offres-emploi` avec un libellé correspondant à sa destination ; le parcours CV dédié reste accessible depuis cette rubrique.

## Points bloquants avant ouverture réelle
1. Authentification et formulaire de création de compte avec prénom, nom, e-mail et téléphone.
2. Persistance serveur de l'opportunité sélectionnée pendant et après l'inscription. Les paramètres d'URL ne constituent pas un enregistrement.
3. Vérification du formulaire Business existant, de son destinataire Formspree, de sa notice d'information et de la conservation des réponses.
4. Stockage privé, contrôle d'accès et règles de conservation avant tout dépôt de Kbis ou de CV.
5. Choix des sources d'emploi autorisées ; provenance, date et statut de chaque offre doivent être vérifiables.
6. Filtres réellement connectés par domaine. Pour le moment, la recherche active concerne surtout les marchés publics et BODACC.
7. Vérification automatisée complète des liens internes et des ancres, puis test manuel sur une preview déployée. Le contrôle effectué jusqu'ici vérifie seulement l'existence de plusieurs routes principales, pas chaque lien du site.
8. Tests responsive, clavier, focus, libellés et messages d'erreur.
9. Lint, TypeScript, build et tests navigateur à confirmer sur les derniers commits ; aucun rendu récent n’est certifié.

## Règles de cohérence
- Réutiliser le socle de recherche avec des filtres configurés par rubrique.
- Les exemples restent clairement marqués comme fictifs et ne doivent pas déclencher de candidature réelle.
- Une source officielle peut rester accessible pour vérification ; l'action principale d'une opportunité réelle est le positionnement dans MajestiOS.
- Ne jamais afficher une confirmation d'inscription ou d'envoi si aucun traitement serveur n'a abouti.
- Ne pas fusionner la PR ni déployer en production sans validation explicite du fondateur.
