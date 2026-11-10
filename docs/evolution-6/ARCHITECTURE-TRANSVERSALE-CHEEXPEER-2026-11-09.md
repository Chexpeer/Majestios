# Architecture transversale de Cheexpeer — 9 novembre 2026

**Statut : spécification cible, non preuve d'implémentation.** Les capacités décrites ici ne doivent pas être présentées comme opérationnelles sans réalisation, tests et preuves datées.

## 1. Vision

MajestiOS est la plateforme qui porte les rubriques, les services, le CRM, les données, les utilisateurs et l'administration. Cheexpeer est l'agent IA intégré à cette plateforme : il orchestre des compétences transversales et assiste les utilisateurs et les équipes, sans se substituer aux services métier, au CRM ni à l'autorité de l'Administration. Le moteur IA qui exécute ses tâches est une dépendance technique remplaçable, distincte de l'identité et des règles de Cheexpeer.

**Doctrine : une identité centrale, une connaissance cohérente de l'environnement, des compétences spécialisées orchestrées et des permissions strictement contrôlées.**

Cheexpeer doit comprendre MajestiOS dans son ensemble, mobiliser les compétences appropriées, faire circuler les informations pertinentes entre les rubriques, accomplir les missions autorisées et capitaliser les résultats.

## 2. Connaissance globale de l'environnement

Cheexpeer doit disposer d'une cartographie structurée et actualisée de :
- l'arborescence : espaces, rubriques, dossiers, pages et routes ;
- les fonctionnalités, parcours, dépendances et états réels ;
- l'architecture applicative, services, API, fonctions serveur et connecteurs ;
- les modèles de données, relations, événements, migrations et règles métier ;
- les identités, organisations, rôles, permissions et politiques RLS ;
- les contenus, annonces, métadonnées SEO et règles de publication ;
- les processus commerciaux, entreprises, contacts, opportunités et historiques ;
- les environnements de développement, test, preview et production ;
- les journaux, métriques, anomalies, décisions et preuves.

Chaque élément doit être qualifié selon un cycle explicite : prévu, spécifié, développé, testé, intégré, déployé, opérationnel. Une page présente ou une spécification ne prouve pas qu'une fonction est opérationnelle. La cartographie doit conserver sources, versions, dates et preuves.

## 3. Intelligence transversale et circulation de l'information

Les rubriques sont des espaces fonctionnels spécialisés, pas des silos. Cheexpeer doit comprendre leurs relations et orchestrer la circulation utile de l'information, sans ressaisie inutile.

### Cycle commun
1. Détecter ou recevoir une information.
2. Qualifier sa provenance, sa date, sa fiabilité, sa pertinence et sa sensibilité.
3. Rapprocher l'information des entités connues ; repérer doublons et contradictions.
4. Identifier les rubriques qui peuvent légitimement en bénéficier.
5. Distribuer l'information ou préparer une action dans le respect des droits.
6. Capitaliser l'information, ses liens, ses décisions et son historique.
7. Actualiser ou expirer les informations devenues obsolètes.

Chaque transmission conserve un identifiant, une origine, des dates, une finalité, un niveau de confiance, un statut et les destinataires autorisés.

| Événement | Rubriques susceptibles d'en bénéficier |
|---|---|
| Création d'une entreprise | Prospection, qualification, CRM, développement commercial |
| Signal économique | Veille, qualification, prospection, CRM selon les droits |
| Nouvel appel d'offres | Marchés publics, CRM, accompagnement AO |
| Référence chantier vérifiée | CRM, bibliothèque entreprise, mémoire technique, éditorial |
| Avis client vérifié | Réputation virtuelle, CRM, mémoire technique |
| Nouvel article ou annonce | Gestion éditoriale, SEO, rubrique métier concernée |
| Résultat d'audit SEO | Supervision, SEO, gestion éditoriale, administration |
| Nouvelle interaction commerciale | CRM, prospection, historique entreprise |

Ces circuits sont des objectifs d'architecture et non des intégrations réputées déjà actives.

