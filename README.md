# MajestiOS — prototype public de référence

MajestiOS est un projet de **développement commercial proactif** et de **prospection inversée assistée par IA**. Ce dépôt contient le prototype statique servant à valider l’expérience, l’arborescence et les parcours avant raccordement des services métier.

## Structure de référence de l’accueil

La page `index.html` doit contenir uniquement :
1. la barre de navigation principale composée exactement de : Accueil, Développement commercial, Salon virtuel, Nous rejoindre, Espace membre et FAQ ;
2. la zone artisanale virtuelle interactive, visible directement sur l’accueil ;
3. le moteur de recherche avancé.

La liste d’appels d’offres, les blocs explicatifs, les répertoires redondants, les formulaires permanents et les pieds de page sont exclus de l’accueil. Le bandeau horizontal présent en haut de page reste un flux de démonstration lent, discret et explicitement fictif ; il ne diffuse aucune annonce réelle.

## Pages et ressources à conserver

- `index.html` : accueil épuré, scène interactive et recherche avancée.
- `zone-artisanale.html`, `zone-artisanale.css`, `zone-artisanale.js` : page autonome de secours/visite et moteur 3D partagé tant que les liens des pages métier l’utilisent.
- `marches-publics.html`, `marches-prives.html` et les dix autres pages métier : destinations des douze bâtiments.
- `categorie-*.html` : pages de destination pour les catégories du moteur de recherche.
- `nous-rejoindre.html`, `espace-membre.html`, `faq.html` : rubriques secondaires accessibles par navigation.
- `styles.css`, `app.js`, `catalogue-majestios.js`, `rubriques-immersives.css`, `rubriques-immersives.js` : styles, interactions, correspondance des bâtiments et présentation commune.
- `build.js`, `verify-site.js`, `.github/workflows/majestios-anti-regression.yml`, `vercel.json` : préparation, vérification et configuration de publication.
- `company-targeting.js`, `company-fit.js`, `naf-suggestions.js`, `qualification-entreprises.html` : prototype de ciblage et de qualification explicable ; les correspondances APE/NAF et géographiques restent indicatives.
- Les documents de référence sont détaillés dans la section « Documentation produit et reprise par une IA » plus bas ; le cahier des charges maître, la spécification fonctionnelle, la matrice et le registre des ressources CRM complètent le README et l’arborescence.

Ne supprimer aucun fichier de page ou ressource avant d’avoir vérifié les références dans les scripts, les liens entrants et le processus de build. Les fichiers de prototype qui paraissent anciens peuvent encore être requis par le contrôle automatique ou par une page métier.

## Démarrer et vérifier

Aucune installation applicative n’est nécessaire. Lancer un serveur statique depuis ce dossier :

```sh
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`. Pour préparer le site et vérifier les liens :

```sh
node build.js
node verify-site.js
```

Le contrôle statique ne remplace pas un test dans un navigateur réel, notamment pour la scène 3D, les gestes tactiles et les interactions JavaScript.

## État fonctionnel réel

- La scène 3D et les filtres de recherche sont des fonctions du prototype ; vérifier leur rendu et leur comportement dans le navigateur.
- Les résultats de marché sont fictifs tant que des sources réelles ne sont pas connectées.
- Les formulaires peuvent prévisualiser une demande mais ne garantissent pas son envoi ni son enregistrement.
- L’espace membre ne crée pas de compte réel.
- Aucun lien de navigation ni écran de démonstration ne doit être interprété comme preuve qu’un service métier est opérationnel.

## Règles de travail

- La structure d’accueil ci-dessus est la référence : navigation + zone artisanale interactive + recherche avancée, rien d’autre.
- Une rubrique métier = une page dédiée ; ne pas remplacer des pages par des ancres vers de longs paragraphes de l’accueil.
- Préserver les douze destinations du catalogue et les formulaires requis par les parcours secondaires.
- Contrôler les liens, ressources copiées dans `dist/`, états interactifs et rendu mobile après chaque évolution.
- Ne pas publier en production une branche ou une prévisualisation qui n’a pas été vérifiée.


## Documentation produit et reprise par une IA

Lire dans cet ordre avant de reprendre les travaux :
1. DOCUMENTATION-REPRISE-IA-MAJESTIOS.md — contexte, décisions, état de vérité et protocole de reprise ;
2. CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md — vision et périmètre ;
3. SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md — parcours et critères d'acceptation ;
4. CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md — sources et signaux ;
5. ARBORESCENCE-MAJESTIOS.md — structure des pages ;
6. PLAN-CHANTIER-RECHERCHE-DONNEES-CRM.md — lots et garde-fous ;
7. MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md — statut des exigences et preuves attendues ;
8. REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md — sources candidates et alimentation du CRM.

MajestiOS est un outil de **développement commercial assisté par IA**. L'accompagnement humain et technique aux appels d'offres, le ciblage d'entreprises par codes APE/NAF et département, la diffusion ciblée avec proposition d'accompagnement, la veille emploi discrète et les pistes immobilières professionnelles appartiennent au périmètre documenté. Leur mention ne signifie pas qu'ils sont tous implémentés ou connectés.

Le registre des décisions établies et des arbitrages ouverts se trouve dans la section 11 de `CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md`. Ne pas créer un registre parallèle sans besoin explicite.


### Préqualification des entreprises (prototype)

La page `qualification-entreprises.html` permet de rechercher des entreprises par codes APE/NAF et département via l’API publique Recherche d’Entreprises. Le module `naf-suggestions.js` propose des pistes lexicales explicables depuis l’intitulé du marché ; l’opérateur doit choisir et vérifier les codes avant la recherche. Les scores et suggestions sont indicatifs : aucune preuve de compétence, aucune persistance CRM et aucun envoi de prospection ne sont produits par ce prototype. Les tests ciblés sont dans `tests/naf-suggestions.test.cjs` et `tests/company-targeting.test.cjs`.

- `SPEC-SUIVI-DYNAMIQUE-ECONOMIQUE-ENTREPRISES-MAJESTIOS.md` : suivi envisagé du chiffre d'affaires publié et de la dynamique économique des entreprises ciblées, avec provenance, confidentialité et garde-fous contre les interprétations abusives.

- `MODELE-VALORISATION-DONNEES-ET-ETUDES-COMMERCIALES-MAJESTIOS.md` : conception des statistiques, tableaux de bord, études payantes et options de commercialisation, avec exigences de qualité, conformité et validation des droits.
- `PLAN-PILOTE-STATISTIQUES-MAJESTIOS.md` : plan opérationnel du premier pilote, indicateurs proposés, sources prioritaires DECP/Sirene/INPI, contrôles de qualité et critères de passage à l'expérimentation.
