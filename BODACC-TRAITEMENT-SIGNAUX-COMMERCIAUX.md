# BODACC — source de signaux commerciaux privés

Source officielle à intégrer : https://www.bodacc.fr/pages/annonces-commerciales-recherche/?sort=dateparution

## Rôle dans MajestiOS
Le BODACC alimente la rubrique **Marchés privés / Signaux d’opportunités commerciales**. Il ne doit pas être présenté comme un flux d’appels d’offres au sens strict : les annonces peuvent décrire des ventes et cessions, des procédures collectives, des créations/modifications d’entreprises ou d’autres événements légaux et commerciaux. Chaque annonce doit être classée selon son contenu réel.

## Parcours client
- Rechercher par type d’événement, activité, localisation et date lorsque les filtres de la source le permettent.
- Afficher un intitulé fidèle à l’annonce, l’entreprise concernée, la localisation, la date de publication, la catégorie d’événement, la provenance et un lien vers la source officielle.
- Expliquer pourquoi l’annonce peut constituer un signal commercial, sans garantir qu’un besoin d’achat existe.
- Permettre ultérieurement d’enregistrer un signal, demander une analyse ou créer une alerte. Tant que le compte et le stockage ne sont pas connectés, ne pas afficher ces actions comme déjà enregistrées.

## Traitement par les équipes MajestiOS
1. **Collecte** : enregistrer source, identifiant, URL officielle, date de collecte et date de publication.
2. **Normalisation** : séparer les faits explicitement publiés des annotations internes.
3. **Qualification** : attribuer une catégorie (cession/vente, procédure collective, création ou évolution d’entreprise, autre annonce) avec une confiance et une justification ; envoyer les cas ambigus à vérification humaine.
4. **Dédoublonnage et actualisation** : repérer les annonces déjà traitées et suivre les changements de statut.
5. **Hypothèse commerciale** : proposer des pistes possibles (ex. accompagnement à la reprise, travaux, équipements, conseil, recrutement, sous-traitance) uniquement lorsque les faits permettent de les envisager. Afficher cette piste comme une hypothèse, jamais comme un fait de l’annonce.
6. **Segmentation marketing** : bâtir des campagnes distinctes selon le type d’événement, le secteur, la zone et la pertinence ; documenter la justification de ciblage et les exclusions.
7. **Validation humaine** : vérifier la source, la pertinence et la conformité avant tout contact externe ou campagne. Aucune prise de contact ni campagne ne doit partir automatiquement à partir d’une simple inférence.
8. **Mesure** : suivre le volume collecté, taux de doublons, qualité de qualification, signaux validés, contacts autorisés, retours, conversions et demandes de retrait.

## Contrôles de confiance
- Ne pas inférer qu’une entreprise est en difficulté, acheteuse, solvable ou intéressée par une offre sans preuve appropriée.
- Les procédures collectives sont particulièrement sensibles : une annonce publique n’autorise pas un ciblage trompeur, intrusif ou opportuniste.
- Respecter les conditions d’accès, les droits de réutilisation, les règles de protection des données et les obligations applicables à la prospection B2B ; vérifier le fondement, la pertinence, l’information des personnes et l’opposition avant activation.
- Toujours conserver la provenance et la date de vérification ; retirer des résultats actifs les annonces obsolètes ou dont le statut ne peut pas être confirmé.

## État technique
Le lien officiel est identifié, mais la connexion automatisée au BODACC n’est pas déclarée opérationnelle à ce stade. Avant développement du connecteur, vérifier la disponibilité d’une API ou d’un flux réutilisable officiel, ses conditions et ses champs. Ne pas faire du scraping non validé ni supposer que la page de recherche constitue une API.
