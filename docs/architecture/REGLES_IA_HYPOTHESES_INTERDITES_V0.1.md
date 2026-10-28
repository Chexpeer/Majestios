# Règles IA — hypothèses interdites

> **Règle fondamentale : une information métier absente ne doit jamais être inventée.**

Lorsqu'une information métier manque, est ambiguë ou contradictoire, l'assistant doit inscrire **« Validation Fondateur requise »**, préciser la question et arrêter uniquement le périmètre qui en dépend.

Il ne doit pas créer de valeur par défaut, de statut, de rôle, de permission, de prix, de délai, de source, de promesse client, de règle de rétention ou de comportement métier pour masquer l'absence.

Une proposition technique peut être formulée séparément comme proposition, avec ses conséquences, mais elle ne devient pas une décision métier sans validation explicite.

## Application au dépôt MajestiOS

- Distinguer les faits sourcés, les hypothèses de travail et les décisions humaines.
- Ne jamais déclarer opérationnelle une fonctionnalité qui n'a pas été implémentée et vérifiée.
- Ne jamais présenter des données fictives comme des annonces réelles.
- Ne jamais affirmer qu'un formulaire transmet ou enregistre des données sans vérifier le traitement serveur.
- Ne jamais fusionner un ancien composant ou une ancienne branche sans examiner ses différences avec la branche de travail.
- Toute action engageante vers un tiers exige une validation humaine explicite et traçable.
