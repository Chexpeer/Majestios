# Edge Function de contexte pour l'audit Cheexpeer — 9 novembre 2026

## Fonction livrée dans Git

`supabase/functions/reputation-audit-context/index.ts` expose un endpoint POST authentifié qui :
- vérifie la session de l'appelant avec Supabase Auth ;
- accepte uniquement un nom d'entreprise et, facultativement, un SIREN ;
- limite le corps de requête à 4 Ko ;
- appelle le connecteur vers le référentiel public d'identité des entreprises ;
- renvoie uniquement les preuves normalisées destinées à l'interface ;
- n'expose pas les identifiants techniques de connecteurs ni les résultats internes d'orchestration ;
- n'écrit aucune donnée en base.

Le code partagé est placé sous `supabase/functions/_shared/` pour éviter les imports de modules situés hors du périmètre des Edge Functions.

## Contrôles

- Authentification obligatoire et vérification effective de l'utilisateur.
- Méthode POST uniquement (hors préflight OPTIONS).
- Validation du nom et du SIREN.
- Type de contenu JSON obligatoire.
- Taille maximale de requête : 4 Ko.
- Aucun URL arbitraire fourni par l'utilisateur : le connecteur utilise un endpoint officiel fixe.
- En-têtes `Cache-Control: no-store`.
- Aucune clé service_role utilisée.
- Aucun accès aux tables CRM, memberships ou RLS.

## Tests

Le handler HTTP est isolé et testé avec authentification et transport simulés :
- utilisateur non authentifié refusé ;
- entrées invalides refusées avant tout appel externe ;
- réponse normalisée sans identifiants internes ;
- contenu non JSON et requête trop volumineuse refusés.

## Limites et activation

La fonction est uniquement présente dans le dépôt Git à ce stade. Elle n'est pas déployée dans Supabase et n'est pas encore appelée depuis l'interface Réputation virtuelle. L'API officielle confirme le contexte administratif de l'entreprise ; elle ne fournit pas une analyse de réputation en ligne.

Avant tout déploiement : vérifier les secrets de configuration disponibles, les paramètres CORS et JWT du projet, les conditions d'accès de l'API amont, puis effectuer un test authentifié dans un environnement non-production. Aucun déploiement n'est inclus dans ce lot.


## Extension — contexte légal BODACC

Le connecteur BODACC est maintenant qualifié comme source automatique de contexte légal, à côté du référentiel d'identité DINUM. Il interroge le jeu officiel DILA `annonces-commerciales` par recherche plein texte sur le champ `commercant`, avec une limite de dix annonces et une sélection de champs minimisés.

Les annonces BODACC sont traitées comme des **faits de publication**, jamais comme un score de réputation. L'extrait ne reprend pas les personnes physiques ; les limites rappellent que le texte intégral et le contexte juridique doivent être vérifiés. La réponse de l'endpoint authentifié peut donc contenir des preuves `business_identity` et `legal_event`.

Le dataset BODACC est proposé gratuitement par la DILA sous Licence Ouverte 2.0. La DILA avertit toutefois que les données peuvent contenir des données personnelles : la réutilisation doit respecter les obligations applicables. Cette intégration est bornée aux champs nécessaires à l'identification et au contexte de l'entreprise.
