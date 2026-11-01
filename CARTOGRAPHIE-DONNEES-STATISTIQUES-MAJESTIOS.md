# Cartographie des données — existant, manques et contrat statistique MajestiOS

**Date :** 1er novembre 2026  
**Branche :** `chantier-recherche-donnees-gardes-fous-2026-11-01`  
**Statut :** analyse documentaire du code et des schémas existants. Ce document ne certifie pas que les sources externes sont connectées ni que leurs données ont été collectées.

## 1. Conclusion exécutive

Le dépôt contient déjà deux contrats différents, à ne pas confondre :

1. **Opportunité d'appel d'offres** — le schéma `schemas/opportunite.schema.json` structure une annonce et sa provenance.
2. **Qualification d'entreprise** — `company-fit.js` produit une qualification indicative APE/NAF, géographique et administrative, avec des contrôles humains obligatoires.

Ces éléments ne constituent pas encore un modèle de données statistique complet. Il manque un contrat versionné pour les unités légales et établissements, les attributions, les exercices financiers publiés, les événements BODACC, les signaux emploi/immobilier et les indicateurs calculés. Il faut donc éviter de brancher un tableau de bord sur des champs improvisés ou de traiter les annonces d'opportunités comme une base statistique exhaustive.

## 2. Champs déjà présents et réutilisables

| Objet | Champs / comportement existants | Usage possible | Limite |
|---|---|---|---|
| Opportunité | `id`, `sourceId`, titre, description, catégorie, type public/privé, acheteur, localisation, dates, source, URL, statut, vérification, dernière observation, tags, lots, provenance | Index des annonces et suivi de fraîcheur | Pas un modèle d'attribution statistique distinct ; la structure ne suffit pas à identifier un titulaire |
| Provenance opportunité | date de récupération, méthode, empreinte éventuelle | Audit et dédoublonnage | Ne conserve pas à elle seule la licence, la version du jeu source ou la transformation complète |
| Qualification entreprise | activité APE/NAF, département, statut administratif ; avertissements et contrôles manuels | Préqualification explicable | Le résultat est une aide au tri, pas une décision d'éligibilité ni un profil financier |
| Contrôles humains | établissement local, certifications, références, capacité humaine/matérielle, éligibilité, disponibilité | Liste de vérifications métier | Valeurs actuelles à `to_verify`, sans preuve documentaire ni historique daté |
| Ressources CRM | sources candidates, modes d'accès, limites, statut d'intégration documenté | Registre de gouvernance des sources | Une source listée n'est pas une source connectée, autorisée pour toute finalité ou validée juridiquement |

## 3. Modèles à ajouter avant le tableau de bord statistique

### A. Unité légale et établissement

Champs minimaux recommandés :
- identifiants : `siren` (unité légale), `siret` (établissement), identifiant source ;
- dénomination publiée et, si nécessaire, nom commercial publié ;
- code APE/NAF avec date/version connue ;
- adresse structurée et codes commune/département/région ;
- état administratif et date d'effet, quand disponibles ;
- statut de diffusion / restriction de réutilisation ;
- source, URL, date de collecte, date de dernière observation, version du jeu ;
- valeurs brutes conservées séparément des valeurs normalisées ;
- statut de rapprochement : exact par identifiant, candidat, rejeté, contrôle humain requis.

Ne pas utiliser le seul nom comme clé de fusion. Ne pas écraser l'historique par la dernière valeur : conserver les observations datées ou un historique de changements.

### B. Avis, consultation, lot et attribution

L'avis de consultation et le résultat d'attribution sont des objets liés mais différents. Prévoir :
- identifiant de l'avis / consultation et identifiant source ;
- identifiant du lot et de la procédure quand ils existent ;
- acheteur et identifiant de l'acheteur ;
- titulaire publié et identifiant entreprise si disponible ;
- dates de publication, de décision/attribution et de récupération ;
- montant, devise, unité, nature du montant et caractère estimé/attribué lorsque la source le précise ;
- catégorie/métier et géographie de la prestation ;
- état du résultat : publié, non publié, inconnu, corrigé ;
- provenance et qualité du rapprochement avec le titulaire.

Un montant d'attribution ne doit pas être assimilé au chiffre d'affaires effectivement réalisé. Les données de titulaires publiées ne décrivent pas nécessairement tous les candidats ni toutes les offres reçues.

### C. Comptes annuels publiés

- SIREN de rattachement et identifiant du dépôt ;
- exercice, date de clôture, date de dépôt/publication ;
- code de confidentialité / disponibilité ;
- nom, valeur numérique, devise et unité de chaque indicateur publié ;
- source documentaire et lien vers le document quand la réutilisation le permet ;
- statut : publié, confidentiel, absent, non trouvé, illisible, à contrôler ;
- date de collecte et version d'extraction.

Ne jamais convertir « non publié », « confidentiel » ou « non trouvé » en zéro. Ne comparer que des exercices compatibles et signaler les changements de périmètre comptable.

