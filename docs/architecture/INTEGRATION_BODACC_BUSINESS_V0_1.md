# Intégration BODACC au pôle Business — v0.1

## Décision produit
Le BODACC est une source structurante du pôle Business de MajestiOS, en particulier pour détecter des signaux de cession, vente, création, modification et procédures collectives. Il ne remplace ni un audit d'entreprise ni une vérification juridique, comptable ou financière.

## Implémentation de ce lot
- Route serveur `/api/bodacc` interrogeant l'API Explore v2 de la DILA, dataset `annonces-commerciales`.
- Recherche côté serveur uniquement, délai maximal de 9 secondes, quantité plafonnée et aucun résultat fictif en cas d'échec.
- Page `/business` avec recherche BODACC, provenance affichée et lien de vérification officielle.
- Assistant MajestiOS : les questions liées au BODACC, aux cessions et reprises déclenchent une recherche réelle via la route interne.
- La clé d'API n'est pas requise dans ce lot ; aucune clé secrète n'est exposée au navigateur.

## Qualité et limites
- Les champs du dataset peuvent évoluer ; le mapping essaie plusieurs variantes et prévoit des valeurs de repli.
- Le lien officiel générique est utilisé si l'API ne renvoie pas de lien d'annonce direct.
- Le moteur de recherche de l'assistant reste fondé sur des règles ; ce lot ne transforme pas le chatbot en LLM.
- Les annonces doivent être interprétées comme des signaux et vérifiées auprès de la source officielle.
- Réutilisation selon les conditions DILA/BODACC, Licence Ouverte 2.0 et exigences applicables aux données personnelles.

## Vérifications à effectuer
- Lint, contrôle TypeScript et build via GitHub Actions.
- Tester plusieurs recherches (nom de société, cession, commune) et l'indisponibilité de l'API.
- Confirmer les noms de champs réellement renvoyés par l'API en prévisualisation.
- Contrôle visuel desktop/mobile et vérification des liens de navigation avant fusion.
