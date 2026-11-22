# Fiches détaillées des 10 missions de Cheexpeer — 22 novembre 2026

*À la demande du propriétaire : « détailler chaque mission pour ne pas être confronté à des problèmes techniques ou fonctionnels », avec des propositions de Claude, et un score sur 20. Les missions et leurs mots d'origine sont dans le [catalogue](CATALOGUE-MISSIONS-CHEEXPEER-2026-11-22.md). Tout ce qui est marqué **Proposition** est à valider par le propriétaire ; rien n'est construit par ce document.*

## Règles communes à toutes les missions
1. **Lecture seule.** Cheexpeer cherche, calcule, rédige des brouillons. Il n'envoie rien, ne publie rien, ne modifie ni le CRM ni le site tout seul (voir le [périmètre](PERIMETRE-ACTION-CHEEXPEER-2026-11-22.md)).
2. **Les chiffres sont calculés par du code, jamais « de tête » par l'IA.** L'IA explique et commente ; les totaux, pourcentages et notes sortent d'un calcul reproductible.
3. **Chaque information garde sa source et sa date.** Une donnée absente s'affiche « non trouvé » ou « non prouvé », jamais comme un fait négatif.
4. **L'administrateur valide** avant tout lancement et avant toute entrée dans le CRM.
5. **Essai sur la base de test d'abord**, avec des cas réels et un contrôle humain, puis activation de l'outil par le propriétaire.
6. **Plafonds** : nombre d'appels, taille du résultat, coût maximal par mission.
7. **Si Cheexpeer ne trouve rien ou échoue**, il le dit clairement, avec la raison, dans l'historique d'événements.

---

## Mission 1 — Surveillance du site
**Objectif (propriétaire).** Surveiller le site, alerter sur toute anomalie ou dysfonctionnement, tout enregistrer dans un historique d'événements, « même un simple nouvel espace créé ».

**Comment ça marche.** À intervalle régulier, Cheexpeer relève : le site répond-il, les connexions fonctionnent-elles, de nouvelles erreurs sont-elles apparues, un espace ou un compte a-t-il été créé, une mission a-t-elle échoué. Chaque constat devient une ligne de l'historique.

**Résultat.** Un historique consultable dans le Centre de commande : date, type, gravité, description, lien vers le détail. Trois niveaux : **information** (nouvel espace), **attention** (erreur isolée), **urgent** (site ou connexion en panne).

**Difficultés prévues.** Trop d'alertes ; alerte répétée pour le même problème. *Proposition :* une alerte n'est renvoyée que si la situation change ; les « information » ne notifient personne, elles s'écrivent seulement dans l'historique.

**À décider.** Comment être prévenu en cas d'urgent : message dans le Centre de commande seulement, ou aussi e-mail. *Proposition :* Centre de commande + e-mail pour l'urgent uniquement.

