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

### Sites étudiés ensuite (21/11, après-midi)
| Site | Ce qu'il apporte | Intérêt | Réserves |
|---|---|---|---|
| corporary.com (API + serveur MCP, via data.gouv.fr) | Fiches entreprises croisant Sirene, BODACC, ratios financiers, RGE/Qualiopi, DECP ; flux de changements ; 7 outils MCP ; plan gratuit 1 000 appels/mois | Fort, à tester | Éditeur unique, licence propre non précisée, quota faible ; clé = secret Supabase |
| Woxup | Marchés attribués (DECP seules), classement des titulaires par montant cumulé, fiches acheteurs, navigation CPV | Fort : prouve que les DECP suffisent | Chiffres incohérents sur leur propre page ; pas d'alertes ni de marchés ouverts |
| Seal Open Data, Assistant, Ariacom | Contexte territorial (94 mesures), assistant par MCP (payant après essai), éditeur de logiciel de reporting | Faible à moyen | Tarifs inconnus ; page « données » fermée aux outils automatiques |
| PublikConnect (accueil, annuaire par département) | Marchés ouverts et **sous seuils**, attributions, profils d'acheteurs, **Radar de renouvellement (contrats 6 à 18 mois avant le nouvel appel d'offres)**, score 0–100 expliqué, alertes, annuaire des titulaires par département (≥ 4 marchés, montant médian), profils « vérifiés » ; Pro 49 € HT/mois | **Très fort : concurrent direct** ; ne traite ni mise en relation ni sous-traitance | Détails chiffrés limités à la Loire-Atlantique ; démonstrations ; aucune date de mise à jour visible |

Différenciation retenue pour MajestiOS : annonces privées de sous-traitance relues, mise en relation par MajestiOS, et sélection croisée par Cheexpeer, avec source, date et raison affichées.

## 3 bis. Sources publiques envisagées
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

## 6. Trois stratégies proposées (à choisir par le propriétaire)
| | A. Simple | B. Intermédiaire (recommandée) | C. Ambitieuse |
|---|---|---|---|
| Contenu | Page « Marchés attribués » + annuaire des titulaires par département (≥ 4 marchés, montant médian) | A + fiches acheteurs + sélection par règles pour la page Sous-traitance + Radar de renouvellement | B + fiches entreprises revendicables, alertes quotidiennes, Cheexpeer N1–N2, API corporary en complément |
| Données | DECP, import filtré 12 mois | DECP + BOAMP (avis d'attribution) | + BODACC, Sirene, finances locales, corporary |
| Effort | Faible | Moyen | Élevé, par étapes |
| Risque | Très faible | Faible | Dépendances et coûts à surveiller |

Ordre commun : A d'abord, sur Test. Rien n'est promu en production sans décision du propriétaire.

## 7. Avancement (21/11)
Stratégie B retenue, 6 derniers mois, gratuite. Étape 1 réalisée sur Test : base, chargement et page « Marchés attribués » (voir [Suite 30](CHARTE-CLAIRE-PALETTE-4-2026-11-15.md)). Reste : secrets GitHub à poser par le propriétaire, premier chargement, puis fiches acheteurs, Radar de renouvellement (nécessite un chargement plus ancien, 2 à 4 ans, sur quelques colonnes) et sélection pour la page Sous-traitance.

## 8. Questions ouvertes
- Import dans la base (rapide, à mettre à jour chaque jour) ou consultation directe des sources : **recommandé, import filtré sur 12 mois** pour commencer.
- Secteurs et départements de départ.
- Autres sites ou sources que le propriétaire souhaite faire étudier.

## 9. Premier chargement réel et accélération (21/11/2026)

- Premier chargement sur Test réussi : 169 289 lignes (139 822 marchés, 54 014 entreprises) du 21/05 au 20/11/2026 ; base à 162 Mo sur 500 Mo.
- Constat : la limite de 3 secondes du visiteur anonyme était dépassée (chiffres 4,9 s, liste 4 s). Correctif (migration `20261121180000_awarded_contracts_speed.sql`, appliquée sur Test) : chiffres précalculés en fin de chargement (`refresh_awarded_stats`), liste et annuaire classés avant détail. Tous les appels passent sous 1 s.
- Ajout d'un bouton « Rechercher » dans chaque formulaire de filtres.
- Production : rejouer aussi cette migration au moment de la fusion décidée par le propriétaire.
