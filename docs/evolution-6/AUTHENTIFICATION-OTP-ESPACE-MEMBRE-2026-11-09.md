# Authentification simplifiée de l’espace membre — 9 novembre 2026

**Statut :** implémentation applicative versionnée sur `Evolution-6`, non déployée sur Supabase ni promue sur Vercel.  
**Périmètre :** création et connexion des membres/clients par code OTP e-mail natif Supabase Auth.  
**Hors périmètre :** authentification de l’administration interne, droits CRM VIP, QR code de connexion, tokens IA.

## 1. Décision produit

Le site public reste consultable sans compte. La création d'un espace personnel utilise un formulaire réduit :
- prénom et nom obligatoires ;
- adresse e-mail obligatoire ;
- entreprise facultative ;
- téléphone facultatif ;
- prise de connaissance de la politique de confidentialité.

Aucun mot de passe n'est demandé aux membres et clients. La connexion initiale et les connexions ultérieures utilisent un code temporaire envoyé par e-mail.

L'entreprise absente est représentée dans le backend par un espace personnel nommé « Espace personnel ». Cela permet de conserver le provisionnement atomique d'une organisation cliente sans rendre l'entreprise obligatoire dans le formulaire.

## 2. Parcours technique livré sur la branche

1. L'utilisateur choisit « Créer mon espace » ou « Se connecter ».
2. Le navigateur appelle `supabase.auth.signInWithOtp()`.
   - création : `shouldCreateUser: true`, avec les informations de profil et l'acceptation de confidentialité ;
   - connexion : `shouldCreateUser: false`.
3. Supabase envoie l'e-mail OTP.
4. L'utilisateur saisit le code à six chiffres dans le formulaire.
5. Le navigateur appelle `supabase.auth.verifyOtp({ email, token, type: "email" })`.
6. Supabase établit la session.
7. Pour une création, le client appelle `provision-client-workspace` avec le jeton de session ; la fonction vérifie le jeton avec `auth.getUser(token)`, puis appelle le RPC atomique `provision_client_workspace`.
8. Le statut de connexion est affiché et l'utilisateur peut se déconnecter.

Le formulaire masque les champs initiaux pendant la saisie du code. Un délai visuel de 60 secondes est appliqué au bouton de renvoi ; ce délai côté navigateur n'est pas une protection de sécurité et ne remplace pas les limites côté Supabase Auth.

## 3. Fichiers modifiés

- `espace-membre.html` : formulaire simplifié, champ OTP, renvoi de code.
- `auth-espace-membre.js` : remplacement du flux mot de passe/récupération par `signInWithOtp` et `verifyOtp`.
- `supabase/functions/provision-client-workspace/index.ts` : accepte les informations facultatives du formulaire après authentification et utilise « Espace personnel » si aucun nom d'entreprise n'est fourni ; le RPC existant continue d'enregistrer la prise de connaissance et de créer l'espace de manière atomique.
- `tests/auth-espace-membre-otp.test.cjs` : contrat statique du formulaire et du flux OTP.
- `.github/workflows/verify-site.yml` : vérification syntaxique de la fonction de provisionnement et exécution du nouveau test.

Aucune migration SQL n'est ajoutée. Aucune politique RLS ni permission CRM n'est modifiée.

## 4. Paramètres Supabase à vérifier avant activation

Dans le projet métier `majestios-crm`, contrôler dans **Authentication → Email Templates** que le modèle « Magic Link » contient le jeton OTP, par exemple :

```html
<p>Votre code de connexion MajestiOS : <strong>{{ .Token }}</strong></p>
```

Supabase réutilise le modèle « Magic Link » pour l'envoi d'un OTP. Si le modèle contient uniquement un lien, le client ne recevra pas le code numérique attendu.

Dans **Authentication → Providers → Email** :
- conserver l'authentification e-mail activée ;
- vérifier la confirmation d'adresse ;
- régler l'expiration OTP à **600 secondes (10 minutes)**, si compatible avec la configuration du projet ;
- ne pas dépasser les recommandations de sécurité Supabase.

Dans **Authentication → Rate Limits** :
- contrôler les limites d'envoi OTP et de vérification ;
- conserver les protections anti-abus côté serveur ;
- vérifier le comportement avec le fournisseur SMTP réellement configuré.

