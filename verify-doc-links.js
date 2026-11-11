const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const canonicalFiles = [
  "README.md",
  "AGENTS.md",
  "docs/README.md",
  "docs/CRITIQUES/README.md"
];
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const docsDirectory = path.join(root, "docs", "evolution-9");
const files = [
  ...canonicalFiles.map((file) => path.join(root, file)),
  ...walk(docsDirectory).filter((file) => file.endsWith(".md"))
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    errors.push("Document canonique absent : " + path.relative(root, file));
    continue;
  }

  const content = fs.readFileSync(file, "utf8").replace(/^```[\s\S]*?^```/gm, "");
  const links = content.matchAll(/\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+[^)]*)?\)/g);

  for (const match of links) {
    let target = match[1].replace(/^<|>$/g, "");
    if (!target || /^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(target)) continue;

    target = target.split("#")[0].split("?")[0];
    if (!target) continue;

    let decoded;
    try {
      decoded = decodeURIComponent(target);
    } catch {
      errors.push(path.relative(root, file) + " : URL locale mal encodée : " + target);
      continue;
    }

    const resolved = path.resolve(path.dirname(file), decoded);
    if (resolved !== root && !resolved.startsWith(root + path.sep)) {
      errors.push(path.relative(root, file) + " : lien sortant du dépôt : " + target);
      continue;
    }
    if (!fs.existsSync(resolved)) {
      errors.push(path.relative(root, file) + " : cible locale absente : " + target);
    }
  }
}

if (errors.length) {
  console.error("Vérification documentaire échouée :");
  for (const error of errors) console.error("- " + error);
  process.exitCode = 1;
} else {
  console.log("Documentation vérifiée : " + files.length + " fichiers canoniques, liens locaux présents.");
}
