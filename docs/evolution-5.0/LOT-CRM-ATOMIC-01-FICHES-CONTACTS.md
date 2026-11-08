# Lot CRM — profils Entreprises et Contacts (Atomic CRM / MajestiOS)

**Branche :** `feature/crm-atomic-integration`  
**Périmètre :** première adaptation UI inspirée d'Atomic CRM  
**Statut :** modifications applicatives commitées sur branche isolée ; tests navigateur/build non exécutés dans cette session.

## Objectif

Améliorer la lecture et la qualification des contacts sans importer le modèle de données ni l'application complète Atomic CRM. MajestiOS conserve son CRM existant, ses identifiants UUID, son cloisonnement multi-organisation et ses politiques RLS.

## Réalisé

- Ajout d'une fiche contact dépliable dans chaque résultat de la liste Contacts.
- Présentation des informations disponibles : prénom, nom, fonction, entreprise associée si elle est présente dans les entreprises chargées, e-mail, téléphone, consentement, provenance et date de création.
- Liens d'action directs `mailto:` et `tel:`, avec normalisation du numéro dans la cible téléphonique.
- Ajout du champ « Fonction » au formulaire de création de contact.
- Transmission de `job_title` à la fonction de création existante.
- Recherche contact enrichie visuellement par la fonction et l'e-mail.
- Mise en page responsive et accessible : élément natif `details/summary`, libellés structurés et valeurs insérées via `textContent`.

## Fichiers modifiés

- `crm.html`
- `crm-page.js`
- `crm-workspace.css`

## Compatibilité et sécurité

- Réutilisation de la table `contacts` et de la colonne `job_title` déjà présentes dans le modèle MajestiOS.
- Réutilisation de `MajestiosCRM.createContact`, sans nouvelle requête SQL ni nouveau client Supabase.
- Les liens e-mail et téléphone sont construits à partir de valeurs textuelles ; aucune valeur CRM n'est injectée comme HTML.
- Les règles d'accès et les filtres tenant-scoped existants restent en place.
- Aucune nouvelle dépendance npm.
- Aucun code source Atomic CRM n'a été copié dans ce lot : seule l'idée d'une fiche contact structurée et rapidement actionnable a été adaptée. La licence MIT du projet source reste à respecter si des composants ou portions de code sont repris ultérieurement.

## Hors périmètre

- Pas de migration Supabase, nouvelle table, colonne, fonction, politique RLS ou modification de données.
- Pas de gestion de tâches/notes séparée : ce sujet nécessite un cadrage de modèle avant d'ajouter des écritures.
- Pas de pipeline Kanban, import/export ou capture e-mail dans ce lot.
- Aucun changement sur l'immeuble interactif, la recherche générale, les autres rubriques ou l'espace client.
- Aucun déploiement, merge ou promotion en production.

## Contrôles restant à effectuer

1. Vérifier le rendu des fiches contact sur ordinateur et mobile.
2. Créer un contact de test avec fonction, e-mail et téléphone dans un environnement de test.
3. Vérifier la persistance de `job_title`, l'ouverture de `mailto:` et `tel:`.
4. Tester les rôles viewer et editor, puis confirmer que les contrôles RLS n'ont pas changé.
5. Exécuter le build et les tests existants dans l'environnement de développement du dépôt.
