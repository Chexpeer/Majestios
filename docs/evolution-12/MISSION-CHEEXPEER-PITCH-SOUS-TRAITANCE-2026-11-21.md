# Mission Cheexpeer — Pitch de sous-traitance après un marché gagné

*Fiche rédigée le 21 novembre 2026 à la demande du propriétaire. Aucune construction n'est lancée : cette fiche est à relire avant toute décision.*

## Idée
Une entreprise remporte un marché (exemple : climatisation ou panneaux solaires). Cheexpeer prépare un pitch pour que les artisans complémentaires de la même région (plombiers, électriciens…) proposent leurs services en sous-traitance. Rien n'est envoyé sans la validation du propriétaire.

## Déroulé
1. **Déclencheur** : un marché attribué apparaît dans « Marchés attribués » (entreprise gagnante, département, code CPV des travaux, montant).
2. **Identification du métier gagnant** : code APE/NAF de l'entreprise gagnante, complété par le code CPV du marché.
3. **Métiers complémentaires** : une table « code NAF gagnant → codes NAF à solliciter » (voir ci-dessous) donne les métiers utiles.
4. **Entreprises ciblées** : recherche d'entreprises de ces codes NAF dans le même département (moteur de recherche d'entreprises existant).
5. **Pitch** : texte court adapté à chaque métier (le marché, le besoin probable, ce que peut apporter l'artisan).
6. **Validation** : le propriétaire voit le pitch et la liste, puis décide. Aucun envoi automatique.

## Rôle des codes APE/NAF
Le code NAF est l'indice central : il relie ce que fait l'entreprise gagnante aux métiers à solliciter, et permet d'écrire un pitch dans le langage du métier. **Point à prévoir** : les données de marchés (DECP) ne contiennent pas le code NAF des gagnants ; il faut l'obtenir dans le registre officiel des entreprises à partir du SIRET (le projet sait déjà interroger ce registre : `search-official-companies`, `import-official-company`).

## Table de correspondance (point de départ, à valider)
| Métier gagnant (NAF) | Métiers à solliciter (NAF) |
|---|---|
| 43.22B Chauffage, climatisation | 43.21A Électricité, 43.22A Plomberie |
| 43.21A Installation électrique (dont solaire) | 43.91B Couverture, 43.22A Plomberie |
| 43.22A Plomberie | 43.21A Électricité, 43.22B Chauffage-climatisation |

## Extension à tous les secteurs
La méthode ne dépend pas du bâtiment : seule la table de correspondance change. Chaque secteur reçoit sa propre table « NAF gagnant → NAF complémentaires » (restauration collective, nettoyage, informatique, transport, espaces verts…), ajoutable sans modifier le reste. Le code CPV du marché sert de second indice dans tous les cas.

## Prérequis
- Fonctions Cheexpeer à mettre en production (chat, missions, audit de réputation, création d'espaces clients) : aujourd'hui seule une mission de test existe dans le code.
- Récupération du code NAF des gagnants depuis le registre officiel.
- Validation des tables de correspondance par le propriétaire.

## Ambition
MajestiOS vise à devenir la plateforme nationale de la sous-traitance et des marchés privés, en s'appuyant sur le croisement de toutes les sources pour donner à Cheexpeer une information précise et complète sur chaque entreprise.

## Fiche entreprise unifiée (clé : SIREN)
Chaque source apporte une pièce ; la provenance, la date de collecte et le lien d'origine sont conservés (règle déjà posée dans `docs/evolution-5.0/ETAT-RESSOURCES-PROSPECTION-2026-11-07.md`).

| Source | Apport | État au 21 novembre 2026 |
|---|---|---|
| Marchés attribués (DECP) | Marchés gagnés, montants, acheteurs, sous-traitance déclarée | En production |
| API Recherche d'Entreprises | Code NAF, effectif, chiffre d'affaires, adresse | Code prêt, test réel à faire |
| ADEME (RGE) | Certification RGE | Code prêt, test réel à faire |
| BODACC | Procédures collectives, ventes, modifications | Code prêt, test réel à faire |
| QUALIBAT, QUALIFELEC, OPQIBI, FNTP | Qualifications professionnelles | Non connectées |
| SIRENE (INSEE), RNE (INPI) | Données officielles détaillées | Non connectées |
| Annonces MajestiOS | Besoins et offres de sous-traitance | En production |

## Sites de référence fournis par le propriétaire (21 novembre 2026)
Ce sont des sites d'inspiration et de veille concurrentielle, pas des sources de données à copier : leur intérêt est dans leurs fonctionnalités. Les données qu'ils présentent viennent pour l'essentiel de sources publiques que MajestiOS charge déjà ou peut charger.

| Site | Apport principal | Intérêt | Idée pour MajestiOS |
|---|---|---|---|
| PublikConnect (accueil, annuaire, départements) | Score expliqué, radar de renouvellement, annuaire par département, profils vérifiés ; concurrent direct | Très fort | Score expliqué par entreprise ; renouvellement des marchés ; annuaire par département |
| Octroi | Cycle marché → gagnant → acheteur, alerte | Fort | Alerte « un marché vient d'être gagné » déclenchant la mission de sous-traitance |
| Woxup | Classement des titulaires, fiches acheteurs | Fort | Déjà amorcé (annuaire des gagnants) ; ajouter les fiches acheteurs |
| corporary.com | Fiches entreprises, flux de changements | Fort, à tester | Modèle de la fiche entreprise unifiée et du flux de changements |
| tamairie.fr | Finances locales, délibérations | Moyen (plus tard) | Contexte acheteur communal |
| Seal Open Data / Ariacom | Contexte territorial | À étudier | Contexte de la zone |

**Avantage propre à MajestiOS :** ces sites présentent les marchés ; aucun ne relie un marché gagné aux artisans complémentaires de la région avec un pitch prêt (codes NAF + Cheexpeer). C'est la mission décrite ci-dessus.