### D. Événement d'entreprise / BODACC

- identifiant d'annonce, type d'événement, date de publication et date de l'événement si connue ;
- entreprise liée par identifiant fiable quand disponible ;
- extrait factuel et URL de la publication ;
- statut de vérification, date de contrôle et source ;
- interprétation commerciale éventuelle, conservée dans un champ séparé et explicitement marquée comme hypothèse.

Un événement de cessation ou de procédure collective ne prouve pas qu'un local est disponible à la vente ou à la location.

### E. Signal emploi et signal immobilier

Ces deux domaines doivent rester des objets séparés. Conserver l'identifiant de l'annonce, la source autorisée, le lieu, le métier/type de bien, les dates, le statut de fraîcheur et la preuve de publication. Une annonce d'emploi peut suggérer une compétence recherchée ; elle ne prouve pas à elle seule une intention d'achat. Une donnée DVF décrit une transaction passée et non une annonce actuellement disponible.

### F. Indicateur calculé

Chaque statistique publiée doit être une entité documentée, comprenant :
- `metric_id`, nom, définition métier et version de formule ;
- période, périmètre territorial, secteur et population de référence ;
- numérateur, dénominateur et effectif utilisé si applicables ;
- sources, versions de jeux, date de calcul et date de mise à jour ;
- nombres inclus, exclus, non rapprochés et manquants ;
- statut qualité : provisoire, contrôlé, insuffisant ou retiré ;
- distinction entre observation, calcul, estimation et commentaire ;
- avertissement visible et conditions minimales de publication.

## 4. Contrat de qualité et garde-fous

1. **Identité :** privilégier SIREN/SIRET ; documenter les rapprochements incertains et ne pas fusionner automatiquement sur le nom seul.
2. **Temps :** conserver date de publication, date d'événement, date de collecte et période de référence séparément.
3. **Données manquantes :** distinguer absent, confidentiel, non applicable, erreur d'import et zéro observé.
4. **Couverture :** publier le périmètre temporel, territorial, sectoriel et les sources couvertes ; absence de résultat ne signifie pas absence de fait.
5. **Reproductibilité :** versionner la formule et les jeux de données ; un tiers autorisé doit pouvoir recalculer le résultat.
6. **Interprétation :** séparer faits sources, transformations, inférences et validation humaine.
7. **Droits :** vérifier licence, conditions API, réutilisation commerciale, données personnelles et règles de prospection pour chaque source et finalité.
8. **Sécurité :** ne pas exposer de données personnelles ou documents non publics dans les tableaux de bord, exports ou rapports.
9. **Publication :** masquer ou retirer un indicateur si sa couverture ou sa qualité est insuffisante ; afficher une date de mise à jour.
10. **Décision commerciale :** aucun score opaque ne doit être présenté comme vérité ou recommandation définitive.

## 5. Indicateurs de première version autorisables sous réserve de données suffisantes

- nombre d'entreprises/établissements identifiés par secteur et territoire, avec date de référence et couverture ;
- nombre d'attributions publiées dans le périmètre et la période ;
- nombre de titulaires et acheteurs distincts identifiés ;
- répartition descriptive des attributions et montants publiés, en explicitant leur nature ;
- nombre et proportion de rapprochements exacts, candidats et non résolus ;
- évolution du chiffre d'affaires publié sur exercices comparables, avec effectif de comptes disponibles ;
- nombre d'événements publiés par type et période ;
- indicateurs agrégés d'emploi issus de sources dont l'accès et la réutilisation ont été validés.

Ne pas publier sans données adaptées : taux de réussite aux appels d'offres, « n'a jamais gagné », solvabilité, rentabilité, probabilité de défaillance, capacité d'exécution, intention d'achat, disponibilité d'un local.

## 6. Conditions de passage à l'implémentation

- [ ] Le propriétaire produit et la licence/les conditions d'accès de chaque source sont documentés.
- [ ] Un échantillon réel, daté et autorisé est récupéré ; la méthode est reproductible.
- [ ] Les champs réels sont comparés au modèle et les conversions sont documentées.
- [ ] Les identifiants et les taux de rapprochement sont contrôlés manuellement sur un échantillon.
- [ ] Les données manquantes, doublons, mises à jour et retraits ont des états définis.
- [ ] Les indicateurs sont recalculés deux fois à partir du même jeu et donnent les mêmes résultats.
- [ ] Les limites de couverture et avertissements sont visibles dans le rapport.
- [ ] Les droits de réutilisation et les finalités de traitement ont été validés avant commercialisation.

## 7. État de vérité

Cette cartographie est issue de la lecture du code et des documents présents sur la branche au 1er novembre 2026. Elle constate l'existence du schéma d'opportunité et du prototype de qualification. Elle ne prétend pas que le modèle statistique décrit ci-dessus est déjà implémenté, qu'un échantillon de données réelles a été ingéré, que les API fonctionnent en production ou que les droits de réutilisation sont validés.
