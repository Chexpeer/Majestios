# MajestiOS — synthèse (point d'entrée unique)

**Mise à jour :** 21 novembre 2026 (état courant : [état et orientation](evolution-12/ETAT-ET-ORIENTATION-2026-11-21.md)) · **Statut :** document de travail validé par le porteur du projet sur les points marqués « décidé ».  
Cette page remplace la lecture préalable des dossiers Evolution-5.0 à 8, conservés comme archives.

## 1. Mission en une phrase

Relier **développement commercial, gestion quotidienne, facturation électronique et accompagnement intelligent** dans un environnement tout-en-un, modulaire et ouvert, pour les artisans, TPE et PME. Parcours : Détecter → Comprendre → Qualifier → Décider → Agir → Gérer → Facturer → Capitaliser. Ambition produit, pas état livré. MajestiOS n'est pas une plateforme agréée (PA).

## 1 bis. Ambition et parcours client (décidé par le porteur, 16 novembre 2026)

**Ambition :** MajestiOS veut être la version **encore plus professionnelle et beaucoup plus efficace que LinkedIn** pour le développement commercial des entreprises, surtout du bâtiment et des services associés. Cette ambition guide les choix de produit ; elle ne figure pas telle quelle dans les textes publics (aucune comparaison de marque sur le site).

**Parcours en entonnoir :**
1. **Portes d'entrée publiques et gratuites** : appels d'offres publics, appels d'offres privés (annonces), réputation virtuelle, prospection. Les annonces gratuites sont le premier appât, juste avant les appels d'offres.
2. **Un espace personnel unique** (création gratuite) : passage obligé avant toute action ; ses titulaires accèdent aux quatre services quelle que soit leur porte d'entrée.
3. **Quatre services** : publier des annonces (gratuit, relues avant publication) ; audit de réputation virtuelle ; accompagnement aux appels d'offres ; achat de fichiers de missions de prospection (à construire : paiement, catalogue, validation juridique).
4. **Outils de l'équipe** : poste de pilotage, CRM interne, relecture des annonces, Cheexpeer (IA).
5. **Suite prévue** : CRM client et facturation électronique.

**Vocabulaire (à respecter dans tous les textes) :** un appel d'offres **public** est une procédure formelle d'un acheteur public (code de la commande publique, publicité officielle). La page « Appels d'offres privés » est **conservée** sous ce nom et affiche : « Chez MajestiOS, les appels d'offres privés n'ont de privés que le nom. » Détail et état d'avancement : [journal Evolution-10](evolution-10/CHARTE-CLAIRE-PALETTE-4-2026-11-15.md).

