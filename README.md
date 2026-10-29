# MajestiOS — plateforme de développement commercial assisté par IA

**Branche de travail actuelle :** `fix/homepage-structure-opportunity-flow`  
**Statut :** prototype en construction. Le connecteur BOAMP est implémenté dans le code, mais son fonctionnement réel doit encore être confirmé par un test de bout en bout.

## 1. Périmètre actuel

L’application de référence est l’application Next.js située sous `src/app`. Les anciens fichiers de site statique à la racine (`index.html`, `app.js`, `build.js` et `styles.css`) ont été retirés lors de l’assainissement de cette branche : les commandes `dev`, `build` et `start` de `package.json` utilisent Next.js. Les anciens rapports d’audit peuvent mentionner ces fichiers parce qu’ils décrivent l’état historique du dépôt au moment de leur rédaction.

La feuille de route centrale à suivre est [docs/FEUILLE_DE_ROUTE_MAJESTIOS.md](docs/FEUILLE_DE_ROUTE_MAJESTIOS.md). Elle définit la doctrine produit, la structure de l’accueil, le gabarit des pages annexes et les priorités de validation.

L’[index documentaire](docs/README.md) précise l’ordre de référence entre feuille de route, doctrine, audits et documents d’architecture afin d’éviter les contradictions entre documents rédigés à des dates différentes.

L’architecture cible actuelle distingue :
- **Accueil** : navigation latérale, présentation concise, recherche multicritère, flocon interactif central, flux compacts et ressources.
- **Pages annexes** : barre de navigation commune, carte interactive spécialisée, flux contextualisé, ressources et liens vers des destinations distinctes.
- **Espace personnel** : parcours commun pour poursuivre une démarche, avec un statut explicite tant que l’authentification, le stockage sécurisé et la persistance ne sont pas activés.

Le schéma interactif, les cartes de ressources et les flux constituent des éléments de navigation et de présentation ; ils ne prouvent pas à eux seuls que les sources externes, les annonces ou les traitements de compte sont opérationnels.

## 2. Connecteur BOAMP : état et limites

La route `GET /api/opportunities` interroge le jeu de données BOAMP exposé par OpenDataSoft et transforme les enregistrements en résultats affichables.

Paramètres pris en charge :
- `q` : recherche textuelle ;
- `location` : code département validé (métropole, Corse et principaux codes ultramarins pris en charge) ; une valeur invalide renvoie une erreur explicite ;
- `type` : `all`, `Travaux`, `Services` ou `Fournitures` ; les filtres de catégorie et de département sont transmis à la requête BOAMP.

Le code gère les erreurs de la source externe et ne remplace pas silencieusement une erreur par des résultats fictifs.

**À vérifier avant de considérer la fonction comme opérationnelle :**
1. tester en direct l’API BOAMP avec plusieurs mots-clés, catégories et départements, notamment `68`, `2A` et un code invalide ;
2. vérifier que la syntaxe combinée des filtres `where` retourne les résultats attendus ;
3. que les noms de champs retournés correspondent au schéma réel du jeu de données ;
4. que les URLs officielles des avis ouvrent bien les avis concernés ;
5. que le statut et la date limite permettent de qualifier correctement les avis encore ouverts ;
6. que la recherche, les filtres et les erreurs ont été testés sur le déploiement cible.

La présence du connecteur dans le code ne constitue pas, à elle seule, une preuve de fonctionnement en production.

## 3. Orientation produit cible : copilote IA de développement commercial

MajestiOS doit évoluer vers une plateforme de développement commercial assistée par IA. L'assistant conversationnel est envisagé comme une interface de travail qui aide l'utilisateur à mobiliser les fonctions de la plateforme, et non comme un chatbot généraliste isolé.

Capacités cibles, à concevoir et livrer progressivement :
- rechercher des opportunités dans les sources autorisées et expliciter leur provenance ;
- rechercher et qualifier des entreprises ;
- aider à identifier les interlocuteurs et décideurs à partir d'informations accessibles et vérifiables ;
- préparer des analyses de marché, des argumentaires et des scripts de prospection ;
- organiser les prochaines actions commerciales ;
- exploiter une mémoire d'entreprise structurée, isolée par organisation et soumise aux droits d'accès.

Principe d'architecture : commencer par un assistant unique doté de compétences métier, connecté à des outils serveur explicitement autorisés. Séparer les capacités et les permissions par rôle plutôt que multiplier d'emblée les agents ou les clés API. Les clés doivent rester côté serveur ; les quotas, la consommation, la traçabilité et l'isolation des données devront être conçus avant l'ouverture aux utilisateurs.

Garde-fou : ces capacités décrivent une orientation produit, pas des fonctions déjà disponibles. Une action ne doit être présentée comme exécutée que si l'outil correspondant l'a réellement effectuée. Les réponses doivent distinguer les faits sourcés, les inférences et les informations à vérifier. Toute automatisation externe sensible doit rester soumise aux permissions appropriées et, lorsque nécessaire, à une confirmation humaine.

Ordre recommandé : stabiliser et tester le connecteur BOAMP ; valider les parcours et les objets métier à partir des tomes de référence ; définir les contrats des outils de l'assistant ; puis intégrer progressivement le chat à des fonctions métier réellement opérationnelles.

## 3. Fonctions non encore attestées

