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

**Grille révisée le 22 novembre 2026** (après les avis de Gemini, Copilot et ChatGPT) : **deux indicateurs séparés.**

*1. Note d'adéquation au marché, sur 20 :*
| Critère | Points | Ce qui est regardé |
|---|---|---|
| Adéquation au métier | 5 | Code NAF, activité et mots du lot |
| Qualifications et exigences techniques | 4 | Certifications demandées (RGE, Qualibat…) |
| Références et expériences vérifiables | 4 | Marchés comparables déjà remportés, chantiers vérifiables |
| Capacité financière documentée | 3 | Ancienneté, comptes publiés, absence de procédure collective |
| Capacité opérationnelle | 2 | Taille du chantier par rapport à l'effectif |
| Proximité géographique | 2 | Distance au chantier (calculée avec la Base Adresse Nationale) |

*2. Niveau de preuve, en pourcentage :* part des points de la note qui reposent sur une information réellement vérifiée.

**État de chaque critère :** *confirmé*, *partiellement confirmé*, *non prouvé*, *contradictoire*, *non applicable*. Une information absente n'est jamais une preuve d'incapacité.

**Règles.**
- Un critère **non prouvé** vaut 0 point et s'affiche « non prouvé ». Le niveau de preuve baisse en conséquence : on voit qu'une note de 15/20 à 40 % de preuve est moins sûre qu'une note de 15/20 à 95 %.
- Un critère **confidentiel ou inaccessible** (comptes déposés en confidentialité, par exemple) est **neutralisé** : il sort du calcul et la note est ramenée sur 20. L'entreprise n'est pas sanctionnée.
- **Exigence obligatoire** : si l'avis ou le règlement de la consultation en impose une et qu'elle n'est pas prouvée, la note est plafonnée à 8/20 **et l'entreprise est étiquetée « dossier incomplet »**, pas « inadéquate ». Si les exigences ne sont **pas connues** (règlement non lu), le plafond ne s'applique pas et l'étiquette est « exigences non vérifiées ».
- Le calcul est fait par un **programme déterministe**. L'IA fournit les éléments justificatifs, elle ne décide pas de la note.
- Chaque note affiche le détail par critère, les sources, la date et la **version de la méthode**. L'administrateur peut corriger ou contester. Le score n'exclut personne seul.
- Sont écartées d'office les entreprises radiées, en liquidation, ou **non diffusables** (statut de diffusion Sirene).
- Seuil « très bon » : à partir de 16/20 (l'équivalent de 8 sur 10), **avec un niveau de preuve élevé** (seuil à fixer lors des essais).

**Difficultés prévues.** Les exigences détaillées sont dans le règlement de la consultation (un PDF sur le site de l'acheteur), pas dans l'avis public : sans lui, beaucoup d'exigences resteront « non vérifiées ». *Proposition :* afficher « exigences non vérifiées » plutôt que d'inventer, et envisager plus tard la lecture de ce document.

**À décider.** Les poids (5 / 4 / 4 / 3 / 2 / 2) et le seuil, ajustés sur des cas réels. Une mission « faut-il répondre à ce marché ? » (Go / No go) est proposée par Copilot : à décider plus tard.

**Manque aujourd'hui.** Aucun scoring construit ; comptes, références et règlement de consultation non branchés ; qualifications des annuaires professionnels non branchées (seul RGE est disponible) ; Base Adresse Nationale non branchée.

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

## Mission 11 — Opportunités après attribution *(proposition, déjà amorcée)*
Les trois IA consultées la placent en tête. C'est le prolongement direct de votre objectif et de la mission n°1 déjà construite sur Test.

**Comment ça marche.** Quand un marché est attribué : Cheexpeer identifie le gagnant, analyse sa taille et son activité par rapport au montant (un gagnant de petite taille avec un gros marché aura besoin de renfort), repère les lots ou métiers souvent sous-traités, et prépare la liste des **partenaires potentiels** locaux du même métier. Il ne parle jamais de « besoin confirmé » : une entreprise identifiée n'est pas forcément à la recherche d'un sous-traitant.

**Résultat.** Liste d'entreprises (missions 2, 3 et 5 réunies), avec la raison de chaque choix, et la fiche d'opportunité du marché.

**Manque aujourd'hui.** Source des marchés attribués récents branchée en continu ; analyse de la taille du gagnant.

---

### État du prototype de la mission 11 (22 novembre 2026)
Construit sur la base de **Test** uniquement, outil **désactivé** par défaut, validation humaine toujours obligatoire, aucun envoi.
- **Entrée** : l'identifiant d'un marché attribué (base DECP déjà chargée), choisi dans une recherche de l'écran « Centre de commande ».
- **Fiche produite** : gagnant (annuaire officiel : activité, catégorie, tranche d'effectif), **indice faible / moyen / fort** (montant annualisé ÷ effectif estimé ; seuils provisoires 40 000 et 100 000 € par salarié, à fixer après essais sur cas réels), « non évaluable » si montant absent, suspect ou aberrant, ou effectif inconnu. Métier (NAF du gagnant puis métiers retrouvés dans l'objet, avec extrait). Lieu : départements cités dans l'objet, sinon département du gagnant **signalé « à confirmer »**, jamais l'adresse de l'acheteur. Partenaires potentiels : même métier, hors gagnant, avec la raison de chaque choix ; export CSV.
- **Langage imposé** : « peut représenter une opportunité » ; jamais « cherche un sous-traitant » ni « besoin confirmé » (testé).
- **Reste à faire** : brancher les marchés attribués en continu, analyser la taille du gagnant avec des comptes sociaux, ajouter le score (mission 5), fiches contacts (mission 3).

## Mission 12 — Opportunités après les travaux *(proposition, mise de côté le 22 novembre 2026, 15 h 12 : « on oublie la mission 12 pour le moment »)*
Vous aviez indiqué : « récupérer les travaux mal faits ou les retards de chantier ». Les IA proposent des signaux **publics** qui le permettent.

**Comment ça marche.** Cheexpeer surveille les avis officiels de marché « sans suite », résilié ou relancé en urgence, et les entreprises titulaires d'un marché récent qui entrent en procédure collective (BODACC). Il prépare une fiche : le marché, le signal, la date, la source, les entreprises locales du métier concerné.

**Règles.** Cheexpeer **ne déclare jamais** qu'un ouvrage est mal exécuté ni qu'une entreprise est responsable : il rassemble les faits publics et laisse l'analyse à un professionnel. Un marché « sans suite » peut aussi venir d'un manque de budget, pas d'une défaillance : la fiche le précise.

**À décider.** Si ces deux signaux correspondent bien à ce que vous voulez surveiller après les travaux.

**Manque aujourd'hui.** Lecture des avis « sans suite » ou résiliés ; croisement BODACC avec les titulaires récents.

---

## Précisions retenues par au moins deux IA (22 novembre 2026)
Elles sont intégrées aux fiches ci-dessus ou à retenir au moment de la construction :
- **Fiche d'opportunité** pour chaque marché (objet, acheteur, lieu réel des travaux, date limite, lots, métiers, exigences, entreprises concernées, sources et date).
- **Lieu réel des travaux** distinct de l'adresse de l'acheteur.
- **Statuts des e-mails** : vérifié, probable à confirmer, introuvable ; adresse générique ou nominative.
- **Ne jamais fusionner automatiquement** deux fiches : la fusion est proposée, l'administrateur décide.
- **Indice de qualité d'une fiche CRM** : complète et vérifiée, exploitable mais incomplète, à actualiser, à contrôler, à écarter (mission 9).
- **Jeu d'essai** : marchés passés dont le résultat est connu, avec des cas simples, ambigus et piégés ; trois environnements (fictif, copie représentative, production).
- **Coûts maîtrisés** : un tri par code classique et gratuit, l'IA n'intervient que sur les marchés pertinents.

## Consolidation des audits de ChatGPT, Gemini et Copilot (22 novembre 2026, 15 h 40)
*Second tour de consultation, avec le prompt n°2. Chaque IA a relu les fiches. Ce qui suit retient ce qui revient chez au moins deux d'entre elles, et isole les désaccords. Tout est **proposé** : le propriétaire tranche.*

### 1. Ordre de construction : le score passe après la mission 11
Les trois IA jugent le **score (mission 5) comme la partie la plus risquée** : plusieurs données nécessaires (références, comptes, qualifications autres que RGE, règlement de consultation) ne sont pas encore branchées. Deux d'entre elles conseillent de ne pas commencer par lui.

| Étape | Travail |
|---|---|
| 1 | Socle commun : historique d'événements, source et date pour chaque donnée, plafonds, environnement d'essai |
| 2 | Mission 2 — analyser un marché, trouver les entreprises |
| 3 | Mission 3 — fiches de contacts |
| 4 | Mission 11 — opportunités après attribution (**sans score** : « qualification non réalisée ») |
| 5 | Mission 5 — score, quand ses données sont branchées |
| 6 | Mission 7 — brouillons |
| 7 | Missions 9, 4, 6 |

### 2. Premier morceau utile (une semaine) — accord des trois IA
Un prototype fermé, sans score et sans IA de rédaction : **un marché → ses lots → codes NAF proposés et validés par l'administrateur → entreprises locales (annuaire officiel) → tableau avec SIREN, adresse, code NAF, effectif, source, date → export CSV → erreurs notées dans l'historique.** Une partie existe déjà sur la base de test (la liste d'entreprises par métier et région).

### 3. Règles retenues (au moins deux IA sur trois)
- **Lots avant codes NAF** ; un code NAF proposé doit citer un **extrait exact** de l'avis, sinon il est rejeté par le code.
- **Lieu réel des travaux**, jamais l'adresse de l'acheteur. Ordre de recherche : lieu du lot, lieu d'exécution, département indiqué, région, sinon « territoire non déterminé ».
- **Territoire de recherche** : département des travaux d'abord ; élargissement à la région si peu d'entreprises (seuil à fixer, 15 proposé), en le signalant.
- **Avis modifié** : l'analyse précédente est marquée obsolète et relancée.
- **Mission 11** : le gagnant et le montant donnent un **indice** (niveau faible, moyen, fort), jamais un besoin confirmé. Formulation autorisée : « peut représenter une opportunité ». Interdite : « cherche un sous-traitant ».
- **Score** : critères sans donnée neutralisés (note ramenée sur 20), niveau de preuve calculé à part, plafond à 8/20 seulement si le règlement de consultation a été lu, **le score classe, il n'exclut pas**, seuil « très bon » fixé **après** des essais sur cas réels.
- **E-mails** : jamais déduits ; statut vérifié, probable à confirmer, introuvable ; générique ou nominatif.
- **Aucune fusion automatique** de fiches ; propositions acceptées une à une, tracées et réversibles.
- **Statistiques** : seuil minimal de cas avant d'afficher un pourcentage ; chaque chiffre recalculable à l'identique.
- **Classement des métiers (statistiques)** par la **nature de la prestation du marché**, pas par le code d'activité du gagnant.

### 4. Essais proposés (ordres de grandeur, à fixer après le premier essai)
| Mission | Jeu d'essai proposé |
|---|---|
| 2 | 30 à 50 avis réels : simples, multi-lots, plusieurs lieux, ambigus |
| 3 | 30 à 200 entreprises : avec site complet, incomplet, sans site, plusieurs établissements |
| 5 | 25 à 100 dossiers sur marchés passés. Test proposé : les entreprises réellement retenues apparaissent-elles dans le haut du classement ? |
| 11 | 20 à 50 marchés attribués : simples, multi-lots, groupements, montants manquants. Le responsable commercial juge chaque piste « utile » ou « inutile » |
| 7 | 20 à 100 brouillons relus à la main : zéro fait inventé |
| 9 | 50 fiches CRM avec doublons vrais et faux, entreprises fermées, données contradictoires |
Les **seuils de réussite chiffrés** proposés par les IA (par exemple 85 % ou 90 %) ne sont pas retenus : ils seront fixés après le premier essai, pas inventés avant.

### 5. Désaccords et décisions à trancher par le propriétaire
| N° | Question | Avis des IA | Recommandation de Claude |
|---|---|---|---|
| 1 | Ordre : score avant ou après la mission 11 ? | Copilot : 11 avant 5. ChatGPT et Gemini : 5 avant 11, mais ChatGPT veut que 11 marche sans score | **11 avant 5** (le score est le plus risqué) |
| 2 | Entreprises radiées ou « non diffusables » : écartées ? | Gemini : écartées d'office. ChatGPT : ne pas écarter pour ce seul motif | Écarter les entreprises **fermées ou radiées** ; ne rien afficher des non diffusables, sans chercher à contourner ; procédure collective : signaler, un humain décide |
| 3 | Sources des marchés | Gemini : BOAMP et données d'attribution ; ChatGPT ajoute les avis européens ; Copilot : BOAMP, données essentielles, profils d'acheteurs | Commencer par **BOAMP et données d'attribution françaises**, ajouter le reste ensuite |
| 4 | Qu'est-ce qu'une « référence vérifiable » ? | Copilot : un document public obligatoire | Adopter cette définition au départ |
| 5 | Territoire si peu d'entreprises | Gemini : région ; Copilot : département puis régions limitrophes | Département, puis région, avec l'origine affichée |
| 6 | Lire les règlements de consultation (PDF) ? | Les trois : indispensable à terme | Oui, **après** le premier prototype |
| 7 | Qui valide quoi ? | Gemini : l'administrateur valide au quotidien, le propriétaire valide les règles | Adopter cette séparation |
| 8 | Score visible des entreprises concernées ? | ChatGPT : réservé à l'administrateur | Oui, réservé à l'administrateur |
| 9 | Mission 6 (audit Web) | Gemini : à confirmer, sans effort pour l'instant ; Copilot : en dernier | Garder en dernier rang 2 |
| 10 | Gestion des oppositions à la prospection | ChatGPT : conserver partout le statut d'opposition | Prévoir dès le socle commun |

## Décisions retenues le 22 novembre 2026, 15 h 40
> Le propriétaire a consulté trois IA pour ne pas partir dans tous les sens, puis a confié l'arbitrage à Claude : « tu as ton libre arbitre et MajestiOS doit avancer ». Claude adopte donc ses recommandations du tableau ci-dessus. Le propriétaire peut les corriger à tout moment. **Les règles qui protègent MajestiOS restent entières** : rien en production, ni rôles ni suppressions de membres décidés par Claude, aucun secret dans le chat ou dans Git, lecture seule pour Cheexpeer.

| N° | Décision adoptée |
|---|---|
| 1 | Ordre technique : socle commun, missions 2, 3, 11, puis le score (5), puis 7, 9, 4, 6 |
| 2 | Entreprises fermées ou radiées : écartées. Non diffusables : rien d'affiché, aucune tentative de contournement. Procédure collective : signalée, un humain décide |
| 3 | Sources de départ : BOAMP et données d'attribution françaises ; avis européens ensuite |
| 4 | « Référence vérifiable » = appuyée par un document public |
| 5 | Territoire : département des travaux, puis région, avec l'origine affichée |
| 6 | Lecture des règlements de consultation : après le premier prototype |
| 7 | L'administrateur valide au quotidien ; le propriétaire valide les règles, seuils et mises en production |
| 8 | Score visible de l'administrateur seul |
| 9 | Mission 6 (audit Web) en dernier du rang 2 |
| 10 | Statut d'opposition à la prospection prévu dès le socle commun |

**Premier chantier lancé :** le prototype fermé de la mission 2 (analyse d'un marché : lots, lieu des travaux, codes NAF avec extraits de l'avis, puis recherche d'entreprises), construit **sur la base de test uniquement**.

### État du prototype de la mission 2 (22 novembre 2026)
- **Fait :** le cœur de l'analyse (`supabase/functions/_shared/mission-analyse-marche-core.mjs`) et ses tests, écrits sur la structure d'avis BOAMP réels lus depuis la base de test. Il ne fait aucun appel à une IA : des règles écrites, donc des résultats reproductibles.
- **Ce qu'il fait :** découpe l'avis en lots ; trouve le **lieu réel des travaux** (lot, puis adresse d'exécution, puis départements cités dans l'objet, puis champ de prestation, sinon « territoire non déterminé » ; l'adresse de l'acheteur n'est jamais utilisée) ; repère les métiers et **propose des codes NAF avec l'extrait exact de l'avis** (pas d'extrait, pas de proposition) ; prépare les recherches d'entreprises **uniquement pour les codes validés par l'administrateur**.
- **Constat sur les données réelles :** le champ « départements » de l'avis est souvent bruité ; on lit donc l'avis complet (format eForms).
- **Branché au moteur (22 novembre, soir) :** type de mission `analyse_marche` (entrée : l'identifiant de l'avis BOAMP), validation humaine toujours exigée, outil enregistré **désactivé** sur la base de test (migration `20261122180000`). Le résultat propose les codes NAF ; l'administrateur les valide, puis lance la mission « prospects » existante pour chaque code et département validé.
- **Reste à faire :** déploiement des fonctions sur Test, écran dans le Centre de commande (saisie de l'avis, validation des codes, tableau + CSV), essai réel sur Test, décision du propriétaire avant toute activation.

## Ordre de réalisation — décision du propriétaire du 22 novembre 2026, 15 h 09
> « Intervenir en fonction de la valeur ajoutée commerciale immédiate (le SEO, la maintenance, les alertes ne me semblent pas d'une urgence absolue). »

| Rang | Missions | Raison |
|---|---|---|
| **1 — Valeur commerciale immédiate** | 2 (appels d'offres), 3 (fiches contacts), 5 (score), 11 (après attribution), 7 (brouillons de prospection) | C'est la chaîne appel d'offres → entreprise → qualification → prospection |
| **2 — Ensuite** | 9 (qualité du CRM), 4 (statistiques), 6 (audit Web, à confirmer) | Elles renforcent la chaîne ou ouvrent d'autres occasions |
| **Mise de côté** | 12 (après les travaux) : décision du propriétaire, on y reviendra |
| **Plus tard (pas d'urgence)** | 1 (surveillance et alertes), 8 (maintenance), 10 (SEO) | Utiles, mais sans effet commercial immédiat. Elles restent au catalogue |

Chaque mission passe par les mêmes étapes : fiche validée, essai sur Test, décision du propriétaire, activation.

## État du prototype de la mission 5 (score) — 22 novembre 2026
**Construit (lecture seule, sans IA générative).** Un programme déterministe (`mission-score-core.mjs`, méthode « 1.0-provisoire ») note chaque entreprise sur 20 et calcule à part un niveau de preuve en %, selon la grille ci-dessus. Il est branché sur la mission 11 : chaque partenaire potentiel reçoit sa note, son niveau de preuve, le détail par critère, et la liste est classée. Le CSV téléchargeable contient la note, la preuve et l'étiquette.

**Ce qui est réellement évalué aujourd'hui.** Métier (code NAF), RGE, ancienneté (partielle), effectif face au montant annualisé (partielle), département. **Non branchés, donc « non prouvé » ou « exigences non vérifiées »** : références, comptes, règlement de consultation, autres qualifications. Aucune entreprise n'est exclue par le score ; seules sont écartées et listées à part les radiées, en liquidation ou non diffusables.

**Précisions de calcul.** Critère neutralisé (par exemple montant inconnu) : il sort du calcul et la note est ramenée sur 20. Niveau de preuve = part des points maximum reposant sur une information confirmée (la moitié des points pour « partiellement confirmé »). « Très bon » = 16/20 ou plus avec une preuve d'au moins 70 %. **Tous les poids et seuils restent provisoires** et seront ajustés sur des cas réels.

## Prochaines priorités à faire — décision du propriétaire du 22 novembre 2026
1. **Mission 7 (brouillons d'e-mails, pitchs et messages LinkedIn) : mise de côté à la demande du propriétaire, à reprendre plus tard**, une fois la stratégie de contact arrêtée. Un premier jet de brouillons existe sur le poste de Claude (branche locale `mission-7-brouillons`, jamais fusionné ni publié) : e-mail court et long, message LinkedIn, sans aucun envoi, avec les règles de langage de la mission 11.
2. **Mission 3 (fiches contacts)** : attend la clé Google (vérification de facturation en cours).
3. Puis missions 9, 4 et 6. Mission 12 et dialogue avec Majestios Bot : laissés de côté.
4. **Score (mission 5)** : poids et seuils à ajuster sur des cas réels ; références, comptes et règlement de consultation à brancher.

## Décision du 23 novembre 2026 — la distance dans le score et dans l'accompagnement aux appels d'offres
**Demande du propriétaire.** Pour un appel d'offres sur une ville remporté par une entreprise située à 50 km, toutes les entreprises à moins de 50 km du lieu du chantier ont de bonnes chances d'être retenues en sous-traitance, car leurs frais de déplacement sont limités. La distance doit donc compter dans le score, et aussi dans l'accompagnement aux appels d'offres (choix des partenaires et des sous-traitants).

**Règle retenue (provisoire, à ajuster selon les résultats obtenus).**
- Distance en ligne droite entre l'établissement de l'entreprise et le **lieu du chantier** (jamais l'adresse du siège de l'acheteur sans le signaler).
- Paliers : moins de 25 km = maximum ; moins de 50 km = élevé ; moins de 100 km = moyen ; au-delà = faible. Seuils adaptables, éventuellement par métier.
- Poids de la proximité relevé de 2 à 3.
- Repli sans distance exacte : département ou région, marqué « partiellement confirmé » (le niveau de preuve baisse).
- Pour un marché d'une commune, le lieu du chantier est la commune de l'acheteur, localisée via l'annuaire officiel des adresses (API Adresse, gratuite), et signalée « à confirmer ».
- La distance entre le chantier et l'entreprise gagnante est affichée à côté, pour voir qui est plus proche qu'elle.
- Limite connue : distance à vol d'oiseau, pas de temps de trajet par la route.

**Réutilisation.** La même mesure de distance servira à la mission d'accompagnement aux appels d'offres (sélection de partenaires proches du chantier).

### État au 23 novembre 2026 (nuit) — distance livrée et décision d'extension aux appels d'offres en cours
- **Livré sur Test uniquement** (fusionné dans le code, PR « Score des entreprises : distance au chantier ») : calcul à vol d'oiseau, paliers 25 / 50 / 100 km, lieu du chantier d'un marché communal via l'API Adresse (« à confirmer »), colonne « Distance » à l'écran et dans le fichier Excel. Rien en production.
- **Décision du propriétaire (23 novembre, 0 h 36)** : on documente pour le moment ; ce même système de distance doit aussi servir à l'**accompagnement aux appels d'offres en cours**.
- **Application prévue à « Analyse d'un appel d'offres »** (mission existante, avis BOAMP) :
  - le lieu des travaux lu dans l'avis (lot, sinon exécution du marché, sinon département cité) devient le point de référence du chantier ;
  - les entreprises candidates comme partenaires ou sous-traitants (même métier) sont classées avec le même score, donc la même distance ;
  - différence avec « Opportunités après attribution » : il n'y a pas encore d'entreprise gagnante à comparer ; on affiche à la place le nombre d'entreprises à moins de 25 / 50 / 100 km ;
  - le lieu précis (commune, adresse) est souvent absent de l'avis : dans ce cas, repli sur le département, signalé « à confirmer », sans inventer de distance ;
  - toujours en lecture seule, autonomie 0, validation humaine, rien d'envoyé à l'extérieur.
- **À décider avec le propriétaire avant de construire** : seuils par métier ; faut-il aussi montrer la distance aux entreprises déjà en relation (CRM).
- **Réglage des seuils** : à faire après les premiers essais sur de vrais marchés, comme prévu.
- **Décision du propriétaire (23 novembre, 0 h 38)** : la distance en ligne droite suffit, pas de temps de trajet par la route.
- **Décision du propriétaire (23 novembre, 0 h 39)** : les seuils peuvent varier selon le métier. Premier cas : pour le **désamiantage** (métier rare, entreprises peu nombreuses), la distance acceptable peut aller **jusqu'à 200 km**. Les autres métiers gardent 25 / 50 / 100 km pour l'instant ; d'autres métiers seront ajustés après les premiers essais. Pas encore codé (documentation seule).
- **Précision du propriétaire (23 novembre, 0 h 42) — métiers où les grandes entreprises sous-traitent une partie du travail** :
  - **Métallerie lourde** : les grandes entreprises remportent souvent les marchés et sous-traitent le **montage**.
  - **Télécoms et électricité** : les grandes entreprises sous-traitent les **tirages de câbles**.
  - Conséquence retenue : ces métiers sont à traiter comme le désamiantage, avec des seuils de distance propres, probablement plus larges ; la distance exacte reste à fixer avec le propriétaire. Les codes d'activité (NAF) correspondants et les mots-clés à repérer dans les avis (montage, charpente métallique, tirage de câbles, fibre, courants faibles…) sont à définir au moment de construire. Rien n'est codé.
- **Décision du propriétaire (23 novembre, 0 h 44)** : pour la métallerie lourde, les télécoms et l'électricité, on **reste à 100 km** pour le moment (paliers 25 / 50 / 100 km, comme les autres métiers) ; à rectifier par la suite selon les résultats. Seul le désamiantage va jusqu'à 200 km.
- **Construit le 23 novembre 2026 (Test uniquement) — accompagnement aux appels d'offres** : dans « Analyse d'un appel d'offres », la commune des travaux lue dans l'avis (si elle y figure) est transmise à la recherche d'entreprises ; les entreprises sont alors classées avec le score, la distance à vol d'oiseau est affichée (écran et fichier Excel) avec le nombre d'entreprises à moins de 25 / 50 / 100 km. Sans commune dans l'avis : recherche par département, sans distance. Désamiantage (codes 39.00Z et 43.11Z) : paliers élargis à 50 / 100 / 200 km ; tous les autres métiers, y compris métallerie lourde, télécoms et électricité : 25 / 50 / 100 km. Le lieu du chantier est toujours « à confirmer ».