**Avant ouverture au public :** achat de fichiers, service d'envoi d'e-mails fiable (quota), textes juridiques (annonces d'emploi, données personnelles), recette complète du CRM sur Test, décision explicite de promotion vers la production. Aucun de ces points n'est réglé au 16/11/2026.

## 2. Où en est le produit (vérifié)

| Domaine | État réel |
|---|---|
| Site public (44 pages, statique, sources rangées en dossiers `pages/` depuis evolution-12, adresses inchangées) | En ligne en prévisualisation sur la branche de test ; fonds par rubrique, menu à 6 entrées, liens harmonisés ; recette sur appareil réel non faite |
| Recherche BOAMP / BODACC | Moteurs côté navigateur ; résultats réels à recetter par le porteur |
| Espace membre | Sur la branche de test : création d'espace par lien reçu par e-mail, puis activation obligatoire (mot de passe sécurisé et acceptation de la politique de confidentialité avant la date limite) ; connexion ensuite par mot de passe ; tableau de bord client ; la limite d'envoi d'e-mails de Supabase s'applique (messagerie personnalisée à prévoir). Recette de bout en bout par le propriétaire à faire ; rien en production (AUTH-01 levé sur la copie de test) |
| Marchés attribués | Base Test : 139 822 marchés des 6 derniers mois, annuaire des titulaires, chargement DECP par GitHub Actions ; prévisualisation seulement ; production à rejouer au moment de la fusion |
| CRM interne | Code et fondations Supabase présents ; recette multi-rôles non exécutée ; distinct du futur CRM client |
| Facturation électronique | Page d'information, calendrier, **diagnostic d'orientation en 4 questions** (sans stockage) sur la branche de test ; aucun module, aucune PA. Étude comparative des PA : [PA-01](evolution-10/ETUDE-COMPARATIVE-PLATEFORMES-AGREEES-2026-11-14.md) ; offre de partenariat rédigée, aucun partenaire retenu |
| Veille des créations (BODACC) | Page admin « Recherches ciblées » (propriétaire/administrateur) : 4 régions, bâtiment et hôtellerie-restauration, note de priorité expliquée, bouton « Veille des créations » ; lecture seule, rien n'est enregistré ; contrôle juridique avant lancement. [Parcours](evolution-10/PARCOURS-VEILLE-BODACC-CREATIONS-2026-11-14.md) |
| Cheexpeer | Assistant local de première génération sur le site ; audit de réputation avec Claude **testé de bout en bout sur MajestiOS-Test** (5 audits/jour/utilisateur) ; API de missions déployées sur Test, seule `readiness_probe` soumissible avant recette ; rien sur `majestios-crm` |

## 3. Décisions validées (14 novembre 2026)

- **Menu :** 5 rubriques de contenu (Appels d'offres · Développement commercial · Réseau · Services · Assistant) + menu « Accéder à mon espace personnel » (espace, création, accès VIP). Une rubrique = une place. Remplace la décision Evolution-7.
- **Espace personnel :** libellé « Accéder à mon espace personnel » ; une seule entrée « Mon espace personnel » dans le menu ; la création de compte se propose dans le formulaire de connexion (lien discret, sans création réelle avant la recette d'authentification) ; le bandeau de bas de page « Accéder à mon espace personnel » disparaît quand la personne est connectée.
- **Annonces :** 12 types (sous-traitance, emploi, location de matériel, immobilier, entreprise — cession ou reprise —, autres), chacun en offre et en demande. Chaque espace a sa pastille (« MON ESPACE » / « ESPACE ADMIN »).
- **Tableau de bord de l'espace personnel (connecté et activé) :** « Bonjour <prénom> », 4 chiffres sur les demandes, dernières demandes avec statut, suivi commercial des clients (pistes par étape et 5 prochaines actions, lecture seule, limité à la société du membre), puis les cartes de services. Ampoule verte « Connecté » sur toutes les pages. « Mes factures » est affiché grisé en attendant le partenaire de facturation électronique.
- **Fonds par rubrique** (13 WebP) et navigation discrète validés ; cube de l'accueil conservé.
- **BODACC :** annonces d'entreprises uniquement (créations, cessions, radiations, procédures).
- **Textes :** une ligne « En préparation. » au lieu des longs avertissements ; le détail des statuts vit ici et dans les registres.

## 4. Risques critiques et suite

Table tenue à jour dans [le dossier des anomalies critiques](CRITIQUES/README.md). Tout ce qui touche Supabase (migrations, policies, secrets, déploiement de fonctions) exige une **autorisation explicite** : le dépôt contient des correctifs préparés, rien n'est appliqué à distance.

## 5. Trajectoire

[Feuille de route stratégique](evolution-10/FEUILLE-DE-ROUTE-STRATEGIQUE-2026-11-14.md) : lots, prérequis, décisions à prendre, ce qui est déjà prêt. Références de fond : [vision 2026–2028](evolution-10/VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md), [plan de réalisation](evolution-10/PLAN-REALISATION-ET-MOYENS.md), [écart site / documentation](evolution-10/ETAT-REEL-SITE-ET-TRAJECTOIRE-2026-11-14.md).

## 6. Règles de vérité (inchangées)

Distinguer proposition, décision validée, code présent, build, déploiement et recette. Pas de promesse de capacité non déployée. CRM interne ≠ CRM client. Jamais de synchronisation automatique des deux projets Supabase. Pas de fusion, production ou PR sans décision du porteur. Détail : [AGENTS.md](../AGENTS.md).

## 7. Carte documentaire

| Niveau | Contenu | Usage |
|---|---|---|
| À lire | cette synthèse · [anomalies critiques](CRITIQUES/README.md) · [feuille de route](evolution-10/FEUILLE-DE-ROUTE-STRATEGIQUE-2026-11-14.md) | Toute intervention |
| Référence | `docs/evolution-10/` (registre, audits, spécifications Cheexpeer et facturation, vision, plan) | Sujet précis |
| Historique | [journaux](historique/JOURNAL-CRITIQUES-2026-11.md) · [Evolution-9 au 13/11](historique/JOURNAL-EVOLUTION-9-2026-11-13.md) · `docs/evolution-5.0` à `evolution-8` · `docs/historique` | Comprendre une décision ancienne ; jamais source d'état courant |
