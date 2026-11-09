# Refonte globale de MajestiOS — Evolution-7

**Date :** 9 novembre 2026  
**Branche :** `Evolution-7`  
**Branche source :** `Evolution-6`  
**Point de départ :** `f864d80ec2a43c999208afaf62685aea07458389`  
**Statut :** décision validée par le porteur du projet ; réalisation en cours, non déployée.

## 1. Décision et objectif

La refonte abandonne l'immeuble interactif comme système de navigation. MajestiOS adopte une navigation web classique, permanente, lisible et responsive. La barre de navigation doit donner accès à **toutes les rubriques et à leurs contenus**, y compris les sous-rubriques et pages métier qui ne figuraient pas dans les neuf destinations de l'immeuble.

La refonte doit améliorer en priorité les fonctionnalités vitales et commerciales du site, sans réduire son périmètre fonctionnel.

## 2. Éléments explicitement préservés

Aucune fonctionnalité existante ne doit être supprimée au motif de la simplification de l'interface.

Sont notamment préservés :
- tous les contenus éditoriaux et métier des pages existantes ;
- les fonds d'écran, images, ambiances et identités visuelles propres aux rubriques ;
- les textes, titres, descriptions et formulations existants, sauf correction demandée ou incohérence démontrée ;
- les formulaires, moteurs de recherche, filtres, résultats, parcours et interactions ;
- les scripts métier, les ressources et les routes actuellement publiées ;
- les connexions, paramètres et contrats d'intégration CRM / Supabase, dont l'authentification OTP en cours de préparation ;
- la séparation stricte entre CRM VIP interne et espaces clients ;
- les contrôles de sécurité, rôles, RLS et règles de cloisonnement.

Les fichiers graphiques historiques peuvent rester dans le dépôt ; ils ne sont pas supprimés simplement parce que l'immeuble n'est plus utilisé comme navigation.

## 3. Nouvelle navigation classique

La navigation doit être commune à toutes les pages publiques et métier, avec :
- une barre supérieure cohérente sur ordinateur ;
- des groupes déroulants organisés par parcours métier ;
- un accès direct à chaque rubrique, dossier et page existante ;
- un état actif indiquant la page courante ;
- une adaptation mobile accessible au clavier et au tactile ;
- aucune destination factice, aucune ancre utilisée à la place d'une vraie page lorsqu'une page dédiée existe.

Le menu doit être construit depuis un inventaire vérifié des pages et de leurs relations. Les pages réservées à l'administration et au CRM VIP restent protégées par leurs contrôles d'accès ; leur présence éventuelle dans la navigation ne constitue jamais une autorisation.

## 4. Accueil après abandon de l'immeuble

L'accueil conserve son identité visuelle, son fond, ses textes, son moteur de recherche transversal et son bandeau de démonstration clairement signalé comme fictif. L'immeuble et ses zones SVG interactives sont remplacés par une présentation classique des rubriques et des accès vers leurs contenus.

La page d'accueil ne doit pas devenir un long catalogue redondant : elle présente clairement les grandes portes d'entrée et renvoie vers les pages détaillées existantes.

## 5. Chatbot — première génération de Cheexpeer

Installer un point d'entrée conversationnel discret, disponible de manière cohérente sur le site. Il constitue la première génération du futur assistant Cheexpeer et doit être conçu pour évoluer sans réécriture de l'interface.

Principes :
- aider le visiteur à comprendre l'offre et à trouver la bonne rubrique ou le bon contenu ;
- s'appuyer sur les contenus réellement disponibles ;
- distinguer réponse vérifiée, information absente et hypothèse ;
- proposer le contact humain si la réponse n'est pas fiable ;
- ne pas prétendre disposer d'une IA connectée, d'une mémoire, d'un CRM ou de capacités d'action tant que ces raccordements ne sont pas implémentés et testés ;
- ne jamais exposer de clé ou secret fournisseur dans le navigateur ;
- préparer une interface et un contrat d'intégration permettant l'évolution vers Cheexpeer.

Le fournisseur IA, l'accès API et les paramètres de production doivent être vérifiés avant toute activation d'un moteur génératif distant.

## 6. Nettoyage technique et contrôle qualité

Le nettoyage CSS se fait après inventaire des styles, des fonds, des points de rupture responsive et des règles spécifiques aux pages. Il vise à réduire les doublons et les règles contradictoires sans changer involontairement le rendu.

Le contrôle des liens couvre :
- liens internes et routes de toutes les pages déclarées ;
- liens vers les dossiers et sous-rubriques ;
- formulaires, boutons et appels à l'action ;
- ressources images, feuilles CSS et scripts ;
- liens de navigation et liens de pied de page ;
- destinations protégées et parcours d'authentification.

Les erreurs sont corrigées par lots, avec tests anti-régression.