Ces réglages ne sont pas modifiés par le code et n'ont pas été changés dans le projet distant.

Références officielles :
- [Supabase — Passwordless email logins](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Supabase — Rate limits](https://supabase.com/docs/guides/auth/rate-limits)
- [Supabase — Email templates](https://supabase.com/docs/guides/auth/auth-email-templates)

**Attention au plan e-mail :** Supabase a modifié le 3 juin 2026 la personnalisation des modèles sur certains nouveaux projets Free utilisant le SMTP par défaut. Vérifier les capacités du projet existant ; prévoir un SMTP personnalisé si un modèle de marque est nécessaire.

## 5. Points bloquants avant activation réelle

L'audit direct du 9 novembre 2026 a constaté que `provision-client-workspace` n'apparaissait pas dans l'inventaire des Edge Functions actives de `majestios-crm`, alors que le code existait dans le dépôt.

Le code de cette fonction a maintenant été adapté sur `Evolution-6`, mais **il n'a pas été déployé**. Tant qu'elle n'est pas activée et testée dans un environnement isolé, le parcours de création peut vérifier l'adresse e-mail et ouvrir une session, mais la création de l'espace client ne peut pas être garantie.

Avant toute activation :
1. préparer une stack Supabase locale ou le projet de test vierge ;
2. vérifier les migrations nécessaires sans appliquer la migration locale non validée `20261108151400_enforce_vip_boundary_for_internal_crm.sql` ;
3. déployer la fonction adaptée uniquement dans l'environnement de test ;
4. tester création, OTP valide/invalide/expiré, renvoi, connexion d'un compte existant, provisionnement idempotent et erreurs réseau ;
5. confirmer que le compte client n'obtient aucun accès au CRM VIP ;
6. vérifier l'e-mail réel et les limites de débit ;
7. seulement ensuite planifier une activation du projet métier, après autorisation.

Ne jamais créer des comptes ou des données de test dans la base métier réelle.

## 6. Sécurité et séparation des privilèges

- Le code OTP authentifie une adresse e-mail ; il n'accorde aucun rôle métier.
- Les autorisations restent fondées sur les appartenances et les politiques serveur/RLS, jamais sur le formulaire ou les métadonnées modifiables par l'utilisateur.
- Le CRM VIP reste strictement réservé aux administrateurs internes autorisés.
- Un rôle `owner/admin` dans une organisation cliente ou partenaire ne confère aucun accès au CRM interne.
- Le flux d'administration et le bootstrap du premier administrateur ne sont pas modifiés.
- Le code client ne contient aucune clé `service_role`.
- Les erreurs d'envoi sont volontairement génériques afin de limiter la divulgation de l'existence d'un compte.

## 7. QR code : phase ultérieure, pas dans ce lot

Le QR code n'est pas implémenté dans cette livraison. Il ne doit jamais être un identifiant permanent ni un droit d'accès autonome. S'il est étudié ultérieurement, il devra représenter un jeton aléatoire temporaire, à usage unique, à durée courte, révocable et validé côté serveur. Le code OTP e-mail reste la méthode de référence dans le présent lot.

## 8. Critères d'acceptation

- [x] Aucun champ mot de passe dans le formulaire membre.
- [x] Prénom, nom et e-mail obligatoires à la création.
- [x] Entreprise et téléphone facultatifs.
- [x] Envoi de code via Supabase Auth natif.
- [x] Vérification par `verifyOtp` de type `email`.
- [x] Connexion existante sans création automatique de compte.
- [x] Renvoi de code avec délai visuel.
- [x] Provisionnement atomique conservé côté serveur.
- [x] Test statique ajouté à la CI.
- [ ] Test d'intégration avec Supabase local.
- [ ] Vérification du modèle e-mail et des paramètres OTP distants.
- [ ] Déploiement de la fonction `provision-client-workspace` dans l'environnement de test.
- [ ] Tests Auth/RLS multi-identités.
- [ ] Validation complète avant activation sur le projet métier.

**Conclusion :** le parcours front-end OTP et son contrat de provisionnement sont versionnés sur `Evolution-6`. La livraison n'est pas encore qualifiée d'opérationnelle en production ; la configuration Auth, le déploiement Edge manquant et les tests d'intégration restent des prérequis explicites.
