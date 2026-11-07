# PROMPT MAÎTRE — RÉCUPÉRATION INTÉGRALE DU CRM MAJESTIOS

**Objectif :** permettre à une IA qui reprend le projet, même après une perte de conversation, de retrouver la version du CRM MajestiOS la plus avancée réellement disponible, d'en reconstituer l'état complet et de préparer sa restauration sans perte.

> Ce prompt est un protocole de découverte et de restauration. Il ne remplace pas les sauvegardes physiques, les exports de données ni les secrets conservés dans un gestionnaire sécurisé. Une documentation seule ne peut pas recréer des données ou secrets qui n'ont jamais été sauvegardés.

---

## PROMPT À COPIER-COLLER DANS UNE NOUVELLE CONVERSATION

Tu reprends le projet **MajestiOS**, dépôt GitHub **Chexpeer/Majestios**. Ta mission prioritaire est de retrouver et sauvegarder **la version la plus avancée du CRM, dans sa totalité**, puis de pouvoir la restaurer sur une instance Supabase neuve si nécessaire.

Tu dois travailler comme un ingénieur de reprise après sinistre (disaster recovery), avec preuves et contrôles. Ne te fie jamais uniquement à une ancienne conversation, à un nom de branche ou à une documentation datée.

### 1. Retrouver la version la plus avancée

1. Identifie le dépôt, toutes les branches pertinentes, les tags, les commits récents, les PR et les déploiements associés.
2. Examine les branches candidates sans les modifier. Compare leurs commits et leur contenu.
3. Recherche tout le périmètre CRM, pas seulement les fichiers portant le mot « CRM » :
   - interface CRM, espace membre et parcours d'inscription/connexion ;
   - clients Supabase, configuration publique et variables d'environnement attendues ;
   - migrations SQL, schémas, tables, vues, index, contraintes et types ;
   - fonctions SQL/RPC, fonctions Edge et leurs versions déployées ;
   - politiques RLS, grants, rôles, triggers et fonctions privées ;
   - Storage, buckets et politiques, le cas échéant ;
   - tâches planifiées, webhooks, files, automatisations et intégrations, le cas échéant ;
   - tests, scripts de vérification, CI, documentation, décisions métier et audits.
4. Inspecte aussi les sauvegardes et exports disponibles dans les fichiers du projet, les conversations et les espaces de stockage accessibles.
5. Détermine la version la plus avancée **à partir de preuves** : code présent, migrations réellement appliquées, fonctions réellement déployées, tests exécutés et données réellement présentes.
6. Distingue explicitement : « présent dans Git », « appliqué à Supabase », « déployé », « testé », « opérationnel » et « non vérifié ». Un fichier versionné ne prouve pas qu'il est déployé.

### 2. Établir un inventaire exhaustif

Produis un inventaire daté avec, pour chaque élément : nom, emplacement, branche/commit ou projet source, version, état constaté, dépendances, méthode de sauvegarde et preuve de vérification.

Récupère notamment :
- toutes les migrations SQL, dans leur ordre exact ;
- le schéma réel de la base et l'historique des migrations appliquées ;
- le code complet des fonctions SQL et Edge ;
- les politiques RLS et permissions ;
- les configurations non secrètes et la liste des variables nécessaires ;
- les données métier et fichiers Storage, si présents et autorisés à l'export ;
- les tests et procédures permettant de vérifier la restauration.

Ne te limite jamais à un résumé ou à quelques fichiers téléchargés. Conserve les fichiers complets et leurs chemins.

### 3. Sauvegarder avant toute intervention

1. Crée un point de retour Git identifié (branche de sauvegarde et commit SHA) à partir de la meilleure version confirmée. Ne réécris pas l'historique.
2. Prépare une archive complète du code et de la documentation CRM.
3. Prépare les exports Supabase adaptés : schéma, données, migrations, fonctions, paramètres et fichiers Storage.
4. Vérifie que chaque archive est lisible et que les fichiers attendus sont présents. Calcule des empreintes SHA-256 lorsque l'environnement le permet.
5. Établis un manifeste de sauvegarde avec date, origine, taille, empreinte, contenu et limites.
6. Conserve les secrets (service role, clés privées, mots de passe, tokens) uniquement dans un gestionnaire sécurisé. Ne les affiche jamais dans les rapports, commits, captures d'écran ou fichiers publics. Documente leur nom, leur emplacement sécurisé et la procédure de rotation, jamais leur valeur.

**Interdiction absolue :** ne supprime, ne réinitialise, ne mets en pause et ne remplace aucun projet Supabase avant que le propriétaire ait confirmé que les sauvegardes nécessaires sont complètes, vérifiées et récupérables.

### 4. Préparer une restauration fidèle sur Supabase vierge

À partir des éléments sauvegardés :