Cheexpeer doit aussi comprendre les conséquences possibles d'une information. Exemple : une entreprise remporte un marché ; il peut proposer d'actualiser son historique, préparer une référence technique, repérer des opportunités connexes et rédiger un projet d'actualité. Les actions sensibles, externes ou publiées ne sont jamais déclenchées automatiquement par la seule détection d'un événement.

## 4. Mémoire et connaissance partagées

Les mémoires sont logiquement distinctes, reliées par des identifiants et soumises aux permissions :

- **Mémoire environnementale :** structure du site, architecture, rubriques, routes, services, dépendances, données et permissions.
- **Mémoire métier :** règles et méthodes de développement commercial, prospection active, CRM, SEO, réputation virtuelle, éditorial et appels d'offres.
- **Mémoire opérationnelle :** missions, étapes, résultats, anomalies, corrections, tests, décisions et approbations.
- **Mémoire relationnelle :** entreprises, organisations, contacts, interactions, opportunités, documents et références.

Exigences communes : provenance, horodatage, validité, confiance, distinction fait/hypothèse/recommandation, détection des doublons et contradictions, historique des corrections, rétention encadrée et cloisonnement strict des données internes et des données de chaque client.

**La mémoire ne vaut jamais autorisation d'accès.** Elle ne doit pas permettre de mélanger les données de clients différents.

## 5. Compétences spécialisées orchestrées

Les métiers sont des compétences spécialisées orchestrées par Cheexpeer ; elles ne constituent pas des agents autonomes concurrents et ne disposent pas de permissions propres qui contourneraient les droits de MajestiOS.

### 5.1 Gardien quotidien de la qualité
Surveiller pages, routes, liens, formulaires, traitements, erreurs JavaScript/serveur/API, performances, affichage multi-écrans, accessibilité et cohérence des fonctionnalités annoncées. Reproduire les anomalies, diagnostiquer, préparer des corrections en environnement isolé, tester et produire un journal des anomalies, corrections et résultats. Rechercher chaque jour des améliorations, notamment pour l'ergonomie et l'efficacité du CRM.

### 5.2 Responsable SEO et visibilité organique
- Auditer indexabilité, exploration, sitemap.xml, robots.txt, canonicals, redirections, titres, meta descriptions, hiérarchie Hn, URL, liens internes, contenus dupliqués, données structurées, performances, Core Web Vitals, mobile et images.
- Construire une stratégie d'intentions de recherche et de mots-clés, relier les requêtes aux pages et éviter la cannibalisation.
- Optimiser les contenus existants, le maillage interne et proposer de nouvelles pages utiles et cohérentes avec l'arborescence.
- Suivre impressions, clics, positions, indexation et conversions lorsque les outils sont réellement connectés.
- Exploiter Google Search Console et les outils analytiques après connexion et vérification de disponibilité.
- Produire rapports, alertes de régression et plans d'action priorisés.

Le SEO doit attirer des entreprises et professionnels pertinents et transformer la visibilité en contacts et opportunités commerciales, pas maximiser le trafic sans discernement. Ne jamais fabriquer des métriques ni promettre un classement.

### 5.3 Gestion éditoriale et annonces
Rédiger et actualiser pages, articles, actualités et annonces ; adapter ton, public et SEO ; vérifier les faits, dates, liens, images et droits ; préparer prévisualisations, programmation, publication après validation et archivage ; détecter les contenus obsolètes et mesurer les performances.

### 5.4 Accompagnement aux appels d'offres
Analyser le DCE (RC, CCTP, CCAP, critères, pièces, clauses éliminatoires et échéances) ; qualifier les capacités de l'entreprise ; préparer les pièces administratives (DC1/DC2 selon le cas, DUME, attestations et justificatifs) ; construire le mémoire technique critère par critère ; préparer et contrôler BPU/DPGF ; vérifier exhaustivité et conformité ; préparer le dépôt ; capitaliser les résultats.

La bibliothèque entreprise peut contenir présentation, compétences, moyens humains et matériels, qualifications, assurances, références, photos, satisfaction clients, méthodes et engagements vérifiés. Cheexpeer ne doit jamais inventer références, certifications, moyens, prix ou engagements. Prix, engagements financiers et dépôt définitif exigent une validation humaine explicite.

