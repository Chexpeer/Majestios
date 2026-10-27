# MajestiOS — Centre de contrôle des intégrations et des secrets
## Spécification d'architecture — V0.1

**Statut :** conception, non implémentée  
**Branche de référence :** `architecture-v0-1`  
**Principe :** préparer les intégrations sans exiger de clé API ni prétendre qu'un service est déjà connecté.

## 1. Objectif

Prévoir un centre d'administration permettant de suivre les intégrations techniques de MajestiOS (IA, recherche Web, données d'entreprises, appels d'offres, e-mail, téléphonie, traduction et paiement ultérieur), tout en séparant clairement :
- l'interface d'administration ;
- les secrets d'authentification ;
- les adaptateurs qui appellent les fournisseurs ;
- les droits d'accès ;
- les métriques de consommation et de coût.

Ce centre est une fonction interne d'administration, pas une page publique ni une fonctionnalité disponible à tous les membres.

## 2. Règles de sécurité non négociables

1. **Aucune clé réelle dans Git.** Ne jamais committer de secret dans le code, la documentation, les fichiers d'exemple, les tickets ou les journaux.
2. **Aucun secret envoyé au navigateur.** Les clés sont utilisées exclusivement côté serveur. Ne jamais les inclure dans les props d'un composant client, une réponse API, le HTML ou un message d'erreur.
3. **Pas de stockage des clés dans une table accessible au client.** Ne pas enregistrer de secrets dans les tables applicatives Supabase, le profil utilisateur, les journaux ou une base exposée aux rôles client.
4. **Stockage dans un gestionnaire de secrets adapté.** Au démarrage, privilégier les variables d'environnement chiffrées de l'environnement de déploiement pour les secrets nécessaires au serveur. Pour un besoin de rotation et de gestion à plus grande échelle, étudier ensuite un gestionnaire de secrets dédié.
5. **L'interface ne révèle jamais la valeur complète.** Elle peut afficher « configuré / non configuré », le fournisseur, le dernier contrôle et un message d'erreur assaini. Une clé déjà enregistrée ne doit pas pouvoir être relue depuis l'interface.
6. **Écriture et rotation contrôlées.** Si une saisie de clé depuis l'interface est ajoutée ultérieurement, elle doit passer par une route serveur protégée, avec autorisation stricte, validation, protection contre les requêtes intersites selon le mécanisme d'authentification, et enregistrement direct dans un stockage de secrets dédié. Ne pas implémenter de saisie web tant que ce stockage sécurisé et son modèle de permissions ne sont pas définis.
7. **Moindre privilège.** Les clés doivent avoir les permissions minimales possibles. Séparer projets, clés ou budgets lorsque le fournisseur le permet.
8. **Journaux assainis.** Ne jamais journaliser les clés, les en-têtes Authorization, les chaînes de connexion, ni les corps contenant des données sensibles.
9. **Aucun faux statut.** Un service est « opérationnel » uniquement après un contrôle réel réussi. L'absence de clé doit apparaître comme « Non configuré », pas comme une erreur technique ou une connexion active.
10. **Pas d'action de production sans autorisation explicite.** La mise en place de cette architecture ne modifie pas les paramètres Vercel, les domaines, Supabase ni la production.

## 3. États à afficher

- **Non configuré** : aucun secret ou paramètre requis n'est présent.
- **À tester** : configuration présente, mais connexion non contrôlée.
- **Opérationnel** : contrôle serveur réel réussi récemment.
- **Erreur** : dernier contrôle réel échoué ; afficher un message assaini, jamais la réponse brute du fournisseur.
- **Désactivé** : intégration volontairement coupée.
- **Limite atteinte** : état à utiliser uniquement lorsqu'une limite est confirmée par une réponse du fournisseur ou une métrique fiable.

Chaque état doit comporter la date du dernier contrôle lorsqu'elle est disponible. Un simple test de présence d'une variable ne prouve pas que la clé est valide.

## 4. Catalogue initial des intégrations

Le catalogue ci-dessous est prévisionnel ; il ne confirme aucune connexion ni aucun abonnement.

