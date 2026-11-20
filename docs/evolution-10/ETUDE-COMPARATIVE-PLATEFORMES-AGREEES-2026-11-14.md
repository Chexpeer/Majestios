# Étude comparative des plateformes agréées (PA) — lot P2-03 — 14 novembre 2026

**Statut :** première étude documentaire pour préparer le choix d'un partenaire. **Aucun partenaire sélectionné, aucun contrat, aucune intégration.** MajestiOS n'est pas une plateforme agréée ; la cible documentée est une intégration avec une ou plusieurs PA partenaires (voir `VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md`, `SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md`, `evolution-7/PHASE-2-CRM-CLIENTS-ARTISANS-FACTURATION-ELECTRONIQUE-RESEAU.md` §3).

## 1. Limites de cette étude (à lire d'abord)

- La **liste officielle** des plateformes agréées (impots.gouv.fr) n'a pas pu être consultée depuis l'environnement de travail. Les informations ci-dessous viennent de **pages commerciales et de comparateurs** : ce sont des sources secondaires, parfois promotionnelles, dont les prix et les statuts peuvent être périmés.
- **Avant toute prise de contact, toute décision ou tout message commercial**, le porteur (ou un tiers) doit vérifier chaque candidat sur la liste officielle : <https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees>.
- Aucune recommandation d'un fournisseur « meilleur » n'est faite : l'analyse technique (API réelle, bac à sable, cas d'usage), juridique et contractuelle n'a pas été conduite.

## 2. Ce que montre le marché (fin septembre 2026, selon un comparateur)

- Environ **147 plateformes** immatriculées définitivement selon un comparateur indépendant (à confirmer sur la liste officielle ; le comparateur signale lui-même quelques entrées « hors liste officielle »).
- Plusieurs se positionnent explicitement **pour les éditeurs de logiciels** : accès par API, « marque blanche » (le logiciel garde sa marque, la PA travaille en arrière-plan) ou « marque grise » (la PA reste visible).
- Les modèles de prix observés varient fortement : abonnement mensuel, forfait annuel par volume de documents, prix par facture (de l'ordre de quelques millièmes à un centième d'euro par facture pour les gros volumes selon une offre), paliers gratuits sur de petits volumes, ou **« sur devis »**.

## 3. Candidats qui déclarent une offre éditeur (API ou marque blanche)

À contacter pour **instruction**, sans présumer de leur qualité. Données indicatives, à confirmer par le fournisseur.

| Candidat | Modèle déclaré pour les éditeurs | Prix publiés (indicatifs) | Points à vérifier |
|---|---|---|---|
| B2Brouter | API, marque blanche (« solution compatible ») ou marque grise ; bac à sable avec la même adresse que la production | Page tarifs séparée | Statut sur la liste officielle, e-reporting, conditions éditeur |
| Serensia | Marque blanche pour éditeurs (API REST, webhooks, e-reporting, archivage) ; hébergement annoncé en France | Sur devis | Modèle économique, répartition des responsabilités, délai d'intégration |
| Iopole | API, intégrée ou marque blanche ; non vendue directement aux entreprises | Sur devis (paliers de volume) | Couverture des cas d'usage artisans, support |
| SUPER PDP | API ; prix par facture dégressif publié | de 0,01 à 0,0025 € HT par facture selon le volume (annoncé) | Statut officiel, e-reporting, niveau de service |
| Ademico, Billit, Flowie, Facnote | API pour éditeurs ; prix d'entrée publiés | de 0 € (petits volumes) à environ 720 €/an selon le fournisseur (annoncé) | Plafonds de volume, coûts cachés, statut officiel |
| Generix, TESSI, Docoon, EsaLink | Marque blanche ou revente pour éditeurs | Sur devis | Adaptation à de petits volumes par client |

## 4. Grille d'évaluation (dix critères, déjà arrêtés dans la phase 2)

1. Agrément vérifiable sur la liste officielle à jour.
2. Couverture des cas d'usage visés (artisans, TPE, B2B et B2C) et des obligations applicables.
3. API documentée, bac à sable, webhooks, mécanismes de reprise.
4. Formats, statuts du cycle de vie, rejets, e-reporting.
5. Sécurité, hébergement, sous-traitants, réversibilité, portabilité.
6. Prix (par entreprise, utilisateur, facture ou volume), frais fixes, coûts cachés.
7. Marque blanche, revente ou co-commercialisation.
8. Support, disponibilité, niveau de service, gestion des incidents.
9. Responsabilités, assurances, protection des données, conditions de sortie.
10. Possibilité de changer de partenaire sans enfermer les données ni l'expérience client.

## 5. Ce que cela implique pour le modèle économique

- Un **socle gratuit** pour l'artisan est envisageable seulement si le coût de la PA par client reste faible. Ordre de grandeur à vérifier par devis : un artisan qui émet 300 factures par an coûterait, au prix par facture annoncé par une offre, environ 0,75 à 3 € par an en transmission seule — hors abonnement éventuel, frais fixes et support. **Ce calcul est une illustration, pas une base de décision.**
- Les coûts de la PA ne doivent pas être masqués par la gratuité du CRM (vision §8).
- Aucune promesse de facturation électronique « gratuite et illimitée » avant contrat (phase 2 §3.3).

## 6. Démarche recommandée (la moins risquée)

1. **Vérifier** les candidats sur la liste officielle (porteur).
2. **Contacter 4 à 5 fournisseurs** avec l'offre de partenariat et le questionnaire de l'annexe (préparés le 14/11), en commençant par ceux qui publient un bac à sable ou des prix.
3. **Obtenir un accès bac à sable** et tester sans donnée réelle : émission, réception, rejet.
4. **Comparer** sur les dix critères et décider (décision du porteur, validation juridique).
5. Ne rien annoncer publiquement avant contrat (règle de vérité).

## 7. Annexe — questionnaire à adresser aux fournisseurs

1. Votre plateforme figure-t-elle sur la liste officielle, avec quelle date d'immatriculation ?
2. Proposez-vous un accès par API pour un éditeur de logiciel ? Documentation et bac à sable accessibles avant contrat ?
3. Quels modèles : marque blanche, marque grise, revente, co-commercialisation ?
4. Quels flux couvrez-vous : émission, réception, e-reporting (transactions et paiements) ?
5. Quel prix pour un volume de départ de quelques centaines d'entreprises clientes émettant chacune quelques dizaines à centaines de factures par an ? Frais fixes, minimums, coûts cachés ?
6. Comment gérez-vous les rejets, corrections, avoirs et statuts (webhooks, reprises) ?
7. Où sont hébergées les données ? Quels sous-traitants ? Quelle durée de conservation ?
8. Quelles conditions de sortie et de portabilité des factures et des preuves ?
9. Quel niveau de service, quel support, quelle procédure en cas d'incident ?
10. Quelle répartition des responsabilités et quelles assurances ?

## 8. Sources consultées (secondaires, 14 novembre 2026)

- Comparateur indépendant de plateformes agréées : <https://www.comparateur-facturation-electronique.fr/choisir-pdp/>
- Comparatif de plateformes (mise à jour avril 2026) : <https://www.codeur.com/comparatif/plateforme-agreee>
- Offre éditeur B2Brouter : <https://www.b2brouter.net/fr/api-facturation-electronique/>
- Offre marque blanche Serensia : <https://serensia.com/avis-d039expert/pourquoi-choisir-une-pa-en-marque-blanche/>
- Liste officielle (à consulter par le porteur) : <https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees>
