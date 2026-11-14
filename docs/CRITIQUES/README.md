# Dossier de suivi des anomalies critiques — MajestiOS

> **Point d'entrée obligatoire pour tout agent IA ou développeur intervenant sur MajestiOS.** Lire d'abord [la synthèse](../SYNTHESE-MAJESTIOS.md), puis ce fichier, puis le registre détaillé.

## 1. Où trouver les informations

- **Registre actif Evolution-9 :** [REGISTRE-ANOMALIES-EVOLUTION-9.md](../evolution-9/REGISTRE-ANOMALIES-EVOLUTION-9.md)
- **Guide de prise en main IA :** [GUIDE-PRISE-EN-MAIN-IA-MAJESTIOS.md](../GUIDE-PRISE-EN-MAIN-IA-MAJESTIOS.md)
- **Registre détaillé Evolution-8 :** [REGISTRE-ANOMALIES-EVOLUTION-8.md](../evolution-8/REGISTRE-ANOMALIES-EVOLUTION-8.md)
- **Historique Evolution-7 :** [REGISTRE-ANOMALIES-PRIORITAIRES-2026-11-09.md](../evolution-7/REGISTRE-ANOMALIES-PRIORITAIRES-2026-11-09.md)
- **Consignes obligatoires des agents :** [AGENTS.md](../../AGENTS.md)
- **Index documentaire général :** [docs/README.md](../README.md)
- **Référentiel Evolution-9 :** [README.md](../evolution-9/README.md)
- **Référentiel Evolution-8 :** [README.md](../evolution-8/README.md)
- **Audit de départ :** [AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md](../evolution-7/AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md)
- **Décisions de navigation héritées :** [REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md](../evolution-7/REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md)

Le registre Evolution-9 est la source de vérité des identifiants, preuves et critères de clôture. Le journal des états antérieurs de ce dossier est archivé dans [JOURNAL-CRITIQUES-2026-11.md](../historique/JOURNAL-CRITIQUES-2026-11.md).

## 2. Anomalies critiques vivantes — état au 14 novembre 2026

Légende : **Ouvert** · **Préparé** (correctif dans Git, non déployé, recette absente) · **Bloqué** (autorisation, accès distant ou décision manquants). Une correction de code ne clôt jamais un risque distant.

| ID | Prio | Sujet | État | Prochaine action et condition |
|---|---|---|---|---|
| AUTH-01 | P0 | Provisionnement OTP des membres : code présent, déploiement et recette E2E non démontrés | **Bloqué** | Autorisation ciblée sur `MajestiOS-Test` ; recette complète (redirections, e-mails, anti-abus). Prérequis de l'ouverture de la création d'espaces. |
| CRM-06 / CRM-03 / CRM-02 | P0/P1 | `majestios-crm` : droits UPDATE trop larges, historisation atomique absente | **Préparé** (migrations dans Git, non appliquées) | Sauvegarde, revue SQL, plan de retour arrière, autorisation explicite. |
| AUTH-02 | P1 | Preuve de prise de connaissance fondée sur `user_metadata` modifiable | **Ouvert** | Concevoir un reçu serveur horodaté et versionné (migration à autoriser). |
| AN-05 | P1 | Adresse admin codée en dur, CORS `*` (`bootstrap-internal-admin`) | **Préparé** le 14/11 : secrets `INTERNAL_ADMIN_EMAIL` et `INTERNAL_ALLOWED_ORIGINS`, repli historique conservé ; test `bootstrap-admin-hardening` | Déploiement + configuration des secrets, après revue ; tant que les secrets sont absents, le comportement reste l'ancien. |
| CRM-TRG-01 | P1 | Triggers d'intégrité en double (`MajestiOS-Test`) | **Bloqué** | Migration de nettoyage candidate documentée ; tests isolés NOT RUN ; jamais promue vers `majestios-crm`. |
| AN-14 / TEST-RLS-01 | P1 | RLS absente sur `private.reputation_audit_usage` (test) | **Bloqué** | Idem : activer RLS après tests sur copie. |
| AN-04 / ENV-PARITY-01 | P1 | Écart de migrations 22 / 39 entre les deux projets | **Ouvert** | Matrice de parité ; aucune synchronisation automatique. |
| CRM-05 / CRM-07 | P1 | Recette CRM multi-rôles et multi-tenant | **Bloqué** (NOT RUN) | Identités synthétiques de recette sur `MajestiOS-Test`. |
| AN-06 / CHX-06 | P1 | Cheexpeer non opérationnel de bout en bout | **Ouvert** | Voir synthèse : API de mission dans Git, déploiement et recette absents. |
| SEO-01…05 | P2 | Pas de `robots.txt`, ni `sitemap.xml`, ni `canonical` | **Corrigé en partie** le 14/11 : `robots.txt` et `sitemap.xml` ajoutés (domaine provisoire) | **Domaine canonique à décider** avant d'ajouter les balises `canonical`. |
| CTA-TEST-01 | P1 | « Créer mon espace personnel » sans création réelle | **Corrigé** (libellé honnête) | Création réelle après AUTH-01. |

Alertes Supabase complémentaires (WARN) : protection des mots de passe compromis désactivée sur `majestios-crm` ; RPC SECURITY DEFINER exécutable par `authenticated` sur le projet de test. Voir [l'audit CRM/Supabase](../evolution-9/AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md).

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

14 novembre 2026. Historique complet : [journal des critiques](../historique/JOURNAL-CRITIQUES-2026-11.md). Branche de test : voir [l'état réel du site](../evolution-9/ETAT-REEL-SITE-ET-TRAJECTOIRE-2026-11-14.md).