### 5.5 Réputation virtuelle
Analyser présence numérique, identité, présence Web et locale, avis, visibilité et concurrents. Les constats sont sourcés, datés et séparés des recommandations. Les rapports internes confidentiels ne sont pas publiés automatiquement. L'état réel du moteur reste défini par les documents d'implémentation Evolution 6 et leurs preuves.

### 5.6 Développement commercial et prospection
Détecter, qualifier, identifier les interlocuteurs, préparer la prise de contact, suivre et capitaliser. Les sources sont orchestrées en arrière-plan sans exposer de catalogue de fournisseurs. Une détection ne déclenche pas automatiquement une campagne externe.

## 6. Canal privilégié Admin ↔ Cheexpeer

### Finalité et accès
L'interface d'administration doit disposer d'un canal direct et permanent avec Cheexpeer : le poste de commandement intelligent de MajestiOS. Il est réservé aux comptes autorisés **owner/admin**. Les membres ordinaires ne doivent pas y accéder et ce canal ne doit jamais devenir une voie indirecte vers le CRM VIP.

Le contrôle est effectué côté serveur et par les politiques de données (dont RLS), jamais par le seul masquage d'un élément d'interface. Le privilège de pilotage ne constitue pas un accès illimité aux secrets ou aux données non nécessaires.

### Capacités de l'interface
1. **Dialogue :** poser des questions, demander des explications et conserver le contexte.
2. **Missions :** confier, prioriser, suivre, suspendre et reprendre des travaux.
3. **Supervision :** consulter l'état du site, du CRM, des services, connecteurs, erreurs, tests et alertes.
4. **Décisions :** approuver, refuser ou demander la modification d'une action proposée.
5. **Mémoire et historique :** retrouver missions, décisions, preuves, rapports et interventions.

L'admin peut demander un audit, une correction préparée, une optimisation SEO, un travail éditorial ou une analyse multi-rubriques. Cheexpeer cartographie les rubriques, données et dépendances concernées avant d'agir.

Le contexte d'une mission doit survivre aux sessions : demande, objectif, périmètre, décisions, étapes, résultats, blocages et suite. Cheexpeer peut signaler proactivement anomalies importantes, risques, opportunités et validations en attente selon des règles configurées.

### Séparation CRM
Le CRM initial reste réservé aux comptes **owner/admin**. Le canal privilégié ne contourne pas cette restriction. Les membres pourront disposer ultérieurement de leur propre expérience CRM, séparée du CRM VIP.

## 7. Orchestration d'une mission

Cycle commun :
1. comprendre et reformuler l'objectif ;
2. vérifier identité, rôle, périmètre et autorisations ;
3. cartographier rubriques, données, dépendances et compétences ;
4. définir plan, risques, prérequis et critères d'acceptation ;
5. collecter les informations nécessaires avec provenance ;
6. exécuter dans le niveau d'autonomie permis ;
7. vérifier, tester et contrôler les régressions ;
8. demander les approbations nécessaires ;
9. restituer résultats, preuves et limites ;
10. capitaliser et actualiser l'état de mission.

Prévoir idempotence lorsque possible, reprise sur erreur, contrôle des actions externes, quotas, coûts et indisponibilités des fournisseurs.

## 8. Autonomie et validation

- **Autonomie complète :** surveillance en lecture, audits, collecte autorisée de données publiques, diagnostics, analyses, recommandations, brouillons et rapports internes.
- **Autonomie encadrée :** modifications en branche ou environnement de test, tests, préparation de dossiers, prévisualisations et programmation non publiée.
- **Validation humaine obligatoire :** publication en production, communication externe engageante, campagne de prospection, dépôt définitif d'un appel d'offres, prix et engagements financiers, changements sensibles Auth/RLS/permissions, modifications de données réelles et actions irréversibles.

Une instruction conversationnelle ne neutralise jamais une règle de sécurité.

## 9. Sécurité, traçabilité et observabilité

