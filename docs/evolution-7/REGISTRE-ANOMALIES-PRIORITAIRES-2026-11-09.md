# Registre des anomalies prioritaires — MajestiOS Evolution-7

**Date d'ouverture :** 9 novembre 2026  
**Branche :** `Evolution-7`  
**Règle :** ce registre distingue les anomalies confirmées des vérifications en attente. Une présence dans le code ou un test statique ne vaut pas preuve d'un service opérationnel en conditions réelles.

## Anomalies prioritaires

| ID | Priorité | Domaine | Constat | Conséquence | Statut / action attendue |
|---|---|---|---|---|---|
| AUTH-01 | **P0 — bloquant avant ouverture aux membres** | Authentification OTP / espace membre | Le flux front-end `signInWithOtp()` / `verifyOtp()` est implémenté, mais l'envoi réel, le modèle e-mail OTP, les paramètres d'expiration et limites de débit, ainsi que le parcours complet ne sont pas validés. La fonction Edge `provision-client-workspace` n'est pas confirmée déployée dans l'environnement de test. | Un utilisateur peut éventuellement vérifier son adresse et obtenir une session sans que son espace client soit provisionné ; la disponibilité et la sécurité du parcours complet ne sont pas garanties. | **Ouvert — recette E2E isolée requise.** Vérifier SMTP/modèle, émission, code valide/invalide/expiré, renvoi, connexion existante, provisionnement, idempotence, erreurs réseau et séparation des droits. Aucun changement Supabase métier sans autorisation. |
| FORM-01 | **P1 — conversion** | Formulaire Contact | Le formulaire valide et prévisualise localement mais n'envoie ni ne sauvegarde la demande. | MajestiOS ne reçoit pas les demandes de contact. | Ouvert — raccordement à une destination autorisée après confirmation de l'endpoint et recette de transmission. |
| FORM-02 | **P1 — conversion** | Candidature / Nous rejoindre | Le parcours conduit vers Contact ; dépôt de CV et candidature persistante non démontrés. | Les candidatures ne sont pas réceptionnées comme dossiers exploitables. | Ouvert — définir un flux distinct et un stockage sécurisé avant collecte de CV. |
| CRM-01 | **P1 — continuité métier** | Recherche / qualification vers CRM | Les résultats de recherche et de qualification ne sont pas automatiquement capitalisés dans le CRM dans tous les parcours. | Perte de traçabilité et ressaisie manuelle. | Ouvert — cartographier et tester chaque transfert, provenance et consentement. |
| DATA-01 | **P1 — couverture des signaux** | Recherche BODACC | Le moteur demande au plus 100 annonces triées par date, puis applique localement les filtres de mots-clés et de famille. Aucune pagination BODACC n'est présente dans ce parcours. | Des annonces pertinentes plus anciennes que les 100 premières peuvent être absentes ; la couverture réelle est limitée à un échantillon récent. | Ouvert — filtres serveur adaptés, pagination contrôlée et indication du périmètre réellement interrogé. |
| DATA-02 | **P2 — exhaustivité d'affichage** | Recherche mixte BOAMP/BODACC | La recherche « publics et privés » répartit le plafond de 10 résultats en 5 maximum par source. | Résultats tronqués sans pagination ni indication d'un total consultable. | Ouvert — pagination ou chargement progressif et indication du plafond par source. |
| DATA-03 | **P1 — disponibilité fonctionnelle** | Taxonomie opportunités privées | Immobilier, emploi et sous-traitance sont explicitement déclarés non connectés ; le moteur renvoie un message d'indisponibilité. | Ces familles ne constituent pas encore des moteurs opérationnels malgré leur présence dans la taxonomie. | Ouvert — connecter des sources adaptées ou afficher clairement ces rubriques comme prévues/non disponibles. |

## Détail de l'anomalie AUTH-01

Le code de `auth-espace-membre.js` appelle Supabase Auth pour demander et vérifier un code à six chiffres. Le test `tests/auth-espace-membre-otp.test.cjs` est un test de contrat statique : il vérifie la présence des appels et des éléments de formulaire, pas l'envoi effectif d'un e-mail ni la validation contre un service Auth réel.

La documentation `docs/evolution-6/AUTHENTIFICATION-OTP-ESPACE-MEMBRE-2026-11-09.md` confirme que restent à faire : test d'intégration Supabase local, vérification du modèle e-mail et des paramètres OTP distants, déploiement de la fonction de provisionnement en environnement de test, tests Auth/RLS multi-identités et validation avant activation métier.

**Décision de gouvernance :** ne pas annoncer le système OTP comme opérationnel tant que ces critères ne sont pas validés. Ne pas déployer de fonction, appliquer de migration, modifier les paramètres Auth ni créer de données de test dans le projet Supabase métier sans autorisation explicite.

## Règles de mise à jour

- Chaque anomalie doit avoir un identifiant stable, une priorité, une preuve, un impact, une action attendue et un statut.
- Statuts : Ouvert, En cours, Corrigé à vérifier, Validé, Bloqué.
- Après correction, exécuter les tests concernés et les non-régressions avant de changer le statut en Validé.
- Conserver la date, le commit et les liens de preuve lors de chaque mise à jour.
