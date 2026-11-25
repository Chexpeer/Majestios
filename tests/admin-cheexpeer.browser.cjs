// Test navigateur du centre de commande Cheexpeer : SDK Supabase et API simulés, aucun réseau réel.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".png": "image/png", ".webp": "image/webp" };
const ORG = "7ae83b50-bbd7-4098-bb38-0cfae56492f4", MID = "dddddddd-dddd-4ddd-8ddd-dddddddddddd", AID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

const fakeSdk = `
export function createClient(){
  const chain = (rows)=>{ const q={ select:()=>q, eq:()=>q, in:()=>q, limit:()=>q, then:(r)=>r({data:rows,error:null}) }; return q; };
  return { auth:{ getSession: async()=>({data:{session: window.__signedIn===false?null:{access_token:'tok',user:{id:'u1'}}},error:null}),
    signOut: async()=>({}), signInWithOtp: async()=>({error:null}), verifyOtp: async()=>({error:null}) },
    rpc: async(name)=>{ (window.__rpc=window.__rpc||[]).push(name);
      if(name==='cheexpeer_chat_status') return {data:{enabled:window.__chatOn!==false,is_owner:true,daily_cap:30,monthly_cap:500,used_today:1,used_month:3},error:null};
      if(name==='cheexpeer_chat_history') return {data:{conversation_id:null,messages:[]},error:null};
      return {data:{ok:true},error:null}; },
    from:(t)=> t==='organization_members'? chain([{organization_id:'${ORG}',role:'owner'}]) : chain([{id:'${ORG}',kind:'internal'}]) };
}`;

(async () => {
  assert.ok(fs.existsSync(path.join(root, "admin-cheexpeer.html")), "Exécuter node build.js avant le test.");
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "admin-cheexpeer.html";
    const f = path.resolve(root, p);
    if (!f.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(f, (e, d) => e ? res.writeHead(404).end() : (res.writeHead(200, { "content-type": mime[path.extname(f)] || "application/octet-stream" }), res.end(d)));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const page = await (await browser.newContext()).newPage();
    const errors = []; page.on("pageerror", (e) => errors.push(e.message));
    const calls = [];
    let approved = false;
    await page.route("https://esm.sh/**", (r) => r.fulfill({ contentType: "text/javascript", body: fakeSdk }));
    await page.route("**/functions/v1/**", async (r) => {
      const name = new URL(r.request().url()).pathname.split("/").pop();
      const body = JSON.parse(r.request().postData() || "{}");
      calls.push({ name, body, auth: r.request().headers().authorization });
      const mission = { id: MID, organization_id: ORG, mission_type: "readiness_probe", title: "Diagnostic de disponibilité", status: approved ? "approved" : "pending_approval", autonomy_level: 0, created_at: new Date().toISOString(), result: {} };
      const detail = { ok: true, mission, approvals: [{ id: AID, status: approved ? "approved" : "pending", action_summary: "Diagnostic sans effet externe", created_at: mission.created_at }], events: [{ id: "e1", event_type: "mission_created", actor_type: "user", occurred_at: mission.created_at }] };
      if (name === "cheexpeer-chat") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, conversation_id: "11111111-1111-4111-8111-111111111111", reply: "Bonjour, je suis Majestios Bot." }) });
      if (name === "cheexpeer-mission-submit") return r.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true, mission: { mission_id: MID, mission_status: "pending_approval", was_created: true } }) });
      if (name === "cheexpeer-approval-decision") { approved = true; return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }); }
      return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(detail) });
    });
    await page.goto(origin + "/admin-cheexpeer.html");
    await page.waitForSelector("#workspace:not([hidden])");
    assert.match(await page.textContent(".cx-banner-inline"), /rien n’est envoyé/);
    await page.click(".cx-diag summary");
    await page.click("#cx-submit button");
    await page.waitForSelector("#cx-detail:not([hidden])");
    const submit = calls.find((c) => c.name === "cheexpeer-mission-submit");
    assert.equal(submit.auth, "Bearer tok");
    assert.equal(submit.body.organization_id, ORG);
    assert.ok(!("created_by" in submit.body));
    await page.waitForFunction(() => document.querySelector("#cx-detail")?.textContent.includes("Approuvée"));
    const decision = calls.find((c) => c.name === "cheexpeer-approval-decision");
    assert.equal(decision.body.decision, "approved");
    // Un seul clic a suffi : envoi, lecture, validation ; aucune étape manuelle.
    assert.deepEqual(calls.map((c) => c.name).slice(0, 3), ["cheexpeer-mission-submit", "cheexpeer-mission-read", "cheexpeer-approval-decision"]);
    assert.ok(!("decision_by" in decision.body));
    assert.match(await page.textContent("#cx-recent"), /Diagnostic de disponibilité/);
    // Prospects : un clic = envoi + validation + exécution.
    calls.length = 0; approved = false;
    await page.click('.cx-tab[data-tab="prospects"]');
    await page.selectOption('#cx-prospects select[name="naf"]', "43.22B"); await page.fill('#cx-prospects input[name="departement"]', "81");
    await page.click('#cx-prospects button[type="submit"]');
    await page.waitForFunction(() => document.querySelector("#cx-pro-status")?.textContent.includes("Terminé"));
    for (let i = 0; i < 50 && calls.length < 5; i++) await new Promise((r) => setTimeout(r, 50));
    assert.deepEqual(calls.map((c) => c.name), ["cheexpeer-mission-submit", "cheexpeer-mission-read", "cheexpeer-approval-decision", "cheexpeer-mission-run", "cheexpeer-mission-read"]);
    // Dialogue : nom visible, envoi avec jeton, réponse affichée.
    assert.match(await page.textContent("#cx-chat-title"), /Majestios Bot/);
    assert.match(await page.textContent("#cx-chat-state"), /Dialogue actif/);
    await page.click("#cx-bot-launcher");
    await page.fill("#cx-chat-form textarea", "Bonjour");
    await page.click("#cx-chat-form button[type=submit]");
    await page.waitForFunction(() => document.querySelector("#cx-chat-log")?.textContent.includes("je suis Majestios Bot"));
    const chatCall = calls.find((c) => c.name === "cheexpeer-chat");
    assert.equal(chatCall.auth, "Bearer tok"); assert.equal(chatCall.body.message, "Bonjour");
    assert.ok(!("organization_id" in chatCall.body) && !("user_id" in chatCall.body));
    // Dialogue éteint : formulaire masqué.
    const pageOff = await (await browser.newContext()).newPage();
    await pageOff.addInitScript(() => { window.__chatOn = false; });
    await pageOff.route("https://esm.sh/**", (r) => r.fulfill({ contentType: "text/javascript", body: fakeSdk }));
    await pageOff.goto(origin + "/admin-cheexpeer.html");
    await pageOff.waitForSelector("#workspace:not([hidden])");
    await pageOff.waitForFunction(() => document.querySelector("#cx-chat-state")?.textContent.includes("éteint"));
    assert.equal(await pageOff.isHidden("#cx-chat-form"), true);
    // Non connecté : le centre reste fermé.
    const page2 = await (await browser.newContext()).newPage();
    await page2.addInitScript(() => { window.__signedIn = false; });
    await page2.route("https://esm.sh/**", (r) => r.fulfill({ contentType: "text/javascript", body: fakeSdk }));
    await page2.goto(origin + "/admin-cheexpeer.html");
    await page2.waitForSelector("#cx-login:not([hidden])");
    assert.equal(await page2.isHidden("#workspace"), true);
    assert.deepEqual(errors, []);
    console.log("admin-cheexpeer.browser : OK");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
