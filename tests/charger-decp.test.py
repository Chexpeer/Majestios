"""Essai du chargement DECP sur un faux fichier et un faux serveur (aucun accès réseau externe, aucun secret réel)."""
import json
import os
import subprocess
import sys
import tempfile
import threading
from datetime import date, timedelta
from http.server import BaseHTTPRequestHandler, HTTPServer

import duckdb

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CALLS = []


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["content-length"])))
        CALLS.append((self.path.rsplit("/", 1)[-1], body, self.headers.get("authorization")))
        self.send_response(200)
        self.send_header("content-type", "application/json")
        self.end_headers()
        self.wfile.write(b"1")

    def log_message(self, *args):
        pass


def make_parquet(path, rows):
    con = duckdb.connect()
    con.execute("""create table t (uid varchar, titulaire_id varchar, titulaire_typeIdentifiant varchar, titulaire_nom varchar,
      objet varchar, montant double, montant_rationalise double, montant_anomalie varchar, dateNotification date,
      datePublicationDonnees date, donneesActuelles boolean, offresRecues integer, sousTraitanceDeclaree boolean,
      acheteur_id varchar, acheteur_nom varchar, acheteur_departement_code varchar, titulaire_departement_code varchar,
      titulaire_categorie varchar, codeCPV varchar, dureeMois integer)""")
    con.executemany("insert into t values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", rows)
    con.execute(f"copy t to '{path}' (format parquet)")


def row(i, days_ago=10, actuelle=True, winner=None, amount=1000.0, rationalise=None, uid=None):
    d = date.today() - timedelta(days=days_ago)
    return (uid or f"U{i}", winner or f"W{i}", "SIRET", f"Entreprise {i}", f"Objet {i}", amount, rationalise, "normal", d, d,
            actuelle, 3, False, "B1", "Mairie", "61", "14", "PME", "45000000", 24)


def main():
    server = HTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    env = dict(os.environ, SUPABASE_URL=f"http://127.0.0.1:{server.server_port}", SUPABASE_SERVICE_ROLE_KEY="cle-de-test-seulement", DECP_MONTHS="6")
    with tempfile.TemporaryDirectory() as tmp:
        path = os.path.join(tmp, "decp.parquet")
        rows = [row(i) for i in range(2500)]                       # 2500 marchés récents
        rows += [row(9000, days_ago=400), row(9001, actuelle=False)]  # trop ancien ; ligne non actuelle
        rows += [row(9002, uid="U1", winner="W1")]                  # doublon (même marché, même titulaire)
        rows += [row(9003, amount=5e9, rationalise=250000.0)]       # montant aberrant corrigé
        make_parquet(path, rows)
        env["DECP_PARQUET_PATH"] = path
        result = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "charger-decp.py")], env=env, capture_output=True, text=True)
        assert result.returncode == 0, result.stdout + result.stderr
        assert "cle-de-test-seulement" not in result.stdout + result.stderr, "la clé ne doit jamais être affichée"
        imports = [c for c in CALLS if c[0] == "import_awarded_contracts"]
        purges = [c for c in CALLS if c[0] == "purge_awarded_contracts"]
        loaded = [r for c in imports for r in c[1]["p_rows"]]
        assert all(len(c[1]["p_rows"]) <= 1000 for c in imports), "lots de 1000 au plus"
        assert len(loaded) == 2501, f"2500 + 1 aberrant corrigé attendus, reçu {len(loaded)}"
        assert not any(r["contract_uid"] in ("U9000", "U9001") for r in loaded), "ancien et non actuel exclus"
        assert sum(1 for r in loaded if r["contract_uid"] == "U1") == 1, "doublon retiré"
        assert [r for r in loaded if r["contract_uid"] == "U9003"][0]["amount"] == 250000.0, "montant rationalisé utilisé"
        assert all("amount_raw" not in r for r in loaded)
        assert all(c[2] == "Bearer cle-de-test-seulement" for c in CALLS)
        assert len(purges) == 1 and purges[0][1]["p_before"] < date.today().isoformat()
        # Protection : fichier anormal (peu de lignes) => aucun retrait
        CALLS.clear()
        make_parquet(path, [row(i) for i in range(5)])
        result = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "charger-decp.py")], env=env, capture_output=True, text=True)
        assert result.returncode == 0, result.stdout + result.stderr
        assert not [c for c in CALLS if c[0] == "purge_awarded_contracts"], "pas de retrait sur un petit fichier"
        # Colonnes obligatoires absentes => arrêt sans rien modifier
        CALLS.clear()
        duckdb.connect().execute(f"copy (select 1 as x) to '{path}' (format parquet)")
        result = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "charger-decp.py")], env=env, capture_output=True, text=True)
        assert result.returncode != 0 and not CALLS, "format inattendu : arrêt sans appel"
    print("TEST CHARGEMENT DECP RÉUSSI : filtre 6 mois, doublons, montant corrigé, lots, clé jamais affichée, protections.")


main()
