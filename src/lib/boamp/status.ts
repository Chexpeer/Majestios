/**
 * Conservative classification for whether a BOAMP notice appears open for bids.
 * Missing or invalid deadlines are never treated as open.
 */
export function isOpenBoampNotice(input: {
  nature: string;
  status: string;
  deadline: string;
  now?: number;
}): boolean {
  const normalize = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleUpperCase("fr").trim();

  const nature = normalize(input.nature);
  const status = normalize(input.status);
  const deadline = input.deadline ? new Date(input.deadline).getTime() : NaN;
  const now = input.now ?? Date.now();

  const isMarketNotice = nature.includes("AVIS DE MARCHE");
  const isCancelled =
    /ANNUL|ANNULE|SUPPRIME|SANS SUITE/.test(status) ||
    /ANNUL|ANNULE|SUPPRIME|SANS SUITE/.test(nature);

  return isMarketNotice && !isCancelled && Number.isFinite(deadline) && deadline >= now;
}