## 7. Ordre de réalisation

1. **Lot 0 — sauvegarde et cartographie :** confirmer le point de départ, inventorier les pages, ressources, styles, scripts, contenus et dépendances.
2. **Lot 1 — navigation globale :** concevoir le menu commun et vérifier chaque destination sur toutes les pages.
3. **Lot 2 — accueil classique :** retirer uniquement le mécanisme de navigation par immeuble, préserver le moteur, le bandeau, les textes et les fonds, puis présenter les rubriques.
4. **Lot 3 — chatbot première génération :** installer l'interface conversationnelle et son contrat de connaissance/navigation, sans simuler une connexion IA absente.
5. **Lot 4 — nettoyage CSS :** consolider les styles après comparaison visuelle desktop/mobile.
6. **Lot 5 — audit des liens et des parcours :** tester routes, formulaires, moteurs, résultats, OTP, CRM et espaces protégés.
7. **Lot 6 — validation :** tests automatisés, tests navigateur, build, contrôle du diff et documentation.

## 8. Critères de non-régression

La refonte n'est pas recevable si l'un des éléments suivants régresse :
- contenu d'une rubrique manquant ou rendu inaccessible ;
- fond d'écran, image ou identité visuelle supprimé sans décision ;
- recherche, filtres, résultats ou formulaires cassés ;
- lien interne erroné ou destination manquante ;
- connexion CRM / Supabase altérée ;
- accès indu au CRM VIP ou mélange des espaces clients ;
- chatbot présentant comme opérationnelle une capacité qui ne l'est pas ;
- version mobile moins utilisable ou navigation inaccessible au clavier.

## 9. Gouvernance de livraison

Tous les travaux restent sur `Evolution-7`. Aucune fusion vers `Evolution-6` ou `main`, aucune promotion Vercel, aucun déploiement production et aucune modification des projets Supabase ne sont autorisés par la présente décision. La prévisualisation sera utilisée pour la recette avant toute demande de promotion distincte.

Chaque lot doit indiquer ses fichiers modifiés, tests exécutés, résultats, limites et risques résiduels.

## 10. Suivi de réalisation — premier lot

### Réalisé sur Evolution-7

- Création de la branche `Evolution-7` depuis `Evolution-6`, sans modification de la branche source.
- Ajout d'un catalogue de navigation globale dans `app.js` : Opportunités, Développement commercial, Réseau & visibilité, Espaces et Informations, avec les pages et sous-rubriques correspondantes.
- Navigation construite sur toutes les pages qui chargent le contrôleur partagé ; les pages internes Administration/CRM conservent leurs navigations dédiées.
- Ajout de `navigation-majestios.css` et inscription dans `site-files.json`.
- Retrait de l'immeuble et de son contrôleur SVG de l'accueil ; les images historiques ne sont pas supprimées du dépôt.
- Préservation du moteur de recherche transversal, du titre, du slogan et du bandeau de démonstration de l'accueil.
- Remplacement de l'immeuble par six portes d'entrée éditoriales renvoyant vers les pages métier existantes.
- Installation d'un premier assistant conversationnel d'orientation, disponible sur les pages qui chargent `app.js`. Il répond à partir d'une base locale de rubriques et propose des liens directs ; il ne prétend pas être un moteur génératif ou Cheexpeer déjà connecté.
- Ajout du test navigateur `tests/navigation-classique.browser.cjs` et remplacement dans la CI du test de l'immeuble par le test de la navigation classique et du chatbot.
- Adaptation des contrats statiques de vérification de l'architecture et de l'accueil.

### Non réalisé à ce stade

- Le nettoyage global du CSS historique n'est pas terminé : les règles propres à l'ancien immeuble sont encore présentes et doivent être retirées après inventaire des dépendances.
- Le contrôle exhaustif des liens, boutons, formulaires et destinations de chaque rubrique reste à exécuter.
- Le chatbot n'est pas encore relié à un fournisseur IA, à une mémoire persistante ou à Supabase ; aucun secret n'est exposé dans le navigateur.
- Aucun fichier métier, fond d'écran de rubrique, image, contenu de page, connexion CRM ou paramètre Supabase n'a été supprimé ou modifié intentionnellement.
- Aucun changement de schéma, migration, politique RLS, fonction Edge ou déploiement Supabase n'a été effectué.
- Aucun déploiement Vercel ni promotion de production n'a été effectué.

### Vérification CI — limite connue

Le premier run de vérification a échoué avant le build sur le test préexistant `tests/crm-security-contract.test.cjs`. Ce test attend notamment que les membres d'organisations clientes/partenaires conservent des droits CRM ; cette attente doit être réexaminée au regard de la décision actuelle : le CRM VIP reste réservé à l'administration interne et le CRM propre aux autres membres est différé. La migration locale `20261108151400_enforce_vip_boundary_for_internal_crm.sql` n'a pas été appliquée et ne doit pas être déployée avant correction/validation de ce contrat.

