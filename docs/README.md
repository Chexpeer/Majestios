# MajestiOS — documentation de référence

**Branche de travail :** `Evolution-9`  
**Date de référence :** 11 novembre 2026  
**Objectif :** offrir un point d'entrée court, cohérent et vérifiable pour comprendre la stratégie, l'architecture, l'état réel et les risques du projet.

## 1. Avant toute intervention

1. Lire le [registre central des anomalies critiques](CRITIQUES/README.md).
2. Lire le [référentiel Evolution-9](evolution-9/README.md).
3. Lire la [vision stratégique MajestiOS 2026–2028](evolution-9/VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md).
4. Lire le [plan de réalisation et les moyens](evolution-9/PLAN-REALISATION-ET-MOYENS.md).
5. Lire le [registre des anomalies Evolution-9](evolution-9/REGISTRE-ANOMALIES-EVOLUTION-9.md).
6. Consulter les spécifications spécialisées utiles au lot.

## 2. La vision en une phrase

**MajestiOS ambitionne de devenir le CRM tout-en-un qui relie le développement commercial, la gestion quotidienne, la facturation électronique et l'accompagnement intelligent, dans un environnement modulaire et ouvert.**

Le parcours de valeur :

**Détecter → Comprendre → Qualifier → Décider → Agir → Gérer → Facturer → Capitaliser.**

La formule « premier vrai CRM tout-en-un » exprime une ambition de différenciation, pas une affirmation concurrentielle démontrée.

## 3. Références canoniques actuelles

| Sujet | Référence | Rôle |
|---|---|---|
| Vision stratégique | [Vision MajestiOS 2026–2028](evolution-9/VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md) | Positionnement, publics, piliers, différenciation et modèle d'expérience |
| Réalisation | [Plan de réalisation et moyens](evolution-9/PLAN-REALISATION-ET-MOYENS.md) | Phases, dépendances, moyens, tests et indicateurs |
| Documentation | [Plan de synthèse documentaire](evolution-9/PLAN-SYNTHESE-DOCUMENTAIRE.md) | Hiérarchie des documents, statut des sources et méthode de consolidation |
| Architecture | [Architecture cible CRM tout-en-un](evolution-8/ARCHITECTURE-CIBLE-CRM-TOUT-EN-UN.md) | CRM natif/externe, facturation, Connect, Supabase et Cheexpeer — à consolider |
| UX | [Plan de refonte UX](evolution-8/PLAN-REFONTE-UX.md) | Accueil, navigation et parcours |
| Audit de l'existant | [Audit Evolution-7 du 11 novembre](evolution-7/AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md) | État vérifié du site, CRM interne, Supabase, Cheexpeer et Vercel |
| Phase CRM client | [CRM clients, artisans et facturation](evolution-7/PHASE-2-CRM-CLIENTS-ARTISANS-FACTURATION-ELECTRONIQUE-RESEAU.md) | Offre cible et séparation des CRM |
| Cheexpeer | [Cahier des charges détaillé](evolution-7/CAHIER-DES-CHARGES-DETAILLE-CHEEXPEER-2026-11-09.md) | Espaces, compétences, missions, gouvernance et critères d'acceptation |
| Exécution Cheexpeer | [Architecture d'exécution](evolution-7/ARCHITECTURE-EXECUTION-CHEEXPEER-2026-11-09.md) | Missions, étapes, outils, worker et états réels |
| Navigation | [Décisions de navigation Evolution-7](evolution-7/REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md) | Structure et arbitrages de navigation |

## 4. État produit — ne pas confondre vision et disponibilité

### Présent dans l'existant
- Site web statique avec moteurs de recherche et rubriques de développement commercial.
- CRM interne MajestiOS pour l'activité propre de MajestiOS.
- Code d'authentification OTP et fondations multi-tenant.
- Premiers modules et contrats techniques Cheexpeer.
- Première vitrine Evolution-8 et page d'information sur la facturation électronique.

### Non démontré comme opérationnel
- CRM client complet pour les entreprises utilisatrices.
- Cycle complet devis → intervention → facture → règlement.
- Module MajestiOS Facturation connecté à une PA.
- Connecteurs universels vers les CRM externes.
- Provisionnement membre OTP de bout en bout.
- Worker Cheexpeer exécutant des outils métier.
- Recette réelle de l'isolation multi-tenant et des rôles sur deux organisations.

Le détail et les conditions de clôture figurent dans les registres d'anomalies. Une page, un composant ou une migration présente dans Git ne prouve pas son déploiement ni son fonctionnement réel.

## 5. Documentation spécialisée et historique

Les dossiers `evolution-5.0`, `evolution-6`, `evolution-7` et `evolution-8` sont conservés pour leurs décisions, spécifications, audits et preuves datées. Ils ne doivent pas être supprimés pendant la synthèse. Lorsqu'une décision ancienne diverge d'une décision plus récente, vérifier l'arbitrage daté et la branche source avant de conclure.

La documentation détaillée reste dans les dossiers spécialisés ; cet index ne doit pas recopier leurs contenus. Le plan de synthèse Evolution-9 décrit les rapprochements à effectuer sans perte d'historique.

## 6. Règles de vérité

- Distinguer proposition, décision validée, spécification, code présent, déploiement et recette.
- Ne pas annoncer MajestiOS comme PA ; la transmission réglementaire doit passer par une PA partenaire.
- Ne pas promettre une connexion à tous les CRM externes.
- Ne pas confondre le CRM interne MajestiOS et le CRM de chaque client.
- Ne pas présenter les capacités Cheexpeer décrites comme déjà actives.
- Toute anomalie critique reste visible jusqu'à preuve de correction et de recette.
