# MajestiOS — arborescence de référence

**Statut : référence fonctionnelle validée par le porteur du projet le 30 octobre 2026.**  
Cette arborescence constitue le socle à préserver lors de la reconstruction. Elle ne signifie pas que toutes les routes ou fonctionnalités sont déjà implémentées.

## Arborescence de référence

```text
MAJESTIOS
├── Accueil
├── Opportunités
│   ├── Marchés publics
│   │   ├── Appels d’offres
│   │   │   ├── Travaux
│   │   │   ├── Services
│   │   │   └── Fournitures
│   │   └── Par département
│   ├── Opportunités privées
│   │   ├── Marchés privés
│   │   │   ├── Par secteur
│   │   │   └── Proposer une annonce
│   │   ├── Radar des entreprises
│   │   └── Signaux économiques
│   ├── Emploi et recrutement
│   │   ├── Offres d’emploi
│   │   ├── Missions
│   │   ├── Publier une offre
│   │   ├── Déposer un CV
│   │   ├── Métiers et conseils
│   │   └── Conseils emploi
│   └── Salons professionnels
│       ├── Calendrier
│       ├── Préparer une visite
│       ├── Par secteur
│       └── Par région
├── Business
│   ├── Intelligence entreprises
│   │   ├── Créations et implantations
│   │   └── Évolutions d’activité
│   ├── Veille BODACC
│   ├── Achat et cession
│   │   ├── Acheter
│   │   ├── Vendre
│   │   └── Évaluer une entreprise
│   └── Diagnostic
├── Développement commercial
│   ├── Prospection
│   │   ├── Ciblage
│   │   ├── Argumentaires
│   │   └── Suivi
│   ├── Études de marché
│   │   ├── Méthodologie
│   │   └── Sources
│   ├── E-réputation
│   │   ├── Surveiller
│   │   └── Répondre aux avis
│   └── Accompagnement appels d’offres
│       ├── Préparer
│       ├── Rédiger
│       └── Après un résultat
├── Réseaux
│   ├── Annuaire professionnel
│   └── Rejoindre le réseau
├── Comprendre
│   ├── Le concept
│   ├── FAQ
│   └── Glossaire
└── Entrées générales
    ├── Espace professionnel
    ├── Confidentialité
    └── Mentions légales
```

## Règles impératives de construction

1. **Préserver les rubriques et leurs relations hiérarchiques.** Ne pas renommer, supprimer, déplacer ou fusionner une branche sans décision explicite du porteur du projet.
2. **Profondeur réelle.** Les liens de navigation conduisent à une route/page ou à un dossier métier identifiable. Ne pas simuler une navigation en faisant défiler la page d’accueil vers une ancre.
3. **Pages spécialisées.** Chaque page doit avoir un objectif, un contenu et une identité visuelle propres à sa rubrique. Un composant partagé est acceptable comme infrastructure, mais ne doit pas produire une série de pages génériques au contenu interchangeable.
4. **Identité visuelle par rubrique.** Prévoir un symbole de domaine en filigrane discret, sans nuire à la lisibilité ni aux contrastes.
5. **Interconnexions horizontales.** L’arborescence décrit les entrées principales, pas une navigation enfermée dans une hiérarchie. Une page peut proposer des liens contextuels vers une autre rubrique lorsque le parcours métier le justifie.
6. **Accueil maîtrisé.** L’accueil sert de porte d’entrée : schéma interactif MajestiOS, accès à la recherche d’opportunités et flux d’annonces compact. Il ne doit pas devenir une page unique contenant tout le contenu du site.
7. **État fonctionnel explicite.** Distinguer dans la documentation et l’interface ce qui est opérationnel, ce qui est partiellement implémenté et ce qui est en préparation. Une entrée dans l’arborescence n’est pas une preuve de fonctionnement.
8. **Préserver les fonctionnalités existantes utiles.** Avant toute réécriture, comparer les branches et vérifier routes, composants, recherche BOAMP, détails d’appels d’offres et tests. Réutiliser ce qui fonctionne au lieu de réintroduire une refonte totale non vérifiée.
9. **Modularité.** Garder les domaines métier séparables dans le code, tout en maintenant une arborescence centrale cohérente et une navigation unifiée.
10. **Sécurité de l’espace professionnel.** Ne pas afficher de documents privés, coordonnées restreintes ou données de compte dans des pages publiques ; toute fonctionnalité privée doit être vérifiée côté serveur.

## Parcours transversaux à prévoir

- Appel d’offres → qualification → radar entreprise / signaux économiques → prospection ciblée → argumentaire → suivi → capitalisation.
- Marché privé → demande d’accès ou positionnement → espace professionnel → constitution du dossier.
- Salon professionnel → préparation de visite → entreprises pertinentes → mise en relation → suivi commercial.
- Signal BODACC → qualification de l’entreprise → opportunité commerciale éventuelle → prise de contact suivie.

Ces parcours sont des liens contextuels entre rubriques : ils ne remplacent pas l’arborescence.

## Contrôles avant validation d’une reconstruction

- Vérifier que chaque entrée de l’arborescence possède une route réelle ou un statut « en préparation » explicite.
- Vérifier les liens internes et les destinations, y compris les liens horizontaux.
- Vérifier qu’aucun lien interne important ne renvoie à une ancre de la page d’accueil ou à une page générique sans rapport avec sa destination.
- Tester les parcours principaux, les états vides, les erreurs API et les vues mobile/desktop.
- Ne pas promouvoir en production sans contrôle explicite.
