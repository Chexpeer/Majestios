import Link from "next/link";

export type SectionMapItem = {
  label: string;
  href: string;
  description: string;
};

export default function SectionInteractiveMap({
  title,
  items,
}: {
  title: string;
  items: SectionMapItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="section-interactive-map" aria-label={`Carte interactive : ${title}`}>
      <div className="section-interactive-map-heading">
        <span className="eyebrow">CARTE INTERACTIVE DE LA RUBRIQUE</span>
        <h2>Explorer <em>{title.toLocaleLowerCase("fr-FR")}</em></h2>
        <p>Choisissez un pôle pour accéder directement à une fonction ou à une sous-rubrique dédiée.</p>
      </div>
      <div className="section-map-nodes">
        {items.map((item, index) => (
          <Link className="section-map-node" href={item.href} key={item.href}>
            <span className="section-map-node-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="section-map-node-copy">
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </span>
            <span className="section-map-node-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
