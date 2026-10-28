# Audit de cohérence navigation, formulaires et redirections — 28 octobre 2026

## Périmètre
Contrôle statique effectué sur la branche `feat/opportunity-search-conversion` après la mise en place du moteur transversal. Ce document ne remplace pas un test navigateur ni un test de bout en bout en environnement déployé.

## Corrections apportées
- Harmonisation du logo de navigation et du symbole central : M doré et couronne.
- Recherche d'accueil compacte avec filtres avancés repliables ; la recherche BOAMP reste reliée à l'API publique existante.
- Le terme de recherche est transmis aux rubriques Business, Radar entreprises, Opportunités privées, Emploi & missions, Réseaux et Sources/veille. La page Business et la page des marchés publics préremplissent désormais le champ de recherche à partir de `q`.
- Les résultats BODACC et BOAMP proposent une action « Me positionner / créer mon espace » tout en conservant l'accès secondaire à la source officielle ou à la fiche détaillée.
- La page Espace professionnel affiche le contexte d'arrivée (CV, collaboration ou opportunité sélectionnée) et précise explicitement que le compte et l'enregistrement ne sont pas encore activés. Elle ne prétend pas créer de compte ni enregistrer une demande.
- La rubrique Emploi & missions présente une entrée de recherche et un accès au parcours CV. Elle signale clairement que les sources externes ne sont pas encore raccordées et ne fabrique pas d'offres.
- Les liens de retour depuis l'espace professionnel sont adaptés à la démarche sélectionnée.

## Points qui restent à traiter avant d'ouvrir le service
1. **Authentification réelle** : intégrer le fournisseur d'authentification choisi et les quatre champs d'inscription (prénom, nom, e-mail, téléphone), avec vérification et protections anti-abus.
2. **Persistance de l'opportunité** : stocker la sélection dans une session ou en base avant l'inscription, puis la rattacher au compte créé. Le contexte actuellement porté par l'URL est uniquement provisoire et n'est pas une preuve de sauvegarde.
3. **Formulaire Business / Formspree** : le formulaire de cadrage existant envoie des données à un prestataire tiers. Valider sa destination, son usage, la notice d'information, la durée de conservation et l'accès aux réponses avant diffusion publique.
4. **Kbis et CV** : aucun dépôt réel ne doit être activé avant de disposer d'un stockage privé, de règles d'accès, de suppression et de traitement clairement définies.
5. **Connecteurs Emploi** : sélectionner les sources autorisées et les méthodes de collecte ; les offres doivent avoir une provenance, une date et un statut vérifiables.
6. **Filtres avancés par domaine** : pour le moment, les filtres opérationnels sont limités aux marchés publics (mot-clé, département et type). Les autres domaines renvoient vers leurs pages ; il ne faut pas les présenter comme des recherches de données unifiées déjà actives.
7. **Liens et redirections** : exécuter une vérification automatique de toutes les routes et ancres, puis un test manuel des parcours sur une preview déployée. Les liens externes doivent être contrôlés, notamment la provenance et les URL directes renvoyées par les API.
8. **Accessibilité et mobile** : tester navigation clavier, focus, libellés de champs, messages d'erreur, lecture d'écran, petits écrans et réduction des animations.
9. **CI et preview** : les derniers commits doivent encore être vérifiés par lint, TypeScript, build et test navigateur. Les contrôles Vercel précédents ont renvoyé une limite de déploiement ; aucun rendu de preview récent n'est certifié ici.

## Principes de cohérence
- Un seul composant de recherche partagé autant que possible, avec des filtres spécifiques configurés par rubrique.
- Les annonces et cartes fictives restent explicitement étiquetées comme exemples et ne déclenchent pas de candidature réelle.
- Une source officielle peut rester un lien secondaire de vérification ; l'action principale pour une opportunité réelle est le positionnement dans MajestiOS.
- Aucun formulaire ne doit afficher une confirmation d'envoi ou d'inscription si aucun traitement serveur n'a abouti.
- Ne pas fusionner la PR ni déployer en production sans validation explicite du fondateur.