**Manque aujourd'hui.** L'historique actuel ne couvre que les missions. Il faut un historique général du site et les « sondes » (contrôle de disponibilité, lecture des erreurs, création d'espaces).

---

## Mission 2 — Analyser les appels d'offres et trouver les entreprises concernées
**Objectif (propriétaire).** Analyser les appels d'offres en cours, les traduire en codes APE/NAF, puis chercher les entreprises susceptibles d'être concernées.

**Comment ça marche.**
1. Cheexpeer lit l'avis : objet, lots, travaux ou services, qualifications exigées, lieu d'exécution, date limite.
2. Il propose **un ou plusieurs codes NAF**, chacun classé *correspondance forte*, *complémentaire* ou *incertaine*, avec les mots de l'avis qui le justifient.
3. Il détermine le territoire (département d'exécution, puis région si besoin).
4. Il interroge l'annuaire officiel des entreprises pour chaque code et chaque territoire.
5. Il remet un **dossier de ciblage** : l'appel d'offres, les codes retenus, les entreprises, la raison de chacune.

**Résultat.** Tableau téléchargeable (Excel, CSV) : entreprise, SIREN, adresse, code NAF, effectif, RGE, correspondance au lot, source, date. Mission n°1 déjà construite en est la base.

**Difficultés prévues.** Un code NAF ne prouve pas la compétence ; un marché mélange plusieurs métiers ; l'IA lit de façon approximative un avis long. *Proposition :* un lot = un jeu de codes ; l'administrateur peut corriger les codes avant la recherche ; table NAF des métiers validée avec le propriétaire (point déjà ouvert).

**À décider.** Quels appels d'offres analyser : seulement ceux que l'administrateur choisit, ou tous ceux d'un territoire. *Proposition :* ceux qu'il choisit au départ.

**Manque aujourd'hui.** Source des appels d'offres **en cours** branchée sur Cheexpeer ; lecture structurée des lots ; table NAF validée.

---

## Mission 3 — Fiches de contacts
**Objectif (propriétaire).** Compléter des fiches de contacts (téléphone, e-mail, nom du dirigeant) et alimenter le CRM admin.

**Comment ça marche.** Pour chaque entreprise retenue : le **nom du dirigeant** vient de l'annuaire officiel ; le **site web** et les **coordonnées publiques** viennent du site de l'entreprise (page contact, mentions légales) ; le **lien Google Maps** est cherché ; chaque champ garde sa source.

**Résultat.** Une fiche par entreprise, avec des champs remplis, des champs « non trouvé », et pour chaque e-mail la mention **générique** (contact@…) ou **nominatif**. Les fiches sont **proposées** à l'administrateur ; il valide, puis elles entrent dans le CRM.

**Difficultés prévues.** Aucun annuaire officiel ne donne téléphone et e-mail ; les sites changent ; données de Google Maps non copiables en masse (voir [outils Google](OUTILS-GOOGLE-CHEEXPEER-2026-11-22.md)). *Proposition :* ne remplir le téléphone et l'e-mail que s'ils figurent sur le site de l'entreprise, et pour Google ne garder que le lien.

**À décider.** Les e-mails nominatifs (personne physique) : les garder dans la fiche ou seulement les génériques. *Proposition :* génériques par défaut, nominatifs seulement s'ils sont publiés par l'entreprise elle-même.

**Manque aujourd'hui.** Lecture automatique des sites d'entreprises ; clé Google (en attente de validation) ; règle d'entrée dans le CRM par validation.

---

## Mission 4 — Statistiques
**Objectif (propriétaire).** Établir des statistiques servant de support pédagogique au site et à d'éventuels investisseurs (exemple : sur 100 appels d'offres, 40 % bâtiment, 20 % services numériques, 40 % autres, sur la Basse-Normandie ou le Calvados), plus précises et plus pertinentes que l'exemple.

**Comment ça marche.** Le code compte les appels d'offres et marchés attribués par territoire, métier (code NAF), période, montant, type d'acheteur. Cheexpeer rédige le commentaire.

**Résultat.** Tableaux et graphiques exportables. **Chaque chiffre affiche** : la période, le territoire, le nombre de cas (« sur 100 appels d'offres »), la source, la date de calcul.

**Difficultés prévues.** Échantillon trop petit pour être parlant ; chiffres impossibles à retrouver ; classement des métiers imprécis. *Proposition :* un chiffre n'est publié que s'il repose sur un nombre minimal de cas (seuil à fixer) ; la méthode est écrite à côté du chiffre.

**À décider.** Qui voit ces statistiques : l'administrateur seulement, puis une page publique pédagogique. *Proposition :* administrateur d'abord ; page publique seulement après relecture.

**Manque aujourd'hui.** Historique de données suffisant et classement des appels d'offres par métier ; page d'affichage.

---

## Mission 5 — Scoring sur 20
**Objectif (propriétaire).** Noter les entreprises potentiellement éligibles selon les exigences de l'appel d'offres et leurs références : entreprise avec les certifications demandées et une comptabilité saine très bien notée ; entreprise aux références non prouvées mal notée. Les exemples orientent, ils ne sont pas à prendre au pied de la lettre.

**Proposition de grille (note sur 20) :**
| Critère | Points | Ce qui est regardé |
|---|---|---|
| Adéquation au métier | 5 | Code NAF et activité par rapport au lot |
| Exigences de l'appel d'offres | 5 | Certifications et qualifications demandées (par exemple RGE) |
| Solidité financière | 4 | Ancienneté, comptes publiés, absence de procédure collective |
| Références prouvées | 4 | Marchés déjà remportés, chantiers vérifiables |
| Proximité | 2 | Même département ou même région |

**Règles.**
- Un critère **sans preuve** vaut 0 point et s'affiche « **non prouvé** » (ce n'est pas « mauvais » : c'est « non vérifié »).
- Une exigence **éliminatoire** non prouvée (qualification obligatoire) plafonne la note à **8/20**.
- Le seuil « très bon » est fixé à partir de **16/20** (l'équivalent de 8 sur 10 de votre exemple).
- Chaque note affiche le détail par critère, la date, les sources et la **version de la méthode**. L'administrateur peut corriger ou contester.
- Le score est une aide à la décision. Il ne décide ni d'un contact ni d'une exclusion.

**Difficultés prévues.** Beaucoup de critères sans données (comptes, références). *Proposition :* afficher aussi un **niveau de confiance** (nombre de critères réellement vérifiés sur 5).

**À décider.** Les poids de la grille (5 / 5 / 4 / 4 / 2) et le seuil. *Proposition :* les garder pour un essai, puis les ajuster sur des cas réels.

**Manque aujourd'hui.** Aucun scoring construit ; comptes publiés et références non branchés ; qualifications des annuaires professionnels non branchées (seul RGE est disponible).

---

## Mission 6 — Audit de présence Web, à la demande
**Objectif (propriétaire).** Auditer la présence Web des entreprises qui en font la demande.

**Comment ça marche.** Une entreprise demande l'audit depuis son espace ; l'administrateur valide ; Cheexpeer examine site, fiches en ligne, réputation, cohérence des coordonnées, puis rédige le rapport.

**Résultat.** Rapport de constats classés par priorité, avec pistes d'amélioration, remis après relecture de l'administrateur.

**Difficultés prévues.** Une absence de résultat ne prouve pas une absence de présence. *Proposition :* chaque constat est écrit « non trouvé » ou « trouvé », jamais « n'existe pas ».

**Manque aujourd'hui.** Audit de réputation seulement sur Test, non installé en production ; point d'entrée « demander un audit » dans l'espace entreprise.

---

## Mission 7 — Mails, pitchs et messages LinkedIn
**Objectif (propriétaire).** Préparer des e-mails de prospection et des pitchs pour les dirigeants et/ou les contacts LinkedIn.

**Comment ça marche.** À partir d'une fiche entreprise et du marché gagné qui motive le contact, Cheexpeer rédige un brouillon d'e-mail et un message LinkedIn court. Il reprend les règles du générateur existant : aucune donnée inventée, tableau neutre.

**Résultat.** Brouillons à relire, à copier ou à envoyer par un humain depuis sa propre messagerie ou son compte LinkedIn. **Cheexpeer n'envoie rien.**

**Difficultés prévues.** Messages trop génériques ; ton qui ne convient pas au dirigeant d'une petite entreprise. *Proposition :* un modèle de ton par métier, validé par le propriétaire ; une version courte et une version longue.

**À décider.** Le fond du message et la façon de contacter : le propriétaire avait dit « on réfléchira plus tard, une fois la stratégie en place ».

**Manque aujourd'hui.** Stratégie de contact non arrêtée.

---

## Mission 8 — Maintenance du site
**Objectif (propriétaire).** S'occuper de la maintenance du site.

**Comment ça marche.** Cheexpeer relève les points à surveiller (liens cassés, tests qui échouent, alertes de sécurité de la base, pages incohérentes) et prépare un diagnostic avec la correction proposée.

**Résultat.** Liste de problèmes classés, avec la correction envisagée. **Aucune mise en ligne sans validation.**

**Difficultés prévues.** Cheexpeer n'a aucun accès au code du site aujourd'hui. *Proposition :* il diagnostique et prépare ; la correction est réalisée dans une session de travail sur le code, puis validée.

**Manque aujourd'hui.** Accès en lecture aux résultats de tests et aux alertes ; procédure de validation d'une correction.

---

## Mission 9 — Assistance à l'administrateur (enrichissement du CRM et de la base de prospection)
**Objectif (propriétaire).** Assister l'administrateur sur l'enrichissement du CRM ou de la base de prospection.

**Comment ça marche.** Cheexpeer parcourt la base, repère les fiches incomplètes et les doublons, propose les corrections et les compléments.

**Résultat.** Liste de propositions « fiche X : ajouter Y, source Z », que l'administrateur accepte ou refuse une par une.

**Proposition de partage avec la mission 3.** La mission 3 complète les fiches d'une liste précise d'entreprises ; la mission 9 est le **nettoyage régulier de toute la base**. Elles partagent les mêmes outils.

**Manque aujourd'hui.** Détection de doublons ; écran de validation par lots.

---

## Mission 10 — SEO
**Objectif (propriétaire).** Optimiser le référencement.

**Comment ça marche.** Cheexpeer audite le site (plan du site, titres, descriptions, vitesse, liens), cherche les mots-clés utiles, propose des améliorations classées par effet attendu et prépare des brouillons de contenus.

**Résultat.** Rapport priorisé et brouillons. **Rien n'est publié sans validation** ; chaque changement est versionné et réversible.

**Difficultés prévues.** Données de Search Console non connectées ; plan du site incomplet. *Proposition :* commencer par l'audit technique, qui ne demande aucun accès.

**Manque aujourd'hui.** Connexion de Search Console (par le propriétaire) ; plan du site à compléter.

---

## Ordre de réalisation (Proposition)
1. **Chaîne « ciblage »** : missions 2 → 3 → 5. Elle prolonge la mission n°1 déjà construite et répond à l'objectif central.
2. **Mission 1** (surveillance) : simple et utile pour tout le reste.
3. **Mission 4** (statistiques), quand l'historique de données est suffisant.
4. **Missions 6, 7, 8, 9, 10**, une par une, selon les besoins.

Chaque mission passe par les mêmes étapes : fiche validée, essai sur Test, décision du propriétaire, activation.
