import assert from "node:assert/strict";
import { safeOfficialSourceUrl } from "../official-source-links.js";

assert.equal(
  safeOfficialSourceUrl("https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:ABC", "bodacc"),
  "https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:ABC"
);
assert.equal(
  safeOfficialSourceUrl("https://www.boamp.fr/pages/avis/?q=idweb:ABC", "boamp"),
  "https://www.boamp.fr/pages/avis/?q=idweb:ABC"
);
for (const unsafe of [
  "javascript:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "http://www.bodacc.fr/annonce",
  "https://evil.example/bodacc.fr",
  "//evil.example/path",
  "https://www.bodacc.fr.evil.example/path"
]) {
  assert.equal(safeOfficialSourceUrl(unsafe, "bodacc"), "https://www.bodacc.fr/pages/annonces-commerciales-recherche/");
}
assert.equal(
  safeOfficialSourceUrl("https://evil.example/avis", "boamp"),
  "https://www.boamp.fr/"
);
assert.equal(
  safeOfficialSourceUrl("https://www.bodacc.fr/annonce", "unknown"),
  "https://www.boamp.fr/"
);
console.log("Liens BOAMP/BODACC : protocoles HTTPS et domaines officiels contrôlés.");
