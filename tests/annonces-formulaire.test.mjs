import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateAnnouncement, serverMessage, KINDS } from "../annonces-formulaire.mjs";
import { ANNONCES_OUVERTES, ANNONCES_SUPABASE } from "../annonces-config.mjs";

const today = new Date("2026-11-14T10:00:00Z");
const valid = {
  kind: "subcontract_need", title: "Cherche plaquiste Rennes", trade: "Plâtrerie", department: "35",
  description: "Chantier de 12 logements neufs à Rennes, 600 m² de cloisons à poser en mars.",
  contact_name: "Jean Martin", email: "Jean@Example.fr", consent: "on"
};

test("l'interrupteur d'ouverture est explicite et la cible est le projet de test", () => {
  assert.equal(typeof ANNONCES_OUVERTES, "boolean");
  assert.match(ANNONCES_SUPABASE.url, /^https:\/\/[a-z0-9]+\.supabase\.co$/);
  assert.match(ANNONCES_SUPABASE.publishableKey, /^sb_publishable_/);
  assert.doesNotMatch(JSON.stringify(ANNONCES_SUPABASE), /service_role|secret/i);
});

test("une annonce valide produit les paramètres attendus par le serveur", () => {
  const r = validateAnnouncement(valid, { today });
  assert.equal(r.ok, true);
  assert.equal(r.payload.p_email, "", "l’e-mail de contact vient du compte, pas de la saisie");
  assert.equal(r.payload.p_department, "35");
  assert.equal(r.payload.p_consent, true);
  assert.equal(r.payload.p_phone, null);
  assert.equal(KINDS.length, 8);
  for (const k of ["job_offer", "job_seeker", "equipment_offer", "equipment_wanted", "other_offer", "other_request"]) assert.ok(KINDS.some(([v]) => v === k), k);
});

test("les champs obligatoires et le consentement sont exigés", () => {
  const r = validateAnnouncement({}, { today });
  for (const field of ["kind", "title", "description", "trade", "contact_name", "consent"]) assert.ok(r.errors[field], field);
  assert.equal(validateAnnouncement({ ...valid, consent: "" }, { today }).errors.consent !== undefined, true);
});

test("liens, e-mails et téléphones sont refusés dans le texte public", () => {
  for (const text of ["Voir www.exemple.fr pour tous les détails du chantier prévu.", "Écrivez à jean@exemple.fr pour tous les détails du chantier.", "Appelez le 06 12 34 56 78 pour tous les détails du chantier.", "Détails sur https://exemple.fr/chantier pour tous les travaux."]) {
    assert.ok(validateAnnouncement({ ...valid, description: text }, { today }).errors.description, text);
  }
});

test("département, date et tailles sont contrôlés", () => {
  assert.ok(validateAnnouncement({ ...valid, department: "99" }, { today }).errors.department);
  assert.equal(validateAnnouncement({ ...valid, department: "2a" }, { today }).ok, true);
  assert.ok(validateAnnouncement({ ...valid, valid_until: "2026-11-01" }, { today }).errors.valid_until);
  assert.ok(validateAnnouncement({ ...valid, valid_until: "2028-01-01" }, { today }).errors.valid_until);
  assert.equal(validateAnnouncement({ ...valid, valid_until: "2026-12-31" }, { today }).ok, true);
  assert.ok(validateAnnouncement({ ...valid, title: "court" }, { today }).errors.title);
});

test("le champ piège est transmis au serveur qui l'ignore, et les erreurs serveur sont traduites", () => {
  assert.equal(validateAnnouncement({ ...valid, website: "http://spam" }, { today }).payload.p_website, "http://spam");
  assert.match(serverMessage(new Error('{"message":"rate_limited"}')), /Trop de dépôts/);
  assert.match(serverMessage("boom"), /n’a pas pu être enregistré/);
});

test("le SQL proposé reste hors des migrations et verrouille tout accès direct", async () => {
  const sql = await readFile(new URL("../supabase/proposed/20261114210000_public_announcements.sql", import.meta.url), "utf8");
  assert.match(sql, /NON APPLIQUÉE/);
  for (const table of ["public.announcements", "private.announcement_contacts", "private.announcement_introductions", "private.announcement_events"]) {
    assert.ok(sql.includes(`alter table ${table} enable row level security`), table + " : RLS");
    assert.ok(sql.includes(`on ${table} for all to anon, authenticated using (false) with check (false)`), table + " : aucune politique ouverte");
  }
  assert.doesNotMatch(sql, /grant (select|insert|update|delete)[^;]*to (anon|authenticated)/i);
  assert.match(sql, /grant execute on function public\.moderate_announcement[^;]*to authenticated;/);
  assert.match(sql, /if not private\.announcement_is_moderator\(\) then raise exception 'forbidden'/);
  assert.ok(!sql.split("grant execute on function public.moderate_announcement")[1].split(";")[0].includes("anon"));
  const publicList = sql.slice(sql.indexOf("create or replace function public.list_published_announcements"), sql.indexOf("-- 9."));
  assert.doesNotMatch(publicList, /email|phone|contact_name/);
});
