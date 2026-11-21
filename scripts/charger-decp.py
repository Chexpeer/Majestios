#!/usr/bin/env python3
"""Charge dans Supabase les marchés publics attribués des 6 derniers mois (DECP consolidées, Licence Ouverte 2.0).

Source : https://www.data.gouv.fr/datasets/608c055b35eb4e6ee20eb325 (fichier decp.parquet, ~280 Mo).
Cible  : fonctions public.import_awarded_contracts et public.purge_awarded_contracts (rôle de service uniquement).

Variables d'environnement :
  SUPABASE_URL                 adresse du projet (ex. https://xxxx.supabase.co)
  SUPABASE_SERVICE_ROLE_KEY    clé de service : secret GitHub, jamais affichée ni écrite dans un fichier
  DECP_MONTHS                  fenêtre en mois (défaut 6)
  DECP_PARQUET_PATH            (essais) fichier local à utiliser au lieu du téléchargement
Sécurité : si le fichier paraît anormal (trop peu de lignes), rien n'est supprimé.
"""
import json
import os
import sys
import tempfile
import urllib.request
from datetime import date

RESOURCE_URL = "https://www.data.gouv.fr/fr/datasets/r/11cea8e8-df3e-4ed1-932b-781e2635e432"
BATCH = 1000
MIN_ROWS_TO_PURGE = 1000

# colonne du fichier -> (champ de la base, type)
COLUMNS = {
    "uid": ("contract_uid", "text"), "titulaire_id": ("winner_id", "text"),
    "dateNotification": ("awarded_on", "date"), "datePublicationDonnees": ("published_on", "date"),
    "nature": ("nature", "text"), "type": ("kind", "text"), "procedure": ("procedure", "text"), "codeCPV": ("cpv", "text"),
    "objet": ("object", "text"), "montant_rationalise": ("amount", "num"), "montant": ("amount_raw", "num"),
    "montant_anomalie": ("amount_flag", "text"), "dureeMois": ("duration_months", "int"),
    "offresRecues": ("offers_received", "int"), "sousTraitanceDeclaree": ("subcontracting_declared", "bool"),
    "acheteur_id": ("buyer_id", "text"), "acheteur_nom": ("buyer_name", "text"), "acheteur_categorie": ("buyer_category", "text"),
    "acheteur_commune_nom": ("buyer_commune", "text"), "acheteur_departement_code": ("buyer_dept", "text"),
    "acheteur_departement_nom": ("buyer_dept_name", "text"), "acheteur_region_nom": ("buyer_region", "text"),
    "titulaire_nom": ("winner_name", "text"), "titulaire_typeIdentifiant": ("winner_id_type", "text"),
    "titulaire_activite_libelle": ("winner_activity", "text"), "titulaire_categorie": ("winner_category", "text"),
    "titulaire_commune_nom": ("winner_commune", "text"), "titulaire_departement_code": ("winner_dept", "text"),
    "titulaire_departement_nom": ("winner_dept_name", "text"), "titulaire_distance": ("winner_distance_km", "int"),
}
REQUIRED = ("uid", "titulaire_id", "dateNotification")


def log(message):
    print(message, flush=True)


def download(path):
    log("Téléchargement du fichier DECP (parquet)…")
    request = urllib.request.Request(RESOURCE_URL, headers={"User-Agent": "MajestiOS-chargement-decp/1.0"})
    with urllib.request.urlopen(request, timeout=120) as response, open(path, "wb") as out:
        total = 0
        while True:
            chunk = response.read(1024 * 1024)
            if not chunk:
                break
            out.write(chunk)
            total += len(chunk)
    log(f"Fichier reçu : {total / 1_000_000:.0f} Mo.")


def clean(value, kind):
    if value is None:
        return None
    try:
        if kind == "text":
            text = str(value).strip()
            return text or None
        if kind == "date":
            return value.isoformat() if hasattr(value, "isoformat") else str(value)[:10]
        if kind == "num":
            number = float(value)
            return None if number != number or number in (float("inf"), float("-inf")) else number
        if kind == "int":
            number = float(value)
            return None if number != number else int(number)
        if kind == "bool":
            return bool(value)
    except (TypeError, ValueError):
        return None
    return None


