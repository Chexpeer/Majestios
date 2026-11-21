// Règle du mot de passe sécurisé des espaces personnels (contrôle côté navigateur ; le serveur vérifie qu'un mot de passe existe).
export const PASSWORD_MIN = 12;
export const PASSWORD_HELP = "12 caractères minimum, avec au moins une lettre et un chiffre. Évitez votre adresse e-mail ou le nom de votre entreprise.";

export function validatePassword(password, { email = "", organization = "", confirm = null } = {}) {
  const p = String(password ?? "");
  if (p.length < PASSWORD_MIN) return { ok: false, message: `Le mot de passe doit contenir au moins ${PASSWORD_MIN} caractères.` };
  if (!/[A-Za-zÀ-ÿ]/.test(p) || !/\d/.test(p)) return { ok: false, message: "Ajoutez au moins une lettre et un chiffre." };
  if (/^(.)\1+$/.test(p)) return { ok: false, message: "Choisissez un mot de passe moins répétitif." };
  const lower = p.toLowerCase();
  const local = String(email).toLowerCase().split("@")[0];
  if (local.length >= 4 && lower.includes(local)) return { ok: false, message: "Le mot de passe ne doit pas contenir votre adresse e-mail." };
  const org = String(organization).toLowerCase().replace(/\s+/g, "");
  if (org.length >= 4 && lower.replace(/\s+/g, "").includes(org)) return { ok: false, message: "Le mot de passe ne doit pas contenir le nom de votre entreprise." };
  if (confirm !== null && p !== String(confirm)) return { ok: false, message: "Les deux mots de passe ne sont pas identiques." };
  return { ok: true, message: "" };
}

export function formatDeadline(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
