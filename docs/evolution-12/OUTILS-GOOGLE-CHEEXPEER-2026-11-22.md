# Outils Google pour Cheexpeer — décision du 22 novembre 2026

*Décision du propriétaire, mise par écrit avant toute construction. Elle répond à la question « quels outils mettre à la disposition de Cheexpeer ». Elle complète le [périmètre d'action](PERIMETRE-ACTION-CHEEXPEER-2026-11-22.md) et le [catalogue de missions](CATALOGUE-MISSIONS-CHEEXPEER-2026-11-22.md).*

## Les mots du propriétaire
> Tous les outils que Google peut nous proposer, on les prend.

## Ce qui est décidé
1. Cheexpeer reçoit les outils **Google Maps Platform** utiles à ses missions (liste ci-dessous), en plus de ses outils actuels.
2. Chaque outil a **sa ligne dans le registre d'outils** : ouvert un par un, **fermé par défaut**, activé seulement par le propriétaire.
3. Tous restent en **lecture seule** : Cheexpeer cherche et présente, il n'envoie rien (voir le périmètre).
4. La clé Google est **créée et collée par le propriétaire** dans les secrets Supabase. Elle ne passe jamais par le chat ni par GitHub.

## Outils Google envisagés
| Outil Google | Ce qu'il apporte à Cheexpeer | Mission concernée |
|---|---|---|
| Places (recherche de lieux, fiche d'un lieu) | Entreprise sur Google Maps : adresse, téléphone, site web, horaires | Mission n°1 (coordonnées) |
| Géocodage | Adresse ⇄ position sur la carte | Mission n°1, distance au chantier |
| Routes (itinéraires, matrice de distances) | Distance et temps entre une entreprise et un chantier | Choix des entreprises proches |
| Street View / cartes statiques | Image du lieu d'une entreprise ou d'un chantier | Fiche entreprise |
| Validation d'adresse | Adresses propres avant export | Export Excel / CRM |
| Environnement (météo, qualité de l'air…) | Conditions sur un chantier | Après les travaux, à définir |

Les outils non listés ici (autres services Google) ne sont **pas exclus** : ils s'ajouteront par la procédure du périmètre (§8).

## Points concrets à connaître
- **Coût.** Google Maps Platform demande un compte de facturation. Chaque outil a un quota gratuit mensuel (de 1 000 à 10 000 appels selon l'outil), puis devient payant. Le téléphone et le site web d'une entreprise font partie des données les plus chères (quota gratuit : 1 000 par mois). Un plafond de dépense sera fixé côté Google avant toute activation.
- **Conservation des données.** Les conditions de Google limitent la conservation de certaines données : les coordonnées de position se conservent **30 jours au maximum**, puis doivent être supprimées ; l'identifiant d'un lieu (`place_id`) peut être conservé. Les règles sur les noms, téléphones et adresses sont à relire dans les conditions Google **avant** de les stocker dans le tableau Excel ou dans les CRM.
- **Mission n°1.** Aujourd'hui les colonnes téléphone, e-mail et Google Maps sont vides. Les outils Places y répondront ; l'e-mail vient, lui, du site de l'entreprise (étape à cadrer séparément).

## État au 22 novembre 2026
| Élément | État |
|---|---|
| Clé Google Maps | **Non créée** |
| Outils Google dans le registre | **Non construits** |
| Mission n°1 | Sur Test, outil désactivé, coordonnées vides |

## Ordre de travail prévu
1. Le propriétaire crée le compte de facturation et la clé Google, avec un plafond de dépense, et la colle lui-même dans les secrets Supabase de la base de test.
2. Première brique : **Places** pour compléter téléphone, site web et lien Google Maps de la mission n°1.
3. Les autres outils s'ajoutent un par un, chacun avec ses tests et l'activation par le propriétaire.
4. Relecture des conditions Google sur la conservation avant tout export vers Excel ou les CRM.
5. Mise en production seulement sur décision explicite du propriétaire.

## Sources
- [Tarification Google Maps Platform](https://developers.google.com/maps/billing-and-pricing/pricing)
- [Conditions spécifiques des services Google Maps Platform](https://cloud.google.com/maps-platform/terms/maps-service-terms/)
