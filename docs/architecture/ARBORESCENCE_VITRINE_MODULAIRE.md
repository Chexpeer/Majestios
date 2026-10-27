# MajestiOS — Arborescence modulaire de la vitrine publique

> Document de cadrage évolutif. Il décrit la structure cible de la vitrine et les points d'extension attendus ; il ne prétend pas que toutes les fonctionnalités sont déjà développées.

## 1. Principes directeurs

- **Préserver l'acquis** : toute évolution part de l'existant, sans suppression ou remplacement global non justifié.
- **Modularité** : chaque rubrique doit pouvoir évoluer indépendamment, avec ses propres pages, composants et états.
- **Profondeur** : prévoir dès maintenant les niveaux de navigation entre page d'accueil, pages de rubrique, listes, fiches détaillées et formulaires.
- **Ergonomie** : vocabulaire compréhensible, navigation cohérente, actions principales visibles, filtres simples, états de chargement/erreur/absence de résultats explicites.
- **Simplicité** : ne pas surcharger la page d'accueil ; présenter les portes d'entrée principales puis permettre d'approfondir.
- **Séparation des périmètres** : distinguer vitrine publique, parcours de candidature/contact et futurs espaces authentifiés.
- **Honnêteté fonctionnelle** : une maquette, un lien ou une carte illustrative ne doit pas être présenté comme une fonctionnalité opérationnelle si elle ne l'est pas.
- **Évolutivité** : ajouter une rubrique ne doit pas obliger à reconstruire la navigation entière.

## 2. Navigation principale cible

1. **Accueil**
2. **Appels d'offres publics** — recherche et consultation des marchés publics.
3. **Appels d'offres privés** — opportunités privées publiées ou relayées sur MajestiOS.
4. **Intelligence commerciale** — recherche et qualification d'opportunités, entreprises, interlocuteurs et décideurs.
5. **Études de marché** — analyses, tendances et qualification d'un marché.
6. **E-réputation** — veille et analyse de la présence en ligne.
7. **Nous rejoindre** — recrutement et candidatures.

La rubrique « Prospection » n'est pas un élément de premier niveau dans cette vitrine cible : elle est remplacée par **« Appels d'offres privés »**. Les capacités de prospection restent une composante de l'offre professionnelle et pourront être présentées dans la rubrique Intelligence commerciale ou dans l'espace connecté.

## 3. Page d'accueil

Ordre et hiérarchie recommandés :

1. **En-tête** : logo, navigation, accès connexion/espace professionnel lorsqu'il est disponible.
2. **Zone principale** : promesse concise de MajestiOS et moteur de recherche d'appels d'offres publics immédiatement visible.
3. **Opportunités privées** : bandeau ou liste compacte et défilante, avec type et localisation ; accès au détail ou au formulaire approprié. Ne jamais afficher des données confidentielles dans un aperçu public.
4. **Accès aux fonctions clés** : Intelligence commerciale, Études de marché et E-réputation, sous forme de blocs clairement distincts.
5. **Présentation du copilote IA** : aide à rechercher, qualifier, analyser et organiser le travail commercial ; ne pas laisser croire que des actions non développées sont déjà disponibles.
6. **Nous rejoindre** : aperçu des deux annonces de départ.
7. **Pied de page complet**.

La page d'accueil est une porte d'entrée ; elle ne doit pas essayer de contenir toutes les fonctions détaillées.

## 4. « Appels d'offres publics »

- Recherche par mots-clés et filtres disponibles (dont département et catégorie si ces filtres sont pris en charge).
- Résultats lisibles, dates et échéances mises en évidence.
- État explicite : chargement, résultats, aucun résultat, source temporairement indisponible.
- Fiche ou lien vers la source officielle lorsque les données le permettent.
- Mention de la source des données et de ses conditions d'utilisation.
- Aucun résultat de démonstration ne doit être mélangé aux résultats réels.

## 5. « Appels d'offres privés »

- Liste d'opportunités privées séparée des marchés publics.
- Cartes d'aperçu sobres : catégorie, localisation et statut public/privé ; pas de divulgation d'informations réservées.
- Navigation prévue vers une fiche détaillée et/ou un formulaire de demande d'information.
- Prévoir filtres, pagination ou chargement progressif, états vides et mécanisme de signalement/modération lorsque le module sera développé.
- Les annonces de démonstration doivent être explicitement identifiées tant que les données réelles ne sont pas branchées.

## 6. « Intelligence commerciale »

Cette rubrique doit pouvoir accueillir progressivement :
- recherche d'entreprises et qualification ;
- recherche d'interlocuteurs et de décideurs à partir de sources licites et vérifiables ;
- détection et qualification d'opportunités ;
- préparation de démarches commerciales et de scripts ;
- organisation des prochaines actions ;
- exploitation de la mémoire d'entreprise lorsqu'elle sera disponible.

