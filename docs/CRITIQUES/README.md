# Dossier de suivi des anomalies critiques — MajestiOS

> **Point d'entrée obligatoire pour tout agent IA ou développeur intervenant sur MajestiOS.** Lire ce fichier avant toute modification, puis ouvrir le registre détaillé de la branche active.

## 1. Où trouver les informations

- **Registre détaillé Evolution-7 :** [REGISTRE-ANOMALIES-PRIORITAIRES-2026-11-09.md](../evolution-7/REGISTRE-ANOMALIES-PRIORITAIRES-2026-11-09.md)
- **Consignes obligatoires des agents :** [AGENTS.md](../../AGENTS.md)
- **Index documentaire général :** [docs/README.md](../README.md)
- **Décisions de refonte Evolution-7 :** [REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md](../evolution-7/REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md)

Le registre Evolution-7 reste la source de vérité pour les identifiants, constats, priorités, preuves et statuts. Ce dossier sert de porte d'entrée commune et ne doit pas maintenir une seconde copie du registre.

## 2. Anomalies actuellement suivies

| ID | Priorité | Domaine | État connu | Règle de traitement |
|---|---|---|---|---|
| AUTH-01 | P0 — avant ouverture aux membres | Authentification OTP et provisionnement | **Recette E2E non démontrée** | Ne pas modifier Auth, migrations, fonctions déployées ou données Supabase métier sans autorisation explicite. |
| AUTH-02 | P1 — conformité / traçabilité | Preuve de prise de connaissance | **Ouvert — contrôle serveur incomplet** | Vérifier côté Edge Function les métadonnées et la version du consentement ; ne pas déployer sans autorisation. |
| CRM-02 | P1 — traçabilité | Journalisation des créations CRM | **Correction à concevoir** | Définir et tester une écriture atomique ou une compensation avant toute écriture métier. |
| CRM-03 | P1 — intégrité des données | Privilèges UPDATE des tables CRM | **Ouvert — privilèges distants à confirmer** | Contrôler les privilèges réels puis révoquer le droit global et réaccorder une liste blanche de colonnes, uniquement après autorisation. |

Ces états sont ceux documentés dans le registre Evolution-7 au 9 novembre 2026. Ils ne constituent pas une affirmation de validation en environnement réel.

## 3. Règles obligatoires pour chaque agent

1. Identifier le dépôt, la branche et le commit HEAD ; travailler uniquement sur la branche explicitement autorisée.
2. Lire AGENTS.md, ce dossier, le registre détaillé et les décisions récentes liées au périmètre.
3. Vérifier le code actuel avant de reprendre un constat ancien : une anomalie peut avoir été corrigée depuis la dernière mise à jour du registre.
4. Qualifier chaque constat : anomalie confirmée ; évolution produit ; ou recette nécessitant un environnement, des identifiants, une source externe ou une autorisation.
5. Corriger au fur et à mesure uniquement les défauts dont la cause et la correction sont établies. Pour les risques de sécurité, d'authentification, de données ou de droits, arrêter avant toute opération sensible et demander l'autorisation nécessaire.
6. Après chaque correction : ajouter ou ajuster un test pertinent, exécuter les contrôles réellement disponibles, examiner le diff et noter les limites.
7. Mettre à jour le registre détaillé avec l'ID, la priorité, le constat, la preuve, le statut, les fichiers, le commit et les tests.
8. Ne jamais présenter un test statique comme une recette réelle, un déploiement Preview comme une mise en production, ni une fonctionnalité prévue comme opérationnelle.

## 4. Statuts normalisés

- **Ouvert** : anomalie confirmée, non corrigée.
- **En cours** : analyse ou correction commencée.
- **Corrigé à vérifier** : modification effectuée, preuve de validation insuffisante.
- **Validé** : correction et critères de non-régression vérifiés.
- **Bloqué** : une autorisation, un accès, une dépendance ou un environnement manque.

## 5. Autorisations et périmètre de sécurité

Sauf autorisation explicite du porteur du projet, aucun agent ne doit :
- fusionner une branche ou modifier main ;
- déployer ou promouvoir en production ;
- modifier la configuration, les politiques, les migrations ou les données Supabase métier ;
- changer les habilitations, les rôles ou les règles RLS ;
- supprimer une page, une fonctionnalité, une ressource ou une sauvegarde sans analyse de dépendances et point de retour.

## 6. Dernière actualisation

**Dernière indexation :** 9 novembre 2026 — registre complété avec AUTH-02 et CRM-03.
**Branche de travail autorisée dans le chantier en cours :** Evolution-7.
**Règle :** actualiser ce point d'entrée et le registre détaillé à chaque évolution significative des anomalies critiques.
