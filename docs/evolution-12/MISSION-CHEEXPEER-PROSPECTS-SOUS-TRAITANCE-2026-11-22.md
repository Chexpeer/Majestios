# Mission n°1 de Cheexpeer — Prospects de sous-traitance autour d'un marché gagné

*Fiche rédigée le 22 novembre 2026 à partir des déclarations du propriétaire, mises par écrit avant toute construction. Elle **précise et remplace l'ordre des priorités** de [MISSION-CHEEXPEER-PITCH-SOUS-TRAITANCE-2026-11-21.md](MISSION-CHEEXPEER-PITCH-SOUS-TRAITANCE-2026-11-21.md) : le pitch n'est plus la priorité, il vient après la stratégie et les données.*

## Décision du propriétaire : Cheexpeer travaille seul, par missions
Cheexpeer doit exécuter de vraies missions en autonomie depuis le Centre de commande, sur validation de l'administrateur. Aujourd'hui seule une mission de test est autorisée dans le code ; la première vraie mission est celle décrite ci-dessous. Le chat de Cheexpeer est un autre canal : il ne remplace pas les missions.

## Le principe : « la mouche et la bouse » (image du propriétaire)
| L'image | Dans MajestiOS |
|---|---|
| La bouse | Un donneur d'ordre lance un appel d'offres |
| La reine des mouches | L'entreprise qui remporte le marché |
| Les autres mouches | Les entreprises du même domaine d'activité, dans la même région |
| Prévenir les mouches | Cheexpeer leur indique qu'un marché vient d'être gagné par telle entreprise et qu'elles peuvent la contacter pour proposer leurs services en sous-traitance |

Les entreprises intéressées contactent la gagnante : MajestiOS joue l'intermédiaire qui prévient. Le nom de l'entreprise gagnante est une donnée publique.

## Mission n°1 — « Liste de prospects autour d'un marché gagné »
1. **Déclencheur** : un marché est gagné dans un domaine d'activité (exemple : climatisation, panneaux solaires).
2. **Liste** : Cheexpeer sort **20 à 30 entreprises** exerçant dans ce domaine, dans la **même région** que l'entreprise gagnante (codes APE/NAF comme indice principal).
3. **Recherche poussée** : pour chaque entreprise, Cheexpeer complète les informations : **téléphone, e-mail, coordonnées Google Maps**.
4. **Présentation** : la liste apparaît dans le **tableau de bord administrateur**, en **format téléchargeable** (Excel ou Google Sheets).
5. **Réutilisation** : ces mêmes entreprises **alimentent le service de prospection** et les **CRM**.
6. **Validation** : l'administrateur valide le lancement de la mission ; aucun envoi à l'extérieur n'est fait par Cheexpeer.

## Plus tard (rien n'est construit, à réfléchir ensemble une fois la stratégie en place)
- **Le pitch** et la **façon de contacter** ces entreprises.
- **L'accompagnement** des entreprises intéressées dans leur demande de sous-traitance, comme Cheexpeer le fait déjà pour les appels d'offres publics (service « Accompagnement aux appels d'offres »).

## Où trouver chaque information (état au 22 novembre 2026)
| Information | Source | État |
|---|---|---|
| Marché gagné, titulaire, acheteur, département | Marchés attribués (DECP) | En production |
| Nom, SIREN, adresse, code NAF, commune | API Recherche d'Entreprises (officielle) | Utilisée par l'outil admin ; pas de téléphone ni d'e-mail |
| Téléphone, coordonnées Google Maps | Google Maps (Places) | **Clé Google à créer par le propriétaire** (usage payant au-delà d'un petit quota gratuit) |
| E-mail | Site web de l'entreprise (lecture de ses pages publiques) | À construire |
| Provenance, date, lien d'origine | Règle de la fiche entreprise unifiée (clé SIREN) | Règle posée, à appliquer |

## Ordre de construction décidé
1. Mission, liste issue des sources officielles, tableau administrateur et téléchargement — **sur la base de test d'abord**.
2. Ajout du téléphone et des coordonnées Google Maps (après création de la clé Google).
3. Ajout des e-mails depuis les sites web.
4. Alimentation de la prospection et des CRM.
5. Mise en production **seulement sur décision explicite du propriétaire**.

## Acquis réutilisable
Les outils de lecture écrits pour le chat (marchés attribués, annuaire officiel, métiers complémentaires, `pitch-sous-traitance.mjs` avec sa table NAF) servent aussi à cette mission. Les règles existantes restent : validation par l'administrateur, plafonds, Cheexpeer « fermé par défaut », aucune modification des rôles ni des membres par Claude.
