# Doctrine d'accès au moteur de Prospection — visiteur et membre

Date : 2026-11-08  
Branche de travail : `feature/crm-atomic-integration`

## Décision fonctionnelle retenue

Le moteur de Prospection conserve une expérience unifiée, avec deux niveaux d'accès :

1. **Visiteur — annuaire généraliste** : recherche simple d'une entreprise et consultation d'une fiche publique synthétique.
2. **Membre — recherche avancée** : après création gratuite de son accès personnel, recherche multicritère, ciblage, qualification et préparation de fichiers B2B.

Le visiteur n'est pas limité à une démonstration fictive : il bénéficie d'un véritable service d'annuaire généraliste. L'inscription gratuite ouvre les fonctions avancées.

Le bouton d'appel à l'action doit exprimer clairement la contrepartie :
**« Créez votre accès personnel gratuitement »**  
*« Bénéficiez de recherches avancées et accédez à des fichiers B2B qualifiés pour développer votre activité. »*

## Périmètre visiteur

Fonctions autorisées :
- recherche simple par nom d'entreprise ou terme généraliste ;
- consultation d'une fiche synthétique issue de données publiques ;
- informations générales strictement nécessaires à l'identification de l'entreprise.

Fonctions non accessibles :
- filtres multicritères APE/NAF, effectif, ancienneté, forme juridique, chiffre d'affaires, labels et ciblage géographique avancé ;
- constitution ou export de fichiers B2B qualifiés ;
- qualification commerciale, scoring de ciblage et préparation de prospects ;
- sauvegarde dans un espace commercial ou transmission au CRM.

La recherche publique doit avoir un périmètre et des quotas maîtrisés (limite de résultats, pagination bornée, limitation de fréquence, validation des paramètres). Elle ne doit pas devenir un proxy public générique vers les API amont.

## Périmètre membre

Après authentification, le moteur peut proposer :
- les critères avancés déjà définis dans la rubrique ;
- le rapprochement, le dédoublonnage et la qualification des entreprises ;
- la constitution de fichiers B2B qualifiés ;
- la préparation et la sauvegarde de prospects ;
- les transmissions vers le CRM selon les droits de l'utilisateur et de son organisation.

L'inscription gratuite existante dans `espace-membre.html` provisionne un espace client via `provision-client-workspace`. L'accès avancé doit être accordé uniquement après validation serveur de l'identité, de l'appartenance à une organisation cliente et de l'état/droits de cette appartenance. Un JWT valide, à lui seul, ne suffit pas à autoriser la recherche avancée.

## Architecture de sécurité requise

- Conserver un seul moteur métier et un DTO MajestiOS normalisé ; faire varier les capacités selon le niveau d'accès.
- Créer un chemin serveur public strictement limité à l'annuaire généraliste. Il ne doit accepter que les paramètres publics autorisés et ne doit retourner ni nom de fournisseur, ni URL de fournisseur, ni identifiant technique de source, ni payload brut.
- Conserver un chemin serveur distinctement autorisé pour la recherche avancée. Il vérifie la session avec Supabase Auth, puis l'appartenance active à une organisation cliente et les permissions nécessaires avant d'interroger les connecteurs.
- Ne pas transformer `search-official-companies` en endpoint anonyme : son exigence JWT actuelle est une barrière utile, mais l'authentification seule ne constitue pas l'autorisation métier.
- Garder la provenance technique dans une couche serveur restreinte ; ne jamais l'envoyer au navigateur.
- Le navigateur ne doit appeler aucun fournisseur directement et ne doit conserver aucun payload brut amont.
- Le contrôle d'accès doit être appliqué au serveur et, lorsque des données persistées sont concernées, renforcé par RLS. Masquer les contrôles avancés dans l'interface n'est jamais une mesure de sécurité suffisante.
- Le moteur de recherche global de la page d'accueil est hors périmètre : ne pas le modifier.