- Contrôle serveur de chaque opération, moindre privilège et respect des rôles, organisations et RLS.
- Séparation des données MajestiOS, des données publiques et des données clients.
- Aucune fuite inter-tenant via mémoire, recherche, raisonnement ou rapports.
- Secrets dans des mécanismes sécurisés, jamais dans le dépôt ni les réponses de dialogue.
- Environnements test et production séparés ; aucune copie de données CRM réelles vers le test sans stratégie approuvée de minimisation/anonymisation.
- Journal de mission : demandeur, rôle, compétence et version, sources, preuves, actions proposées/effectuées/refusées, approbations, tests, erreurs, résultats et coûts mesurables.
- Ne pas recopier inutilement les secrets ou contenus sensibles dans les journaux.

## 10. Architecture logique cible

1. Interface de commandement Admin.
2. Passerelle d'identité et d'autorisation.
3. Orchestrateur central Cheexpeer.
4. Registre des compétences et contrats d'entrée/sortie.
5. Cartographie de l'environnement.
6. Couche de connaissance et mémoire.
7. Bus ou contrat commun de circulation d'informations.
8. Passerelle d'outils et connecteurs.
9. Moteur de politiques et d'approbations.
10. Observabilité, évaluation, coûts et reprise sur erreur.

Cette architecture est logique et indépendante du choix définitif de fournisseur. Elle ne signifie pas que tous ces composants existent déjà.

## 11. Feuille de route

- **Lot 1 — Cartographie :** inventaire vérifié des rubriques, fonctions, données, routes, services, permissions et dépendances.
- **Lot 2 — Contrats communs :** formaliser mission, événement, information, preuve, décision, approbation et journal ; harmoniser les contrats de transmission V5 existants plutôt que créer un doublon.
- **Lot 3 — Sécurité :** identité, accès owner/admin, cloisonnement VIP, contrôles serveur et tests RLS.
- **Lot 4 — Canal de commandement :** dialogue, missions, supervision, décisions et historique, d'abord en lecture/préparation.
- **Lot 5 — Orchestration et mémoire :** cycle de mission, compétences déclaratives, provenance et circulation contrôlée.
- **Lot 6 — Compétences :** surveillance du site et CRM, SEO et éditorial, accompagnement AO, réputation virtuelle, développement commercial selon dépendances et maturité réelle.
- **Lot 7 — Évaluation :** scénarios inter-rubriques, permissions, reprise, qualité, coûts et anti-régression.

## 12. Critères d'acceptation

- Cheexpeer retrouve structure et état vérifié sans confondre spécification et fonctionnement.
- Toute information transmise conserve provenance, date, confiance, finalité et droits.
- Les doublons et contradictions sont signalés, jamais écrasés silencieusement.
- Une mission multi-rubriques est planifiée, suivie et restituée avec preuves.
- Le canal Admin est inaccessible aux comptes non owner/admin, y compris via API.
- Le CRM VIP reste inaccessible aux membres ordinaires.
- Les actions sensibles exigent approbation et journalisation.
- Les tests démontrent l'absence de fuite inter-tenant et de contournement RLS.
- Aucune capacité n'est qualifiée d'opérationnelle sans preuve d'exécution réelle.

## 13. Articulation documentaire et état réel au 9 novembre 2026

Ce document complète le cahier des charges Cheexpeer, la vision IA transversale, le plan stratégique d'acquisition/circulation/CRM/IA, la matrice de circulation, le contrat commun de transmission, le module Administration IA, l'architecture Administration/CRM/Client et les documents techniques Evolution 6 de Réputation virtuelle. Les documents antérieurs restent traçables ; les contrats existants doivent être harmonisés, non dupliqués.

Le projet Supabase **MajestiOS-Test** (réf. qrlnnfjstoeliymxtkbk, région Francfort) existe et est actif, mais aucun déploiement ni modification n'y avait été effectué à la date de référence. Le projet CRM existant doit rester intact. Ne pas copier les données VIP en test sans plan approuvé.

La présente architecture est une spécification. Elle ne prouve pas l'existence d'un orchestrateur central complet, d'une mémoire transversale opérationnelle, d'un bus d'événements, du canal Admin intégré ou d'un moteur SEO automatisé. Chaque réalisation devra être prouvée par commits, tests adaptés et contrôles de sécurité. Aucun déploiement en production ni fusion n'est autorisé par la seule publication de ce document.
