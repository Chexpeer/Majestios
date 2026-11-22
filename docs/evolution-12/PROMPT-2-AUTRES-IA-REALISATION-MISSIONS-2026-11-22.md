# Prompt n°2 aux autres IA — réussir les 11 premières missions de Cheexpeer (22 novembre 2026)

*Demande du propriétaire (15 h 13) : « Reste à se concerter avec les autres IA pour mener à bien les 11 premières missions ». Ce second prompt s'utilise **avec le document joint** [FICHES-MISSIONS-CHEEXPEER-2026-11-22.md](FICHES-MISSIONS-CHEEXPEER-2026-11-22.md) (à joindre à chaque IA, ou à coller après le prompt). La mission 12 est mise de côté. Les réponses sont à comparer avec Claude avant toute décision.*

## Le prompt

````text
Tu es expert senior en conception de produits d'automatisation par IA, en données publiques françaises (commande publique, entreprises) et en tests logiciels. Je veux un avis indépendant, critique et précis, pas des compliments. Merci de ne rien inventer : quand tu n'es pas sûr, dis-le.

CONTEXTE
MajestiOS est une plateforme française qui accompagne des TPE et PME (bâtiment, services) avant, pendant et après un appel d'offres public, notamment en repérant la sous-traitance après l'attribution d'un marché. Cheexpeer est l'assistant IA de l'administration : il exécute des « missions » préenregistrées, choisies par l'administrateur (qui n'est pas informaticien), en lecture seule, avec validation humaine avant toute entrée dans le CRM. Les chiffres et les notes sont calculés par du code, pas par l'IA. Chaque donnée garde sa source et sa date.

Je te joins (ou je colle ci-dessous) le document « Fiches détaillées des missions de Cheexpeer », version du 22 novembre 2026. Il tient compte d'un premier tour d'avis de trois IA. Il décrit 11 missions et l'ordre de réalisation :
- rang 1 (valeur commerciale immédiate) : missions 2, 3, 5, 11, 7 ;
- rang 2 : missions 9, 4, 6 ;
- plus tard : missions 1, 8, 10.

CE QUE JE TE DEMANDE
Je veux maintenant les rendre RÉALISABLES SANS MAUVAISE SURPRISE. Pour chaque mission du rang 1 puis du rang 2 (une ligne seulement pour les autres) :

1. LES ÉTAPES MANQUANTES OU MAL ORDONNÉES : relis la fiche et dis ce qui ne tiendra pas en pratique.
2. LES DONNÉES EXACTES : quelles sources et quels champs précis utiliser (jeux de données, API, fichiers), avec leurs limites réelles (retard de publication, champs vides, formats, quotas). Distingue ce que tu sais avec certitude de ce que tu supposes.
3. LES RÈGLES DE DÉCISION PRÉCISES : écris-les comme une marche à suivre qu'un programme peut appliquer sans interprétation (par exemple comment relier un texte d'appel d'offres à des codes NAF, comment choisir le lieu réel des travaux, comment départager un siège et une agence, comment calculer le niveau de preuve).
4. LES CAS LIMITES ET LES ÉCHECS : au moins 5 cas difficiles par mission (données contradictoires, entreprise radiée, marché en plusieurs lots, avis modifié, etc.) et ce que Cheexpeer doit faire dans chacun.
5. LES CRITÈRES DE RÉUSSITE : « la mission est réussie quand… », avec des seuils mesurables et un jeu d'essai concret (combien de cas, de quel type, comment vérifier à la main).
6. CE QUE L'ADMINISTRATEUR DOIT VOIR À L'ÉCRAN : la maquette décrite en mots (colonnes, boutons, messages), pour qu'il valide vite sans se tromper.

Puis, sur l'ensemble :
7. LES DÉPENDANCES : dans quel ordre construire les missions du rang 1, ce qu'il faut avoir avant chaque étape, et la plus petite version utile (le « premier morceau » à livrer et tester en une semaine).
8. LES INCOHÉRENCES : contradictions entre les fiches ou avec les règles communes, points flous, décisions que le propriétaire doit encore prendre.
9. LES 10 QUESTIONS À TRANCHER : classées par importance, chacune avec ton avis motivé et l'option la moins risquée.
10. LES CAS OÙ L'IA NE DOIT PAS DÉCIDER : liste des endroits où une erreur serait grave (juridique, commercial, réputation) et le contrôle à y mettre.

FORMAT DE RÉPONSE
Français simple, sans jargon, pour un dirigeant non informaticien. Un titre par mission puis un titre par question générale. Sois précis et concret ; privilégie des tableaux courts et des listes numérotées. N'écris aucune source ou chiffre que tu ne peux pas vérifier. Signale clairement ce qui reste incertain.
````

## Après les réponses
1. Le propriétaire colle chaque réponse à Claude.
2. Claude compare, relève les accords, les idées uniques et les désaccords, et vérifie les sources citées.
3. Le propriétaire tranche ; les fiches sont mises à jour avant toute construction.