Un run déclenché après le réordonnancement des contrôles a été annulé ; aucun résultat vert exploitable de l'ensemble de la CI n'est donc revendiqué. Le test navigateur Evolution-7 doit encore fournir sa première preuve d'exécution complète.


### Lot CSS et validation — réalisé

- Les deux blocs `<style>` de l'accueil ont été externalisés en `homepage.css` et `homepage-theme.css`, en conservant leur ordre de cascade par rapport à `styles.css`, `charte-majestios.css` et `rubriques-immersives.css`.
- Les règles devenues orphelines de l'immeuble, des étages, de l'ascenseur, des enseignes LED, des dialogues d'étage, de l'ancien guide d'accueil et de l'ancien menu ont été retirées des feuilles d'accueil.
- Le fond panoramique `Designer (2).png`, la palette, le bandeau, les textes de positionnement, le moteur de recherche et le pied de page restent en place.
- Les feuilles `homepage.css` et `homepage-theme.css` sont déclarées dans `site-files.json` et contrôlées par le build.
- Les vérifications statiques ont été adaptées : aucun style inline ne subsiste dans `index.html`, et un contrôle anti-régression interdit le retour des sélecteurs de l'immeuble et de l'ancien menu.

### Résultat CI Evolution-7

**Run GitHub Actions :** `42601227994` — conclusion `success` — commit `c27583ece1a38c74a55fcc7ea2c41e7e02df969b`.

Contrôles exécutés avec succès :
- syntaxe JavaScript et TypeScript ;
- tests métier existants, dont Auth OTP, prospection, réputation virtuelle et contrat de sécurité CRM ;
- build statique du manifeste ;
- architecture, routes, fonds de rubrique et liens locaux ;
- navigateur réel : recherche, navigation classique, sous-menus mobile/desktop, chatbot, réputation virtuelle, formulaires et verrouillage administratif ;
- contrôles réels des API BOAMP et BODACC.

La CI est verte sur ce commit. Cela ne vaut pas recette fonctionnelle complète de chaque contenu métier, ni validation d'une connexion IA générative au chatbot.


### Assistant — enrichissement de la base d’orientation

Le premier assistant a été enrichi pour distinguer les annonces BODACC de la rubrique générale Marchés privés, orienter directement vers la veille BODACC, la veille des marchés, la FAQ et la page Vision. Le test navigateur vérifie désormais qu’une question BODACC conduit bien à la page dédiée. Le moteur reste local et déterministe, sans connexion IA distante à ce stade.

### Conservation des menus et de leurs textes

- Le menu global expose désormais **33 destinations de rubrique**, plus Accueil, soit 34 liens vérifiés dans le navigateur.
- Les raccourcis de l'ancien guide d'accueil n'ont pas été abandonnés : « Rechercher une opportunité », « Découvrir le développement commercial », « Préparer mon espace personnel » et « Consulter les questions fréquentes » sont repris dans le panneau conversationnel.
- Les formulations « Besoin d’un coup de pouce ? », « MAJESTIOS · GUIDE DE VISITE », « Par où commencer ? » et « Vous proposez, MajestiOS dispose. » sont conservées dans cette nouvelle interface.
- Les rubriques BODACC, Veille des marchés, FAQ et Vision disposent d'une orientation directe depuis le chatbot.

**Dernière validation complète :** run GitHub Actions `42602181746` — conclusion `success` — commit `de68625326e5887d0f68dc19cfa90e314eaf94fa`. Ce run couvre les 34 liens de navigation, les raccourcis historiques du guide, l'orientation directe BODACC, les contrôles CSS, les tests navigateur desktop/mobile, les moteurs de recherche, les formulaires, le verrouillage administratif et le contrat de sécurité CRM.
### Correctif CI — ressources de prospection et validation du SIRET (9 novembre 2026)

- Le run 42604087884 sur 31caf02 a révélé un test obsolète dans tests/prospecting-resources.test.cjs : il attendait l'ancien catalogue public SOURCES et l'ancienne signature de sélection individuelle d'un fournisseur.
- Le contrat actuel est conservé : les fournisseurs ne sont pas exposés dans l'API publique et la vérification orchestre uniquement les connecteurs configurés côté serveur.
- Le test a été réaligné sur ce contrat : absence de configuration, appel d'un proxy configuré, normalisation du SIRET et recherche RGE avec filtre départemental.
- Correction des expressions régulières qui normalisent les chiffres et valident les 14 chiffres du SIRET. La version précédente échouait à reconnaître correctement les caractères non numériques et les chiffres.
- Aucun secret, endpoint distant, réglage Supabase ou donnée métier n'a été modifié.

