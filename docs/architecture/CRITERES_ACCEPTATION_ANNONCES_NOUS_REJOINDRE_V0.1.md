# MajestiOS — Critères d’acceptation « Nous rejoindre » et annonces V0.1

**Statut :** critères de cadrage proposés, à confronter aux tomes de référence avant implémentation métier.  
**Branche :** `architecture-v0-1`  
**Principe :** le présent document ne vaut ni validation du modèle de données ni autorisation de migration ou de mise en production.

## 1. État actuel du prototype

L’interface publique comporte une entrée de navigation « Nous rejoindre » et trois cartes de présentation :
- veille et appels d’offres ;
- développement commercial ;
- proposer son expertise.

Ces cartes sont des exemples visuels. Elles ne représentent pas des missions ouvertes confirmées. Aucun parcours de candidature réel, enregistrement en base, envoi de courriel ou publication LinkedIn n’est activé par cette interface.

Les contrôles GitHub Actions du code de cette section et de ses styles sont terminés avec succès sur les commits `e85edf7` et `b118511` (ESLint et build). Cela valide la compilation, pas les parcours métier ni le déploiement Vercel.

## 2. Critères d’acceptation de la page publique

- **PUB-01 — Navigation :** l’entrée « Nous rejoindre » permet d’accéder à la section depuis la navigation principale.
- **PUB-02 — Responsive :** le contenu reste lisible sur mobile, tablette et ordinateur ; les cartes ne provoquent pas de débordement horizontal.
- **PUB-03 — Transparence :** toute carte de démonstration est identifiée comme exemple et ne prétend pas annoncer une mission réellement disponible.
- **PUB-04 — Catégories :** l’interface distingue au minimum mission freelance liée aux appels d’offres, mission de développement commercial et proposition d’expertise.
- **PUB-05 — Accessibilité :** les éléments interactifs sont accessibles au clavier, disposent d’un intitulé compréhensible et conservent un indicateur de focus visible.
- **PUB-06 — Non-régression :** les sections existantes de recherche publique, d’opportunités privées et de fonctionnement restent présentes et utilisables comme auparavant.
- **PUB-07 — Partage :** avant publication réelle, chaque annonce publiée possède une URL stable, partageable et une prévisualisation sociale cohérente avec son titre et sa description.

## 3. Critères métier des annonces dynamiques

- **ANN-01 — Typologie :** distinguer emploi salarié, mission freelance, collaboration commerciale, appel d’offres et autres types validés. Ne pas déduire un type uniquement du titre.
- **ANN-02 — Provenance :** chaque annonce conserve son origine : MajestiOS, membre autorisé ou source externe identifiée.
- **ANN-03 — Attribution :** une annonce externe n’est jamais présentée comme créée ou validée par MajestiOS si ce n’est pas le cas.
- **ANN-04 — Fraîcheur :** conserver les dates de publication, collecte et dernière vérification lorsqu’elles sont disponibles ; signaler ou masquer les annonces expirées selon la règle métier validée.
- **ANN-05 — Cycle de vie :** prévoir des transitions contrôlées entre brouillon, validation, publiée, suspendue, expirée et archivée. Les rôles habilités à chaque transition restent à valider.
- **ANN-06 — Dédoublonnage :** détecter les doublons probables en tenant compte de l’URL source, de l’identifiant source et d’attributs normalisés ; une fusion automatique ne doit pas supprimer la provenance.
- **ANN-07 — Moteur commun :** les annonces rejoignent le moteur central d’opportunités avec une catégorie et un type explicites ; elles ne créent pas un moteur séparé des appels d’offres.
- **ANN-08 — Recherche :** les filtres doivent utiliser les données réellement enregistrées. Les résultats d’exemple ne doivent pas être présentés comme des offres réelles.
- **ANN-09 — Source externe :** avant de collecter ou republier, vérifier les conditions d’utilisation, les droits d’accès et de réutilisation ; sinon, conserver uniquement les informations permises et renvoyer vers la source originale.