1. Identifie les prérequis, extensions, région, version PostgreSQL et paramètres nécessaires.
2. Reconstitue la base avec les migrations dans l'ordre, en séparant clairement migrations appliquées et migrations en attente dans l'instance d'origine.
3. Redéploie les fonctions Edge à partir du code sauvegardé et configure les secrets requis via le canal sécurisé.
4. Reconstitue les rôles, grants, politiques RLS, fonctions, triggers, buckets et planifications.
5. Restaure les données et objets Storage uniquement à partir d'exports vérifiés et selon les autorisations applicables.
6. Adapte les URL, clés publiques, variables d'environnement et domaines au nouveau projet sans exposer de secret.
7. Ne copie jamais une clé privée ou un identifiant d'environnement de l'ancien projet dans le code client.

### 5. Vérifier que le CRM récupéré est réellement complet

Exécute et consigne des contrôles reproductibles :
- migrations et schéma conformes à l'inventaire ;
- fonctions SQL/RPC et Edge présentes dans les versions attendues ;
- tests d'authentification, inscription, connexion et récupération ;
- isolation multi-tenant et tests RLS entre deux organisations distinctes ;
- permissions par rôle, notamment rôle consultatif ;
- création, lecture, modification et historisation des entreprises, contacts, opportunités et activités ;
- contrôles des relations inter-organisations et des listes d'exclusion ;
- intégrité des données, pièces jointes et fichiers Storage ;
- tests CI, tests applicatifs et vérification des journaux ;
- absence de secrets dans le code client et les commits.

Un contrôle non exécuté doit être marqué « non vérifié », jamais « réussi ».

### 6. Préserver la doctrine CRM MajestiOS

Le CRM est le socle de capitalisation du développement commercial. Il doit préserver la provenance des informations, l'historique des actions, la qualification humaine, les relations entre entreprises et contacts, la séparation des organisations, les droits d'accès et les règles d'exclusion.

Ne confonds pas :
- organisation/tenant et statut commercial d'une entreprise ;
- prospect, client, partenaire et entreprise à exclure ;
- fondation technique et CRM réellement opérationnel ;
- détection d'une opportunité et qualification/validation humaine.

Respecte les décisions les plus récentes du propriétaire et les documents canoniques du dépôt. Toute contradiction doit être signalée, pas tranchée par supposition.

### 7. Livrables obligatoires

À la fin, fournis :
1. **Version CRM la plus avancée retrouvée** : branche, commit SHA, projet Supabase et preuves.
2. **Inventaire exhaustif** : code, migrations, fonctions, sécurité, données, fichiers, intégrations.
3. **Dossier de sauvegarde vérifié** : fichiers, manifeste, empreintes et limites.
4. **État de l'instance d'origine** : appliqué / en attente / déployé / testé.
5. **Procédure de restauration pas à pas** sur projet Supabase vierge.
6. **Rapport de recette** : tests réussis, échoués et non exécutés.
7. **Liste des secrets à reconfigurer**, sans jamais afficher leurs valeurs.
8. **Liste des risques ou éléments impossibles à récupérer**, avec explication précise.

### 8. Règle de conduite

Commence par l'audit et la récupération, pas par une reconstruction improvisée. Travaille par lots contrôlables, sauvegarde avant chaque changement risqué, vérifie chaque résultat et tiens la documentation à jour.

Ne supprime rien, ne déploie rien en production, ne fusionne aucune branche et n'engage aucune dépense sans autorisation explicite du propriétaire.

**Première action attendue :** établir l'état des lieux GitHub + Supabase, retrouver la version CRM la plus avancée, puis présenter le plan de sauvegarde intégrale avant toute opération destructive.

---

## État de référence connu au 7 novembre 2026

Ces repères servent uniquement de point de départ ; ils doivent être revalidés à chaque reprise :

- Dépôt : `Chexpeer/Majestios`.
- Branche de travail backend précédemment documentée : `evolution-5.0-clean-preview`.
- Projet Supabase précédemment documenté : `majestios-backend`, région `eu-west-3`, référence `awtgrjnpckgxsdpfrnhg`.
- Document d'état backend : [ETAT-BACKEND-SUPABASE.md](ETAT-BACKEND-SUPABASE.md).
- Migrations : `supabase/migrations/`.
- Fonction Edge : `supabase/functions/provision-client-workspace/`.
- Modules front CRM : notamment `crm.html`, `crm-page.js`, `crm-client.js`, `auth-espace-membre.js` et `supabase-config.js`.

**Limite connue :** l'état backend documenté le 6 novembre 2026 qualifiait Supabase de fondation technique, pas encore de CRM pleinement opérationnel. Il signalait notamment des migrations présentes dans Git mais non appliquées et une fonction Edge dont le code source n'avait pas encore été redéployé. Ces constats historiques ne doivent pas être considérés comme l'état du jour sans vérification.