**Commit correctif :** 8219491195c3d0aba902293e978af1318053d0a4.

**Validation GitHub Actions :** run 42605289091 — conclusion success sur ce commit. Les tests de ressources de prospection, suggestions APE/NAF, contrats/DTO/habilitations, recherche membre, build, architecture, liens, tests navigateur desktop/mobile, formulaires, verrouillage Administration et contrat de sécurité CRM ont tous réussi.

Cette validation porte sur le commit correctif ci-dessus. Elle ne vaut pas validation de tous les services externes ou de l'activation réelle des connecteurs de qualification.

### Correctif de précision géographique — référentiel RGE (9 novembre 2026)

- Le schéma public ADEME consulté expose un champ `code_postal`, mais pas de code département distinct.
- Les codes postaux ne permettent pas de distinguer de façon fiable les départements corses 2A et 2B. Le filtre précédent réduisait les deux codes à `2` et pouvait mélanger les résultats.
- La recherche refuse désormais ce filtre ambigu lorsque seul le code postal est disponible, au lieu de présenter des résultats géographiques inexacts. Le message invite à rechercher par commune ou sans filtre départemental.
- Les tests couvrent explicitement les deux cas corses et vérifient qu'aucune requête de lignes n'est envoyée avec ce filtre ambigu.
- Limite restant à traiter séparément : la recherche RGE récupère actuellement un premier lot de 100 lignes puis filtre localement. Une pagination/filtration serveur doit être validée sur le contrat réel de l'API Data Fair avant d'être modifiée.

**Source de schéma consultée :** API ADEME « Liste des entreprises RGE », actualisation indiquée au 30 juin 2026 ; champ géographique disponible : `code_postal`.

### Correctif navigation et cohérence CI — 9 novembre 2026

- Le clic sur un onglet parent de la navigation desktop ouvre désormais la page principale de sa rubrique ; le survol conserve l'ouverture du sous-menu. Sur mobile, le toucher continue d'ouvrir/replier le sous-menu.
- Les tests navigateur classique et tiroirs vérifient explicitement le clic sur le parent desktop, en plus du survol, du focus clavier et du parcours tactile.
- Le contrôle d'architecture et le test navigateur classique ont été réalignés sur le menu réellement retenu dans Evolution-7 : six familles, 18 liens secondaires et 17 destinations distinctes, plus Accueil. L'ancienne attente de 24 liens et la rubrique « Espace client » de premier niveau provenaient d'un contrat obsolète ; l'espace client est bien une entrée du groupe « Espaces privés ».
- Le lien « Accès VIP · Administration » reste dans « Espaces privés », avec sa classe dédiée et son traitement visuel bleu nuit / or / chrome. Sa présence dans le menu ne remplace jamais les contrôles d'accès.
- Les tests sont ajoutés ou adaptés, mais leur exécution sur le commit final reste en attente du résultat GitHub Actions. Aucun déploiement ni changement Supabase n'a été effectué.

### Accès VIP et formulaire de contact — audit complémentaire

- Le contrôle navigateur existant couvre l'accès sans session, la matrice owner/admin/member/viewer, les accès directs au CRM, au cockpit et aux recherches d'administration. Il vérifie aussi que seuls owner/admin voient les modules d'administration et que member/viewer ne sont pas redirigés vers le cockpit.
- Le lien « Accès VIP · Administration » est conservé dans « Espaces privés ». Son texte est bleu nuit sur fond transparent, avec un filet or discret ; le test navigateur vérifie les couleurs calculées et le fond transparent. Le précédent texte or sur tiroir clair avait un contraste insuffisant.
- Le formulaire Contact reste explicitement en prévisualisation : son test vérifie la validation des champs et l'absence de requête d'envoi. Ce comportement est conforme à la décision produit documentée ; ce n'est pas une anomalie critique. L'activation de l'envoi reste une évolution produit à décider.
- Réserve sécurité : les tests d'accès utilisent un client Supabase simulé et vérifient le contrat front. Ils ne remplacent pas une recette RLS multi-identités dans un environnement isolé. Les migrations VIP ne sont pas modifiées ni appliquées pendant cet audit.
- La migration 20261108181246_vip_only_crm_access.sql se présente comme appliquée et réserve le CRM aux administrateurs d'organisation ; 20261108151400_enforce_vip_boundary_for_internal_crm.sql se présente comme versionnée mais non appliquée et distingue l'organisation interne des espaces clients. Leur cohérence et l'état réel de la migration distante doivent être confirmés avant toute évolution des droits client/partenaire. Aucune conclusion sur l'état distant n'est tirée depuis Git seul.
- La CI de référence du lot précédent est passée sur 2e13a690. Le nouveau test de contraste VIP est en attente dans le run associé au commit 12574f65.
