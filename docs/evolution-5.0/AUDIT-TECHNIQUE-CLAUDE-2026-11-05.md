# Audit technique indépendant — Source Claude

**Date du rapport :** 5 novembre 2026  
**Source :** analyse indépendante réalisée par Claude à partir de l’archive ZIP de MajestiOS V.5 transmise par le porteur du projet.  
**Périmètre déclaré :** code, build, tests, documentation et structure du site présents dans l’archive.  
**Statut :** audit externe consigné à titre de contre-analyse ; ses constats ne sont pas réputés vérifiés indépendamment par l’équipe MajestiOS.  
**Mode d’intervention :** lecture seule ; Claude indique n’avoir apporté aucune modification à l’archive.

> **Précaution de lecture.** Ce document restitue les observations et recommandations de Claude. Il distingue les contrôles qu’il déclare avoir exécutés, les limites de son environnement et les recommandations à confirmer sur la branche GitHub avant toute intervention.

## 1. Synthèse de l’audit

Claude estime que le projet possède des fondations techniques encourageantes : contrôles syntaxiques et tests annoncés comme réussis, contrôles de construction et de cohérence du site, précautions de sécurité côté navigateur et gestion explicite de certaines erreurs réseau.

L’audit identifie néanmoins plusieurs chantiers avant une mise en ligne publique complète : informations légales et confidentialité, reproductibilité de la CI, fondations SEO, robustesse des recherches et optimisation de certaines ressources.

Ce rapport ne conclut pas à la nécessité d’une refonte générale. Les recommandations doivent être traitées de manière ciblée, après comparaison avec l’état réel de la branche de travail.

## 2. Contrôles déclarés comme exécutés

Selon Claude :

- Les 14 fichiers JavaScript passent `node --check`.
- Les quatre suites de tests unitaires passent : `company-targeting`, `company-fit`, `naf-suggestions` et `mesure-boamp`.
- `build.js`, `verify-architecture.js` et `verify-site.js` passent après correction locale du nom de fichier signalé au point 3.1.
- Le contrôle porte sur 32 pages HTML, 52 ressources, les liens locaux et les identifiants.
- Les dossiers `tests/` (8 fichiers), `verify-site.js` et `verify-architecture.js` sont bien présents dans l’archive.

### Contrôles non exécutés

Claude précise ne pas avoir pu exécuter :

- les tests live BOAMP et BODACC, faute d’accès réseau ;
- les tests navigateur Playwright.

Leur fonctionnement réel reste donc non démontré par cet audit.

## 3. Anomalies et risques relevés

### 3.1. Nom de fichier avec caractère accentué — robustesse de l’archive

**Constat rapporté :** après extraction de l’archive, le fichier `Marché-Public-.webp` apparaît sous le nom `March#U00e9-Public-.webp`. Le build échoue dans cet état. Claude indique qu’après renommage local, les contrôles passent.

**Impact potentiel :** fragilité de l’extraction ou de la résolution du nom de fichier selon les outils et systèmes d’exploitation.

**Recommandation :** vérifier le nom réellement enregistré dans GitHub et dans l’archive d’origine. Si le problème est confirmé, adopter un nom ASCII stable, par exemple `marche-public.webp`, puis mettre à jour toutes les références dans le manifeste et les feuilles de style.

**Réserve :** Claude estime que le fichier peut être correct dans le dépôt ; ce point doit donc être vérifié sur la branche avant modification.

### 3.2. Pages légales et confidentialité incomplètes

**Constats rapportés :**

- `mentions-legales.html` contient encore des champs à compléter pour l’éditeur, l’adresse, le directeur de publication et l’hébergeur.
- `politique-confidentialite.html` ne désigne pas clairement le responsable du traitement.
- Le site comporte un formulaire demandant notamment nom, e-mail et téléphone ; Claude indique que ce formulaire ne transmet actuellement aucune donnée.
- Le lien « Contact » du menu conduit à `nous-rejoindre.html`, ce qui peut créer une ambiguïté.

**Impact potentiel :** informations légales insuffisantes avant ouverture publique et manque de clarté sur les parcours de contact et les traitements de données.

**Recommandation :** compléter les informations exactes de l’éditeur et de l’hébergement, documenter les traitements réellement réalisés, les finalités, les durées de conservation, les droits des personnes et les coordonnées de contact appropriées. Faire valider les mentions applicables avant mise en ligne publique. Clarifier la destination du lien « Contact ».

### 3.3. CI et reproductibilité des contrôles

**Constats rapportés :**