## 4. Critères de candidature

- **CAN-01 — Formulaire réel :** le formulaire ne sera présenté comme opérationnel qu’après validation serveur, transmission effective et confirmation vérifiable.
- **CAN-02 — Validation :** contrôler les champs côté serveur ; ne jamais considérer la validation navigateur comme une protection suffisante.
- **CAN-03 — Minimisation :** ne collecter que les informations nécessaires au traitement de la candidature.
- **CAN-04 — Accès :** seules les personnes habilitées peuvent consulter ou traiter les candidatures ; aucun candidat ne peut accéder aux données d’un autre candidat.
- **CAN-05 — Confirmation :** afficher un état de succès uniquement après confirmation réelle de l’enregistrement ou de la transmission.
- **CAN-06 — Conservation :** définir avant mise en production les finalités, la durée de conservation, les droits d’accès et le processus de suppression.
- **CAN-07 — Anti-abus :** prévoir des protections adaptées contre le spam et les soumissions automatisées.
- **CAN-08 — Traçabilité :** journaliser les changements de statut nécessaires au suivi, sans enregistrer inutilement des données personnelles dans les journaux techniques.

## 5. Critères de diffusion LinkedIn

- **LIN-01 — MVP manuel :** permettre d’abord de copier/partager le lien et de préparer un texte de publication ; aucune publication automatisée n’est supposée disponible.
- **LIN-02 — Automatisation conditionnelle :** toute intégration ultérieure doit vérifier les produits API, les autorisations, les rôles et les conditions LinkedIn applicables au compte concerné.
- **LIN-03 — Contrôle éditorial :** l’utilisateur habilité vérifie le texte, le lien et l’origine avant publication.
- **LIN-04 — Pas de duplication abusive :** ne pas diffuser en masse des annonces dupliquées ni modifier le sens d’une annonce externe.
- **LIN-05 — Attribution :** la publication distingue clairement MajestiOS, l’émetteur de l’annonce et la source originale le cas échéant.

La documentation officielle LinkedIn indique que la création de publications via l’API Posts dépend de permissions dédiées et que l’API Job Posting vise des tiers autorisés relevant du programme LinkedIn Talent Solutions. L’automatisation doit donc être étudiée séparément ; elle n’est pas acquise par le simple fait d’avoir un compte LinkedIn.

## 6. Sécurité et modèle de données — préalables obligatoires

Avant toute implémentation avec persistance :
1. retrouver et confirmer les tomes maîtres qui font autorité ;
2. relier chaque exigence aux objets canoniques du modèle, notamment Tenant, User, Membership, Organization, Contact, OpportunityCase, CaseActor et Mission ;
3. valider les cardinalités, les propriétaires des annonces et la séparation entre annonces internes et externes ;
4. définir les rôles, permissions, politiques RLS et tests négatifs d’isolation ;
5. confirmer un projet Supabase DEV distinct et ses accès ;
6. établir des tests fonctionnels, de sécurité et de non-régression avant tout déploiement.

Aucune table, migration SQL, connexion externe ou modification de production ne doit être créée sur la seule base de ce document.

## 7. Ordre de réalisation proposé

1. Vérifier la page dans un aperçu de préproduction contrôlé, sans modifier le domaine de production.
2. Valider le contenu, les catégories et les parcours avec les tomes maîtres.
3. Concevoir le modèle et les permissions, puis les faire relire.
4. Implémenter la gestion d’annonces MajestiOS en environnement DEV.
5. Implémenter le parcours de candidature sécurisé et ses tests.
6. Étendre le moteur central aux annonces de membres et aux sources externes autorisées.
7. Ajouter les liens de partage LinkedIn ; étudier l’API uniquement après validation de l’accès.
8. Préparer le back-office de gestion, de modération et de suivi.

---
**Fin — critères de travail V0.1, non validés.**
