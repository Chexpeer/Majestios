const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = path.join(__dirname, "dist");
const siteFiles = ["index.html", "styles.css", "app.js"];
const routeDirectories = ["opportunites", "services", "contact", "espace-client"];

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of siteFiles) {
  fs.copyFileSync(path.join(__dirname, file), path.join(outputDirectory, file));
}

for (const directory of routeDirectories) {
  const source = path.join(__dirname, directory);
  if (fs.existsSync(source)) {
    fs.cpSync(source, path.join(outputDirectory, directory), { recursive: true });
  }
}
