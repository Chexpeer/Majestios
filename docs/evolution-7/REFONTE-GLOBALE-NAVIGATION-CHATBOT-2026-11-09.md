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