Architecture de pages à prévoir : page de présentation, formulaire de recherche, résultats filtrables, fiche entreprise, fiche interlocuteur/décideur, dossier d'opportunité. Les données sourcées doivent être distinguées des hypothèses ou informations à vérifier.

## 7. « Études de marché »

Prévoir une page de présentation et, à terme, un parcours guidé : besoin d'étude, périmètre, zone géographique, secteur, sources, synthèse, limites et pistes d'action. Ne pas présenter une analyse générée comme une étude validée sans expliciter ses sources et ses limites.

## 8. « E-réputation »

Prévoir une page dédiée à la surveillance et à l'analyse de la présence en ligne : périmètre surveillé, sources publiques, période, signaux observés, liens sources et recommandations. Les capacités de collecte et d'alerte ne seront annoncées comme actives qu'après implémentation et validation.

## 9. « Nous rejoindre » — recrutement

La rubrique est dédiée au recrutement et ne doit pas être confondue avec les appels d'offres privés.

Annonces initiales prévues :
1. **Assistante indépendante — suivi des appels d'offres** : veille, suivi des échéances et organisation des dossiers.
2. **Business Developer — développement commercial de MajestiOS** : développement du réseau, identification d'opportunités et acquisition commerciale.

Chaque annonce doit avoir sa propre fiche et un parcours de candidature/contact. Les conditions de collaboration, le statut et la rémunération doivent être validés avant publication définitive. Tant que le traitement des candidatures n'est pas connecté à un backend sécurisé, le formulaire ne doit pas prétendre enregistrer ou transmettre une candidature.

## 10. Pied de page (footer)

Prévoir un footer stable et réutilisable sur les pages publiques, avec des groupes de liens :

### Comprendre MajestiOS
- **Comment et pourquoi MajestiOS ?** → page explicative dédiée au concept, à l'origine du besoin, à la proposition de valeur et à la logique de fonctionnement.
- Notre approche / fonctionnalités (à mesure qu'elles sont publiées).

### Explorer
- Appels d'offres publics
- Appels d'offres privés
- Intelligence commerciale
- Études de marché
- E-réputation

### Rejoindre
- Nous rejoindre
- Assistante indépendante — suivi des appels d'offres (si l'annonce est publiée)
- Business Developer (si l'annonce est publiée)

### Informations
- **Mentions légales** — emplacement et route à prévoir dès maintenant ; contenu à rédiger et valider ultérieurement.
- Politique de confidentialité et autres informations réglementaires : à examiner ultérieurement avant ouverture publique des parcours qui collectent des données personnelles.

Le lien « Comment et pourquoi MajestiOS ? » doit conduire à une véritable page explicative dédiée, pas à une ancre perdue ou à une simple fenêtre modale.

Les pages juridiques peuvent être créées comme emplacements clairement signalés « contenu en préparation » dans l'environnement de développement ; ne pas inventer de mentions légales et ne pas publier de page juridique vide comme si elle était complète.

## 11. Architecture technique et conventions

- Construire les pages publiques comme des unités distinctes, avec composants partagés pour en-tête, navigation, footer, cartes, filtres, messages d'état et appels à l'action.
- Garder les règles de navigation dans une source centralisée plutôt que dupliquer les liens sur chaque page.
- Favoriser des composants petits et réutilisables, avec types explicites et responsabilités nettes.
- Prévoir les URL stables et les pages de détail dès la conception ; vérifier la cohérence entre liens de navigation, liens de cartes et footer.
- Prévoir les états responsive mobile/tablette/ordinateur et l'accessibilité clavier/contraste/labels.
- Garder les clés API côté serveur ; ne pas exposer les secrets dans le navigateur.
- Isoler les futures données et opérations par organisation/utilisateur, avec contrôle d'accès serveur lorsque l'espace professionnel sera développé.
- Ne pas connecter ou modifier Supabase, Vercel, les domaines ou l'environnement de production dans le cadre de ce document.

## 12. Plan de réalisation conseillé

1. Auditer les pages et composants existants sur la branche de travail ; identifier ce qui peut être conservé.
2. Formaliser les routes et la navigation, puis intégrer le footer commun.
3. Créer la page « Comment et pourquoi MajestiOS ? ».
4. Structurer les pages publiques Appels d'offres publics et Appels d'offres privés en préservant les comportements existants.
5. Créer la page « Nous rejoindre » et ses deux fiches d'annonce.
6. Préparer les pages/points d'extension Intelligence commerciale, Études de marché et E-réputation.
7. Vérifier les liens, le responsive, l'accessibilité et les états d'erreur ; exécuter lint et build.
8. Documenter clairement les fonctions réellement opérationnelles et celles qui restent à développer.

## 13. Limites de ce document

Ce document définit une cible d'architecture et de navigation, pas une déclaration d'achèvement. Toute évolution du code doit se faire en préservant l'existant et en évitant les suppressions non nécessaires. Les modifications restent limitées à la branche de travail autorisée jusqu'à validation explicite de l'utilisateur.
