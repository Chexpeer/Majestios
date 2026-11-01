# Modèle de valorisation des données et études commerciales — MajestiOS

**Statut :** proposition fonctionnelle à valider  
**Périmètre :** documentation et conception uniquement ; aucune offre commerciale ni collecte nouvelle n'est activée par ce document.

## 1. Vision

MajestiOS ne doit pas seulement agréger des annonces. La plateforme peut transformer des données d'entreprises, de marchés publics, d'emploi, d'établissements, d'événements économiques et d'immobilier professionnel en indicateurs lisibles et en études utiles à la décision.

La valeur proposée vient du croisement documenté de sources, de l'historique, de la contextualisation territoriale et sectorielle, de l'explicabilité des résultats et de la fraîcheur des informations — pas de la simple revente brute de données.

## 2. Familles d'indicateurs et de visualisations

### 2.1 Accès aux marchés publics
- Nombre de marchés attribués identifiés par secteur, territoire, acheteur et période.
- Montants publiés des marchés attribués, lorsque comparables et disponibles.
- Nombre d'acheteurs distincts et concentration des attributions.
- Répartition des titulaires par taille, activité et territoire lorsque les données permettent cette segmentation.
- Évolution dans le temps et cartographie territoriale.
- Couverture des données et part d'attributions pour lesquelles l'identification du titulaire reste incertaine.

**Limite obligatoire :** les données d'attribution ne recensent pas nécessairement toutes les candidatures. Sans données fiables sur les candidatures non retenues, MajestiOS ne doit pas calculer ni annoncer un « taux de réussite » individuel. L'absence de marché identifié ne prouve pas l'absence d'expérience.

### 2.2 Profils d'entreprises et dynamique économique
- Chiffre d'affaires publié par exercice, évolution entre exercices comparables et date de publication.
- Effectifs ou tranches d'effectifs lorsque disponibles.
- Créations, cessations, procédures collectives, changements d'établissement et autres événements publiés.
- Présence géographique et évolution du réseau d'établissements.
- Mise en regard avec les marchés attribués, les recrutements et les opportunités pertinentes.

Ne jamais confondre chiffre d'affaires, bénéfice, trésorerie, capacité d'exécution, solvabilité ou intention de candidater. Une variation isolée ne doit pas déclencher automatiquement une conclusion défavorable.

### 2.3 Emploi, immobilier professionnel et signaux sectoriels
- Tendances d'offres d'emploi par métier, bassin d'emploi et période.
- Signaux relatifs aux locaux professionnels à examiner après certains événements d'entreprise.
- Évolutions sectorielles et territoriales utiles aux entreprises, recruteurs, professionnels de l'immobilier et conseils.

Un événement juridique n'établit pas qu'un local est disponible ou à vendre. Toute opportunité immobilière doit être corroborée par une source appropriée. Les données d'emploi et immobilières doivent conserver leur source, leur date et leurs conditions de réutilisation.

## 3. Produits et modèles de revenus possibles

### A. Tableau de bord professionnel par abonnement
- Veille personnalisée par activité, code postal/département, acheteur, type d'opportunité et période.
- Alertes et historique.
- Profil d'entreprise documenté et indicateurs comparatifs.
- Export et partage selon le niveau d'abonnement.

### B. Études ponctuelles
- Étude d'un secteur dans un département ou un bassin d'emploi.
- Cartographie des acheteurs publics et des entreprises attributaires identifiées.
- Analyse de l'évolution des attributions, des recrutements ou des créations/cessations.
- Étude de marché pour une entreprise qui souhaite s'implanter sur un territoire.

Chaque étude doit afficher sa période, son périmètre, ses sources, sa date d'extraction, ses limites et la méthode de calcul.

### C. Rapports et observatoires sectoriels
- Baromètres périodiques par métier ou territoire.
- Comparaisons historiques.
- Indicateurs de concentration, de dynamisme et de couverture des données.
- Publications gratuites synthétiques pouvant soutenir la notoriété, et éditions professionnelles approfondies payantes.

### D. Services d'analyse et d'accompagnement
- Diagnostic de positionnement commercial.
- Repérage de marchés pertinents.
- Accompagnement à la réponse aux appels d'offres.
- Analyse de développement territorial, partenariats ou recrutement.
- Rapports adaptés aux besoins d'acteurs immobiliers professionnels ou de cabinets de conseil, sous réserve de données adéquates et d'un cadre de réutilisation validé.

### E. Accès API ou licence de données enrichies — phase ultérieure
Possible uniquement après validation des droits de chaque source, des obligations d'attribution, des limites de redistribution, des droits sur les bases et des garanties de protection des données. Priorité à la commercialisation d'indicateurs et d'analyses à valeur ajoutée plutôt qu'à la revente indifférenciée de données brutes.

## 4. Segmentation commerciale des entreprises

Prévoir au minimum trois parcours, révisables et explicables :
1. **Conquête / accompagnement** : peu de marchés publics attribués identifiés dans les sources et la période étudiées, avec données suffisamment couvertes pour soutenir ce constat.
2. **Développement** : expérience visible, recherche de nouveaux acheteurs, territoires ou segments de marchés.
3. **Qualification à approfondir** : données insuffisantes, identité incertaine, historique incomplet ou signaux contradictoires.

