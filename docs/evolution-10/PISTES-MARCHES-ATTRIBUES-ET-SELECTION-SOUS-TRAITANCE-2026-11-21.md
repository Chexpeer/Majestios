# Pistes : marchés attribués, fiches acheteurs et sélection Cheexpeer pour la page Sous-traitance — 21 novembre 2026

**Statut :** idées et décisions de cadrage. **Rien n'est construit.** Complète la [charte de rôle de Cheexpeer](CHARTE-ROLE-CHEEXPEER-2026-11-14.md) (mission 2 : veille et prospection, niveaux N1–N2) et la [spécification des annonces de sous-traitance](SPECIFICATION-ANNONCES-SOUS-TRAITANCE-2026-11-14.md).

## 1. Demande du propriétaire (21/11)
- Pouvoir consulter la **liste des entreprises ayant gagné un appel d'offres**.
- Idée directrice : **Cheexpeer croise toutes les informations et fait une sélection pour la page Sous-traitance** (l'entreprise qui remporte un marché a souvent besoin de renforts : c'est déjà la promesse de la rubrique, « besoins de renfort autour d'un marché remporté »).

## 2. Sites regardés (inspiration uniquement, rien n'est copié)
| Site | Ce qu'il montre | Ce qui est retenu |
|---|---|---|
| octroi.pro (marchés, résultats, acheteurs) | Fiche par marché attribué : gagnant, acheteur, montant HT, **nombre d'offres reçues** (publié depuis 2024) ; annuaire de 6 529 acheteurs avec historique depuis 2020 ; alerte e-mail quotidienne « seulement quand il y a du nouveau » ; filtres métier / région / département | Cycle marché ouvert → qui a gagné chez cet acheteur et à quel prix → habitudes de l'acheteur ; alerte quotidienne |
| tamairie.fr (accueil, Alençon) | Finances locales, note de comparaison, marchés depuis 2019, élus ; lecture automatique de 725 683 délibérations et arrêtés (34 872 communes) | Indicateurs de capacité d'investissement d'une collectivité ; **délibérations = signal faible** annonçant de futurs marchés |

Réserves : leur source, leur licence et leurs tarifs n'ont pas pu être vérifiés (la page « premier » d'octroi.pro est fermée aux outils automatiques ; non contournée). Résumés automatiques de tamairie.fr : l'auteur précise lui-même que seul le document officiel fait foi.

## 3. Sources publiques envisagées
- **DECP consolidées** (data.gouv.fr, Licence Ouverte 2.0, mises à jour quasi quotidiennes, depuis 2022) : titulaire, SIRET, montant, acheteur, dates, CPV. Fichier lourd (≈ 265 Mo Parquet) : import filtré, jamais interrogé tel quel depuis une page. Un marché peut occuper plusieurs lignes (titulaires, avenants) : dédoublonner.
- **BOAMP** (avis d'attribution), **BODACC**, finances locales (DGFiP), annuaire des élus (Intérieur), Insee.
- Interrogation en ligne du jeu consolidé : sur abonnement (API tierce) : non retenue au départ.

## 4. Ordre proposé (à valider par le propriétaire)
1. **Marchés attribués** : fiche par marché (gagnant, acheteur, montant, nombre d'offres si connu), filtres métier / département / période, recherche « Qui a gagné ? ». Import filtré (12 derniers mois) sur MajestiOS-Test.
2. **Fiches acheteurs / collectivités** : historique d'attribution, indicateurs financiers.
3. **Fiches entreprises** : marchés gagnés, acheteurs.
4. **Sélection pour la page Sous-traitance** : d'abord par **règles simples et explicables** (marché récemment attribué, montant élevé, plusieurs lots ou titulaires, métier et département du membre), sans IA.
5. **Cheexpeer** (N1–N2) : croisement des sources et sélection argumentée, **chaque élément avec sa source, sa date et la raison du choix** ; aucune publication ni envoi sans validation humaine.
6. Plus tard : alerte quotidienne ; **délibérations des communes** (texte libre, gros chantier).

## 5. Garde-fous
- Données d'entreprises uniquement publiques et professionnelles ; chaque ligne affichée porte sa source et sa date.
- Sélection **explicable** (jamais de score opaque) ; mention que les données officielles font foi.
- Rien n'est appliqué à un projet Supabase sans autorisation explicite du propriétaire ; Test d'abord ; production seulement à la fusion décidée par lui.
- Cheexpeer ne s'active que selon la charte de rôle (aucune autonomie par défaut ; la première mission déployée reste `readiness_probe`).

## 6. Questions ouvertes
- Import dans la base (rapide, à mettre à jour chaque jour) ou consultation directe des sources : **recommandé, import filtré sur 12 mois** pour commencer.
- Secteurs et départements de départ.
- Autres sites ou sources que le propriétaire souhaite faire étudier.