def rpc(base_url, key, name, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        f"{base_url}/rest/v1/rpc/{name}", data=body, method="POST",
        headers={"content-type": "application/json", "apikey": key, "authorization": f"Bearer {key}"})
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            return json.loads(response.read().decode("utf-8") or "null")
    except urllib.error.HTTPError as error:
        # Le message du serveur ne contient jamais la clé ; on le tronque par prudence.
        raise SystemExit(f"Erreur {error.code} sur {name} : {error.read().decode('utf-8', 'replace')[:300]}")


def main():
    base_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    months = int(os.environ.get("DECP_MONTHS", "6"))
    if not base_url.startswith("https://") and not base_url.startswith("http://127.0.0.1"):
        raise SystemExit("SUPABASE_URL absent ou invalide.")
    if not key:
        raise SystemExit("SUPABASE_SERVICE_ROLE_KEY absent.")
    if not 1 <= months <= 36:
        raise SystemExit("DECP_MONTHS doit être compris entre 1 et 36.")

    import duckdb

    path = os.environ.get("DECP_PARQUET_PATH")
    cleanup = None
    if not path:
        handle = tempfile.NamedTemporaryFile(suffix=".parquet", delete=False)
        handle.close()
        path = cleanup = handle.name
        download(path)
    try:
        con = duckdb.connect()
        available = {row[0] for row in con.execute("describe select * from read_parquet(?)", [path]).fetchall()}
        missing = [c for c in REQUIRED if c not in available]
        if missing:
            raise SystemExit(f"Colonnes obligatoires absentes du fichier : {missing}. Le format a peut-être changé : rien n'a été modifié.")
        select = ", ".join(f'"{c}"' if c in available else f'NULL as "{c}"' for c in COLUMNS)
        actual = 'coalesce("donneesActuelles", true)' if "donneesActuelles" in available else "true"
        query = (f"select {select} from read_parquet(?) where {actual} and \"titulaire_id\" is not null and \"uid\" is not null "
                 f"and \"dateNotification\" >= (current_date - interval {months} month) and \"dateNotification\" <= current_date")
        cursor = con.execute(query, [path])
        names = [d[0] for d in cursor.description]
        sent = batches = 0
        seen = set()
        while True:
            rows = cursor.fetchmany(BATCH)
            if not rows:
                break
            payload = []
            for row in rows:
                record = {}
                for name, value in zip(names, row):
                    field, kind = COLUMNS[name]
                    record[field] = clean(value, kind)
                if record.get("amount") is None:
                    record["amount"] = record.get("amount_raw")
                record.pop("amount_raw", None)
                key_pair = (record["contract_uid"], record["winner_id"])
                if key_pair in seen or not record["contract_uid"] or not record["winner_id"] or not record["awarded_on"]:
                    continue  # doublon (une seule ligne par marché et titulaire) ou ligne inutilisable
                seen.add(key_pair)
                payload.append(record)
            if payload:
                rpc(base_url, key, "import_awarded_contracts", {"p_rows": payload})
                sent += len(payload)
                batches += 1
                if batches % 20 == 0:
                    log(f"… {sent} lignes chargées")
        log(f"Chargement terminé : {sent} lignes (marché × titulaire) sur {months} mois.")
        if sent >= MIN_ROWS_TO_PURGE:
            today = date.today()
            month = today.month - months
            year = today.year + (month - 1) // 12
            month = (month - 1) % 12 + 1
            before = date(year, month, min(today.day, 28))
            removed = rpc(base_url, key, "purge_awarded_contracts", {"p_before": before.isoformat()})
            log(f"Marchés antérieurs au {before.isoformat()} retirés : {removed}.")
        else:
            log(f"Moins de {MIN_ROWS_TO_PURGE} lignes reçues : aucun retrait (protection contre un fichier anormal).")
            sys.exit(1 if sent == 0 else 0)
    finally:
        if cleanup and os.path.exists(cleanup):
            os.remove(cleanup)


if __name__ == "__main__":
    main()