- Le workflow `majestios-anti-regression.yml` se déclenche sur deux anciennes branches et sur les pull requests, mais pas sur `evolution-5.0`.
- Ce workflow utilise Node 20, alors que les autres workflows utilisent Node 22.
- `verify-site.yml` appelle les API BOAMP et BODACC à chaque push ; une indisponibilité externe peut donc faire échouer le contrôle sans régression du code.
- Playwright est installé sans version fixée via `--package-lock=false`, et aucun `package.json` n’est présent.

**Impact potentiel :** couverture insuffisante de la branche active, résultats CI dépendants de services tiers et environnement de tests navigateur difficile à reproduire.

**Recommandations :**

1. Ajouter explicitement `evolution-5.0` aux déclencheurs du workflow anti-régression.
2. Harmoniser la version de Node selon une version de référence documentée.
3. Séparer les tests déterministes du code des tests d’intégration live BOAMP/BODACC ; exécuter ces derniers manuellement ou selon une planification adaptée.
4. Fixer les versions des dépendances et de Playwright et rendre l’installation reproductible.

### 3.4. Couverture des recherches BOAMP et BODACC

**Constat rapporté :** les connecteurs récupèrent jusqu’aux 100 annonces les plus récentes, puis appliquent une partie des filtres (catégorie, mots-clés et expiration) côté navigateur.

**Impact potentiel :** une recherche très ciblée peut retourner peu de résultats alors que des annonces pertinentes existent au-delà de l’échantillon récupéré.

**Point positif :** le texte de l’interface indique honnêtement que les résultats sont issus des annonces récentes récupérées.

**Recommandation :** étudier le filtrage côté serveur au plus près de la source, les clauses de requête adaptées et la pagination. Conserver une information explicite sur les limites de couverture et ne jamais présenter un échantillon comme une recherche exhaustive.

### 3.5. En-têtes de sécurité