## État du code vérifié sur la branche

- `prospection-active.html` charge `company-targeting.js` et `company-targeting-page.js`, sans initialiser actuellement de client Supabase sur cette page.
- `company-targeting.js` interroge directement le service public de recherche d'entreprises depuis le navigateur et conserve des métadonnées de provenance ainsi que le payload brut dans les objets normalisés.
- `company-targeting-page.js` orchestre les filtres avancés et les résultats de cette recherche.
- `qualification-entreprises.html` charge le même moteur et expose encore dans son texte de présentation le nom du service technique interrogé ; ce texte devra être neutralisé.
- `search-official-companies` exige déjà un JWT valide, mais son contrôle actuel ne démontre pas une appartenance à une organisation cliente ni une permission de prospection avancée.
- `auth-espace-membre.js` utilise déjà Supabase Auth et la table `organization_members`, et provisionne un espace client après inscription/confirmation.
- `crm-client.js` distingue les organisations internes des organisations clientes pour l'accès au CRM interne ; cette logique ne doit pas être réutilisée telle quelle pour donner un accès client à la prospection.

## Séquencement de mise en œuvre

1. Vérifier le schéma exact, les statuts, rôles et politiques RLS de `organizations` et `organization_members`, ainsi que les règles du provisionnement client. Ne pas supposer qu'un champ ou statut existe sans le vérifier.
2. Définir et tester la fonction serveur d'autorisation avancée : utilisateur confirmé, organisation de type client, appartenance valide, permission explicite de recherche avancée.
3. Définir le DTO public synthétique et le DTO avancé, tous deux sans provenance ni payload amont.
4. Mettre en place le point d'entrée public limité (annuaire généraliste) et les protections anti-abus.
5. Mettre en place le point d'entrée avancé authentifié et autorisé côté serveur.
6. Migrer `company-targeting.js` afin qu'il n'effectue plus aucun appel direct à un fournisseur et qu'il utilise le point d'entrée correspondant au niveau d'accès.
7. Adapter l'interface de `prospection-active.html` : visiteur par défaut, recherche simple, résultats synthétiques, bouton d'inscription gratuite ; membre connecté, formulaire avancé.
8. Appliquer la même règle à `qualification-entreprises.html` sans créer de voie de contournement.
9. Vérifier les scénarios visiteur, membre client, membre interne, utilisateur sans organisation, organisation inactive, session expirée, tentative d'appel direct et absence de fuite de métadonnées.
10. Vérifier les tests et le build local/CI avant toute demande distincte de déploiement.

## Garde-fous

- Aucun changement du moteur de recherche global de l'accueil.
- Aucun déploiement Supabase ou Vercel dans ce lot.
- Aucun changement de schéma, de RLS, de secret ou de configuration du projet Supabase sans autorisation explicite distincte.
- Aucun accès avancé accordé sur le seul critère `auth.getUser()`.
- Aucune source, aucun fournisseur, aucun connecteur et aucune URL technique visibles par le visiteur ou le membre.
- Aucun export de fichier B2B pour le visiteur.
- Les données publiques consultables ne doivent pas être présentées comme une qualification commerciale ou une preuve de capacité d'une entreprise.

## Critères d'acceptation

- Un visiteur peut rechercher une entreprise dans l'annuaire généraliste sans créer de compte.
- Un visiteur ne peut pas appeler les fonctions avancées en manipulant le navigateur ou l'URL.
- Le bouton d'inscription gratuite conduit au parcours existant de création d'espace personnel.
- Un membre client autorisé accède aux critères avancés et aux résultats qualifiés.
- Un compte interne, un compte sans organisation cliente ou une appartenance inactive ne reçoit pas automatiquement l'accès avancé.
- Les deux niveaux retournent exclusivement des données normalisées MajestiOS, sans nom/URL/ID de source ni payload brut.
- Le moteur global de la page d'accueil reste inchangé.
