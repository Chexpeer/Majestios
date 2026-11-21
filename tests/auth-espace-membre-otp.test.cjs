const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(require("../chemins-site.cjs").resolveFile(path.join(__dirname, ".."), "espace-membre.html"), "utf8");
const auth = fs.readFileSync(path.join(root, "auth-espace-membre.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert.match(html, /Connexion à votre espace/);
assert.match(html, /name="email"[^>]*type="email"[^>]*required/);
assert.doesNotMatch(html, /id="toggle-auth-mode"/);
assert.doesNotMatch(html, /Créer mon compte/);
assert.doesNotMatch(html, /name="otp"|one-time-code/, "plus de saisie de code : connexion par lien");
assert.match(html, /data-resend-otp/);
assert.match(styles, /personal-space-fields\[hidden\]/);
assert.match(styles, /personal-space-otp\[hidden\]/);
// Mot de passe : seulement dans l'étape d'activation (jamais pour se connecter) ; le formulaire de connexion reste « code seul ».
assert.equal((html.match(/type="password"/g) || []).length, 3, "connexion (1) + activation (2)");
assert.match(html, /name="login_password"[^>]*autocomplete="current-password"/);
assert.match(html, /data-send-link/);
assert.doesNotMatch(html, /name="passwordConfirm"|name="password"/);

assert.match(auth, /supabase\.auth\.signInWithOtp\(\{ email, options: \{ \.\.\.options, emailRedirectTo: `\$\{window\.location\.origin\}\/espace-membre\.html` \} \}\)/);
// Création par code (Evolution-10, 15/11/2026) : création seulement dans le mode « création », avec consentement, puis provisionnement serveur après vérification du code.
assert.equal((auth.match(/shouldCreateUser: false/g) || []).length, 2);
assert.equal((auth.match(/shouldCreateUser: true/g) || []).length, 1);
assert.match(auth, /createMode\s*\?\s*\{ shouldCreateUser: true[\s\S]*?privacy_notice_acknowledged: true[\s\S]*?: \{ shouldCreateUser: false \}/);
assert.match(auth, /if \(createMode && !field\("privacy_ack"\)\?\.checked\) throw/);
assert.match(auth, /provision-client-workspace/);
assert.ok(auth.indexOf("updateUser({ password") < auth.indexOf("provisionWorkspace(session)"), "l'espace n'est demandé qu'après le mot de passe sécurisé");
assert.doesNotMatch(auth, /verifyOtp|otpInput/, "plus de saisie de code");
assert.match(auth, /validatePassword\(/);
assert.match(auth, /start_member_activation/);
assert.match(html, /name="privacy_ack" type="checkbox"/);
assert.match(html, /data-toggle-create/);
assert.doesNotMatch(html, /name="firstName"|name="lastName"|name="phone"/);
assert.match(auth, /signInWithPassword\(/, "connexion par mot de passe après activation");
assert.doesNotMatch(auth, /resetPasswordForEmail/);
assert.match(auth, /Bienvenue dans votre espace MajestiOS/);

console.log("Contrat Auth OTP membre : connexion par lien e-mail, absence de création de compte tant que le provisionnement n’est pas activé, et connexion par mot de passe après activation vérifiées.");

// Demande du propriétaire (15/11/2026) : lien discret « Créer mon espace personnel » ; ce n'est pas un formulaire d'inscription : il renvoie vers le contact tant que la création est suspendue.
assert.match(html, /data-open-create>Créer mon espace personnel<\/button>/);
