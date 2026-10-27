# MajestiOS — prototype de veille et d’intelligence commerciale

**Branche de travail :** `architecture-v0-1`  
**Statut :** prototype en construction. Le connecteur BOAMP est implémenté dans le code, mais son fonctionnement réel doit encore être confirmé par un test de bout en bout.

## 1. Périmètre actuel

L’application Next.js se trouve sous `src/app`. Des fichiers historiques de site statique coexistent à la racine, notamment `index.html`, `app.js`, `build.js` et `styles.css`.

Ne pas supprimer ou déplacer ces fichiers avant d’avoir confirmé quels projets ou scripts les utilisent.

La page d’accueil propose :
- une recherche d’appels d’offres publics ;
- un bandeau illustratif d’opportunités privées ;
- des cartes illustratives de missions et de collaborations ;
- une demande d’accès/démonstration qui reste à vérifier côté enregistrement et traitement.

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

MajestiOS doit évoluer vers une plateforme d'intelligence commerciale assistée par IA. L'assistant conversationnel est envisagé comme une interface de travail qui aide l'utilisateur à mobiliser les fonctions de la plateforme, et non comme un chatbot généraliste isolé.

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