À ce stade, ne pas présenter comme opérationnels :
- les opportunités privées réelles : le bandeau contient des exemples de présentation ;
- l’espace de candidature ou de recrutement ;
- l’enregistrement durable des demandes d’accès ;
- l’authentification et les comptes clients ;
- un CRM persistant, une base métier connectée ou la facturation.

La route `/api/health` est un contrôle technique de prototype ; elle ne prouve pas que les fonctions métier sont prêtes.

## 4. Développement et contrôles

Prérequis : version de Node.js compatible avec les dépendances du projet.

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

Contrôles disponibles :

```bash
npm run lint
npm run build
npm run start
```

Le workflow GitHub Actions exécute ESLint et `next build`. Un contrôle réussi vérifie la qualité statique et la compilation, mais ne remplace pas les tests fonctionnels du connecteur BOAMP ni les tests de sécurité.

**Dépendances :** aucun `package-lock.json` n’a été constaté dans la branche lors de la dernière inspection. L’installation n’est donc pas encore verrouillée de façon reproductible. Ajouter et valider le fichier de verrouillage avant de passer à `npm ci`.

## 5. Architecture et spécifications métier

Les fichiers sous `docs/architecture` sont des documents de travail ; ils ne remplacent pas les tomes de référence du cahier des charges.

Avant de figer le modèle métier, retrouver et confronter les documents faisant autorité, notamment pour les objets Entreprise, Interlocuteur, Décideur, Activité et Mémoire d’entreprise. La vitrine et le connecteur BOAMP ne constituent qu’un premier sous-ensemble de MajestiOS.

Ne pas créer de migration de base de données ni présenter une architecture comme validée tant que les exigences correspondantes n’ont pas été vérifiées.

## 6. Vercel et environnements

Plusieurs projets Vercel ont été créés au fil des essais. Un déploiement indiqué comme `Ready` ne prouve ni que tous les projets utilisent la bonne configuration, ni que les fonctions métier sont validées.

Avant tout changement, identifier précisément :
- le projet d’aperçu ;
- le projet de production ;
- les domaines affectés à chacun ;
- la commande de build et le répertoire de sortie.

**Garde-fou :** ne pas modifier les projets, domaines, déploiements, variables ou paramètres de production sans vérification préalable et autorisation explicite.

## 7. Ordre de travail recommandé

1. Vérifier le connecteur BOAMP sur une réponse réelle et documenter les résultats.
2. Ajouter un verrouillage des dépendances et confirmer que le build reste reproductible.
3. Retrouver les tomes de référence et valider les parcours du MVP professionnel.
4. Faire correspondre les exigences aux écrans, routes et données existants.
5. Confirmer l’identité d’un environnement Supabase DEV avant toute action sur une base.
6. Concevoir et tester les permissions, notamment l’isolation entre organisations.
7. Ajouter progressivement les fonctions métier après validation du modèle, sans prétendre qu’une maquette est une fonctionnalité livrée.

Principes permanents : aucun secret dans le dépôt ou le navigateur ; distinction explicite entre données officielles, exemples et inférences IA ; respect des droits d’utilisation des sources ; traçabilité des actions d’administration.


## 8. Parcours de navigation et assistant MajestiOS

La branche `site-profondeur-v0-1` ajoute les parcours de présentation suivants :
- `/developpement-commercial` : détection, qualification, relation aux entreprises et préparation des actions ;
- `/developpement-commercial/e-reputation` : sous-rubrique de développement commercial ;
- `/business` : formulaire de cadrage « Évaluer mon entreprise » ;
- `/partenaires` : catégories de collaborations et écosystème ;
- assistant conversationnel transversal, accessible depuis le site.

**Limite importante du chatbot :** sa première version est un prototype guidé par des règles et des extraits du référentiel. Elle n’interroge pas encore automatiquement les fichiers Brainios et n’est pas raccordée à un modèle d’IA. Ses réponses doivent donc être présentées comme une aide d’orientation, pas comme une recherche exhaustive dans les documents ni comme une action exécutée.

Avant une connexion réelle à Brainios, définir le corpus autorisé, les droits d’accès, l’indexation, les références de citation, la mise à jour documentaire et les règles de séparation entre faits, inférences et hypothèses. Toute recommandation sensible doit rester soumise à validation humaine.

Les formulaires Business et de demande de contact sont des démonstrations d’interface tant qu’un traitement serveur sécurisé, une politique de confidentialité et une persistance autorisée ne sont pas implémentés. Ne pas présenter les pages de conception comme des services opérationnels.


## 9. Doctrine produit : intelligence commerciale apprenante

Référentiel à consulter avant toute évolution des parcours, de l’assistant, de la base de connaissances ou des ressources pédagogiques :

- [Doctrine fondatrice — MajestiOS, intelligence commerciale apprenante](docs/DOCTRINE_INTELLIGENCE_APPRENANTE.md)

MajestiOS doit agir comme conseiller, informateur, accompagnateur, formateur et garant de méthode. Il doit aider les utilisateurs à progresser tout en améliorant ses propres méthodes à partir de sources vérifiables et de retours qualifiés. Cette amélioration doit rester traçable : un retour n’est pas automatiquement une vérité, une suggestion IA n’est pas une validation, et l’assistance ne constitue pas une garantie absolue.
