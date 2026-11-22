# Prompt à soumettre aux autres IA — fonctionnalités de Cheexpeer (22 novembre 2026)

*Demande du propriétaire : faire proposer par d'autres IA (Gemini, ChatGPT, Copilot) des fonctionnalités pour un outil comme Cheexpeer. Le texte ci-dessous est autonome : il se copie tel quel dans chaque IA. Il ne contient aucun secret ni donnée personnelle. Les réponses reçues sont à relire avec le propriétaire avant toute décision ; aucune ne vaut décision.*

*Décision du même jour : le chat de Cheexpeer est mis de côté (« j'ai oublié le chatbot, on verra par la suite comment le mettre en place »). Les missions passent d'abord par le Centre de commande.*

## Le prompt

````text
Tu es consultant senior en produits numériques B2B, en commande publique française et en automatisation par IA. Je te demande un avis indépendant et critique, pas des compliments.

CONTEXTE
MajestiOS est une plateforme française qui accompagne les entreprises, notamment des TPE et PME du bâtiment et des services, sur toutes les phases d'un appel d'offres public :
- avant : les aider à se positionner ;
- après l'attribution : se rapprocher de l'entreprise qui a gagné pour proposer de la sous-traitance aux entreprises du même métier et de la même région ;
- après les travaux : aider à récupérer des travaux mal faits ou des retards de chantier.
La plateforme a un espace administrateur (Centre de commande), un CRM et une base de prospection.

Cheexpeer est l'assistant IA de l'administration de MajestiOS. Il travaille seul sur des « missions » préenregistrées, choisies dans un menu par l'administrateur, qui les valide avant lancement. Il est en lecture seule : il cherche, calcule, rédige des brouillons ; il n'envoie rien, ne publie rien, ne modifie rien sans validation humaine.

SOURCES DE DONNÉES DISPONIBLES OU ENVISAGÉES
Annuaire des entreprises et API Recherche d'Entreprises, base Sirene (INSEE), BODACC, BOAMP et données essentielles de la commande publique, liste des entreprises RGE, site web public des entreprises, Google Maps Platform (usage limité : recherche, vérification et lien, pas de copie en masse du contenu), éventuellement RNE/INPI.

LES 10 MISSIONS ACTUELLES
1. Surveiller le site, alerter sur toute anomalie, tenir un historique d'événements (même un nouvel espace créé).
2. Analyser les appels d'offres en cours, les traduire en codes APE/NAF, identifier les entreprises concernées.
3. Compléter des fiches de contacts (téléphone, e-mail, nom du dirigeant) et alimenter le CRM après validation de l'admin.
4. Établir des statistiques (par région, département, métier, période) utilisables comme support pédagogique et pour de futurs investisseurs.
5. Noter les entreprises sur 20 selon les exigences de l'appel d'offres et leurs références (adéquation métier 5, exigences 5, solidité financière 4, références prouvées 4, proximité 2 ; un critère non prouvé vaut 0 et est marqué « non prouvé » ; une exigence obligatoire non prouvée plafonne la note à 8/20).
6. Auditer la présence Web des entreprises qui le demandent.
7. Préparer des brouillons d'e-mails de prospection, de pitchs et de messages LinkedIn pour les dirigeants (jamais envoyés par Cheexpeer).
8. Aider à la maintenance du site.
9. Assister l'admin pour enrichir le CRM et la base de prospection (doublons, champs manquants).
10. Optimiser le SEO.

RÈGLES NON NÉGOCIABLES
Lecture seule ; validation humaine ; chaque donnée avec sa source et sa date ; une donnée absente n'est jamais présentée comme un fait négatif ; chiffres et notes calculés par du code et non par l'IA ; plafonds de coût ; essai sur une base de test avant toute activation ; respect du RGPD et des conditions d'utilisation des sources.

CE QUE JE TE DEMANDE
1. Pour chacune des 10 missions : 3 à 5 fonctionnalités concrètes qui la rendraient vraiment utile à un administrateur non technique. Classe-les par valeur et par facilité.
2. Les missions qui manquent : quelles missions supplémentaires un tel outil devrait-il avoir, à chaque phase (avant, après l'attribution, après les travaux) ?
3. Le score sur 20 : critique de la grille et des règles, critères manquants ou mal pondérés, façons de limiter les faux positifs et les biais.
4. Les sources de données françaises que je n'ai pas citées et qui seraient utiles, avec leurs conditions d'usage connues.
5. Les risques : techniques, fonctionnels, juridiques, commerciaux, et comment les réduire.
6. Comment mesurer que Cheexpeer fonctionne bien : indicateurs, jeu d'essai, contrôle humain.
7. Les 5 fonctionnalités que tu garderais si on ne pouvait en construire que 5, avec la justification.

FORMAT DE RÉPONSE
Réponds en français simple, sans jargon technique, comme pour un chef d'entreprise qui n'est pas informaticien. Utilise un titre par question. Pour chaque proposition, indique : l'idée, pourquoi elle est utile, la difficulté, et ce qui pourrait mal tourner. Signale clairement ce dont tu n'es pas sûr et ne présente aucune information incertaine comme un fait. Ne cite aucun chiffre que tu ne peux pas sourcer.
````

## Après les réponses
1. Le propriétaire colle les réponses de chaque IA (une par une) à Claude.
2. Claude les compare : idées communes, idées uniques, désaccords, risques cités.
3. Les idées retenues par le propriétaire sont ajoutées aux [fiches des missions](FICHES-MISSIONS-CHEEXPEER-2026-11-22.md) ; les autres sont écartées avec la raison.