**Constat rapporté :** `vercel.json` contient déjà HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy` et `Permissions-Policy`. Claude signale l’absence de Content-Security-Policy (CSP).

**Recommandation :** définir une CSP adaptée aux scripts, styles, images, formulaires et connexions réellement utilisés, puis la tester progressivement, idéalement en mode rapport avant application bloquante.

**Précaution :** l’activation de HSTS avec `preload` et `includeSubDomains` doit être précédée d’une vérification de la configuration HTTPS de tous les sous-domaines concernés ; ces options sont difficiles à annuler rapidement.

### 3.6. API d’entreprises appelée depuis le navigateur

**Constat rapporté :** les appels sont séquentiels selon les départements, codes NAF et pages, avec jusqu’à quatre pages. Claude ne relève pas de gestion spécifique du HTTP 429 ni de cache.

**Impact potentiel :** multiplication des requêtes lors de recherches combinant plusieurs départements et codes d’activité, ralentissement et risque de limitation par la source.

**Recommandation :** mesurer les volumes réels et les limites de l’API, puis étudier un proxy serveur avec cache, gestion des quotas, temporisation et reprise sur erreur. Cette évolution constitue un choix d’architecture à arbitrer ; elle ne doit pas être engagée sans évaluer ses coûts et ses bénéfices.

### 3.7. Fondations SEO manquantes

**Constats rapportés :** absence de balises canonical, Open Graph, fichier `robots.txt`, sitemap et favicon.

**Points positifs rapportés :** attribut `lang`, titres, descriptions et viewport présents sur les pages ; un seul H1 par page ; aucun identifiant dupliqué et aucune image sans attribut `alt`.

**Recommandation :** mettre en place les fondations techniques du référencement : URLs canoniques pertinentes, métadonnées sociales, robots.txt, sitemap XML, favicon et vérification de l’indexabilité. Compléter ces bases par une stratégie éditoriale et de maillage interne cohérente avec les rubriques et les intentions de recherche.

L’audit rappelle que le SEO est une capacité transversale attendue dans la vision de MajestiOS V.5. Le suivi de l’indexation, la veille sur les évolutions des moteurs et l’amélioration continue doivent être organisés dans cette logique, sans promettre un positionnement garanti.

### 3.8. Poids et ressources visuelles

**Constats rapportés :**

- `Reseau.webp` pèse environ 2 Mo pour une définition de 1024 × 1536.
- Trois fichiers JFIF représentent environ 3 Mo et ne seraient référencés nulle part.
- `schema-majestios.svg` ne serait pas référencé dans le code.
- `styles.css` pèse environ 111 Ko.

**Recommandation :** vérifier les références et l’utilité de chaque ressource avant toute suppression. Optimiser les images effectivement publiées (compression, dimensions adaptées et formats modernes si pertinent). Ne pas supprimer les originaux ou les éléments du patrimoine visuel sans inventaire et sauvegarde.

### 3.9. Incohérences documentaires

**Constats rapportés :**

- `AGENTS.md` indique que cinq catégories BOAMP doivent être choisies après mesure réelle, alors que le site afficherait déjà huit catégories actives.
- L’audit du lot 4 évoque huit catégories routées.
- Plusieurs fichiers mentionnés dans `docs/` seraient absents de l’archive.

**Recommandations :**

1. Clarifier le statut des huit catégories : provisoires, expérimentales ou validées.
2. Aligner `AGENTS.md`, l’audit du lot 4 et l’interface sur un état factuel unique.
3. Vérifier les fichiers documentaires manquants sur la branche GitHub et dans les branches historiques avant de conclure à une perte ou à une suppression.

## 4. Points positifs relevés

### 4.1. Sécurité du traitement côté navigateur

Claude rapporte notamment :

- l’utilisation de `escapeHtml` lorsque des données externes sont injectées dans `innerHTML` ;
- des liens sortants limités à BOAMP et BODACC et munis de `noopener noreferrer` ;
- une validation du département par rapport à une liste avant son intégration dans la requête ODSQL ;
- l’encodage du SIREN avec `encodeURIComponent` ;
- des usages de `innerHTML` dans `rubric-search.js` limités à du texte statique.

### 4.2. Robustesse réseau

Les éléments suivants sont signalés :

- délai d’expiration de 12 secondes ;
- annulation des requêtes devenues obsolètes avec `AbortController` ;
- messages d’erreur distinguant une panne d’une absence de résultats.

### 4.3. Discipline de construction

Claude relève :

- l’absence de secrets dans le frontend ;
- une présentation explicite du caractère prototype de certains parcours ;
- un manifeste de build strict ;
- le rejet des chemins `..`, des doublons et des fichiers Markdown publiés ;
- une vérification octet par octet du contenu de `dist/`.

Ces observations sont encourageantes, mais ne remplacent pas une revue de sécurité complète ni une recette utilisateur.

## 5. Points mineurs

Claude signale dans `opportunity-search.js` (environ lignes 257 et 349) des instructions collées sur une même ligne et des lignes vides parasites, qui pourraient provenir d’éditions automatisées.

Il note également que les tables de familles BODACC sont recréées à chaque enregistrement du filtre.

**Traitement recommandé :** correction de lisibilité et micro-optimisation lors d’un lot de maintenance approprié, sans en faire un chantier prioritaire ni modifier la logique fonctionnelle.

## 6. Ordre de traitement proposé par Claude

1. Compléter les pages légales et vérifier le nom du fichier accentué.
2. Corriger la CI : déclencheurs sur `evolution-5.0`, harmonisation de Node, séparation des tests live et versions de Playwright fixées.
3. Ajouter une CSP adaptée et optimiser les images.
4. Améliorer le filtrage et la pagination des recherches.
5. Développer les fondations SEO.

## 7. Lecture et recommandations de consolidation MajestiOS

Les constats de Claude sont à considérer comme des pistes de travail structurées, et non comme des autorisations de modification.

Avant chaque lot :

- confirmer le constat sur le commit courant de `evolution-5.0` ;
- identifier précisément les fichiers concernés et leurs dépendances ;
- distinguer défaut bloquant, amélioration et choix d’architecture ;
- sauvegarder et définir un point de retour ;
- exécuter les contrôles anti-régression ;
- vérifier le diff avant toute validation.

Aucune refonte générale ne découle de cet audit. Les interactions de l’immeuble, l’arborescence, le moteur de recherche et les rubriques doivent être préservés tant qu’un défaut précis n’a pas été établi et qu’une correction ciblée n’a pas été validée.

Aucun changement de code, merge ou déploiement de production n’est autorisé par la seule consignation de ce rapport.

## 8. Conclusion de la source

Claude considère que les fondations techniques sont encourageantes et que le projet présente plusieurs bonnes pratiques, notamment dans le traitement des données externes, la gestion des erreurs réseau et les contrôles de build.

Les principaux chantiers concernent la préparation à une mise en ligne publique, la reproductibilité de la CI, les fondations SEO et l’amélioration progressive de la couverture et de la robustesse des recherches.

**Ce rapport ne constitue pas une certification de sécurité, une validation juridique, une recette navigateur complète ou une preuve de fonctionnement des API live.** Ces éléments restent à contrôler dans l’environnement réel et sur le commit exact de la branche de travail.

---
*Document de contre-audit externe — source Claude — consigné dans la documentation MajestiOS V.5 le 5 novembre 2026.*
