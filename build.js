const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = path.join(__dirname, "dist");
const siteFiles = ["index.html", "nous-rejoindre.html", "espace-membre.html", "faq.html", "styles.css", "app.js", "schema-majestios.svg"];

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of siteFiles) {
  fs.copyFileSync(path.join(__dirname, file), path.join(outputDirectory, file));
}
