const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const configPath = path.resolve(__dirname, "..", "vercel.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
assert.equal(config.git?.deploymentEnabled, false,
  "Les déploiements automatiques déclenchés par Git doivent rester désactivés.");
console.log("Vercel deployment policy: OK — seuls les déploiements déclenchés manuellement restent autorisés.");
