# Évolution 6 — Réputation virtuelle : état intégré

**Date :** 9 novembre 2026  
**Branche cible :** `Evolution-6`  
**PR intégrée :** [#53 — Réputation virtuelle : dossier d’audit structuré et parcours Google](https://github.com/Chexpeer/Majestios/pull/53)  
**Commit de fusion :** `14600077222e81e5c1bb01e05bc71f6de7168ebf`  
**Commit de la branche de réalisation :** `29d41ac4c19955b61a54713d32aa4e680782b014`

## 1. Résultat livré

Le lot fait évoluer la rubrique Réputation virtuelle au-delà de sa vitrine visuelle. Il réunit :

- une présentation de la présence numérique et une vitrine illustrative des réseaux sociaux ;
- deux parcours de recherche distincts : Google Web et Google Maps ;
- un dossier de préparation d’audit structuré autour de l’entreprise, de son activité, de son site, de son territoire, de sa clientèle et de son objectif commercial ;
- un journal horodaté des requêtes, plafonné aux 50 dernières entrées ;
- une méthodologie opérationnelle d’audit SEO et de réputation virtuelle, référencée dans le corpus documentaire V5.

## 2. Fonctionnement réellement implémenté

### Recherches Web et cartographiques

La page permet de préparer et consulter des recherches Google Web et Google Maps, avec des liens de secours. Les résultats tiers restent servis par Google dans leurs propres interfaces ou contenus intégrés.

**Limite importante :** le navigateur ne donne pas à MajestiOS accès au contenu interne des pages Google intégrées (politique cross-origin). Le code ne réalise donc ni extraction automatique des résultats, ni analyse sémantique de ces résultats, ni classement autonome des entreprises à partir de leur contenu.

### Dossier d’audit et journal

Les données de préparation et le journal sont conservés dans le stockage de session du navigateur (`sessionStorage`) avec les clés :

- `majestios.reputation.auditDossier.v1`
- `majestios.reputation.searchLog.v1`

Le journal conserve au maximum 50 entrées. Ce stockage est local à l’onglet/la session du navigateur : il ne constitue ni une sauvegarde serveur, ni un dossier CRM, ni une synchronisation entre appareils. La fermeture de la session peut entraîner la perte de ces données.

### Vitrine sociale

Les références visuelles Facebook, YouTube, Instagram, LinkedIn, TikTok et X illustrent les lieux où une présence numérique peut être examinée. Elles ne signifient pas que MajestiOS est connecté à ces plateformes, qu’il en collecte les données ou qu’il publie du contenu pour le compte d’un utilisateur.

## 3. Capacités non livrées — ne pas les présenter comme opérationnelles

**Règle métier confirmée : l'audit est une mission interne de Cheexpeer.** L'utilisateur cadre le besoin et fournit les informations nécessaires ; Cheexpeer doit conduire l'investigation, l'analyse, le diagnostic et les recommandations. Le prototype actuel ne réalise pas encore cette mission automatisée.

Le lot ne comprend pas :

- de connexion OAuth ou API aux réseaux sociaux ;
- d’extraction automatisée des avis, publications, résultats Google ou données cartographiques ;
- de diagnostic SEO ou de réputation généré automatiquement par Cheexpeer ;
- de scoring concurrentiel automatisé ;
- de transmission serveur ou de persistance Supabase du dossier d’audit ;
- de création automatique d’une fiche ou d’une activité dans le CRM ;
- d’envoi automatique de recommandations, d’alertes ou de rapports.

La méthodologie documentaire décrit une démarche d’audit à conduire avec des preuves vérifiables. Elle ne prouve pas que ces opérations sont automatisées dans le produit.

## 4. Fichiers et documentation associés

Fichiers applicatifs du lot :

- `reputation-virtuelle.html`
- `reputation-virtuelle.css`
- `reputation-virtuelle.js`
- `site-files.json`

Documentation méthodologique conservée dans le corpus V5 :

- `docs/evolution-5.0/METHODOLOGIE-AUDIT-SEO-REPUTATION-VIRTUELLE.md`

L’index documentaire général est `docs/README.md). Le présent compte rendu est le relevé d’intégration propre à la branche Evolution-6 ; il ne remplace pas la référence stratégique V5.

## 5. Vérifications et limites de recette

Pour le commit de réalisation `29d41ac4c19955b61a54713d32aa4e680782b014` :

- le workflow GitHub Actions `verify-static-site` est terminé avec succès ;
- les contrôles de syntaxe, de build, d’architecture, de routes et les tests déjà présents ont réussi ;
- le statut Vercel associé au commit indique que le déploiement de prévisualisation est terminé avec succès.

**Réserve de recette :** au moment de la fusion, la CI ne contenait pas de test navigateur dédié vérifiant spécifiquement le formulaire Réputation virtuelle, la restauration du dossier depuis `sessionStorage`, le plafonnement du journal à 50 entrées et sa réinitialisation. Les tests existants réussis ne doivent pas être interprétés comme une validation exhaustive de ces comportements. Ajouter ces scénarios Playwright avant de qualifier le parcours de complètement testé.

Le contenu des résultats Google intégrés n’est pas vérifiable par un test DOM de la page hôte en raison de l’isolation cross-origin ; les tests doivent vérifier les URL de recherche, les paramètres transmis, les liens de secours et le comportement de l’interface MajestiOS, sans prétendre valider le contenu Google.

## 6. Périmètre de sécurité et régression

La PR #53 n’introduit aucun changement au CRM VIP, à Auth, aux rôles, aux permissions, à Supabase ou aux politiques RLS. Le dossier d’audit reste local à la session. Aucun déploiement ou promotion en production n’est autorisé par la fusion de cette PR.

## 7. Recette navigateur ajoutée le 9 novembre 2026

Le test Playwright `tests/reputation-virtuelle.browser.cjs` a été ajouté au workflow `.github/workflows/verify-site.yml`. Le run GitHub Actions `42584058635` est terminé avec succès. Il vérifie la préparation et la restauration du dossier après rechargement, l'affichage des données comme texte (sans interprétation HTML), le plafonnement du journal à 50 entrées, l'URL et le lien de secours Google Maps, ainsi que la réinitialisation du dossier et du journal.

Cette recette valide les comportements de l'interface et du stockage de session ; elle ne valide pas encore l'orchestration ni l'analyse interne de Cheexpeer.

## 8. Suites recommandées

1. Ajouter les tests navigateur dédiés au dossier d’audit et au journal de session.
2. Vérifier la validation des champs, l’échappement des données affichées et l’absence d’injection HTML.
3. Tester les liens Google Web/Maps et les liens de secours sans tenter de lire le contenu cross-origin.
4. Faire évoluer ultérieurement la persistance et le raccordement CRM uniquement dans un lot distinct, avec modèle de données, finalités, consentements et autorisations définis.
5. Ne déclarer une connexion aux réseaux sociaux ou une analyse automatique que lorsqu’un connecteur autorisé, son traitement serveur et ses tests auront réellement été livrés.

---
**Règle de vérité :** une recherche ouverte, un formulaire local et une vitrine d’icônes ne constituent pas encore un audit automatisé. Toute reprise doit préserver cette distinction entre interface livrée, consultation externe et capacité d’analyse future.
