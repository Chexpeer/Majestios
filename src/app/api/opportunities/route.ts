import { NextRequest, NextResponse } from "next/server";

type Opportunity = {
  id: number;
  type: string;
  location: string;
  source: "public";
  title: string;
  deadline: string;
  isDemo: true;
};

/**
 * Données de démonstration isolées derrière une API.
 * Remplacer ce fournisseur par des sources vérifiées avant d'afficher
 * des opportunités réelles. Aucune annonce de ce jeu de données n'est réelle.
 */
const demoOpportunities: Opportunity[] = [
  {
    id: 1,
    type: "Travaux",
    location: "Grand Est",
    source: "public",
    title: "Exemple de résultat — travaux et rénovation",
    deadline: "Date à récupérer depuis la source",
    isDemo: true,
  },
  {
    id: 2,
    type: "Services",
    location: "France entière",
    source: "public",
    title: "Exemple de résultat — prestations de services",
    deadline: "Date à récupérer depuis la source",
    isDemo: true,
  },
  {
    id: 3,
    type: "Fournitures",
    location: "Bourgogne-Franche-Comté",
    source: "public",
    title: "Exemple de résultat — fournitures professionnelles",
    deadline: "Date à récupérer depuis la source",
    isDemo: true,
  },
];

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = (params.get("q") ?? "").trim().toLocaleLowerCase("fr");
  const location = (params.get("location") ?? "").trim().toLocaleLowerCase("fr");
  const type = (params.get("type") ?? "all").trim();

  if (type !== "all" && !["Travaux", "Services", "Fournitures"].includes(type)) {
    return NextResponse.json(
      { error: "Type d'opportunité non pris en charge." },
      { status: 400 },
    );
  }

  const items = demoOpportunities.filter((item) => {
    const searchable = `${item.title} ${item.type} ${item.location}`.toLocaleLowerCase("fr");
    const matchesQuery = !query || searchable.includes(query);
    const matchesLocation =
      !location || item.location.toLocaleLowerCase("fr").includes(location) || item.location === "France entière";
    const matchesType = type === "all" || item.type === type;
    return matchesQuery && matchesLocation && matchesType;
  });

  return NextResponse.json(
    {
      items,
      meta: {
        stage: "demo",
        isDemo: true,
        total: items.length,
        message: "Résultats de démonstration uniquement ; aucune source réelle n'est raccordée.",
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
