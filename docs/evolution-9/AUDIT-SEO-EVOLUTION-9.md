# Audit SEO technique et visibilité IA — Evolution-9

**Date :** 11 novembre 2026  
**Branche :** Evolution-9  
**Statut :** balayage HTML complet du manifeste effectué ; audits performance, accessibilité et validation externe à poursuivre  
**Méthode :** lecture du manifeste et des sources HTML dans Git ; aucun score externe Lighthouse/Search Console n'est revendiqué.

## 1. Constat vérifié sur le manifeste HTML

Les **39 pages HTML** déclarées dans site-files.json ont été examinées. Sur l'ensemble de ces pages, un élément title, une meta description et au moins un H1 sont présents. Aucun canonical n'a été trouvé dans les 39 pages. Les titles et descriptions semblent différenciés à la lecture, mais leur unicité exacte doit encore être contrôlée automatiquement avant clôture.

| Page | Title | Meta description | H1 | Canonical | Robots |
|---|---|---|---:|---|---|
| index.html | Présent | Présente | 1 | absent | absent |
| marches-publics.html | Présent | Présente | 1 | absent | absent |
| marches-prives.html | Présent | Présente | 1 | absent | absent |
| developpement-commercial.html | Présent | Présente | 1 | absent | absent |
| crm.html | Présent | Présente | 1 | absent | noindex,nofollow |
| administration.html | Présent | Présente | 2 | absent | noindex,nofollow |
| assistant-majestios.html | Présent | Présente | 1 | absent | absent |
| facturation-electronique.html | Présent | Présente | 1 | absent | absent |
| nous-rejoindre.html | Présent | Présente | 1 | absent | absent |
| faq.html | Présent | Présente | 1 | absent | absent |

**Portée exacte :** inventaire des 39 pages HTML du manifeste. La table ci-dessus présente un échantillon représentatif, pas une liste exhaustive des valeurs.

## 2. Points à traiter

### SEO-01 — Canonicals et domaine de référence
Aucun canonical n'a été trouvé dans les dix pages examinées. Le domaine public canonique n'est pas confirmé dans les éléments de cette passe. Ne pas injecter de canonicals absolus, sitemap ou redirections en devinant le domaine. Décision attendue : confirmer le domaine public officiel et les variantes à rediriger, puis générer les canonicals cohérents.

### SEO-02 — Robots et sitemap
Les fichiers racine robots.txt et sitemap.xml n'ont pas été trouvés dans le dépôt à la date de la vérification. Cela ne prouve pas qu'aucune règle n'est servie par l'hébergeur ou un autre mécanisme. Après confirmation du domaine et des routes publiques :
- produire un robots.txt minimal et contrôlé ;
- générer un sitemap XML à partir des seules pages publiques canoniques ;
- exclure les pages privées, CRM, administration, recherches internes et paramètres de session ;
- contrôler chaque URL publiée, le code HTTP, canonical et indexabilité.

### SEO-03 — Protection des espaces privés
CRM et administration portent bien noindex,nofollow dans l'échantillon. Vérifier également espace-interne, admin-recherches, espace membre, pages privées et routes sensibles. Le noindex est une consigne aux moteurs, jamais un contrôle d'accès ou une mesure de sécurité.

### SEO-04 — Qualité sémantique et éditoriale
Les titres, descriptions et H1 sont présents dans l'échantillon. À contrôler sur toutes les pages : unicité, adéquation à l'intention, promesse vérifiable, absence de duplication, hiérarchie H1/H2/H3, liens internes utiles, textes alternatifs et données structurées uniquement lorsqu'elles correspondent au contenu visible.

### SEO-05 — Performance, accessibilité et partage
Aucun score Lighthouse, Core Web Vitals, audit d'accessibilité automatisé ni test de rendu social n'a été effectué dans cette passe. Ces contrôles restent ouverts : images, formats et dimensions, chargement différé, CSS/JS inutiles, poids des pages, contraste, clavier, focus, libellés et métadonnées Open Graph.

### GEO-01 — Lisibilité par les moteurs IA
Rendre la proposition MajestiOS explicite, cohérente et sourcée : qui est servi, quels problèmes sont résolus, quelles rubriques existent, ce qui est réellement disponible et ce qui est en préparation. Éviter les promesses d'intégration ou de conformité non démontrées. Relier les pages aux sources officielles lorsque le sujet est réglementaire.

## 3. Règles de publication

- Ne pas indexer les cockpits, écrans internes ou pages de test.
- Ne pas fabriquer d'avis, d'étoiles, de prix, de statistiques, de clients ou de partenaires.
- Ne pas créer de FAQ structurée si les questions/réponses ne sont pas visibles sur la page.
- Ne pas présenter MajestiOS comme Plateforme Agréée de facturation.
- Maintenir les dates de mise à jour et les liens réglementaires à partir des sources officielles.
- Toute optimisation éditoriale doit conserver l'intention métier et ne pas surcharger les pages de mots-clés.

## 4. Prochaine séquence d'audit

1. Balayer toutes les pages HTML déclarées dans site-files.json.
2. Vérifier unicité title/description, H1, canonical, robots, liens, images alt, liens cassés et pages orphelines.
3. Confirmer le domaine canonique avant de créer robots.txt, sitemap.xml et canonicals.
4. Ajouter des contrôles statiques de non-régression pour les exigences SEO sûres.
5. Exécuter les contrôles de build, liens, architecture et navigateur ; consigner les preuves.
6. Compléter les tests performance et accessibilité sur une prévisualisation.

## 5. Statuts

SEO-01 à SEO-05 et GEO-01 restent ouverts. Cet audit constitue un état initial partiel et ne doit pas être présenté comme un audit SEO complet.

## 6. Extension du contrôle — espaces privés et résultats dynamiques

Un second échantillon a porté sur espace privé, espace membre, espace interne, recherches administratives, résultats de recherche, qualification d'entreprises, réputation virtuelle, prospection, veille et vision.

Constats confirmés :
- espace-prive.html, espace-interne.html et admin-recherches.html possèdent déjà noindex,nofollow ;
- espace-membre.html et resultats-recherche.html n'avaient pas cette directive alors que la première est un parcours de compte et la seconde une page de résultats dynamiques ;
- les deux pages ont reçu noindex,nofollow dans Evolution-9 et des assertions de non-régression ont été ajoutées dans verify-site.js.

**Statut :** correction de code et tests statiques intégrés ; CI à confirmer. Cette directive limite l'indexation, elle ne protège pas l'accès aux comptes ni les données.


## 7. Exactitude des promesses Cheexpeer

La meta description de majestios-v5.html présentait les missions futures (surveillance, analyse, rapports, alertes et scoring) comme une liste de capacités intégrées. Elle a été reformulée pour annoncer clairement un agent en préparation et renvoyer vers ses missions visées, sa gouvernance et les étapes d'activation. Le corps de page indiquait déjà que ces capacités n'étaient pas opérationnelles ; cette correction aligne le signal SEO avec le contenu réel.

Le contrôle a aussi identifié CHAT-03 : la page assistant-majestios.html affichait un formulaire désactivé alors que seul le guide flottant était fonctionnel. Le formulaire inactif a été remplacé par un bouton qui ouvre le guide local partagé ; le moteur IA avancé reste explicitement annoncé comme non raccordé. Test statique ajouté, CI à confirmer.
