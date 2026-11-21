import assert from "node:assert/strict";
import { PAGES, safeReturnTo, canOpen, landingAfterInvitation, landingAfterLogin, emailRedirect, RETURN_ALLOWED } from "../parcours-majestios.mjs";

assert.equal(safeReturnTo("https://evil.example/"), PAGES.connexionInterne);
assert.equal(safeReturnTo("//evil.example"), PAGES.connexionInterne);
assert.equal(safeReturnTo(null), PAGES.connexionInterne);
assert.equal(safeReturnTo("admin-annonces.html"), "admin-annonces.html");
assert.ok(RETURN_ALLOWED.includes("admin-utilisateurs.html"));

assert.equal(landingAfterInvitation({ kind: "client", role: "owner" }), "espace-membre.html");
assert.equal(landingAfterInvitation({ kind: "client", role: "member" }), "espace-membre.html");
assert.equal(landingAfterInvitation({ kind: "internal", role: "admin" }), "administration.html");
assert.equal(landingAfterInvitation({ kind: "internal", role: "member" }), "espace-interne.html");
assert.equal(landingAfterInvitation({ kind: "internal", role: "viewer" }), "espace-interne.html");
assert.equal(landingAfterInvitation({}), "espace-interne.html");

assert.equal(canOpen("admin-annonces.html", "admin"), true);
assert.equal(canOpen("admin-annonces.html", "member"), false);
assert.equal(canOpen("admin-annonces.html", null), false);
assert.equal(canOpen("espace-interne.html", "viewer"), true);

assert.equal(landingAfterLogin({ internalRole: "owner", returnTo: "admin-annonces.html" }), "admin-annonces.html");
assert.equal(landingAfterLogin({ internalRole: "member", returnTo: "admin-annonces.html" }), "espace-interne.html");
assert.equal(landingAfterLogin({ internalRole: "admin", returnTo: "http://x" }), "espace-interne.html");
assert.equal(landingAfterLogin({ isClient: true }), "espace-membre.html");
assert.equal(landingAfterLogin({}), "espace-interne.html");

assert.equal(emailRedirect("https://s.vercel.app/", PAGES.accepterInvitation), "https://s.vercel.app/accepter-invitation.html");
assert.equal(emailRedirect("https://s.vercel.app", PAGES.connexionInterne, "admin-utilisateurs.html"), "https://s.vercel.app/espace-interne.html?returnTo=admin-utilisateurs.html");
assert.equal(emailRedirect("https://s.vercel.app", PAGES.connexionInterne, "https://evil"), "https://s.vercel.app/espace-interne.html");
console.log("parcours-majestios : OK");