| Identifiant logique | Usage | État initial attendu |
| --- | --- | --- |
| `ai_primary` | Copilote IA et analyse commerciale | Non configuré |
| `web_search` | Recherche Web et veille | Non configuré |
| `company_data` | Données d'entreprises et enrichissement | Non configuré |
| `public_tenders` | Consultation de la source officielle des marchés publics | À tester séparément |
| `email` | Notifications et e-mails transactionnels | Non configuré |
| `telephony` | Téléphonie IP et prospection assistée | Non configuré |
| `translation` | Traduction et fonctions multilingues | Non configuré |
| `payments` | Paiement et abonnements, à une étape ultérieure | Désactivé |

Les noms de fournisseurs et les variables d'environnement exactes seront décidés au moment de choisir chaque service. Ne pas ajouter des clés « au cas où » ni créer des comptes payants avant validation du besoin.

## 5. Architecture cible

### Interface d'administration
- Réservée à un rôle d'administration vérifié côté serveur.
- Affiche le catalogue, les états, le dernier test et les alertes.
- N'affiche jamais la clé complète.
- Les contrôles de rôle ne doivent pas reposer uniquement sur un élément masqué dans l'interface.

### Service serveur d'intégrations
- Expose une liste autorisée d'identifiants logiques ; aucun nom de variable arbitraire fourni par le navigateur.
- Lit les secrets depuis l'environnement serveur ou un gestionnaire de secrets.
- Appelle les fournisseurs par des adaptateurs dédiés.
- Retourne des résultats normalisés et assainis.
- Applique des délais d'attente, une gestion d'erreurs et des limites d'utilisation.

### Suivi de consommation
- Mesure les appels, les erreurs et les coûts uniquement lorsque des données fiables sont disponibles.
- Distingue estimation interne et coût facturé par le fournisseur.
- N'enregistre pas de contenu sensible des requêtes dans les métriques.
- Permettra ultérieurement des alertes de budget ; aucun seuil ne doit être présenté comme actif avant sa mise en œuvre.

## 6. Variables d'environnement

Les noms ci-dessous sont des exemples de conception, pas une liste à créer immédiatement :

- `AI_PROVIDER_API_KEY`
- `WEB_SEARCH_API_KEY`
- `COMPANY_DATA_API_KEY`
- `EMAIL_PROVIDER_API_KEY`
- `TELEPHONY_PROVIDER_API_KEY`
- `TRANSLATION_API_KEY`

Ne pas ajouter de préfixe public tel que `NEXT_PUBLIC_` aux secrets. Les fichiers `.env.example` peuvent contenir des noms de variables avec des valeurs vides, jamais des clés réelles. Le fichier local `.env.local` ne doit pas être versionné.

## 7. Séquence d'implémentation proposée

1. Valider cette spécification et le rôle d'administration disponible dans l'architecture actuelle.
2. Vérifier l'authentification et les permissions côté serveur avant d'ajouter une interface protégée.
3. Créer le catalogue des intégrations avec des états initiaux explicites, sans formulaire de saisie de secrets.
4. Définir une interface serveur commune pour lire la configuration et réaliser un test de connexion par fournisseur.
5. Connecter un premier service choisi et vérifier qu'aucune clé ne fuit dans le navigateur, les réponses ou les journaux.
6. Ajouter la rotation des clés, les alertes et le suivi des coûts selon les besoins réels.

## 8. Hors périmètre à ce stade

- Aucune clé API n'est fournie ou créée par ce document.
- Aucune page de saisie des secrets n'est encore implémentée.
- Aucun fournisseur payant n'est sélectionné.
- Aucun changement n'est apporté à Supabase, Vercel, aux domaines ou à la production.
- Aucun service n'est déclaré opérationnel sans test réel.
- Aucun prix, quota gratuit ou droit d'utilisation n'est présumé.

## 9. Critères d'acceptation avant mise en service

- Un utilisateur non administrateur ne peut ni consulter ni tester les intégrations.
- Aucun secret n'est livré au navigateur ou inclus dans les réponses API.
- Les secrets ne sont pas stockés dans les tables applicatives accessibles au client.
- Les erreurs et journaux ne révèlent pas les secrets.
- Une intégration non configurée est affichée comme telle.
- Un test ne peut être lancé que sur une intégration appartenant à une liste autorisée.
- Les vérifications automatisées (lint et build) passent avant toute proposition de fusion.
