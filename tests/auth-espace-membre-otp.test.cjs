const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "espace-membre.html"), "utf8");
const auth = fs.readFileSync(path.join(root, "auth-espace-membre.js"), "utf8");
const provisioning = fs.readFileSync(path.join(root, "supabase/functions/provision-client-workspace/index.ts"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert.match(html, /name="firstName"[^>]*required/);
assert.match(html, /name="lastName"[^>]*required/);
assert.match(html, /name="email"[^>]*type="email"[^>]*required/);
assert.match(html, /name="organizationName"[^>]*maxlength="120"/);
assert.match(html, /Entreprise <small>\(facultatif\)<\/small>/);
assert.match(html, /Téléphone <small>\(facultatif\)<\/small>/);
assert.match(html, /name="otp"[^>]*autocomplete="one-time-code"/);
assert.match(html, /data-resend-otp/);
assert.match(styles, /personal-space-fields\[hidden\]/);
assert.match(styles, /personal-space-otp\[hidden\]/);
assert.doesNotMatch(html, /type="password"/);
assert.doesNotMatch(html, /name="passwordConfirm"/);

assert.match(auth, /supabase\.auth\.signInWithOtp\(\{ email, options \}\)/);
assert.match(auth, /shouldCreateUser: mode === "signup"/);
assert.match(auth, /supabase\.auth\.verifyOtp\(\{[\s\S]*?type: "email"/);
assert.match(auth, /otpInput\.required = false/);
assert.match(auth, /otpInput\.required = true/);
assert.doesNotMatch(auth, /signInWithPassword|updateUser\(\{ password|resetPasswordForEmail/);
assert.match(auth, /privacy_notice_version: "2026-11-05"/);
assert.match(auth, /organization_name: value\("organizationName"\) \|\| "Espace personnel"/);

assert.match(provisioning, /body\.privacy_acknowledged !== true/);
assert.match(provisioning, /\|\| "Espace personnel"/);
assert.match(provisioning, /admin\.auth\.getUser\(token\)/);
assert.match(provisioning, /provision_client_workspace/);

console.log("Contrat Auth OTP membre : formulaire simplifié, code e-mail, provisionnement authentifié et absence de mot de passe vérifiés.");
