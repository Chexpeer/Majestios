const FALLBACKS = Object.freeze({
  bodacc: "https://www.bodacc.fr/pages/annonces-commerciales-recherche/",
  boamp: "https://www.boamp.fr/"
});

const ALLOWED_HOSTS = Object.freeze({
  bodacc: new Set(["bodacc.fr", "www.bodacc.fr"]),
  boamp: new Set(["boamp.fr", "www.boamp.fr"])
});

export function safeOfficialSourceUrl(value, kind) {
  const fallback = FALLBACKS[kind] || FALLBACKS.boamp;
  try {
    const url = new URL(String(value || ""));
    if (url.protocol !== "https:" || !ALLOWED_HOSTS[kind]?.has(url.hostname.toLowerCase())) {
      return fallback;
    }
    return url.href;
  } catch {
    return fallback;
  }
}
