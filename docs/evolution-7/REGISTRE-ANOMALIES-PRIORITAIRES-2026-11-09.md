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
| CRM-01 | **P1 — continuité métier** | Recherche / qualification vers CRM | Le ciblage DINUM lancé depuis le CRM interne dispose bien d'une intégration manuelle des candidats sélectionnés vers `businesses`, avec contrôle SIREN/SIRET, provenance et statut « à examiner ». En revanche, la page publique `prospection-active.html` et le moteur BOAMP/BODACC ne présentent pas de transfert direct vers le CRM ; aucun transfert automatique BODACC→entreprise CRM ou BOAMP→opportunité CRM n'est démontré. | Le parcours interne de ciblage est partiellement raccordé, mais les signaux externes restent à ressaisir et la circulation entre rubriques n'est pas continue. | Ouvert — préserver l'import manuel CRM existant ; concevoir des actions de transmission explicites depuis les pages publiques et les résultats BOAMP/BODACC, avec revue humaine, provenance et anti-doublon. Tester le parcours de bout en bout. |
| DATA-01 | **P1 — couverture des signaux** | Recherche BODACC | Le moteur demande au plus 100 annonces triées par date, puis applique localement les filtres de mots-clés et de famille. Aucune pagination BODACC n'est présente dans ce parcours. | Des annonces pertinentes plus anciennes que les 100 premières peuvent être absentes ; la couverture réelle est limitée à un échantillon récent. | Ouvert — filtres serveur adaptés, pagination contrôlée et indication du périmètre réellement interrogé. |
| DATA-02 | **P2 — exhaustivité d'affichage** | Recherche mixte BOAMP/BODACC | La recherche « publics et privés » répartit le plafond de 10 résultats en 5 maximum par source. | Résultats tronqués sans pagination ni indication d'un total consultable. | Ouvert — pagination ou chargement progressif et indication du plafond par source. |
| DATA-03 | **P1 — disponibilité fonctionnelle** | Taxonomie opportunités privées | Immobilier, emploi et sous-traitance sont explicitement déclarés non connectés ; le moteur renvoie un message d'indisponibilité. | Ces familles ne constituent pas encore des moteurs opérationnels malgré leur présence dans la taxonomie. | Ouvert — connecter des sources adaptées ou afficher clairement ces rubriques comme prévues/non disponibles. |

| CRM-02 | **P1 — traçabilité** | Création de fiches CRM | La fonction générique `create()` de `crm-client.js` insère entreprises, contacts et opportunités, mais n'ajoute pas d'activité d'historique. Les migrations inspectées définissent l'historique comme append-only et ne montrent pas de déclencheur de journalisation automatique pour ces créations. | Une fiche peut être créée sans événement d'origine dans l'historique commercial ; l'audit de qui a créé quoi et pourquoi est incomplet. | Ouvert — définir un enregistrement atomique ou une stratégie compensatoire pour la création et son événement d'historique ; tester entreprises, contacts, opportunités et import DINUM. |

## Détail de l'anomalie AUTH-01

Le code de `auth-espace-membre.js` appelle Supabase Auth pour demander et vérifier un code à six chiffres. Le test `tests/auth-espace-membre-otp.test.cjs` est un test de contrat statique : il vérifie la présence des appels et des éléments de formulaire, pas l'envoi effectif d'un e-mail ni la validation contre un service Auth réel.

La documentation `docs/evolution-6/AUTHENTIFICATION-OTP-ESPACE-MEMBRE-2026-11-09.md` confirme que restent à faire : test d'intégration Supabase local, vérification du modèle e-mail et des paramètres OTP distants, déploiement de la fonction de provisionnement en environnement de test, tests Auth/RLS multi-identités et validation avant activation métier.

**Décision de gouvernance :** ne pas annoncer le système OTP comme opérationnel tant que ces critères ne sont pas validés. Ne pas déployer de fonction, appliquer de migration, modifier les paramètres Auth ni créer de données de test dans le projet Supabase métier sans autorisation explicite.

## Règles de mise à jour

- Chaque anomalie doit avoir un identifiant stable, une priorité, une preuve, un impact, une action attendue et un statut.
- Statuts : Ouvert, En cours, Corrigé à vérifier, Validé, Bloqué.
- Après correction, exécuter les tests concernés et les non-régressions avant de changer le statut en Validé.
- Conserver la date, le commit et les liens de preuve lors de chaque mise à jour.


## Précision audit CRM — 9 novembre 2026

Le contrôle de `crm-page.js` révèle un import manuel déjà implémenté dans le poste CRM interne : le collaborateur sélectionne des candidats issus du ciblage APE/NAF, le code contrôle les SIREN/SIRET via `findBusinessesByIdentifiers`, puis appelle `MajestiosCRM.createBusiness`. La fiche est créée avec la source DINUM, les critères de ciblage, les motifs et le statut `to_review`. Les doublons détectés sont refusés ; les échecs sont remontés individuellement. Ce parcours est une capacité réelle du code, mais son fonctionnement distant reste soumis à une recette avec un compte et des données de test autorisés.

En revanche, `prospection-active.html` charge `company-targeting-page.js` et les scripts de ciblage mais ne charge pas `crm-client.js` ; `prospection-member-client.js` expose un adaptateur de recherche membre, explicitement décrit comme non raccordé à la page tant que l'endpoint hébergé n'a pas été vérifié et que la bascule n'a pas été autorisée. Le moteur `opportunity-search.js` ne référence ni `MajestiosCRM`, ni `createOpportunity`, ni `createBusiness` : les annonces BOAMP/BODACC conduisent à Contact, pas à une création CRM.

**Conclusion corrigée :** ne pas affirmer que tout ciblage entreprise est déconnecté du CRM. L'import manuel DINUM depuis le CRM existe ; ce sont les transferts inter-rubriques/public→CRM et les conversions BOAMP/BODACC→CRM qui restent absents ou non démontrés.
