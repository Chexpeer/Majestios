const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "espace-membre.html"), "utf8");
const auth = fs.readFileSync(path.join(root, "auth-espace-membre.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert.match(html, /Connexion à votre espace/);
assert.match(html, /création de nouveaux espaces sera ouverte après activation du provisionnement/);
assert.match(html, /name="email"[^>]*type="email"[^>]*required/);
assert.doesNotMatch(html, /id="toggle-auth-mode"/);
assert.doesNotMatch(html, /Créer mon compte/);
assert.match(html, /name="otp"[^>]*autocomplete="one-time-code"/);
assert.match(html, /data-resend-otp/);
assert.match(styles, /personal-space-fields\[hidden\]/);
assert.match(styles, /personal-space-otp\[hidden\]/);
assert.doesNotMatch(html, /type="password"/);
assert.doesNotMatch(html, /name="passwordConfirm"/);

assert.match(auth, /supabase\.auth\.signInWithOtp\(\{ email, options \}\)/);
assert.match(auth, /let mode = "login"/);
assert.equal((auth.match(/shouldCreateUser: false/g) || []).length, 2);
assert.doesNotMatch(auth, /provision-client-workspace|shouldCreateUser: true/);
assert.match(auth, /supabase\.auth\.verifyOtp\(\{[\s\S]*?type: "email"/);
assert.match(auth, /otpInput\.required = false/);
assert.match(auth, /otpInput\.required = true/);
assert.doesNotMatch(auth, /signInWithPassword|updateUser\(\{ password|resetPasswordForEmail/);
assert.match(auth, /Aucun espace MajestiOS ne lui est associé/);
assert.match(auth, /Bienvenue dans votre espace MajestiOS/);

console.log("Contrat Auth OTP membre : connexion par code e-mail, absence de création de compte tant que le provisionnement n’est pas activé, et absence de mot de passe vérifiées.");