Ces profils orientent des recommandations, mais ne constituent ni une certification de capacité ni une décision automatique d'éligibilité. Ils ne doivent pas entraîner d'exclusion automatique d'un marché ou d'une entreprise.

## 5. Exigences statistiques et qualité des données

Chaque indicateur ou graphique doit conserver :
- définition exacte et formule ;
- unité, période, zone géographique et population couverte ;
- sources et références/identifiants d'origine ;
- date de collecte et date de dernière mise à jour ;
- méthode de dédoublonnage et de rapprochement d'identités ;
- données manquantes, limites de couverture et taux d'identification ;
- distinction entre fait sourcé, calcul, estimation et interprétation ;
- niveau de confiance justifié et avertissement de comparabilité.

Règles :
- Une donnée manquante n'est jamais remplacée par zéro.
- Ne pas comparer des périodes, périmètres ou unités non comparables sans le signaler.
- Ne pas afficher de taux sans dénominateur documenté.
- Ne pas transformer une corrélation en causalité.
- Ne pas publier de classements individuels trompeurs fondés sur des données incomplètes.
- Éviter la réidentification d'entreprises ou de personnes à partir de petits groupes statistiques lorsque cela crée un risque ; définir des seuils de publication adaptés.
- Toute correction doit laisser une trace datée dans l'historique.

## 6. Réutilisation, conformité et commercialisation

Avant toute mise en production ou vente :
1. Tenir un registre source par source : licence, conditions d'API, attribution, fréquence, quotas, autorisation de stockage, redistribution et usage commercial.
2. Vérifier séparément les droits de réutilisation de la donnée source et les droits applicables à une base enrichie/structurée.
3. Distinguer données relatives aux personnes morales et données personnelles de dirigeants, entrepreneurs individuels ou contacts.
4. Pour les données personnelles, définir finalité, base légale, minimisation, durée de conservation, information, droits et règles de prospection ; ne pas considérer qu'une information accessible publiquement est libre de toute réutilisation.
5. Respecter les statuts de diffusion partielle, les oppositions et restrictions applicables.
6. Prévoir revue juridique avant vente de fichiers nominatifs, transmission à des partenaires, prospection ou lancement d'une API commerciale.
7. Ne jamais prétendre qu'un produit est conforme tant que les vérifications pertinentes n'ont pas été documentées.

Les données ouvertes peuvent être réutilisables, y compris commercialement, mais la licence de chaque jeu et les règles de protection des données restent à vérifier. Sources de cadrage à consulter :
- INSEE, base Sirene et API : https://www.insee.fr/fr/information/3591226
- BODACC, données ouvertes et API : https://www.bodacc.fr/pages/donnees-ouvertes-et-api/
- CNIL, réutilisation des données diffusées : https://www.cnil.fr/fr/comment-reutiliser-les-donnees-diffusees
- CNIL, données publiquement accessibles réutilisées à des fins commerciales : https://www.cnil.fr/fr/reutilisation-de-vos-donnees-publiees-sur-internet-des-fins-commerciales-quels-sont-vos-droits
- Guides data.gouv.fr sur les conditions de réutilisation : https://guides.data.gouv.fr/guides/reutiliser-des-donnees/introduction-a-lopen-data/comprendre-les-conditions-dutilisation-des-donnees-en-open-data

Ces références sont des points de départ, pas une validation juridique globale des sources ou d'un produit commercial précis.

## 7. Mise en œuvre progressive

**Étape 1 — Cadrage :** choisir un secteur et un territoire pilote, définir 5 à 10 indicateurs utiles et rédiger leur méthode de calcul.

**Étape 2 — Inventaire :** confronter chaque indicateur aux sources déjà recensées, aux champs disponibles, aux fréquences de mise à jour et aux droits de réutilisation.

**Étape 3 — Prototype interne :** générer quelques tableaux de bord sur un jeu de données vérifié, avec sources, dates, couverture et limites visibles.

**Étape 4 — Validation :** vérifier les rapprochements SIREN/SIRET, les doublons, les valeurs manquantes, les calculs, la fraîcheur et l'interprétation métier.

**Étape 5 — Pilote client :** tester l'utilité auprès d'un petit nombre d'utilisateurs, sans vendre de promesses de précision non mesurées.

**Étape 6 — Commercialisation :** choisir entre abonnement, étude ponctuelle, rapport périodique et API selon la valeur démontrée, les coûts d'exploitation et les droits validés.

## 8. Critères d'acceptation

- Chaque graphique est accompagné d'une définition, d'une période et d'une provenance.
- Les chiffres sont reproductibles à partir des données et de la méthode archivées.
- Les données manquantes et la couverture insuffisante sont visibles.
- Les entreprises ne sont pas classées comme « sans expérience » sur la seule base d'une recherche infructueuse.
- Aucun score n'est présenté comme une vérité absolue ou une décision d'éligibilité.
- Les restrictions de licence et de diffusion sont appliquées.
- Aucun fichier ou flux payant n'est lancé avant revue des droits et des obligations applicables.
- Les études publiées séparent clairement statistiques, interprétations et recommandations.

## 9. Décision de conception

Inscrire ce chantier comme **axe de valorisation des données de MajestiOS**, dépendant du registre des ressources CRM, du suivi économique des entreprises, de la qualité des données et de la validation juridique. Ce document ne signifie pas que les connecteurs, statistiques, tableaux de bord ou offres payantes sont déjà implémentés.
