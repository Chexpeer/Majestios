# Exécution de l'analyse Cheexpeer via Vercel AI Gateway — 9 novembre 2026

## Architecture

Le parcours serveur prévu est :

1. Le navigateur envoie le nom de l'entreprise, le SIREN éventuel et les objectifs à `POST /api/reputation-audit-analyze`.
2. La fonction Vercel vérifie le jeton Supabase auprès de Supabase Auth.
3. Elle appelle l'Edge Function `reputation-audit-context` avec le même jeton utilisateur.
4. L'Edge Function collecte le contexte administratif officiel et les annonces BODACC, puis renvoie les preuves normalisées.
5. La fonction Vercel transmet uniquement ces preuves à Cheexpeer via Vercel AI Gateway.
6. Le module d'analyse valide la sortie structurée : références d'évidence, correspondance du sujet, catégories, faits/interprétations/hypothèses et recommandations liées aux constats.
7. Le rapport est renvoyé sans persistance automatique et reste soumis à validation humaine.

## Modèle et authentification

- Modèle par défaut : `anthropic/claude-sonnet-4.6`, identifiant vérifié dans le catalogue AI Gateway au 9 novembre 2026.
- Surcharge possible avec `CHEEXPEER_AUDIT_MODEL`, limitée aux identifiants Anthropic Claude.
- Authentification AI Gateway : `VERCEL_OIDC_TOKEN` fourni automatiquement par Vercel ; `AI_GATEWAY_API_KEY` est un mécanisme de secours pour les environnements qui ne disposent pas d'OIDC.
- Aucun secret ni jeton n'est codé dans le dépôt.
- La réponse est contrainte par un JSON Schema strict puis validée une seconde fois par le code MajestiOS.

## Contrôles

- Authentification Supabase obligatoire avant collecte et analyse.
- Aucun élément de preuve envoyé par le navigateur n'est accepté comme preuve d'audit : la collecte est relancée côté serveur.
- Aucun appel au modèle si aucune preuve n'a été collectée ; un état `insufficient_evidence` est retourné.
- Les preuves administratives et BODACC ne peuvent pas être utilisées seules pour produire un constat d'avis ou de réputation.
- Le prompt traite le contenu des preuves comme des données non fiables pour éviter les instructions injectées dans les pages ou extraits.
- Les erreurs de collecte ou d'analyse ne sont jamais transformées en faux rapport.
- Les réponses sont marquées `Cache-Control: no-store`.
- Durée maximale Vercel configurée à 60 secondes pour cette route.

## Coûts

La génération IA n'est appelée que lorsqu'au moins une preuve exploitable est collectée et qu'un utilisateur authentifié lance la demande. Vercel AI Gateway facture selon les tarifs du fournisseur et du modèle sélectionné. Aucun appel de génération réel n'a été lancé pendant le développement ou les tests CI.

## Statut d'activation

Le code de la fonction Vercel est ajouté au dépôt, mais n'est pas encore déployé ni raccordé à un bouton de l'interface. L'Edge Function Supabase `reputation-audit-context` est également présente dans Git mais non déployée. Le parcours ne peut donc pas encore être utilisé par un membre.

Avant activation :
1. valider la cible Vercel (plusieurs projets MajestiOS sont reliés au dépôt) et éviter les déploiements de prévisualisation inutiles ;
2. déployer l'Edge Function Supabase dans un environnement non-production ;
3. tester l'authentification et les deux connecteurs avec un compte autorisé ;
4. exécuter une seule analyse réelle, après validation du coût du modèle ;
5. vérifier les journaux et la restitution ;
6. n'activer le bouton de l'interface qu'après ces contrôles.

Aucune clé AI Gateway n'a été créée, aucun crédit n'a été consommé et aucun déploiement Vercel/Supabase n'est inclus dans ce lot.
